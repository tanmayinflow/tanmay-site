import { useEffect, type RefObject } from 'react';

/** Motion enhances visible markup; disabled motion never hides content. */
export function useMobileMotion(root:RefObject<HTMLDivElement>,pageKey:string) {
  useEffect(()=>{
    const host=root.current;
    if(!host)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const motions=new Set<Animation>();
    const isM10=host.dataset.mobileVersion==='M10';
    const cycle=isM10?host.querySelector<HTMLElement>('.m-cycle-art'):null;
    const cycleControls=cycle?.closest('.m-interactive-cycle');
    const orbit=isM10?host.querySelector<HTMLElement>('.m-audience-orbit'):null;
    const salto=orbit?.querySelector<HTMLElement>('.m-salto');
    const anchors=isM10?host.querySelector<HTMLElement>('.m7-anchors-stage'):null;
    let disposed=false,frame=0,lastFrame=0,lastY=window.scrollY;
    let cycleAngle=0,cycleTarget=0,saltoProgress=1,saltoDistance=0;
    const viewport=()=>{
      const visual=window.visualViewport;
      return {height:visual?.height||innerHeight,top:visual?.offsetTop||0,
        right:(visual?.offsetLeft||0)+(visual?.width||innerWidth)};
    };
    const cancelEntries=()=>{motions.forEach(a=>a.cancel());motions.clear();};
    const finishSalto=()=>{
      saltoProgress=1;
      if(!orbit)return;
      orbit.style.setProperty('--m-salto-x','0px');orbit.style.setProperty('--m-salto-angle','0deg');
      orbit.style.setProperty('--m-salto-opacity','1');orbit.style.setProperty('--m-salto-copy-opacity','1');
      orbit.dataset.m10Salto='settled';
    };
    const paintSalto=()=>{
      if(!orbit||!salto)return;
      if(preference.matches||!salto.isConnected){finishSalto();return;}
      const view=viewport(),box=orbit.getBoundingClientRect();
      const next=Math.max(0,Math.min(1,(view.top+view.height*.88-box.top)/(view.height*.48)));
      // The pose follows the page in both directions, not a one-shot entrance.
      saltoProgress=next;
      if(saltoProgress>=.999){finishSalto();return;}
      orbit.dataset.m10Salto='entering';
      const travel=(1-saltoProgress)**2;
      orbit.style.setProperty('--m-salto-x',`${saltoDistance*travel}px`);
      // A positive starting angle settles counter-clockwise into the sideflip pose.
      orbit.style.setProperty('--m-salto-angle',`${95*travel}deg`);
      orbit.style.setProperty('--m-salto-opacity',String(saltoProgress));
      orbit.style.setProperty('--m-salto-copy-opacity',String(Math.max(0,(saltoProgress-.65)/.35)));
    };
    const paint=(time:number)=>{
      frame=0;
      if(disposed)return;
      paintSalto();
      if(anchors){
        const view=viewport(),box=anchors.getBoundingClientRect();
        const progress=Math.max(0,Math.min(1,(view.top+view.height-box.top)/(view.height+box.height)));
        anchors.style.setProperty('--m-anchors-scroll-angle',`${preference.matches?0:progress*180}deg`);
      }
      if(preference.matches)return;
      if(cycle){
        const elapsed=Math.min(64,Math.max(1,time-lastFrame)),remaining=cycleTarget-cycleAngle;
        cycleAngle=remaining<.025?cycleTarget:cycleAngle+remaining*(1-Math.exp(-elapsed/65));
        cycle.style.setProperty('--m-cycle-scroll-angle',`${cycleAngle}deg`);
        if(cycleTarget-cycleAngle>.025)frame=requestAnimationFrame(paint);
      }
      lastFrame=time;
    };
    const queue=()=>{if(!frame&&!disposed){lastFrame=performance.now();frame=requestAnimationFrame(paint);}};
    const onCycleClick=(event:Event)=>{
      if(preference.matches||!(event.target instanceof Element)||!event.target.closest('.m-cycle-controls button,.m-cycle-next'))return;
      // Each activation turns one step, even when closing the selected description.
      cycleTarget+=120;queue();
    };
    const onScroll=()=>{
      const y=window.scrollY,down=Math.max(0,y-lastY);lastY=y;
      if(cycle&&down&&!preference.matches){
        const box=cycle.parentElement!.getBoundingClientRect(),view=viewport();
        // A direct jump to this section must not produce several sudden turns.
        if(box.bottom>view.top&&box.top<view.top+view.height)cycleTarget+=Math.min(down,80)*.3;
      }
      queue();
    };
    const measure=()=>{
      lastY=window.scrollY;
      if(orbit&&salto){
        // offsetLeft measures the untouched grid position, not the rotated image.
        saltoDistance=Math.max(0,viewport().right-orbit.getBoundingClientRect().left-salto.offsetLeft+24);
      }
      queue();
    };
    const onFocus=(event:FocusEvent)=>{
      if(event.target instanceof Element&&event.target.closest('.m-audience-one,.m-audience-two'))finishSalto();
    };
    const onPreference=()=>{
      cancelEntries();
      if(preference.matches){
        if(frame)cancelAnimationFrame(frame);
        frame=0;cycleTarget=cycleAngle;finishSalto();
      }
      lastY=window.scrollY;
      queue();
    };
    // Restored scroll and direct section links derive the same pose from position.
    if(orbit&&salto){
      const view=viewport();
      if(!preference.matches&&orbit.getBoundingClientRect().top>=view.top+view.height){
        saltoProgress=0;orbit.dataset.m10Salto='entering';
        saltoDistance=Math.max(0,view.right-orbit.getBoundingClientRect().left-salto.offsetLeft+24);
        paintSalto();
      }else finishSalto();
      orbit.addEventListener('focusin',onFocus);
      orbit.addEventListener('focusout',queue);
    }
    if(anchors)anchors.dataset.m10Rotation='ready';
    measure();
    if(cycle)cycle.dataset.m10Scroll='ready';
    cycleControls?.addEventListener('click',onCycleClick);
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){
        observer.unobserve(entry.target);
        if(preference.matches)continue;
        const animation=entry.target.animate([{opacity:.82,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.22,.68,.2,1)'});
        motions.add(animation);animation.onfinish=()=>motions.delete(animation);
      }
    },{threshold:.12});
    const entries=isM10?'.m-prague,.m-forest,.m-practice-session .m-rings':'.m-prague,.m-forest,.m-salto,.m-anchors-stage,.m-practice-session .m-rings';
    host.querySelectorAll(entries).forEach(el=>observer.observe(el));
    const resize=new ResizeObserver(measure);resize.observe(host);if(orbit)resize.observe(orbit);
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',measure);
    window.visualViewport?.addEventListener('resize',measure);preference.addEventListener('change',onPreference);
    return()=>{
      disposed=true;if(frame)cancelAnimationFrame(frame);
      observer.disconnect();resize.disconnect();cancelEntries();
      window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',measure);
      window.visualViewport?.removeEventListener('resize',measure);
      preference.removeEventListener('change',onPreference);orbit?.removeEventListener('focusin',onFocus);
      orbit?.removeEventListener('focusout',queue);
      cycleControls?.removeEventListener('click',onCycleClick);
      if(orbit){delete orbit.dataset.m10Salto;orbit.style.removeProperty('--m-salto-x');orbit.style.removeProperty('--m-salto-angle');orbit.style.removeProperty('--m-salto-opacity');orbit.style.removeProperty('--m-salto-copy-opacity');}
      if(cycle){delete cycle.dataset.m10Scroll;cycle.style.removeProperty('--m-cycle-scroll-angle');}
      if(anchors){delete anchors.dataset.m10Rotation;anchors.style.removeProperty('--m-anchors-scroll-angle');}
    };
  },[root,pageKey]);
}
