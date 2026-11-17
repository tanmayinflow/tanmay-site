import { previewCopy as p, previewText, previewWhatsApp, previewMail } from "../preview-copy";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CLIENT_REVIEWS } from "./home-reviews.data.js";
import "./home-reviews.css";
import ReviewVideo from "./ReviewVideo";
import { useCircularRail } from "../mobile/useCircularRail";

type Lang = "cs" | "en";

/** Client words, not marketing excerpts. The preview is the complete first paragraph.
 * Native scroll-snap supports touch and trackpads, with buttons/keys as alternatives.
 * No autoplay, line-clamping, artificial quotes, invented videos or ratings.
 */
export default function HomeReferences({ lang = "cs", preview = false }: { lang?: string; preview?: boolean }) {
  const reviews = preview ? ['gledis-kmonickova','lucie-kanska','mariana-stojkovova','zuzana-hofman'].map(id => CLIENT_REVIEWS.find(r => r.id === id)!) : CLIENT_REVIEWS;
  const language: Lang = lang === "en" ? "en" : "cs";
  const tr = (cs: string, en: string) => language === "cs" ? cs : en;
  const rail = useCircularRail(reviews.length);
  const { active, goTo } = rail;
  const [opened, setOpened] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [openOriginal, setOpenOriginal] = useState(false);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const viewport = rail.ref;
  const activeRef = useRef(0);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const readerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const endPointer = rail.viewportProps.onPointerUp;
  const pointerInRail = useRef(false);
  // A mouse selection can end outside the rail; release its navigation guard too.
  useEffect(() => {
    const release = () => {
      if (!pointerInRail.current) return;
      pointerInRail.current = false;
      endPointer();
    };
    const blur = () => { pointerInRail.current = false; };
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", release);
    window.addEventListener("blur", blur);
    return () => {
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", blur);
    };
  }, [endPointer]);
  useEffect(() => {
    activeRef.current = active;
    setAnnouncement(language === "cs"
      ? `Recenze ${active + 1} ze ${reviews.length}: ${reviews[active].name}`
      : `Review ${active + 1} of ${reviews.length}: ${reviews[active].name}`);
  }, [active, language]);

  // Follow the active paragraph's height instead of leaving an empty tall card.
  // The opacity/content never depends on an entrance animation.
  useEffect(() => {
    const el = viewport.current;
    const slide = slides.current[active];
    if (!el || !slide) return;
    const sync = () => el.style.setProperty("--review-height", `${Math.ceil(slide.getBoundingClientRect().height)}px`);
    sync();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    observer?.observe(slide);
    return () => observer?.disconnect();
  }, [active, language]);

  const closeReader = useCallback(() => {
    setOpened(null);
    requestAnimationFrame(() => {
      const target = readerButtons.current[activeRef.current] || viewport.current;
      target?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <section className="sec home-reviews tmr" aria-labelledby="h-reviews" data-real-reviews="v9.7.1">
      <div className="wrap">
        <header className="tmr-head">
          <div>
            <p className="label">{tr("Reference", "Experiences")}</p>
            <h2 className="h-display h2" id="h-reviews">{preview ? previewText(p.reviewTitle,lang) : tr("Co říkají klienti", "What people say about the work")}</h2>{preview && <p className="body-txt">{previewText(p.reviewLead,lang)}</p>}
          </div>
          <div className="tmr-controls" role="group" aria-label={tr("Posouvání recenzí", "Review navigation")}>
            <button className="tmr-arrow" type="button" aria-label={tr("Předchozí recenze", "Previous review")}
              aria-controls={rail.id} onClick={() => rail.step(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button className="tmr-arrow" type="button" aria-label={tr("Další recenze", "Next review")}
              aria-controls={rail.id} onClick={() => rail.step(1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </header>
        <div className="tmr-carousel" role="region" aria-roledescription={tr("karusel", "carousel")}
          aria-label={tr("Zkušenosti klientek", "Client experiences")}>
          <div className="tmr-viewport" id={rail.id} ref={viewport} tabIndex={0}
            aria-label={tr("Recenze. Posouvejte šipkami nebo tahem.", "Reviews. Use arrow keys or swipe.")}
            {...rail.viewportProps}
            onPointerDown={() => { pointerInRail.current = true; rail.viewportProps.onPointerDown(); }}>
            {rail.slots.map(({physical, index: i, clone}) => {
              const review = reviews[i];
              return <article key={physical} className="tmr-slide" role="group"
                ref={node => { if (!clone) slides.current[i] = node; }}
                aria-roledescription={tr("recenze", "slide")} aria-label={`${i + 1} / ${reviews.length}: ${review.name}`}
                aria-hidden={clone || i !== active ? true : undefined} data-review-id={review.id}
                data-carousel-index={i} data-carousel-clone={clone ? "true" : undefined}
                onClick={clone ? event => {
                  const original = (event.target as HTMLElement).closest(".tmr-original");
                  if (!original && !(event.target as HTMLElement).closest(".tmr-read")) return;
                  goTo(i); setOpenOriginal(Boolean(original)); setOpened(i);
                } : undefined}>
                <div className="tmr-attribution">
                  <span className="tmr-quote-mark" aria-hidden="true">“</span>
                  <h3>{review.name}</h3>
                  {language === "en" && <span className="tmr-note">Translated from Czech
                    {review.cs.length === 1 && (clone ? <span className="tmr-original">Czech original</span> : <button type="button" className="tmr-original"
                      ref={node => { readerButtons.current[i] = node; }} tabIndex={i === active ? 0 : -1}
                      aria-haspopup="dialog" aria-controls="home-review-reader"
                      onClick={e => { trigger.current = e.currentTarget; setOpenOriginal(true); setOpened(i); }}>Czech original</button>)}
                  </span>}
                </div>
                <div className="tmr-reading">
                  <blockquote className="tmr-excerpt" lang={language}><p>{review[language][0]}</p></blockquote>
                  {review.cs.length > 1 && <div className="tmr-reading-foot">
                    {clone ? <span className="tmr-read"><span className="tmr-read-label">{tr("Celé znění", "Full review")}</span><span aria-hidden="true">+</span></span> : <button type="button" className="tmr-read" aria-haspopup="dialog" aria-controls="home-review-reader"
                      ref={node => { readerButtons.current[i] = node; }} tabIndex={i === active ? 0 : -1}
                      aria-label={tr(`Celé znění recenze: ${review.name}`, `Full review: ${review.name}`)}
                      onClick={e => { trigger.current = e.currentTarget; setOpenOriginal(false); setOpened(i); }}>
                      <span className="tmr-read-label">{tr("Celé znění", "Full review")}</span>
                      <span aria-hidden="true">+</span>
                    </button>}
                  </div>}
                </div>
              </article>;
            })}
          </div>
          <p className="tmr-sr" aria-live="polite" aria-atomic="true">{announcement}</p>
        </div>
        <ReviewVideo lang={lang}/>
      </div>
      {opened !== null && typeof document !== "undefined" && createPortal(
        <ReviewReader reviews={reviews} index={opened} lang={language} initialOriginal={openOriginal} onClose={closeReader}
          onNavigate={i => { setOpened(i); goTo(i); }} />, document.body)}
    </section>
  );
}

function ReviewReader({ reviews = CLIENT_REVIEWS, index, lang, initialOriginal, onClose, onNavigate }: {
  reviews?: typeof CLIENT_REVIEWS; index: number; lang: Lang; initialOriginal: boolean; onClose: () => void; onNavigate: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const [original, setOriginal] = useState(initialOriginal);
  const review = reviews[index];
  const tr = (cs: string, en: string) => lang === "cs" ? cs : en;
  const textLang: Lang = lang === "en" && !original ? "en" : "cs";

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    if (!el.open) el.showModal();
    title.current?.focus({ preventScroll: true });
    return () => {
      if (el.open) el.close();
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [index, textLang]);

  return (
    <dialog ref={dialog} id="home-review-reader" className="tmr-dialog" aria-modal="true" aria-labelledby="home-review-reader-title"
      onKeyDown={e => {
        if (e.key !== "Tab") return;
        const stops = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.getClientRects().length > 0);
        const first = stops[0], last = stops[stops.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === title.current)) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }}
      onCancel={e => { e.preventDefault(); onClose(); }}
      onClick={e => { if (e.target === dialog.current) onClose(); }}>
      <div className="tmr-dialog-shell">
        <header className="tmr-dialog-head">
          <div>
            <p className="tmr-dialog-meta">{tr("Zkušenost ze spolupráce", "A client’s experience")}</p>
            <h3 ref={title} id="home-review-reader-title" tabIndex={-1} aria-live="polite" aria-atomic="true">{review.name}</h3>
          </div>
          <button type="button" className="tmr-close" onClick={onClose} aria-label={tr("Zavřít recenzi", "Close review")}><span aria-hidden="true">×</span></button>
        </header>
        <div className="tmr-dialog-scroll" ref={scroll} tabIndex={0} aria-label={tr("Celý text recenze", "Full review text")}>
          {lang === "en" && <div className="tmr-translation">
            <span>{original ? "Czech original" : "Translated from Czech"}</span>
            <button type="button" onClick={() => setOriginal(v => !v)}>{original ? "Read English translation" : "Read Czech original"}</button>
          </div>}
          <blockquote className="tmr-full" lang={textLang}>
            {review[textLang].map((p, i) => <p key={i}>{p}</p>)}
          </blockquote>
        </div>
        <footer className="tmr-dialog-foot">
          <button type="button" onClick={() => onNavigate((index - 1 + reviews.length) % reviews.length)}>
            <span aria-hidden="true">←</span> {tr("Předchozí", "Previous")}
          </button>
          <button type="button" onClick={() => onNavigate((index + 1) % reviews.length)}>
            {tr("Další recenze", "Next review")} <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </dialog>
  );
}
