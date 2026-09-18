import { useEffect } from 'react';
import './desktop-motion.css';

/** Desktop enhancements follow page travel; content never depends on animation. */
export function useDesktopMotion(pageKey:string, enabled:boolean) {
  useEffect(()=>{
    if(!enabled)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const salto=document.querySelector<HTMLElement>('.who .salto-field');
    const cycle=document.querySelector<HTMLElement>('.d-cycle');
    let frame=0,disposed=false;
    const motions=new Set<Animation>();
    const clamp=(n:number)=>Math.max(0,Math.min(1,n));
    const paint=()=>{
      frame=0;if(disposed)return;
      if(salto){
        const box=salto.getBoundingClientRect();
        const progress=preference.matches?1:clamp((innerHeight*.92-box.top)/(innerHeight*.52));
        const travel=(1-progress)**2;
        salto.dataset.desktopSalto=progress>=.999?'settled':'entering';
        salto.style.setProperty('--d-salto-x',`${Math.min(460,innerWidth*.32)*travel}px`);
        salto.style.setProperty('--d-salto-angle',`${95*travel}deg`);
        salto.style.setProperty('--d-salto-opacity',String(progress));
      }
      if(cycle){
        const box=cycle.getBoundingClientRect();
        const progress=clamp((innerHeight-box.top)/(innerHeight+box.height));
        cycle.style.setProperty('--d-cycle-scroll',`${preference.matches?0:progress*80}deg`);
      }
    };
    const queue=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(paint);};
    const cancel=()=>{motions.forEach(a=>a.cancel());motions.clear();};
    const change=()=>{cancel();queue();};
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){
        observer.unobserve(entry.target);
        if(preference.matches)continue;
        // Only the existing practice equipment gets this small physical arrival.
        const animation=entry.target.animate([{opacity:.85,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.16,1,.3,1)'});
        motions.add(animation);animation.onfinish=()=>motions.delete(animation);
      }
    },{threshold:.15});
    document.querySelectorAll('.practice-work-layout .secondary-illustration--pine-rings').forEach(el=>observer.observe(el));
    const resize=new ResizeObserver(queue);
    if(salto)resize.observe(salto);if(cycle)resize.observe(cycle);
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
    preference.addEventListener('change',change);paint();
    return()=>{
      disposed=true;if(frame)cancelAnimationFrame(frame);cancel();observer.disconnect();resize.disconnect();
      window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);preference.removeEventListener('change',change);
      if(salto){delete salto.dataset.desktopSalto;['--d-salto-x','--d-salto-angle','--d-salto-opacity'].forEach(v=>salto.style.removeProperty(v));}
      cycle?.style.removeProperty('--d-cycle-scroll');
    };
  },[pageKey,enabled]);
}
