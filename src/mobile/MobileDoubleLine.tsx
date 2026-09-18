import { useId } from 'react';

/** Keep the original upper paths and sharpen their alpha to the supplied lower
 * line's weight. 1.1 source pixels adds about half a CSS pixel at phone widths. */
export function MobileHomeLines() {
  const id = useId(), mask = id + '-home-lines', weight = id + '-line-weight';
  return <svg className="terrain-art m-home-current" viewBox="0 0 1983 793" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <filter id={weight} x="0" y="0" width="100%" height="100%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.1"/></filter>
      <mask id={mask} x="0" y="0" width="1983" height="793" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/refine-v9-15/home-terrain-original-alpha.png" width="1983" height="793" filter={`url(#${weight})`}/></mask>
    </defs>
    <rect width="1983" height="793" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}

/** Original owner-supplied alpha, with only empty margins cropped in the viewBox. */
export function MobileDoubleLine() {
  const mask = useId() + '-double-line';
  return <svg className="m-home-about-lines" viewBox="0 220 2172 320" aria-hidden="true" focusable="false">
    <defs><mask id={mask} x="0" y="0" width="2172" height="724" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-round4/double-line-original.png" width="2172" height="724"/></mask></defs>
    <rect x="0" y="220" width="2172" height="320" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}
