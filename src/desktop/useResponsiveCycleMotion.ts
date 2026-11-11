import { useEffect, type RefObject } from 'react';

/** Match the mobile loop: visible downward travel and each step advance clockwise. */
export function useResponsiveCycleMotion(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const host = root.current;
    const art = host?.querySelector<HTMLElement>('.responsive-work-cycle-art');
    if (!host || !art) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, frame = 0, lastFrame = 0, lastY = window.scrollY;
    let angle = 0, target = 0;
    const paint = (time: number) => {
      frame = 0;
      if (disposed || preference.matches) return;
      const elapsed = Math.min(64, Math.max(1, time - lastFrame));
      const remaining = target - angle;
      angle = remaining < .025 ? target : angle + remaining * (1 - Math.exp(-elapsed / 65));
      art.style.transform = `rotate(${angle}deg)`;
      lastFrame = time;
      if (target - angle > .025) frame = requestAnimationFrame(paint);
    };
    const queue = () => {
      if (!frame && !disposed && !preference.matches) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(paint);
      }
    };
    const onScroll = () => {
      const y = window.scrollY, down = Math.max(0, y - lastY);
      lastY = y;
      if (!down || preference.matches) return;
      const box = art.parentElement!.getBoundingClientRect();
      const view = window.visualViewport;
      const top = view?.offsetTop || 0, height = view?.height || innerHeight;
      if (box.bottom > top && box.top < top + height) {
        target += Math.min(down, 80) * .3;
        queue();
      }
    };
    const onClick = (event: Event) => {
      if (preference.matches || !(event.target instanceof Element) || !event.target.closest('.responsive-work-cycle-buttons button')) return;
      target += 120;
      queue();
    };
    const measure = () => { lastY = window.scrollY; };
    const onPreference = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; angle = 0; target = 0;
      art.style.removeProperty('transform');
      measure();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    preference.addEventListener('change', onPreference);
    host.addEventListener('click', onClick);
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
      preference.removeEventListener('change', onPreference);
      host.removeEventListener('click', onClick);
      art.style.removeProperty('transform');
    };
  }, [root]);
}
