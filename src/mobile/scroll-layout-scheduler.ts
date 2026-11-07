/** Geometry must not be rebuilt underneath WebKit's native touch pan. A
 * pointercancel means the browser took the gesture, not that the finger lifted.
 * Keep the last measured scene through the whole touch and its scroll inertia;
 * coalesce toolbar/font/image/observer changes once the page has settled. */
export function createScrollLayoutScheduler(layout:()=>void, quiet=200) {
 let live=true,touching=false,dirty=false,frame=0,timer=0,lastActivity=-Infinity;
 const cancel=()=>{cancelAnimationFrame(frame);clearTimeout(timer);frame=timer=0;};
 const flush=()=>{
  frame=timer=0;if(!live||!dirty||touching)return;
  const remaining=quiet-(performance.now()-lastActivity);
  if(remaining>0){timer=window.setTimeout(flush,remaining);return;}
  dirty=false;layout();
 };
 const request=()=>{if(!live)return;dirty=true;if(touching)return;if(!frame&&!timer)frame=requestAnimationFrame(flush);};
 const activity=()=>{lastActivity=performance.now();if(timer){clearTimeout(timer);timer=0;}if(dirty&&!touching)request();};
 const start=()=>{touching=true;activity();cancel();};
 const end=(event:TouchEvent)=>{if(event.touches.length)return;touching=false;activity();if(dirty)request();};
 const blur=()=>{touching=false;activity();if(dirty)request();};
 document.addEventListener('touchstart',start,{passive:true});
 document.addEventListener('touchmove',activity,{passive:true});
 document.addEventListener('touchend',end,{passive:true});
 document.addEventListener('touchcancel',end,{passive:true});
 window.addEventListener('scroll',activity,{passive:true});
 window.addEventListener('blur',blur);
 return {request,dispose:()=>{
  live=false;cancel();document.removeEventListener('touchstart',start);document.removeEventListener('touchmove',activity);
  document.removeEventListener('touchend',end);document.removeEventListener('touchcancel',end);
  window.removeEventListener('scroll',activity);window.removeEventListener('blur',blur);
 }};
}

export type RailGestureAnchor={progress:number;natural:number};
/** A horizontal swipe edits only the row, never window.scrollY. Subsequent
 * vertical scrolling joins the same position continuously and still reaches
 * both ends of the original runway, so it cannot trap page navigation. */
export function railProgress(natural:number,distance:number,anchor?:RailGestureAnchor) {
 const n=Math.max(0,Math.min(distance,natural));
 if(!anchor)return n;
 if(n===anchor.natural)return anchor.progress;
 if(n<anchor.natural)return anchor.progress*n/Math.max(1,anchor.natural);
 return anchor.progress+(distance-anchor.progress)*(n-anchor.natural)/Math.max(1,distance-anchor.natural);
}
