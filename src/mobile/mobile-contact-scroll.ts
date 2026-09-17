import { useCallback, useEffect, useRef, type MouseEvent, type RefObject } from 'react';

type ContactScrollOptions = {
  root: RefObject<HTMLElement>;
  dock: RefObject<HTMLElement>;
  contactId: string;
  routeKey: string;
};

/** One mobile-only scroll controller. Each click measures again, even at the same hash. */
export function useMobileContactScroll({ root, dock, contactId, routeKey }: ContactScrollOptions) {
  const cancel = useRef<() => void>(() => {});
  useEffect(() => () => cancel.current(), [routeKey]);

  const toContact = useCallback((event?: MouseEvent<HTMLAnchorElement>) => {
    if (event && (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    const section = document.getElementById(contactId);
    const target = section?.querySelector<HTMLElement>('[data-mobile-contact-target]');
    const host = root.current;
    if (!host || !section || !target || !host.contains(section)) return;
    event?.preventDefault();
    cancel.current();
    // replaceState neither triggers the browser's fragment jump nor hashchange.
    history.replaceState(history.state, '', location.pathname + location.search + '#' + contactId);
    const heading = target.querySelector<HTMLHeadingElement>('h2');
    heading?.focus({ preventScroll: true });

    let frame = 0;
    let stopped = false;
    const started = performance.now();
    const startY = window.scrollY;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', onKey);
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Tab','Escape'].includes(e.key)) stop();
    };
    cancel.current = stop;
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', onKey);

    const tick = (now: number) => {
      if (stopped) return;
      if (!target.isConnected || !host.isConnected || !matchMedia('(max-width: 899px)').matches) { stop(); return; }
      const viewport = window.visualViewport;
      const viewportTop = Math.max(0, viewport?.offsetTop ?? 0);
      const viewportBottom = Math.min(window.innerHeight, viewportTop + (viewport?.height ?? window.innerHeight));
      const inset = Math.max(16, parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
      let availableTop = viewportTop + inset;
      let availableBottom = viewportBottom - 16;
      const header = host.querySelector<HTMLElement>('.m-header');
      if (header) {
        const style = getComputedStyle(header), box = header.getBoundingClientRect();
        if ((style.position === 'fixed' || style.position === 'sticky') && box.top <= availableTop && box.bottom > viewportTop) availableTop = Math.max(availableTop, box.bottom + 12);
      }
      const bar = dock.current;
      if (bar && !bar.hidden && bar.getClientRects().length) {
        const box = bar.getBoundingClientRect();
        if (box.bottom > viewportTop && box.top < viewportBottom) availableBottom = Math.min(availableBottom, box.top - 12);
      }
      availableBottom = Math.max(availableTop, availableBottom);
      const box = target.getBoundingClientRect();
      const room = availableBottom - availableTop;
      // Oversized content starts at the safe top. It never centres its heading offscreen.
      const targetTop = availableTop + Math.max(0, (room - box.height) / 2);
      const scrolling = document.scrollingElement || document.documentElement;
      const maximum = Math.max(0, scrolling.scrollHeight - scrolling.clientHeight);
      const destination = Math.max(0, Math.min(maximum, window.scrollY + box.top - targetTop));
      const elapsed = now - started;
      const progress = Math.min(1, elapsed / 560);
      const eased = 1 - Math.pow(1 - progress, 3);
      // The goal stays live while an open accordion above closes or the visual
      // viewport changes. Instant here avoids stacking native smooth-scroll jobs.
      window.scrollTo({ top: motion.matches ? destination : startY + (destination - startY) * eased, left: window.scrollX, behavior: 'instant' });
      // Briefly settle after the 280 ms disclosure animation, including reduced motion.
      if (elapsed < (motion.matches ? 340 : 620)) frame = requestAnimationFrame(tick);
      else stop();
    };
    frame = requestAnimationFrame(tick);
  }, [root, dock, contactId]);

  useEffect(()=>{
    if(location.hash!=='#'+contactId)return;
    let live=true;
    // Cross-page contact links use the same measured landing as the Home dock.
    document.fonts.ready.then(()=>{if(live)toContact();});
    return()=>{live=false;cancel.current();};
  },[routeKey,contactId,toContact]);
  return toContact;
}
