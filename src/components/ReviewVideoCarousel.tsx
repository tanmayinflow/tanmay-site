import { Children, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const anchors = ["paulina-recenze", "olga-recenze", "maria-recenze"];
const fromHash = () => typeof window === "undefined" ? 0 : Math.max(0, anchors.indexOf(window.location.hash.slice(1)));

/** Native scrolling mirrors the written reviews without cloning video players. */
export default function ReviewVideoCarousel({ children, names, lang }: { children: ReactNode; names: string[]; lang: string }) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(fromHash);
  const activeRef = useRef(active);
  const hashJump = useRef(false);
  const viewport = useRef<HTMLDivElement>(null);
  const uid = useId();
  const czech = lang !== "en";
  const goTo = useCallback((index: number, smooth = true) => {
    const el = viewport.current;
    if (!el) return;
    const next = Math.max(0, Math.min(names.length - 1, index));
    if (next === activeRef.current && Math.abs(el.scrollLeft - next * el.clientWidth) < 1) return;
    el.querySelectorAll("video").forEach(video => video.pause());
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant" });
  }, [names.length]);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    el.scrollLeft = activeRef.current * el.clientWidth;
    let width = el.clientWidth;
    const resize = new ResizeObserver(() => {
      if (width === el.clientWidth) return;
      width = el.clientWidth;
      el.scrollTo({ left: activeRef.current * width, behavior: "auto" });
    });
    resize.observe(el);
    let hashFrame = 0;
    const overflow = el.style.overflowX;
    const snap = el.style.scrollSnapType;
    const restoreScroll = () => { el.style.overflowX = overflow; el.style.scrollSnapType = snap; };
    const followHash = () => {
      const index = anchors.indexOf(window.location.hash.slice(1));
      if (index < 0) return;
      cancelAnimationFrame(hashFrame);
      // A fragment link takes precedence over an unfinished native touch pan.
      // Briefly stop that scroll context, then align after the browser's own
      // fragment and route-focus handlers. Normal swipes stay entirely native.
      hashJump.current = true;
      activeRef.current = index;
      setActive(index);
      el.querySelectorAll<HTMLElement>(".review-video-slide").forEach((slide, i) => {
        slide.inert = i !== index;
        slide.querySelectorAll("video").forEach(video => video.pause());
      });
      el.style.overflowX = "hidden";
      el.style.scrollSnapType = "none";
      el.scrollTo({ left: index * el.clientWidth, behavior: "instant" });
      hashFrame = requestAnimationFrame(() => {
        el.scrollTo({ left: index * el.clientWidth, behavior: "instant" });
        hashFrame = requestAnimationFrame(() => {
          restoreScroll();
          el.scrollTo({ left: index * el.clientWidth, behavior: "instant" });
          hashJump.current = false;
        });
      });
    };
    window.addEventListener("hashchange", followHash);
    return () => { cancelAnimationFrame(hashFrame); hashJump.current = false; restoreScroll(); resize.disconnect(); window.removeEventListener("hashchange", followHash); };
  }, [goTo]);

  useEffect(() => {
    viewport.current?.querySelectorAll<HTMLElement>(".review-video-slide").forEach((slide, index) => {
      slide.inert = index !== active;
      if (index !== active) slide.querySelectorAll("video").forEach(video => video.pause());
    });
  }, [active]);

  return <div className="review-video-carousel" role="region" aria-roledescription={czech ? "karusel" : "carousel"} aria-label={czech ? "Video recenze klientů" : "Client video reviews"}>
    <div className="review-video-viewport" id={uid} ref={viewport} tabIndex={0}
      aria-label={czech ? "Video recenze. Posouvej tahem nebo šipkami." : "Video reviews. Swipe or use arrow keys."}
      onScroll={event => {
        if (hashJump.current) return;
        const el = event.currentTarget;
        const next = Math.max(0, Math.min(names.length - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
        if (next === activeRef.current) return;
        activeRef.current = next;
        setActive(next);
      }}
      onPlayCapture={event => {
        const target = event.target as HTMLVideoElement;
        const slide = target.closest<HTMLElement>(".review-video-slide");
        if (Number(slide?.dataset.reviewIndex) !== activeRef.current) { target.pause(); return; }
        viewport.current?.querySelectorAll("video").forEach(video => { if (video !== target) video.pause(); });
      }}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
        const index = event.key === "ArrowRight" ? active + 1 : event.key === "ArrowLeft" ? active - 1 : event.key === "Home" ? 0 : event.key === "End" ? names.length - 1 : null;
        if (index !== null) { event.preventDefault(); goTo(index); }
      }}>
      {slides.map((slide, index) => <div key={anchors[index]} className="review-video-slide" role="group"
        aria-roledescription={czech ? "recenze" : "slide"} aria-label={`${index + 1} / ${names.length}: ${names[index]}`}
        aria-hidden={index !== active ? true : undefined} data-review-index={index} data-active={index === active}>
        {slide}
      </div>)}
    </div>
    <div className="review-video-controls" role="group" aria-label={czech ? "Procházet video recenze" : "Browse video reviews"}>
      <button type="button" className="review-video-prev" aria-controls={uid} aria-disabled={active === 0}
        aria-label={czech ? "Předchozí video recenze" : "Previous video review"} onClick={() => goTo(active - 1)}><span aria-hidden="true">←</span></button>
      <span className="review-video-status" aria-live="polite" aria-atomic="true">{active + 1} / {names.length} · {names[active]}</span>
      <button type="button" className="review-video-next" aria-controls={uid} aria-disabled={active === names.length - 1}
        aria-label={czech ? "Další video recenze" : "Next video review"} onClick={() => goTo(active + 1)}><span aria-hidden="true">→</span></button>
    </div>
  </div>;
}
