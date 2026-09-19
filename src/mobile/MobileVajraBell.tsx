import { useId } from 'react';

/** A simplified version of the supplied composition; alpha keeps the open
 * contours transparent and currentColor matches the original hero artwork.
 * A small alpha expansion strengthens the supplied lines without blur or recolouring. */
export function MobileVajraBell() {
  const id = useId(), mask = id + '-vajra-bell', stroke = id + '-vajra-bell-stroke';
  return <svg className="m10-hero-vajra m-hero-vajra-bell" viewBox="0 0 1448 1086" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <filter id={stroke} x="0" y="0" width="1448" height="1086" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="2"/></filter>
      <mask id={mask} x="0" y="0" width="1448" height="1086" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-round5/vajra-bell-outline.png" width="1448" height="1086" filter={`url(#${stroke})`}/></mask></defs>
    <rect width="1448" height="1086" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}
