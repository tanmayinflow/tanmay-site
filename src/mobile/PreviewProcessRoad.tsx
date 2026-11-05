import { roadPair, roadPath } from './road-geometry.mjs';
import { useEffect, useRef, type ReactNode } from 'react';

/** Two open pairs of road edges; the second is wider and closer to the reader. */
export function PreviewProcessRoad({children,lang}:{children:ReactNode;lang:string}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=root.current!;
  const svg=host.querySelector<SVGSVGElement>('.preview-process-road-art')!;
  const edges=Array.from(svg.querySelectorAll<SVGPathElement>('.preview-road-edge'));
  let frame=0,live=true;
  const measure=()=>{
   frame=0;if(!live)return;
   const items=Array.from(host.querySelectorAll<HTMLElement>('ol > li'));
   if(items.length!==3)return;
   const box=host.getBoundingClientRect(),w=box.width;
   const bounds=items.map(item=>item.firstElementChild!.getBoundingClientRect());
   svg.setAttribute('viewBox',`0 0 ${w} ${host.offsetHeight}`);
   const top=bounds[0].bottom-box.top+8;
   const end={x:w-66,y:bounds[1].top-box.top-22};
   const start={x:w*.27,y:bounds[1].bottom-box.top+8};
   const bottom=bounds[2].top-box.top-22;
   const upperHeight=Math.max(48,end.y-top),lowerHeight=Math.max(60,bottom-start.y);
   const upper=roadPair({x:w-80,y:top,height:upperHeight,bend:upperHeight*.55},3,11);
   const lower=roadPair({x:start.x,y:start.y,height:lowerHeight,bend:-lowerHeight*.55},11,23);
   [...upper,...lower].forEach((points,i)=>edges[i].setAttribute('d',roadPath(points)));
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(queue);observer.observe(host);
  host.querySelectorAll('ol > li > div').forEach(el=>observer.observe(el));
  document.fonts.ready.then(()=>{if(live)queue();});measure();
  return()=>{live=false;observer.disconnect();cancelAnimationFrame(frame);};
 },[lang]);
 return <div ref={root} className="preview-process-road"><svg className="preview-process-road-art" aria-hidden="true" fill="none">{[0,1,2,3].map(i=><path className="preview-road-edge" data-road-pair={Math.floor(i/2)+1} key={i}/>)}</svg>{children}</div>;
}
