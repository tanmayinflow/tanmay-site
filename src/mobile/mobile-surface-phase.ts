import { useLayoutEffect, type RefObject } from 'react';

// The original textures repeat at one page coordinate, including their masked
// lips. A fresh background origin on every chapter creates false straight seams.
export function useMobileSurfacePhase(root: RefObject<HTMLDivElement>, routeKey: string) {
  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const selector = '.m-dark,.m10-home-caption,.m-home-field,.m-closing,.m-footer,.m-material-edge,.m-mineral--home,.m-earth-coda,.m-offer';
    let frame = 0;
    let live = true;
    const measure = () => {
      const origin = host.getBoundingClientRect();
      host.querySelectorAll<HTMLElement>(selector).forEach(surface => {
        const box = surface.getBoundingClientRect();
        const x = origin.left - box.left, y = origin.top - box.top;
        const scene = surface.parentElement;
        if (scene?.classList.contains('m-hero-scene')) surface.style.setProperty('--m-surface-scene-height', `${scene.clientHeight}px`);
        surface.style.setProperty('--m-surface-x', `${x}px`);
        surface.style.setProperty('--m-surface-y', `${y}px`);
        for (const side of ['before', 'after']) {
          const style = getComputedStyle(surface, `::${side}`);
          if (style.content === 'none') continue;
          const top = style.top !== 'auto' ? parseFloat(style.top) : box.height - (parseFloat(style.bottom) || 0) - (parseFloat(style.height) || 0);
          const left = parseFloat(style.left) || 0;
          surface.style.setProperty(`--m-${side}-x`, `${x - left}px`);
          surface.style.setProperty(`--m-${side}-y`, `${y - top}px`);
        }
      });
    };
    const schedule = () => { if (!live) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(host);
    host.querySelectorAll<HTMLElement>('#main > *, .m-home-field > *').forEach(element => observer.observe(element));
    host.querySelectorAll<HTMLElement>(selector).forEach(surface => observer.observe(surface));
    const additions = new MutationObserver(schedule);
    additions.observe(host, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    host.addEventListener('load', schedule, true);
    measure();
    document.fonts.ready.then(schedule);
    return () => {
      live = false; observer.disconnect(); additions.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      host.removeEventListener('load', schedule, true);
    };
  }, [root, routeKey]);
}
