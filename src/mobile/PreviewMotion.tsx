import { useEffect, type RefObject } from 'react';
import { previewCopy, previewText } from '../preview-copy';

/** Four centered statements; the owner prefers simple bullets to underlines. */
export function MobilePreviewWants({lang}:{lang:string}) {
 return <ul className="preview-wants-editorial">{previewCopy.wants.map(pair=><li key={pair[0]}><p className="preview-want-text">{previewText(pair,lang)}</p></li>)}</ul>;
}

/** Mirrored curves share one size and begin beside the paragraph's final line. */
export function useProcessConnectors(root:RefObject<HTMLOListElement>,key:string) {
 useEffect(()=>{
  const list=root.current;if(!list)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let live=true,frame=0;
  const arrows=Array.from(list.querySelectorAll<SVGSVGElement>('.preview-curve-arrow'));
  const measure=()=>{
   frame=0;if(!live)return;
   arrows.forEach((arrow,i)=>{
    const item=arrow.closest('li')!,copy=item.querySelector('.preview-step-copy')!;
    const range=document.createRange();range.selectNodeContents(copy);
    const lines=Array.from(range.getClientRects()).filter(b=>b.width>0),last=lines[lines.length-1];if(!last)return;
    const box=item.getBoundingClientRect(),width=96,height=84;
    const left=i===0?box.width-width-16:16,top=last.top+last.height*.55-box.top-8;
    arrow.style.left=left+'px';arrow.style.top=top+'px';
    if(arrow.style.getPropertyPriority('width')!=='important')arrow.style.width=width+'px';
    if(arrow.style.getPropertyPriority('height')!=='important')arrow.style.height=height+'px';
    arrow.setAttribute('viewBox',`0 0 ${width} ${height}`);
    arrow.children[0].setAttribute('d',i===0?'M10 8 C72 5 86 40 68 67':'M86 8 C24 5 10 40 28 67');
    arrow.children[1].setAttribute('d',i===0?'M67 53 L68 67 L81 62':'M29 53 L28 67 L15 62');
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
