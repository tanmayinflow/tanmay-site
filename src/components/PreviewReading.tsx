import { useEffect, useRef } from 'react';
import { previewCopy as p, previewText } from '../preview-copy';

export function PreviewComparisonKey({lang}:{lang:string}) {
 return <div className="preview-comparison-key"><span>✕ {lang==='en'?'Old way':'Stará cesta'}</span><strong>✓ {lang==='en'?'New practice':'Nová praxe'}</strong></div>;
}
export function PreviewComparison({lang,showKey=true}:{lang:string;showKey?:boolean}) {
 const c=(v:readonly string[])=>previewText(v,lang);
 return <div className="preview-comparison">{showKey&&<PreviewComparisonKey lang={lang}/ >}{p.oldWays.map((x,i)=><article key={i}><p className="preview-old-way"><span aria-hidden="true">✕</span>{c(x[0])}</p><h3><span aria-hidden="true">✓</span>{c(x[1])}</h3></article>)}</div>;
}

export function PreviewWants({lang}:{lang:string}) {
 const root=useRef<HTMLUListElement>(null);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set<Animation>();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(preference.matches)return;
   const animation=entry.target.animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
   animations.add(animation);animation.onfinish=()=>animations.delete(animation);
  }),{threshold:.65});
  root.current?.querySelectorAll('li').forEach(el=>observer.observe(el));
  const cancel=()=>{animations.forEach(a=>a.cancel());animations.clear();};
  preference.addEventListener('change',cancel);
  return()=>{observer.disconnect();cancel();preference.removeEventListener('change',cancel);};
 },[]);
 return <ul className="preview-wants" ref={root}>{p.wants.map((x,i)=><li key={x[0]}><span aria-hidden="true">0{i+1}</span><p>{previewText(x,lang)}</p></li>)}</ul>;
}

/** Native document scroll owns the distance. No wheel/touch interception or focus trap. */
export function PreviewBenefits({lang,kind='benefits'}:{lang:string;kind?:'benefits'|'barriers'}) {
 const root=useRef<HTMLElement>(null), pin=useRef<HTMLDivElement>(null), track=useRef<HTMLDivElement>(null);
 const c=(v:readonly string[])=>previewText(v,lang);
 useEffect(()=>{
  const host=root.current!,panel=pin.current!,row=track.current!;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let distance=0,frame=0,pinTop=24,disposed=false;
  const paint=()=>{frame=0;if(!distance)return;const progress=Math.max(0,Math.min(distance,-host.getBoundingClientRect().top+pinTop));row.style.transform=`translate3d(${-progress}px,0,0)`;};
  const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const measure=()=>{
   host.dataset.pinned='true';row.style.transform='';host.style.height='';
   pinTop=parseFloat(getComputedStyle(panel).top)||24;
   const height=panel.offsetHeight;
   const viewport=window.visualViewport?.height||innerHeight;
   distance=preference.matches||height>viewport-pinTop-96?0:Math.max(0,row.scrollWidth-row.clientWidth);
   host.dataset.pinned=distance?'true':'false';
   if(distance)host.style.height=`${height+distance}px`;
   queue();
  };
  let measuredWidth=0;
  const observer=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==measuredWidth){measuredWidth=width;measure();}});observer.observe(panel);
  preference.addEventListener('change',measure);window.addEventListener('resize',measure);window.addEventListener('scroll',queue,{passive:true});
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);preference.removeEventListener('change',measure);window.removeEventListener('resize',measure);window.removeEventListener('scroll',queue);};
 },[lang,kind]);
 const barriers=kind==='barriers',titleId=barriers?'preview-barriers-title':'preview-benefits-title';
 return <section className={'preview-benefits'+(barriers?' preview-barriers':'')} ref={root} aria-labelledby={titleId}><div className="preview-benefits-pin" ref={pin}><h2 id={titleId}>{c(barriers?p.barriersTitle:p.benefitsTitle)}</h2><div className="preview-benefits-window"><div className="preview-benefits-track" ref={track}>{(barriers?p.barriers:p.benefits).map((x,i)=><article key={x[0][0]}>{!barriers&&<span className="preview-benefit-number" aria-hidden="true">0{i+1}</span>}<h3>{c(x[0])}</h3><p>{barriers&&<span className="preview-solution-arrow" aria-hidden="true">→</span>}{c(x[1])}</p></article>)}</div></div>{!barriers&&<p className="preview-benefits-close"><strong>{c(p.benefitsClose)}</strong></p>}</div></section>;
}
