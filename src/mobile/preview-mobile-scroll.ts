import { useEffect } from 'react';
import './preview-mobile-scroll.css';

/** Native page pin shared by every mobile rail. The two owned spacers exchange
 * completed travel only at stage boundaries; no blank runway sits in the story.
 * Between boundaries the browser holds the page, and only a row transforms. */
export function usePreviewPageScroll(key:string) {
 useEffect(()=>{
  const page=document.getElementById('root');
  if(!page||page.parentElement!==document.body)return;
  const hosts=Array.from(page.querySelectorAll<HTMLElement>('.tm-mobile[data-preview="v3"] .preview-benefits'));
  if(!hosts.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const before=document.createElement('div'),after=document.createElement('div');
  for(const spacer of [before,after]){spacer.dataset.previewTravel='';spacer.setAttribute('aria-hidden','true');}
  page.before(before);page.after(after);
  type Stage={host:HTMLElement;row:HTMLElement;start:number;distance:number;consumed:number};
  let stages:Stage[]=[],total=0,frame=0,layoutFrame=0,hashFrame=0,live=true,escaped=false,boundary=-1;
  const paint=()=>{
   frame=0;if(!live||!stages.length)return;
   const y=scrollY;
   const next=stages.findIndex(s=>y<s.start+s.consumed+s.distance);
   const index=next<0?stages.length:next;
   if(index!==boundary){
    boundary=index;
    const consumed=stages[index]?.consumed??total;
    before.style.height=consumed+'px';after.style.height=(total-consumed)+'px';
    page.style.setProperty('--preview-page-pin',-(stages[index]?.start??page.offsetHeight)+'px');
   }
   for(const s of stages){
    const progress=Math.max(0,Math.min(s.distance,y-s.start-s.consumed));
    s.row.style.transform=`translate3d(${-progress}px,0,0)`;
    s.host.dataset.phase=progress<=0?'before':progress>=s.distance?'after':'active';
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const configure=()=>{
   if(!live)return;
   stages=[];total=0;boundary=-1;
   const viewport=visualViewport?.height||innerHeight;
   const flow=escaped||reduced.matches||innerWidth>=900||viewport<560||parseFloat(getComputedStyle(document.documentElement).fontSize)>20||(visualViewport?.scale||1)>1.01;
   for(const host of hosts){
    const panel=host.querySelector<HTMLElement>('.preview-benefits-pin')!,row=host.querySelector<HTMLElement>('.preview-benefits-track')!;
    host.dataset.pinned=flow?'false':'true';host.dataset.pageRail='true';row.style.transform='';
    const portrait=host.querySelector<HTMLElement>('.preview-handstand-photo');
    if(portrait){portrait.style.height='';if(!flow){const room=viewport-24-92-(panel.offsetHeight-portrait.offsetHeight);portrait.style.height=Math.max(240,Math.min(portrait.offsetHeight,room))+'px';}}
    const distance=flow||panel.offsetHeight>viewport-24-88?0:Math.max(0,row.scrollWidth-row.clientWidth);
    if(distance){
     const start=panel.getBoundingClientRect().top-page.getBoundingClientRect().top-24;
     stages.push({host,row,start,distance,consumed:total});total+=distance;
    }else{host.dataset.pinned='false';delete host.dataset.phase;if(portrait)portrait.style.height='';}
   }
   if(total){page.dataset.previewPageRoot='';paint();}
   else{delete page.dataset.previewPageRoot;page.style.removeProperty('--preview-page-pin');before.style.height='0px';after.style.height='0px';}
  };
  const goTo=(target:HTMLElement)=>{
   const natural=target.getBoundingClientRect().top-page.getBoundingClientRect().top;
   const travel=stages.filter(s=>s.host!==target&&!s.host.contains(target)&&s.start<natural).reduce((sum,s)=>sum+s.distance,0);
   scrollTo({top:Math.max(0,natural+travel-24),behavior:'instant'});paint();
  };
  const hash=()=>{
   hashFrame=0;if(!live||!location.hash)return;
   let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);if(target&&page.contains(target))goTo(target.querySelector<HTMLElement>('[data-mobile-contact-target]')||target);
  };
  const onHash=()=>{cancelAnimationFrame(hashFrame);hashFrame=requestAnimationFrame(hash);};
  const onClick=(e:MouseEvent)=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
   const link=e.target instanceof Element?e.target.closest<HTMLAnchorElement>('a[href]'):null;
   if(!link||link.hasAttribute('download')||link.target&&link.target!=='_self'||!link.hash||link.origin!==location.origin||link.pathname!==location.pathname)return;
   let id='';try{id=decodeURIComponent(link.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);if(!target)return;
   e.preventDefault();history.pushState(history.state,'',link.hash);goTo(target.querySelector<HTMLElement>('[data-mobile-contact-target]')||target);
   target.querySelector<HTMLElement>('h2[tabindex]')?.focus({preventScroll:true});
  };
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!document.querySelector('dialog[open],.m-menu[data-open=true]')&&stages.some(s=>s.host.dataset.phase==='active')){escaped=true;configure();}};
  const queueLayout=()=>{if(live&&!layoutFrame)layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;configure();});};
  const resize=new ResizeObserver(queueLayout);resize.observe(page);
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',configure);
  window.addEventListener('pageshow',queueLayout);visualViewport?.addEventListener('resize',queueLayout);
  reduced.addEventListener('change',configure);window.addEventListener('hashchange',onHash);
  document.addEventListener('click',onClick,true);window.addEventListener('keydown',onKey);
  page.addEventListener('load',configure,true);configure();
  document.fonts.ready.then(()=>{if(live){configure();onHash();}});
  return()=>{
   live=false;resize.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(layoutFrame);cancelAnimationFrame(hashFrame);
   window.removeEventListener('pageshow',queueLayout);visualViewport?.removeEventListener('resize',queueLayout);
   before.remove();after.remove();delete page.dataset.previewPageRoot;page.style.removeProperty('--preview-page-pin');
   window.removeEventListener('scroll',queue);window.removeEventListener('resize',configure);reduced.removeEventListener('change',configure);
   window.removeEventListener('hashchange',onHash);document.removeEventListener('click',onClick,true);window.removeEventListener('keydown',onKey);page.removeEventListener('load',configure,true);
  };
 },[key]);
}
