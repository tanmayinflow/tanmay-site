import { useEffect, type RefObject } from 'react';

/** Enhance native details only inside the mobile tree. Text and keyboard semantics stay native. */
export function useMobileDisclosures(root: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const active = new Map<HTMLDetailsElement, { animation: Animation; expanded: boolean }>();
    const change = (details: HTMLDetailsElement, expanded: boolean) => {
      const summary = details.querySelector('summary');
      if (!summary) return;
      const start = details.getBoundingClientRect().height;
      active.get(details)?.animation.cancel();
      active.delete(details);
      details.dataset.expanded = String(expanded);
      details.style.overflow = '';
      // The mobile controller closes the previous item after its animation finishes.
      // Native named grouping would otherwise snap that item shut immediately.
      details.removeAttribute('name');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        details.open = expanded;
        return;
      }
      details.open = true;
      const style = getComputedStyle(details);
      const end = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      details.style.overflow = 'hidden';
      const animation = details.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: 280, easing: 'cubic-bezier(.22,.68,.2,1)' });
      active.set(details, { animation, expanded });
      animation.onfinish = () => {
        if (active.get(details)?.animation !== animation) return;
        details.open = expanded;
        details.style.overflow = '';
        active.delete(details);
      };
    };
    const closeOutside = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return;
      host.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details => {
        if (!details.contains(target) && active.get(details)?.expanded !== false) change(details, false);
      });
    };
    const onOutsideClick = (event: MouseEvent) => closeOutside(event.target);
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      // Wait until the click has a stable target: closing on pointerdown can
      // move the next summary away from the finger before pointerup arrives.
      closeOutside(event.target);
      const summary = event.target.closest('summary');
      const details = summary?.parentElement;
      if (!(details instanceof HTMLDetailsElement) || !host.contains(details)) return;
      event.preventDefault();
      change(details, !(active.get(details)?.expanded ?? details.open));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
      const details = event.target.closest('details[open]');
      if (details instanceof HTMLDetailsElement) {
        event.preventDefault();
        change(details, false);
        details.querySelector('summary')?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('click', onOutsideClick);
    host.addEventListener('click', onClick);
    host.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onOutsideClick);
      host.removeEventListener('click', onClick);
      host.removeEventListener('keydown', onKey);
      active.forEach(({ animation }, details) => { animation.cancel(); details.style.overflow = ''; });
    };
  }, [root]);
}
