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
   for(let i=0;i<2;i++){
    const top=bounds[i].bottom-box.top+8,bottom=bounds[i+1].top-box.top-22;
    const h=Math.max(40,bottom-top),mirror=i===1;
    const width=i===0?76:112,edge=mirror?24:w-24;
    const x=(local:number)=>mirror?edge+local:edge-local;
    const points=[{x:x(width*.75),y:top},{x:x(0),y:top+2},{x:x(0),y:top+h*.65},{x:x(width*.44),y:top+h}];
    const sides:[string[],string[]]=[[],[]];
    for(let j=0;j<=72;j++){
     const t=j/72,u=1-t,[a,b,c,d]=points;
     const px=u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x;
     const py=u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y;
     const dx=3*u*u*(b.x-a.x)+6*u*t*(c.x-b.x)+3*t*t*(d.x-c.x);
     const dy=3*u*u*(b.y-a.y)+6*u*t*(c.y-b.y)+3*t*t*(d.y-c.y);
     const norm=Math.hypot(dx,dy)||1,half=i===0?1.5+5*t:6.5+8*t;
     sides[0].push(`${(px-dy/norm*half).toFixed(2)},${(py+dx/norm*half).toFixed(2)}`);
     sides[1].push(`${(px+dy/norm*half).toFixed(2)},${(py-dx/norm*half).toFixed(2)}`);
    }
    sides.forEach((side,j)=>edges[i*2+j].setAttribute('d',`M${side.join(' L')}`));
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
