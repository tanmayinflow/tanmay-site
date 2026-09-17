import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CLIENT_REVIEWS } from "./home-reviews.data.js";
import "./home-reviews.css";

type Lang = "cs" | "en";
const COUNT = CLIENT_REVIEWS.length;
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Client words, not marketing excerpts. The preview is the complete first paragraph.
 * Native scroll-snap supports touch and trackpads, with buttons/keys as alternatives.
 * No autoplay, line-clamping, artificial quotes, invented videos or ratings.
 */
export default function HomeReferences({ lang = "cs" }: { lang?: string }) {
  const language: Lang = lang === "en" ? "en" : "cs";
  const tr = (cs: string, en: string) => language === "cs" ? cs : en;
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [openOriginal, setOpenOriginal] = useState(false);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const readerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef(0);

  const goTo = useCallback((index: number, smooth = true) => {
    const i = Math.max(0, Math.min(COUNT - 1, index));
    const el = viewport.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const update = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const i = Math.max(0, Math.min(COUNT - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
        if (i === activeRef.current) return;
        activeRef.current = i;
        setActive(i);
        setAnnouncement(language === "cs"
          ? `Recenze ${i + 1} ze ${COUNT}: ${CLIENT_REVIEWS[i].name}`
          : `Review ${i + 1} of ${COUNT}: ${CLIENT_REVIEWS[i].name}`);
      });
    };
    el.addEventListener("scroll", update, { passive: true });
    let previousWidth = el.clientWidth;
    const resize = () => {
      if (el.clientWidth === previousWidth) return;
      previousWidth = el.clientWidth;
      el.scrollTo({ left: activeRef.current * previousWidth, behavior: "auto" });
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf.current);
      observer?.disconnect();
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
    };
  }, [language]);

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
            <h2 className="h-display h2" id="h-reviews">{tr("Co říkají klienti", "What people say about the work")}</h2>
          </div>
          <div className="tmr-controls" role="group" aria-label={tr("Posouvání recenzí", "Review navigation")}>
            <button className="tmr-arrow" type="button" aria-label={tr("Předchozí recenze", "Previous review")}
              aria-controls="home-review-slides" aria-disabled={active === 0} onClick={() => goTo(active - 1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button className="tmr-arrow" type="button" aria-label={tr("Další recenze", "Next review")}
              aria-controls="home-review-slides" aria-disabled={active === COUNT - 1} onClick={() => goTo(active + 1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </header>
        <div className="tmr-carousel" role="region" aria-roledescription={tr("karusel", "carousel")}
          aria-label={tr("Zkušenosti klientek", "Client experiences")}>
          <div className="tmr-viewport" id="home-review-slides" ref={viewport} tabIndex={0}
            aria-label={tr("Recenze. Posouvejte šipkami nebo tahem.", "Reviews. Use arrow keys or swipe.")}
            onKeyDown={e => {
              if (e.altKey || e.metaKey || e.ctrlKey) return;
              const dest = e.key === "ArrowRight" ? active + 1 : e.key === "ArrowLeft" ? active - 1
                : e.key === "Home" ? 0 : e.key === "End" ? COUNT - 1 : null;
              if (dest !== null) { e.preventDefault(); goTo(dest); }
            }}>
            {CLIENT_REVIEWS.map((review, i) => (
              <article key={review.id} className="tmr-slide" role="group" ref={node => { slides.current[i] = node; }}
                aria-roledescription={tr("recenze", "slide")} aria-label={`${i + 1} / ${COUNT}: ${review.name}`}
                aria-hidden={i !== active ? true : undefined} data-review-id={review.id}>
                <div className="tmr-attribution">
                  <span className="tmr-quote-mark" aria-hidden="true">“</span>
                  <h3>{review.name}</h3>
                  {language === "en" && <span className="tmr-note">Translated from Czech
                    {review.cs.length === 1 && <button type="button" className="tmr-original"
                      ref={node => { readerButtons.current[i] = node; }} tabIndex={i === active ? 0 : -1}
                      aria-haspopup="dialog" aria-controls="home-review-reader"
                      onClick={e => { trigger.current = e.currentTarget; setOpenOriginal(true); setOpened(i); }}>Czech original</button>}
                  </span>}
                </div>
                <div className="tmr-reading">
                  <blockquote className="tmr-excerpt" lang={language}><p>{review[language][0]}</p></blockquote>
                  {review.cs.length > 1 && <div className="tmr-reading-foot">
                    <button type="button" className="tmr-read" aria-haspopup="dialog" aria-controls="home-review-reader"
                      ref={node => { readerButtons.current[i] = node; }} tabIndex={i === active ? 0 : -1}
                      aria-label={tr(`Celé znění recenze: ${review.name}`, `Full review: ${review.name}`)}
                      onClick={e => { trigger.current = e.currentTarget; setOpenOriginal(false); setOpened(i); }}>
                      <span className="tmr-read-label">{tr("Celé znění", "Full review")}</span>
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>}
                </div>
              </article>
            ))}
          </div>
          <p className="tmr-sr" aria-live="polite" aria-atomic="true">{announcement}</p>
        </div>
      </div>
      {opened !== null && typeof document !== "undefined" && createPortal(
        <ReviewReader index={opened} lang={language} initialOriginal={openOriginal} onClose={closeReader}
          onNavigate={i => { setOpened(i); goTo(i, false); }} />, document.body)}
    </section>
  );
}

function ReviewReader({ index, lang, initialOriginal, onClose, onNavigate }: {
  index: number; lang: Lang; initialOriginal: boolean; onClose: () => void; onNavigate: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const [original, setOriginal] = useState(initialOriginal);
  const review = CLIENT_REVIEWS[index];
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
          <button type="button" aria-disabled={index === 0} onClick={() => { if (index > 0) onNavigate(index - 1); }}>
            <span aria-hidden="true">←</span> {tr("Předchozí", "Previous")}
          </button>
          <button type="button" aria-disabled={index === COUNT - 1} onClick={() => { if (index < COUNT - 1) onNavigate(index + 1); }}>
            {tr("Další recenze", "Next review")} <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </dialog>
  );
}
