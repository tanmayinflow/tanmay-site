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
   // The hidden straight span defines BOTH tangents and a constant join width.
   // Horizontal end sections keep the two edges level, rather than clipping
   // a normal-offset curve (which used to leave the inner edge short).
   const dx=start.x-end.x,dy=start.y-end.y,length=Math.hypot(dx,dy)||1;
   const ux=dx/length,uy=dy/length,half=6.5;
   const upperHandle=Math.min(26,(end.y-top)*.45/uy);
   const lowerHeight=bottom-start.y;
   const lowerHandle=Math.min(58,(start.x-24)/-ux,lowerHeight*.32/uy);
   const point=(x:number,y:number)=>`${x.toFixed(2)},${y.toFixed(2)}`;
   for(let side=0;side<2;side++){
    const offset=side===0?half:-half;
    const a=point(w-98,top+(side===0?0:3));
    const b=point(w-(side===0?8:24),top+(side===0?0:3));
    const c=point(end.x-ux*upperHandle+offset,end.y-uy*upperHandle);
    const d=point(end.x+offset,end.y);
    edges[side].setAttribute('d',`M${a} C${b} ${c} ${d}`);
    const near=side===0?14.5:-14.5;
    const e=point(start.x+offset,start.y);
    const f=point(start.x+ux*lowerHandle+offset,start.y+uy*lowerHandle);
    const bendOffset=side===0?10:-10;
    const bendX=24+bendOffset,bendY=start.y+lowerHeight*.5;
    const g=point(bendX,bendY-lowerHeight*.2);
    const h=point(bendX,bendY);
    const j=point(bendX,bendY+lowerHeight*.23);
    const k=point(w*.27-36+near,bottom-8);
    const l=point(w*.27+near,bottom);
    edges[side+2].setAttribute('d',`M${e} C${f} ${g} ${h} C${j} ${k} ${l}`);
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(queue);observer.observe(host);
  host.querySelectorAll('ol > li > div').forEach(el=>observer.observe(el));
  document.fonts.ready.then(()=>{if(live)queue();});measure();
  return()=>{live=false;observer.disconnect();cancelAnimationFrame(frame);};
 },[lang]);
 return <div ref={root} className="preview-process-road"><svg className="preview-process-road-art" aria-hidden="true" fill="none">{[0,1,2,3].map(i=><path className="preview-road-edge" data-road-pair={Math.floor(i/2)+1} key={i}/>)}</svg>{children}</div>;
}
