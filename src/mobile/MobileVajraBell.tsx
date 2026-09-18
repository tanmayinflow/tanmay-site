import { useId } from 'react';

/** A simplified version of the supplied composition; alpha keeps the open
 * contours transparent and currentColor matches the original hero artwork. */
export function MobileVajraBell() {
  const mask = useId() + '-vajra-bell';
  return <svg className="m10-hero-vajra m-hero-vajra-bell" viewBox="0 0 1448 1086" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs><mask id={mask} x="0" y="0" width="1448" height="1086" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-round5/vajra-bell-outline.png" width="1448" height="1086"/></mask></defs>
    <rect width="1448" height="1086" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}
