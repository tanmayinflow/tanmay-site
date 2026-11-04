import { useEffect, useRef, type RefObject } from 'react';
import { TerrainArtwork } from '../components/TerrainArtwork';
import { previewCopy, previewText } from '../preview-copy';

/** The copy never moves. Scroll progressively uncovers the original terrain line. */
export function MobilePreviewWants({lang}:{lang:string}) {
 const root=useRef<HTMLUListElement>(null);
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const paint=()=>{
   frame=0;
   root.current?.querySelectorAll<HTMLElement>('.preview-want-line').forEach(line=>{
    const box=line.parentElement!.getBoundingClientRect();
    const progress=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.84-box.bottom)/(innerHeight*.25)));
    line.style.clipPath=line.parentElement!.matches(':nth-child(even)')?`inset(0 0 0 ${100-progress*100}%)`:`inset(0 ${100-progress*100}% 0 0)`;
   });
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);reduced.addEventListener('change',queue);paint();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);};
 },[lang]);
 return <ul ref={root} className="preview-wants-editorial">{previewCopy.wants.map(pair=><li key={pair[0]}><p className="preview-want-text">{previewText(pair,lang)}</p><span className="preview-want-line" aria-hidden="true"><TerrainArtwork variant="l02" compact/></span></li>)}</ul>;
}

/** Anchor each connector to the actual last line, including translated/wrapped copy. */
export function useProcessConnectors(root:RefObject<HTMLOListElement>,key:string) {
 useEffect(()=>{
  const list=root.current;if(!list)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let live=true,frame=0;
  const arrows=Array.from(list.querySelectorAll<SVGSVGElement>('.preview-curve-arrow'));
  const measure=()=>{
   frame=0;if(!live)return;
   arrows.forEach((arrow,i)=>{
    const item=arrow.closest('li')!,copy=item.querySelector('.preview-step-copy')!,next=item.nextElementSibling?.querySelector('.preview-step-title');
    if(!next)return;
    const range=document.createRange();range.selectNodeContents(copy);
    const lines=Array.from(range.getClientRects()).filter(b=>b.width>0),last=lines[lines.length-1];if(!last)return;
    const box=item.getBoundingClientRect(),destination=next.getBoundingClientRect(),direction=i===0?1:-1;
    const sx=(i===0?last.right+8:last.left-8)-box.left,sy=last.top+last.height*.64-box.top;
    const ex=(i===0?destination.right-20:destination.left+18)-box.left,ey=destination.top-box.top-12;
    const left=Math.min(sx,ex)-48,top=sy-18,width=Math.abs(ex-sx)+96,height=Math.max(70,ey-sy+36);
    const x=sx-left,y=sy-top,endX=ex-left,endY=ey-top;
    arrow.style.left=left+'px';arrow.style.top=top+'px';
    if(arrow.style.getPropertyPriority('width')!=='important')arrow.style.width=width+'px';
    if(arrow.style.getPropertyPriority('height')!=='important')arrow.style.height=height+'px';
    arrow.setAttribute('viewBox',`0 0 ${width} ${height}`);
    arrow.children[0].setAttribute('d',`M${x} ${y} C${x+36*direction} ${y-5} ${endX+30*direction} ${endY-26} ${endX} ${endY}`);
    const angle=Math.atan2(26,-30*direction),arm=13;
    arrow.children[1].setAttribute('d',`M${endX-arm*Math.cos(angle-.55)} ${endY-arm*Math.sin(angle-.55)} L${endX} ${endY} L${endX-arm*Math.cos(angle+.55)} ${endY-arm*Math.sin(angle+.55)}`);
   });
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.3});
  const motion=()=>arrows.forEach(a=>{if(reduced.matches)a.classList.add('is-visible');else observer.observe(a);});
  const resize=new ResizeObserver(queue);resize.observe(list);
  document.fonts.ready.then(()=>{if(live)queue();});window.addEventListener('resize',queue);reduced.addEventListener('change',motion);
  measure();motion();
  return()=>{live=false;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();window.removeEventListener('resize',queue);reduced.removeEventListener('change',motion);};
 },[key]);
}
