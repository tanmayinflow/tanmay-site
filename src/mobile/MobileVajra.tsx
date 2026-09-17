import { useId } from 'react';

/** The supplied JPEG stays untouched. Its blue chroma supplies alpha; neutral
 * checkerboard pixels have B = R and therefore become transparent. */
export function MobileVajra({className=''}:{className?:string}) {
  const id=useId(),filter=id+'-chroma',mask=id+'-mask';
  return <svg className={'m-vajra '+className} viewBox="0 0 705 371" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <filter id={filter} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -2 0 2 0 0"/></filter>
      <mask id={mask} x="0" y="0" width="705" height="371" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-m8/vajra-reference.jpg" width="705" height="371" filter={`url(#${filter})`}/></mask>
    </defs>
    <rect width="705" height="371" fill="currentColor" mask={`url(#${mask})`}/>
  </svg>;
}
