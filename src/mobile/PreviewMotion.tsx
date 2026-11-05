import { useEffect, type RefObject } from 'react';
import { previewCopy, previewText } from '../preview-copy';

/** Left-aligned statements inside one centered, naturally sized list. */
export function MobilePreviewWants({lang}:{lang:string}) {
 const wants=[...previewCopy.wants,['Cítit klid a jistotu ve svém těle.','Feel calm and confidence in my own body.']];
 return <ul className="preview-wants-editorial">{wants.map(pair=><li key={pair[0]}><p className="preview-want-text">{previewText(pair,lang)}</p></li>)}</ul>;
}

/** Matching, mirrored curves alternate sides beside the paragraph's final line. */
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
    const included=list.classList.contains('preview-included-steps');
    const box=item.getBoundingClientRect(),width=included?76:96,height=included?88:84;
    const left=i%2===0?box.width-width-16:16;
    // Keep the curve beside the final line where there is room. A full line
    // gets a small clearance below it instead of drawing through the words.
    const intersects=last.right>box.left+left+10&&last.left<box.left+left+width;
    const top=intersects?last.bottom-box.top+6:last.top+last.height*.55-box.top-8;
    arrow.style.left=left+'px';arrow.style.top=top+'px';
    if(arrow.style.getPropertyPriority('width')!=='important')arrow.style.width=width+'px';
    if(arrow.style.getPropertyPriority('height')!=='important')arrow.style.height=height+'px';
    arrow.setAttribute('viewBox',`0 0 ${width} ${height}`);
    // The offer uses the owner's tall down-left reference. Home retains its
    // reviewed down-right curve, with only the second connector mirrored.
    const paths=included?['M57 5 C61 36 45 60 13 77','M18 63 L12 79 L28 82']:['M10 8 C72 5 86 40 68 67','M67 53 L68 67 L81 62'];
    Array.from(arrow.children).forEach((path,j)=>{
     path.setAttribute('d',paths[j]);
     if(i%2)path.setAttribute('transform',`translate(${width} 0) scale(-1 1)`);else path.removeAttribute('transform');
    });
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
