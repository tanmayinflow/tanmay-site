import { useEffect, useRef, type ReactNode } from 'react';

/** One ribbon follows the free space beside and between the three steps.
 * Its width grows towards the reader; the text always remains unobstructed. */
export function PreviewProcessRoad({children,lang}:{children:ReactNode;lang:string}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=root.current!;
  const svg=host.querySelector<SVGSVGElement>('.preview-process-road-art')!;
  const centre=svg.querySelector<SVGPathElement>('.preview-road-centre')!;
  const ribbon=svg.querySelector<SVGPathElement>('.preview-road-ribbon')!;
  let frame=0,live=true;
  const measure=()=>{
   frame=0;if(!live)return;
   const items=Array.from(host.querySelectorAll<HTMLElement>('ol > li'));
   if(items.length!==3)return;
   const box=host.getBoundingClientRect(),w=box.width;
   const bounds=items.map(item=>item.firstElementChild!.getBoundingClientRect());
   const [a,b,c]=bounds.map(rect=>({top:rect.top-box.top,bottom:rect.bottom-box.top}));
   const right=w-15,left=15,middle=w*.5;
   const d=`M ${right} ${a.top+12} C ${right+4} ${a.bottom-24}, ${right+4} ${a.bottom+18}, ${w*.8} ${a.bottom+30} S ${left} ${b.top-40}, ${left} ${b.top+14} L ${left} ${b.bottom-12} C ${left} ${b.bottom+32}, ${middle} ${b.bottom+30}, ${middle} ${c.top-12}`;
   svg.setAttribute('viewBox',`0 0 ${w} ${host.offsetHeight}`);
   centre.setAttribute('d',d);
   const length=centre.getTotalLength(),sides:[string[],string[]]=[[],[]];
   for(let i=0;i<=160;i++){
    const t=i/160,at=t*length,p=centre.getPointAtLength(at);
    const before=centre.getPointAtLength(Math.max(0,at-.5)),after=centre.getPointAtLength(Math.min(length,at+.5));
    const dx=after.x-before.x,dy=after.y-before.y,norm=Math.hypot(dx,dy)||1,half=1.1+6.5*t*t;
    sides[0].push(`${(p.x-dy/norm*half).toFixed(2)},${(p.y+dx/norm*half).toFixed(2)}`);
    sides[1].push(`${(p.x+dy/norm*half).toFixed(2)},${(p.y-dx/norm*half).toFixed(2)}`);
   }
   ribbon.setAttribute('d',`M${sides[0].join(' L')} L${sides[1].reverse().join(' L')} Z`);
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(queue);observer.observe(host);
  host.querySelectorAll('ol > li > div').forEach(el=>observer.observe(el));
  document.fonts.ready.then(()=>{if(live)queue();});measure();
  return()=>{live=false;observer.disconnect();cancelAnimationFrame(frame);};
 },[lang]);
 return <div ref={root} className="preview-process-road"><svg className="preview-process-road-art" aria-hidden="true" fill="none"><path className="preview-road-centre" visibility="hidden"/><path className="preview-road-ribbon"/></svg>{children}</div>;
}
