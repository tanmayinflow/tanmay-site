import { Children, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const anchors = ["paulina-recenze", "olga-recenze", "maria-recenze"];
const fromHash = () => typeof window === "undefined" ? 0 : Math.max(0, anchors.indexOf(window.location.hash.slice(1)));

/** Three real players form a ring. CSS order moves cards without replacing video nodes. */
export default function ReviewVideoCarousel({ children, names, lang }: { children: ReactNode; names: string[]; lang: string }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const wrap = useCallback((index: number) => (index % count + count) % count, [count]);
  const [active, setActive] = useState(fromHash);
  const [center, setCenter] = useState(active);
  const activeRef = useRef(active), centerRef = useRef(center);
  const viewport = useRef<HTMLDivElement>(null);
  const hashJump = useRef(false), rebasing = useRef(false), moving = useRef(false);
  const touching = useRef(false), pointer = useRef(false), resizePending = useRef(false);
  const target = useRef<number | null>(null), pending = useRef<number[]>([]);
  const timer = useRef(0), frame = useRef(0);
  const advance = useRef(() => {}), jump = useRef<(index: number) => void>(() => {});
  const uid = useId();
  const czech = lang !== "en";

  const select = useCallback((index: number) => {
    activeRef.current = index;
    setActive(index);
  }, []);
  const settle = useCallback(() => {
    const el = viewport.current;
    if (!el || hashJump.current || rebasing.current || touching.current || pointer.current) return;
    const physical = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    if (!resizePending.current && (Math.abs(el.scrollLeft - physical * el.clientWidth) > 2 || (moving.current && target.current !== null && physical !== target.current))) return;
    const index = resizePending.current ? activeRef.current : wrap(centerRef.current + physical - 1);
    resizePending.current = false;
    select(index);
    if (index !== centerRef.current) {
      rebasing.current = true;
      setCenter(index);
    } else {
      el.scrollTo({ left: el.clientWidth, behavior: "instant" });
      moving.current = false;
      target.current = null;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => advance.current());
    }
  }, [count, select, wrap]);
  const queueSettle = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(settle, 180);
  }, [settle]);
  advance.current = () => {
    const el = viewport.current;
    if (!el || moving.current || rebasing.current || hashJump.current || touching.current || pointer.current) return;
    const direction = pending.current.shift();
    if (direction === undefined) return;
    el.querySelectorAll("video").forEach(video => video.pause());
    moving.current = true;
    target.current = direction > 0 ? 2 : 0;
    el.scrollTo({ left: target.current * el.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    queueSettle();
  };
  const step = (direction: number) => { pending.current.push(direction); advance.current(); };

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    centerRef.current = center;
    rebasing.current = true;
    el.scrollTo({ left: el.clientWidth, behavior: "instant" });
    moving.current = false;
    target.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => { rebasing.current = false; advance.current(); });
  }, [center]);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let width = el.clientWidth, hashFrame = 0;
    const overflow = el.style.overflowX, snap = el.style.scrollSnapType;
    const restoreScroll = () => { el.style.overflowX = overflow; el.style.scrollSnapType = snap; };
    const resize = new ResizeObserver(() => {
      if (width === el.clientWidth) return;
      width = el.clientWidth;
      if (moving.current || touching.current || pointer.current) { resizePending.current = true; return; }
      el.scrollTo({ left: width, behavior: "instant" });
    });
    resize.observe(el);
    jump.current = (index: number) => {
      cancelAnimationFrame(hashFrame);
      clearTimeout(timer.current);
      pending.current = [];
      moving.current = false;
      target.current = null;
      resizePending.current = false;
      hashJump.current = true;
      select(index);
      setCenter(index);
      el.querySelectorAll<HTMLElement>(".review-video-slide").forEach(slide => {
        slide.inert = Number(slide.dataset.reviewIndex) !== index;
        slide.querySelectorAll("video").forEach(video => video.pause());
      });
      // Stop unfinished compositor momentum before applying a fragment jump.
      el.style.overflowX = "hidden";
      el.style.scrollSnapType = "none";
      el.scrollTo({ left: el.clientWidth, behavior: "instant" });
      hashFrame = requestAnimationFrame(() => {
        el.scrollTo({ left: el.clientWidth, behavior: "instant" });
        hashFrame = requestAnimationFrame(() => {
          restoreScroll();
          el.scrollTo({ left: el.clientWidth, behavior: "instant" });
          hashJump.current = false;
          advance.current();
        });
      });
    };
    const followHash = () => { const index = anchors.indexOf(window.location.hash.slice(1)); if (index >= 0) jump.current(index); };
    const touchStart = () => { touching.current = true; pointer.current = true; pending.current = []; moving.current = false; target.current = null; clearTimeout(timer.current); };
    const touchEnd = (event: TouchEvent) => { if (event.touches.length) return; touching.current = false; pointer.current = false; queueSettle(); };
    const pointerEnd = () => { if (touching.current) return; pointer.current = false; queueSettle(); };
    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("scrollend", settle);
    document.addEventListener("touchend", touchEnd, { passive: true });
    document.addEventListener("touchcancel", touchEnd, { passive: true });
    document.addEventListener("pointerup", pointerEnd);
    document.addEventListener("pointercancel", pointerEnd);
    window.addEventListener("hashchange", followHash);
    return () => {
      cancelAnimationFrame(hashFrame); cancelAnimationFrame(frame.current); clearTimeout(timer.current);
      hashJump.current = false; restoreScroll(); resize.disconnect();
      el.removeEventListener("touchstart", touchStart); el.removeEventListener("scrollend", settle);
      document.removeEventListener("touchend", touchEnd); document.removeEventListener("touchcancel", touchEnd);
      document.removeEventListener("pointerup", pointerEnd); document.removeEventListener("pointercancel", pointerEnd);
      window.removeEventListener("hashchange", followHash);
    };
  }, [queueSettle, select, settle]);

  useEffect(() => {
    viewport.current?.querySelectorAll<HTMLElement>(".review-video-slide").forEach(slide => {
      const inactive = Number(slide.dataset.reviewIndex) !== active;
      slide.inert = inactive;
      if (inactive) slide.querySelectorAll("video").forEach(video => video.pause());
    });
  }, [active]);

  return <div className="review-video-carousel" role="region" aria-roledescription={czech ? "karusel" : "carousel"} aria-label={czech ? "Video recenze klientů" : "Client video reviews"}>
    <div className="review-video-viewport" id={uid} ref={viewport} tabIndex={0}
      aria-label={czech ? "Video recenze. Posouvej tahem nebo šipkami." : "Video reviews. Swipe or use arrow keys."}
      onPointerDown={() => { pointer.current = true; pending.current = []; moving.current = false; target.current = null; clearTimeout(timer.current); }}
      onScroll={event => {
        if (hashJump.current || rebasing.current || resizePending.current) return;
        const el = event.currentTarget;
        const physical = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
        const index = wrap(centerRef.current + physical - 1);
        if (index !== activeRef.current) select(index);
        queueSettle();
      }}
      onPlayCapture={event => {
        const video = event.target as HTMLVideoElement;
        if (Number(video.closest<HTMLElement>(".review-video-slide")?.dataset.reviewIndex) !== activeRef.current) { video.pause(); return; }
        viewport.current?.querySelectorAll("video").forEach(other => { if (other !== video) other.pause(); });
      }}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home" || event.key === "End") jump.current(event.key === "Home" ? 0 : count - 1);
        else step(event.key === "ArrowRight" ? 1 : -1);
      }}>
      {slides.map((slide, index) => <div key={anchors[index]} className="review-video-slide" role="group"
        style={{ order: wrap(index - center + 1) }}
        aria-roledescription={czech ? "recenze" : "slide"} aria-label={`${index + 1} / ${names.length}: ${names[index]}`}
        aria-hidden={index !== active ? true : undefined} data-review-index={index} data-active={index === active}>
        {slide}
      </div>)}
    </div>
    <div className="review-video-controls" role="group" aria-label={czech ? "Procházet video recenze" : "Browse video reviews"}>
      <button type="button" className="review-video-prev" aria-controls={uid}
        aria-label={czech ? "Předchozí video recenze" : "Previous video review"} onClick={() => step(-1)}><span aria-hidden="true">←</span></button>
      <button type="button" className="review-video-next" aria-controls={uid}
        aria-label={czech ? "Další video recenze" : "Next video review"} onClick={() => step(1)}><span aria-hidden="true">→</span></button>
    </div>
    <span className="review-video-announcement" aria-live="polite" aria-atomic="true">{active + 1} / {names.length} · {names[active]}</span>
  </div>;
}
