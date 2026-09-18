import { useId } from 'react';

/** Original owner-supplied alpha, with only empty margins cropped in the viewBox. */
export function MobileDoubleLine() {
  const mask = useId() + '-double-line';
  return <svg className="m-home-about-lines" viewBox="0 220 2172 320" aria-hidden="true" focusable="false">
    <defs><mask id={mask} x="0" y="0" width="2172" height="724" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-round4/double-line-original.png" width="2172" height="724"/></mask></defs>
    <rect x="0" y="220" width="2172" height="320" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}
