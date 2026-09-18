import { useEffect, type RefObject } from 'react';

/** The first pass uses real page travel and CSS sticky, including native touch
 * momentum that began above the story. No late preventDefault or body lock. */
export function useMobileStoryScroll(root:RefObject<HTMLDivElement>,pageKey:string) {
  useEffect(()=>{
    const host=root.current,story=host?.querySelector<HTMLElement>('.m-story-timeline');
    const reader=story?.querySelector<HTMLElement>('.m-story-scroll');
    const runway=story?.closest<HTMLElement>('.m-story-runway');
    if(!host||!story||!reader||!runway)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let phase:'armed'|'active'|'done'='armed',lastY=scrollY,frame=0;
    let touchY:number|null=null,travel=0;
    let readingStage=reader.querySelector<HTMLElement>('[data-story-phase]');
    const mark=()=>{story.dataset.pageScroll=phase;};
    const max=()=>Math.max(0,reader.scrollHeight-reader.clientHeight);
    const pinTop=()=>{
      const header=host.querySelector<HTMLElement>('.m-header'),box=header?.getBoundingClientRect();
      const pinned=header&&['sticky','fixed'].includes(getComputedStyle(header).position);
      return Math.max((visualViewport?.offsetTop||0)+16,pinned&&box&&box.bottom>0?box.bottom+12:0);
    };
    const fits=()=>{
      const bottom=(visualViewport?.offsetTop||0)+(visualViewport?.height||innerHeight);
      const dock=host.querySelector<HTMLElement>('.m-dock')?.getBoundingClientRect();
      const lowerEdge=dock&&dock.height>0?Math.min(bottom-12,dock.top-12):bottom-84;
      return !preference.matches&&(visualViewport?.scale||1)<=1.01&&max()>2&&story.offsetHeight+pinTop()<=lowerEdge;
    };
    const interactive=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('a,button,input,textarea,select,[contenteditable=true],[role=button],dialog');
    const release=(reason:string)=>{
      if(phase==='done')return;
      // Removing the consumed runway must not move the visible story or the
      // following content. Measure both layouts, then compensate in the same task.
      // A compact-to-linear reflow has already reset the native scrollTop.
      // Preserve the last read stage, not the beginning of the whole timeline.
      const anchor=phase==='active'&&max()<2&&readingStage?readingStage:story;
      const before=anchor===story?story.getBoundingClientRect().top:pinTop();
      phase='done';mark();story.dataset.storyExit=reason;
      delete runway.dataset.storySticky;
      runway.style.removeProperty('--story-travel');
      runway.style.removeProperty('--story-height');
      const shift=anchor.getBoundingClientRect().top-before;
      // Layout may already have changed scrollY through native scroll anchoring.
      if(Math.abs(shift)>.5)scrollTo({top:Math.max(0,scrollY+shift),behavior:'instant'});
      lastY=scrollY;
    };
    const configure=()=>{
      if(phase==='done')return;
      if(!fits()){release('native-layout');return;}
      travel=max();
      runway.style.setProperty('--story-travel',travel+'px');
      runway.style.setProperty('--story-height',story.offsetHeight+'px');
      runway.style.setProperty('--story-pin-top',pinTop()+'px');
      runway.dataset.storySticky='true';
    };
    const paint=()=>{
      frame=0;
      const y=scrollY,delta=y-lastY;lastY=y;
      if(phase==='done')return;
      if(document.querySelector('dialog[open]')||!reader.isConnected||!fits()){release('native-layout');return;}
      if(phase==='active'&&delta<-2){release('upward');return;}
      const distance=pinTop()-runway.getBoundingClientRect().top;
      if(distance<0)return;
      if(phase==='armed'){
        if(delta<0||reader.scrollTop>1){release('manual-position');return;}
        phase='active';mark();
      }
      reader.scrollTop=Math.min(travel,Math.max(0,distance));
      const boundary=reader.getBoundingClientRect().top+reader.clientHeight*.34;
      reader.querySelectorAll<HTMLElement>('[data-story-phase]').forEach(stage=>{if(stage.getBoundingClientRect().top<=boundary)readingStage=stage;});
      if(distance>=travel-1)release('complete');
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
    const onResize=()=>{
      if(phase==='done')return;
      configure();schedule();
    };
    const onWheel=(event:WheelEvent)=>{
      if(phase!=='active')return;
      if(event.ctrlKey||event.metaKey||event.shiftKey||interactive(event.target)||event.deltaY<0)release('wheel-exit');
    };
    const onTouchStart=(event:TouchEvent)=>{
      touchY=event.touches.length===1?event.touches[0].clientY:null;
      if(phase==='active'&&(touchY===null||interactive(event.target)))release('touch-exit');
    };
    const onTouchMove=(event:TouchEvent)=>{
      if(event.touches.length!==1){touchY=null;if(phase==='active')release('pinch');return;}
      const y=event.touches[0].clientY;
      if(phase==='active'&&touchY!==null&&y-touchY>3)release('upward');
      touchY=y;
    };
    const onTouchEnd=()=>{touchY=null;};
    const onKey=(event:KeyboardEvent)=>{
      if(phase!=='active'||event.defaultPrevented)return;
      if(event.altKey||event.ctrlKey||event.metaKey||interactive(event.target)||['Escape','Tab','Home','End','ArrowUp','PageUp'].includes(event.key)||(event.key===' '&&event.shiftKey)){release('keyboard-exit');return;}
      // A focused overflow:hidden reader can consume these keys itself. Route
      // them to the same native page travel as touch/wheel, without a scroll lock.
      const delta=event.key==='ArrowDown'?40:['PageDown',' '].includes(event.key)?reader.clientHeight*.8:0;
      if(delta){event.preventDefault();scrollBy({top:delta,behavior:'instant'});}
    };
    const onClick=(event:MouseEvent)=>{
      if(interactive(event.target)&&(phase==='active'||(event.target instanceof Element&&event.target.closest('a,.m-story-phase-controls'))))release('explicit-navigation');
    };
    const onPreference=()=>release('motion-preference');
    if(runway.getBoundingClientRect().top<pinTop())phase='done';
    mark();configure();
    const resize=new ResizeObserver(onResize);resize.observe(reader);resize.observe(story);
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('wheel',onWheel,{passive:true});
    window.addEventListener('touchstart',onTouchStart,{passive:true});
    window.addEventListener('touchmove',onTouchMove,{passive:true});
    window.addEventListener('touchend',onTouchEnd,{passive:true});
    window.addEventListener('touchcancel',onTouchEnd,{passive:true});
    window.addEventListener('keydown',onKey);
    document.addEventListener('click',onClick,true);
    preference.addEventListener('change',onPreference);visualViewport?.addEventListener('resize',onResize);
    return()=>{
      resize.disconnect();cancelAnimationFrame(frame);
      delete story.dataset.pageScroll;delete story.dataset.storyExit;delete runway.dataset.storySticky;
      runway.style.removeProperty('--story-travel');runway.style.removeProperty('--story-height');runway.style.removeProperty('--story-pin-top');
      window.removeEventListener('scroll',schedule);window.removeEventListener('resize',onResize);window.removeEventListener('wheel',onWheel);
      window.removeEventListener('touchstart',onTouchStart);window.removeEventListener('touchmove',onTouchMove);
      window.removeEventListener('touchend',onTouchEnd);window.removeEventListener('touchcancel',onTouchEnd);window.removeEventListener('keydown',onKey);
      document.removeEventListener('click',onClick,true);
      preference.removeEventListener('change',onPreference);visualViewport?.removeEventListener('resize',onResize);
    };
  },[root,pageKey]);
}
