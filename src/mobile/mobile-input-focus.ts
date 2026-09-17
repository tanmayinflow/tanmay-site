import { useLayoutEffect, type RefObject } from 'react';

/** Dialog and route focus still move normally; only their visual indicator follows input. */
export function useMobileInputFocus(root: RefObject<HTMLDivElement>) {
  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const set = (value: 'pointer' | 'keyboard') => { host.dataset.inputModality = value; };
    const pointer = () => set('pointer');
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (['Tab', 'Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) set('keyboard');
    };
    set('pointer');
    // Capture before React opens a dialog or the router focuses its new heading.
    // touchstart also covers Safari's touch-to-click path without relying on its
    // inherited :focus-visible heuristic after a programmatic focus transfer.
    document.addEventListener('pointerdown', pointer, true);
    document.addEventListener('touchstart', pointer, { capture: true, passive: true });
    document.addEventListener('keydown', keyboard, true);
    return () => {
      document.removeEventListener('pointerdown', pointer, true);
      document.removeEventListener('touchstart', pointer, true);
      document.removeEventListener('keydown', keyboard, true);
      delete host.dataset.inputModality;
    };
  }, [root]);
}
