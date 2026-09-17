import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

/** Three visual runs provide a short native scroll across either seam.
 * Only the central run contains accessible content or interactive controls. */
export function useCircularRail(count:number) {
  const ref=useRef<HTMLDivElement>(null);
  const id=useId();
  const [active,setActive]=useState(0);
  const activeRef=useRef(0), timer=useRef<number>(), dragging=useRef(false);
  const pending=useRef<number[]>([]), moving=useRef(false), target=useRef<number|null>(null), frame=useRef<number>();
  const advance=useRef<()=>void>(()=>{});
  const started=useRef(0);
  const logical=useCallback((index:number)=>((index%count)+count)%count,[count]);
  const nearest=useCallback(()=>{const e=ref.current;if(!e)return count;let best=0;for(let i=1;i<e.children.length;i++)if(Math.abs((e.children[i] as HTMLElement).offsetLeft-e.scrollLeft)<Math.abs((e.children[best] as HTMLElement).offsetLeft-e.scrollLeft))best=i;return best;},[count]);
  const jump=useCallback((physical:number)=>{const e=ref.current,child=e?.children[physical] as HTMLElement|undefined;if(e&&child)e.scrollTo({left:child.offsetLeft,behavior:'instant'});},[]);
  const settle=useCallback(()=>{
    if(dragging.current)return;
    const e=ref.current;if(!e)return;
    if(moving.current&&target.current!==null){
      const goal=e.children[target.current] as HTMLElement|undefined;
      if(goal&&Math.abs(e.scrollLeft-goal.offsetLeft)>2){
        // A stale scrollend from the seam may arrive just as the next step starts.
        if(performance.now()-started.current<120)return;
        // A completed native scroll/focus action takes priority over queued steps.
        pending.current=[];
      }
    }
    const physical=nearest(),index=logical(physical);
    activeRef.current=index;setActive(index);
    moving.current=false;target.current=null;
    if(physical<count||physical>=count*2)jump(count+index);
    cancelAnimationFrame(frame.current||0);
    if(pending.current.length)frame.current=requestAnimationFrame(()=>advance.current());
  },[count,jump,logical,nearest]);
  useLayoutEffect(()=>{
    const e=ref.current;if(!e||!count)return;
    jump(count+activeRef.current);
    const size=new ResizeObserver(()=>{pending.current=[];moving.current=false;target.current=null;jump(count+activeRef.current);});size.observe(e);if(e.children[0])size.observe(e.children[0]);
    e.addEventListener('scrollend',settle);
    return()=>{size.disconnect();e.removeEventListener('scrollend',settle);clearTimeout(timer.current);cancelAnimationFrame(frame.current||0);};
  },[count,jump,settle]);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const stop=()=>{if(media.matches){pending.current=[];moving.current=false;target.current=null;jump(count+activeRef.current)}};media.addEventListener('change',stop);return()=>media.removeEventListener('change',stop);},[count,jump]);
  advance.current=()=>{
    if(moving.current||dragging.current||!pending.current.length)return;
    const e=ref.current;if(!e)return;
    let physical=nearest();const index=logical(physical);
    if(physical<count||physical>=count*2){physical=count+index;jump(physical);}
    const destination=physical+(pending.current.shift()||0),child=e.children[destination] as HTMLElement|undefined;
    if(child){moving.current=true;target.current=destination;started.current=performance.now();e.scrollTo({left:child.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  };
  const step=useCallback((direction:number)=>{pending.current.push(direction<0?-1:1);advance.current();},[]);
  const goTo=useCallback((index:number)=>{pending.current=[];moving.current=false;target.current=null;activeRef.current=logical(index);setActive(logical(index));jump(count+logical(index));},[count,jump,logical]);
  const onScroll=()=>{const index=logical(nearest());activeRef.current=index;setActive(index);clearTimeout(timer.current);timer.current=window.setTimeout(settle,160);};
  const onKeyDown=(e:KeyboardEvent<HTMLDivElement>)=>{if(e.target!==e.currentTarget||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home'||e.key==='End')goTo(e.key==='Home'?0:count-1);else step(e.key==='ArrowRight'?1:-1);};
  const onPointerDown=()=>{dragging.current=true;pending.current=[];moving.current=false;target.current=null;clearTimeout(timer.current)};
  const onPointerUp=()=>{dragging.current=false;clearTimeout(timer.current);timer.current=window.setTimeout(settle,180)};
  const onFocusCapture=()=>{pending.current=[];moving.current=false;target.current=null;cancelAnimationFrame(frame.current||0);};
  return {ref,id,active,step,goTo,slots:Array.from({length:count*3},(_,physical)=>({physical,index:logical(physical),clone:physical<count||physical>=count*2})),viewportProps:{onScroll,onKeyDown,onPointerDown,onPointerUp,onPointerCancel:onPointerUp,onFocusCapture}};
}
