import { useEffect, useRef } from 'react';
import { previewCopy as p, previewText } from '../preview-copy';
import { Photo } from '../mobile/MobileElements';
import { mobilePreviewCopy } from '../mobile/PreviewDetails';
import { mobileText } from '../mobile/mobile-copy';
import { bindPreviewRailSwipe } from '../mobile/preview-rail-swipe';

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
 return <ul className="preview-wants" ref={root}>{[...p.wants,['Cítit klid a jistotu ve svém těle.','Feel calm and confidence in my own body.']].map((x,i)=><li key={x[0]}><span aria-hidden="true">0{i+1}</span><p>{previewText(x,lang)}</p></li>)}</ul>;
}

/** Native scroll moves only the row; the full mobile scene releases at its end. */
function usePreviewRail(key:string,handstand=false) {
 const root=useRef<HTMLElement>(null), pin=useRef<HTMLDivElement>(null), track=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=root.current!,panel=pin.current!,row=track.current!;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:899px)');
  let distance=0,progress=0,manual:number|undefined,frame=0,pinTop=24,disposed=false;
  const paint=()=>{
   frame=0;if(mobile.matches||!distance)return;
   const natural=-host.getBoundingClientRect().top+pinTop;
   if(manual!==undefined&&natural>=0&&natural<=distance){scrollBy({top:manual-natural,behavior:'instant'});manual=undefined;}
   progress=manual??Math.max(0,Math.min(distance,-host.getBoundingClientRect().top+pinTop));
   row.style.transform=`translate3d(${-progress}px,0,0)`;
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const measure=()=>{
   if(mobile.matches){distance=0;manual=undefined;host.style.height='';panel.style.minHeight='';return;}
   host.dataset.pinned='true';row.style.transform='';host.style.height='';panel.style.minHeight='';
   pinTop=parseFloat(getComputedStyle(panel).top)||24;
   const viewport=window.visualViewport?.height||innerHeight;
   const portrait=handstand?panel.querySelector<HTMLElement>('.preview-handstand-photo'):null;
   if(portrait){
    portrait.style.height='';
    const available=viewport-pinTop-96-(panel.offsetHeight-portrait.offsetHeight);
    portrait.style.height=`${Math.max(240,Math.min(portrait.offsetHeight,available))}px`;
   }
   const height=panel.offsetHeight;
   distance=preference.matches||height>viewport-pinTop-96?0:Math.max(0,row.scrollWidth-row.clientWidth);
   host.dataset.pinned=distance?'true':'false';
   if(distance){
    panel.querySelector<HTMLElement>('.preview-benefits-window')!.scrollLeft=0;
    // The next chapter stays below the viewport until every card has passed.
    if(mobile.matches)panel.style.minHeight=`${viewport-pinTop}px`;
    host.style.height=`${panel.offsetHeight+distance}px`;
   }else if(portrait)portrait.style.height='';
   queue();
  };
  const unbindSwipe=bindPreviewRailSwipe(panel.querySelector<HTMLElement>('.preview-benefits-window')!,
   ()=>!mobile.matches&&distance?{progress,distance}:null,
   value=>{
    const natural=-host.getBoundingClientRect().top+pinTop;
    if(natural>=-1&&natural<=distance+1){manual=undefined;scrollBy({top:value-natural,behavior:'instant'});}
    else manual=value;
    paint();
   });
  let measuredWidth=0;
  const observer=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width!==measuredWidth){measuredWidth=width;measure();}});observer.observe(panel);
  preference.addEventListener('change',measure);window.addEventListener('resize',measure);window.addEventListener('scroll',queue,{passive:true});
  document.fonts.ready.then(()=>{if(!disposed)measure();});measure();
  return()=>{disposed=true;unbindSwipe();observer.disconnect();cancelAnimationFrame(frame);preference.removeEventListener('change',measure);window.removeEventListener('resize',measure);window.removeEventListener('scroll',queue);};
 },[key,handstand]);
 return {root,pin,track};
}

export function PreviewHandstand({lang}:{lang:string}) {
 const {root,pin,track}=usePreviewRail(lang+'comparison',true);
 const c=(v:readonly string[])=>previewText(v,lang);
 return <section className="preview-benefits preview-handstand" ref={root} aria-labelledby="preview-handstand-title"><div className="preview-benefits-pin" ref={pin}>
  <h2 id="preview-handstand-title">{c(mobilePreviewCopy.oldTitle)}</h2>
  <div className="preview-benefits-window"><div className="preview-benefits-track preview-pairs" ref={track}>{p.oldWays.map((x,i)=><article key={i}><p className="preview-pair-old"><span className="preview-pair-label">✕ {lang==='en'?'Old way':'Stará cesta'}</span>{c(x[0])}</p><h3><span className="preview-pair-label">✓ {lang==='en'?'New practice':'Nová praxe'}</span>{c(x[1])}</h3></article>)}</div></div>
  <div className="preview-handstand-photo"><Photo asset="earthField" alt="" className="preview-handstand-earth"/><Photo asset="handstand" alt={mobileText('handstandAlt',lang)} className="preview-handstand-person"/></div>
  <p className="preview-benefits-close">{c(p.oldClose)}</p>
 </div></section>;
}

export function PreviewBenefits({lang,kind='benefits',close}:{lang:string;kind?:'benefits'|'barriers';close?:string}) {
 const {root,pin,track}=usePreviewRail(lang+kind);
 const c=(v:readonly string[])=>previewText(v,lang);
 const barriers=kind==='barriers',titleId=barriers?'preview-barriers-title':'preview-benefits-title';
 return <section className={'preview-benefits'+(barriers?' preview-barriers':'')} ref={root} aria-labelledby={titleId}><div className="preview-benefits-pin" ref={pin}><h2 id={titleId}>{c(barriers?p.barriersTitle:p.benefitsTitle)}</h2><div className="preview-benefits-window"><div className="preview-benefits-track" ref={track}>{(barriers?p.barriers:p.benefits).map((x,i)=><article key={x[0][0]}>{!barriers&&<span className="preview-benefit-number" aria-hidden="true">0{i+1}</span>}<h3>{c(x[0])}</h3><p>{barriers&&<span className="preview-solution-arrow" aria-hidden="true">→</span>}{c(x[1])}</p></article>)}</div></div>{barriers?close&&<p className="preview-benefits-close preview-work-bridge">{close}</p>:<p className="preview-benefits-close"><strong>{c(p.benefitsClose)}</strong></p>}</div></section>;
}
