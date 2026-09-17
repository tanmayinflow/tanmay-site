import { useId } from 'react';

/** Two crops of the SAME delivered bitmap. No new pixels, retouching or filters.
 * The shared scale is measured from the hero scene by MobileHero. The crop
 * boundary follows the transparent gap between the stool and the small bars. */
export function MobileCollaborationPortrait({alt}:{alt:string}) {
  const id=useId();
  const source='/media/collaboration-v9-8/collaboration-hero-1086.webp';
  return <figure className="m-photo m-hero-photo m10-collaboration-crops" role="img" aria-label={alt}>
    <svg className="m10-person-crop" viewBox="326 114 684 1298" aria-hidden="true" focusable="false">
      <defs><clipPath id={id+'-person'}><path d="M326 114H1010V1412H390V1280L358 1276V1263L359 1252L355 1243L349 1230L326 1210Z"/></clipPath></defs>
      <image href={source} width="1086" height="1448" clipPath={`url(#${id}-person)`}/>
    </svg>
    <svg className="m10-bars-crop" viewBox="8 1190 376 224" aria-hidden="true" focusable="false">
      <defs><clipPath id={id+'-bars'}><path d="M0 1180H326V1210L349 1230L355 1243L359 1252L358 1263V1276L390 1280V1448H0Z"/></clipPath></defs>
      <image href={source} width="1086" height="1448" clipPath={`url(#${id}-bars)`}/>
    </svg>
  </figure>;
}
