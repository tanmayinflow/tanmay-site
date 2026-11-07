import { useEffect } from 'react';
import { bindPreviewRailSwipe } from './preview-rail-swipe';
import { createScrollLayoutScheduler, railProgress, type RailGestureAnchor } from './scroll-layout-scheduler';
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
  type Stage={host:HTMLElement;row:HTMLElement;start:number;distance:number;consumed:number;progress:number;manual?:RailGestureAnchor};
  let stages:Stage[]=[],total=0,frame=0,hashFrame=0,live=true,escaped=false,boundary=-1;
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
    const progress=railProgress(y-s.start-s.consumed,s.distance,s.manual);
    s.progress=progress;
    s.row.style.transform=`translate3d(${-progress}px,0,0)`;
    s.host.dataset.phase=progress<=0?'before':progress>=s.distance?'after':'active';
   }
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const configure=()=>{
   if(!live)return;
   const previous=stages;stages=[];total=0;boundary=-1;
   const viewport=visualViewport?.height||innerHeight;
   // iOS browser chrome can pan the visual viewport inside the layout viewport.
   // Pin the heading inside that visible window, not behind its upper edge.
   const pinTop=(visualViewport?.offsetTop||0)+24;
   const dock=page.querySelector<HTMLElement>('.m-dock')?.getBoundingClientRect();
   const bottom=Math.min((visualViewport?.offsetTop||0)+viewport-12,dock&&dock.height>0?dock.top-12:Infinity);
   const available=bottom-pinTop-2;
   const flow=escaped||reduced.matches||innerWidth>=900||viewport<560||parseFloat(getComputedStyle(document.documentElement).fontSize)>20||(visualViewport?.scale||1)>1.01;
   for(const host of hosts){
    if(innerWidth>=900){delete host.dataset.pageRail;continue;} // Local desktop rail owns its geometry.
    const panel=host.querySelector<HTMLElement>('.preview-benefits-pin')!,row=host.querySelector<HTMLElement>('.preview-benefits-track')!;
    host.dataset.pinned=flow?'false':'true';host.dataset.pageRail='true';row.style.transform='';
    const portrait=host.querySelector<HTMLElement>('.preview-handstand-photo');
    if(portrait){portrait.style.height='';if(!flow){const room=available-(panel.offsetHeight-portrait.offsetHeight);portrait.style.height=Math.max(120,Math.min(portrait.offsetHeight,room))+'px';}}
    const distance=flow||panel.offsetHeight>available?0:Math.max(0,row.scrollWidth-row.clientWidth);
    if(distance){
     host.querySelector<HTMLElement>('.preview-benefits-window')!.scrollLeft=0;
     const start=panel.getBoundingClientRect().top-page.getBoundingClientRect().top-pinTop;
     const prior=previous.find(s=>s.host===host),manual=prior?.manual;
     stages.push({host,row,start,distance,consumed:total,progress:0,manual:manual&&{progress:manual.progress*distance/prior!.distance,natural:manual.natural*distance/prior!.distance}});total+=distance;
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
  const unbindSwipes=hosts.map(host=>bindPreviewRailSwipe(host.querySelector<HTMLElement>('.preview-benefits-window')!,
   ()=>stages.find(s=>s.host===host)??null,
   progress=>{
    const stage=stages.find(s=>s.host===host);if(!stage)return;
    stage.manual={progress,natural:Math.max(0,Math.min(stage.distance,scrollY-stage.start-stage.consumed))};
    paint();
   }));
  const layout=createScrollLayoutScheduler(configure),queueLayout=layout.request;
  // VisualViewport also emits scroll events while a touch is stationary. Only
  // actual viewport changes invalidate geometry; page scrolling just paints.
  const viewportKey=()=>[innerWidth,innerHeight,visualViewport?.offsetTop||0,visualViewport?.height||innerHeight,visualViewport?.scale||1].join(':');
  let lastViewport=viewportKey();
  const onViewport=()=>{const next=viewportKey();if(next===lastViewport)return;lastViewport=next;queueLayout();};
  const resize=new ResizeObserver(queueLayout);resize.observe(page);
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',onViewport);
  window.addEventListener('pageshow',queueLayout);visualViewport?.addEventListener('resize',onViewport);visualViewport?.addEventListener('scroll',onViewport);
  reduced.addEventListener('change',configure);window.addEventListener('hashchange',onHash);
  document.addEventListener('click',onClick,true);window.addEventListener('keydown',onKey);
  page.addEventListener('load',queueLayout,true);configure();
  document.fonts.ready.then(()=>{if(live){queueLayout();onHash();}});
  return()=>{
   live=false;layout.dispose();resize.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(hashFrame);
   unbindSwipes.forEach(unbind=>unbind());
   window.removeEventListener('pageshow',queueLayout);visualViewport?.removeEventListener('resize',onViewport);visualViewport?.removeEventListener('scroll',onViewport);
   before.remove();after.remove();delete page.dataset.previewPageRoot;page.style.removeProperty('--preview-page-pin');
   window.removeEventListener('scroll',queue);window.removeEventListener('resize',onViewport);reduced.removeEventListener('change',configure);
   window.removeEventListener('hashchange',onHash);document.removeEventListener('click',onClick,true);window.removeEventListener('keydown',onKey);page.removeEventListener('load',queueLayout,true);
  };
 },[key]);
}
