import { useEffect, type RefObject } from 'react';

/** On the first downward visit, page gestures finish the existing native reader.
 * No body lock, duplicate text or synthetic sections: every exit restores native scroll. */
export function useMobileStoryScroll(root:RefObject<HTMLDivElement>,pageKey:string) {
  useEffect(()=>{
    const host=root.current,story=host?.querySelector<HTMLElement>('.m-story-timeline');
    const reader=story?.querySelector<HTMLElement>('.m-story-scroll');
    if(!host||!story||!reader)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let phase:'armed'|'active'|'done'='armed',lastY=scrollY,anchorY=scrollY;
    let touch:{x:number;y:number;blocked:boolean;native:boolean}|null=null;
    const mark=()=>{story.dataset.pageScroll=phase;};
    const release=()=>{phase='done';mark();};
    const view=()=>({top:visualViewport?.offsetTop||0,height:visualViewport?.height||innerHeight});
    const safeTop=()=>{
      const v=view(),header=host.querySelector<HTMLElement>('.m-header'),box=header?.getBoundingClientRect();
      const pinned=header&&['sticky','fixed'].includes(getComputedStyle(header).position);
      return Math.max(v.top+Math.min(80,v.height*.1),pinned&&box&&box.bottom>v.top?box.bottom+12:0);
    };
    const max=()=>Math.max(0,reader.scrollHeight-reader.clientHeight);
    const usable=()=>!preference.matches&&(visualViewport?.scale||1)<=1.01&&max()>2&&reader.clientHeight+safeTop()+60<view().height+view().top;
    const blocked=()=>!!document.querySelector('dialog[open]')||!reader.isConnected||!usable();
    const interactive=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('a,button,input,textarea,select,[contenteditable=true],[role=button],dialog');
    const setPage=(top:number)=>{scrollTo({top,behavior:'instant'});lastY=scrollY;};
    const activate=()=>{phase='active';anchorY=scrollY+reader.getBoundingClientRect().top-safeTop();mark();setPage(anchorY);};
    const advance=(delta:number)=>{
      const before=reader.scrollTop,remaining=Math.max(0,max()-before);
      reader.scrollTop=Math.min(max(),before+delta);
      if(delta>=remaining-1){release();if(delta>remaining)setPage(anchorY+delta-remaining);}
    };
    // A touch close to the reader is handled from its first move. This avoids
    // trying to cancel a gesture after iOS has committed it to native scrolling.
    const consume=(delta:number,anticipateTouch=false)=>{
      if(phase==='done'||!Number.isFinite(delta)||Math.abs(delta)<.1)return false;
      if(blocked()){if(phase==='active')release();return false;}
      if(phase==='active'){
        if(delta<0){release();return false;}
        advance(delta);return true;
      }
      if(delta<=0)return false;
      const box=reader.getBoundingClientRect(),distance=box.top-safeTop();
      if(box.bottom<safeTop()+40){release();return false;}
      if(reader.scrollTop>1){release();return false;}
      if(distance>delta){
        if(anticipateTouch&&distance<view().height){setPage(scrollY+delta);return true;}
        return false;
      }
      activate();advance(Math.max(0,delta-Math.max(0,distance)));return true;
    };
    const onWheel=(event:WheelEvent)=>{
      if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||interactive(event.target)){if(phase==='active')release();return;}
      if(!event.cancelable){if(phase==='active')release();return;}
      const unit=event.deltaMode===1?16:event.deltaMode===2?reader.clientHeight:1;
      if(consume(event.deltaY*unit))event.preventDefault();
    };
    const onTouchStart=(event:TouchEvent)=>{
      if(event.touches.length!==1||(visualViewport?.scale||1)>1.01){touch=null;if(phase==='active')release();return;}
      const point=event.touches[0];touch={x:point.clientX,y:point.clientY,blocked:interactive(event.target),native:false};
      if(touch.blocked&&phase==='active')release();
    };
    const onTouchMove=(event:TouchEvent)=>{
      if(!touch||touch.blocked||event.touches.length!==1)return;
      const point=event.touches[0],dy=touch.y-point.clientY,dx=touch.x-point.clientX;
      touch.x=point.clientX;touch.y=point.clientY;
      if(touch.native||event.defaultPrevented||Math.abs(dx)>Math.abs(dy))return;
      if(!event.cancelable){touch.native=true;if(phase==='active')release();return;}
      if(consume(dy,true))event.preventDefault();else touch.native=true;
    };
    const onTouchEnd=()=>{touch=null;};
    const onKey=(event:KeyboardEvent)=>{
      if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||interactive(event.target)){if(phase==='active')release();return;}
      if(['Escape','Tab','Home','End'].includes(event.key)){if(phase==='active')release();return;}
      const delta=event.key==='ArrowDown'?40:event.key==='ArrowUp'?-40:event.key==='PageDown'?reader.clientHeight*.8:event.key==='PageUp'?-reader.clientHeight*.8:event.key===' '?reader.clientHeight*.8*(event.shiftKey?-1:1):0;
      if(delta&&consume(delta))event.preventDefault();
    };
    const onPageScroll=()=>{
      const y=scrollY,down=y-lastY;lastY=y;
      if(phase==='done'||touch?.native)return;
      if(blocked()){if(phase==='active')release();return;}
      if(phase==='active'){
        if(y<anchorY-1){release();return;}
        if(y>anchorY+1){const delta=y-anchorY;setPage(anchorY);advance(delta);}
        return;
      }
      if(down<=0)return;
      const box=reader.getBoundingClientRect();
      if(box.top<=safeTop()&&box.bottom>safeTop()+40&&reader.scrollTop<2)activate();
      else if(box.bottom<=safeTop()+40)release();
    };
    const onReaderScroll=()=>{if(phase==='active'&&reader.scrollTop>=max()-1)release();};
    const onClick=(event:MouseEvent)=>{
      // Explicit navigation and stage selection always take priority over capture.
      if(interactive(event.target)&&phase!=='done'&&(phase==='active'||(event.target instanceof Element&&event.target.closest('a,.m-story-phase-controls'))))release();
    };
    const onResize=()=>{if(phase==='active'){if(!usable())release();else anchorY=scrollY+reader.getBoundingClientRect().top-safeTop();}};
    if(preference.matches||reader.getBoundingClientRect().top<safeTop())phase='done';
    mark();
    const resize=new ResizeObserver(onResize);resize.observe(reader);
    window.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('touchstart',onTouchStart,{passive:true});
    window.addEventListener('touchmove',onTouchMove,{passive:false});
    window.addEventListener('touchend',onTouchEnd,{passive:true});
    window.addEventListener('touchcancel',onTouchEnd,{passive:true});
    window.addEventListener('keydown',onKey);
    window.addEventListener('scroll',onPageScroll,{passive:true});
    document.addEventListener('click',onClick,true);
    reader.addEventListener('scroll',onReaderScroll,{passive:true});
    preference.addEventListener('change',release);visualViewport?.addEventListener('resize',onResize);
    return()=>{
      resize.disconnect();delete story.dataset.pageScroll;
      window.removeEventListener('wheel',onWheel);window.removeEventListener('touchstart',onTouchStart);
      window.removeEventListener('touchmove',onTouchMove);window.removeEventListener('touchend',onTouchEnd);window.removeEventListener('touchcancel',onTouchEnd);
      window.removeEventListener('keydown',onKey);window.removeEventListener('scroll',onPageScroll);
      document.removeEventListener('click',onClick,true);reader.removeEventListener('scroll',onReaderScroll);
      preference.removeEventListener('change',release);visualViewport?.removeEventListener('resize',onResize);
    };
  },[root,pageKey]);
}
