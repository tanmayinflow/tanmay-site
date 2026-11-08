import { useEffect, type RefObject } from 'react';

const SURFACES = 'main, section, header, footer, .m-dark, .m-home-field, .m10-home-caption, .m-earth-coda, .m-closing, .m-offer';

/** Browser chrome is browser-owned. Supply the visible surface as a tint hint
 * and as the document underlay used by translucent UI and rubber-band areas. */
export function useMobileBrowserTheme(root: RefObject<HTMLElement>, routeKey: string) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const existingMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const meta = existingMeta ?? document.createElement('meta');
    const previousMeta = meta.getAttribute('content');
    if (!existingMeta) {
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    const underlays = [document.documentElement, document.body];
    const previousColors = underlays.map(element => ({
      value: element.style.getPropertyValue('background-color'),
      priority: element.style.getPropertyPriority('background-color'),
    }));
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let resizeTimer = 0;
    let active = true;
    let lastColor = '';

    const visibleColor = () => {
      // Sample the margin, not the photo or card occupying the page centre.
      // Transparencies inherit the first opaque surface beneath them.
      const height = Math.max(1, window.innerHeight);
      const y = Math.max(0, Math.min(height - 1, (window.visualViewport?.offsetTop ?? 0) + 2));
      const candidates = document.elementsFromPoint(Math.min(12, window.innerWidth / 4), y);
      for (const candidate of candidates) {
        if (!host.contains(candidate) || candidate.closest('.m-dock')) continue;
        let element: Element | null = candidate;
        while (element && host.contains(element)) {
          // These complete surfaces are painted on a masked ::before layer.
          // Other pseudo-elements are only decorative edges, not backgrounds.
          const paintLayer = element.matches('.m-offer, .m-earth-coda') ? '::before' : null;
          const color = getComputedStyle(element, paintLayer).backgroundColor;
          const channels = color.match(/[\d.]+/g)?.map(Number);
          if (channels && channels.length >= 3 && (channels.length < 4 || channels[3] >= 0.98)) return color;
          element = element.parentElement;
        }
      }
      return getComputedStyle(host).backgroundColor || '#E5D8C4';
    };
    const update = () => {
      frame = 0;
      if (!active) return;
      const color = visibleColor();
      if (color === lastColor) return;
      lastColor = color;
      meta.content = color;
      underlays.forEach(element => { element.style.backgroundColor = color; });
    };
    const schedule = () => { if (!frame && active) frame = requestAnimationFrame(update); };
    const observe = () => {
      if (!active) return;
      observer?.disconnect();
      // Observe a thin strip at the visible top edge. Work happens at section
      // boundaries, never on each touch/scroll frame or in a polling loop.
      const height = Math.max(0, window.innerHeight);
      // An iframe or tab can briefly have no layout viewport while resizing.
      // Keep every inset numeric: concatenating a minus sign with a negative
      // top offset would create an invalid rootMargin such as "--2px".
      const top = Math.max(0, Math.min(Math.max(0, height - 2), window.visualViewport?.offsetTop ?? 0));
      const bottom = Math.max(0, height - top - 8);
      observer = new IntersectionObserver(schedule, {
        rootMargin: `${-top}px 0px ${-bottom}px 0px`,
        threshold: 0,
      });
      observer.observe(host);
      host.querySelectorAll(SURFACES).forEach(element => observer?.observe(element));
      schedule();
    };
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(observe, 180);
    };
    observe();
    window.addEventListener('resize', resize, { passive: true });
    window.visualViewport?.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pageshow', schedule);
    document.fonts.ready.then(() => { if (active) schedule(); });
    return () => {
      active = false;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.removeEventListener('pageshow', schedule);
      underlays.forEach((element, index) => {
        const previous = previousColors[index];
        if (previous.value) element.style.setProperty('background-color', previous.value, previous.priority);
        else element.style.removeProperty('background-color');
      });
      if (!existingMeta) meta.remove();
      else if (previousMeta === null) meta.removeAttribute('content');
      else meta.content = previousMeta;
    };
  }, [root, routeKey]);
}
