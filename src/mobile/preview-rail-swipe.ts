type RailPosition = { progress:number; distance:number };

/** Horizontal pointer gestures share the page rail's progress. Vertical panning
 * and pinch zoom stay browser-owned; ordinary flow rails use native overflow. */
export function bindPreviewRailSwipe(surface:HTMLElement, read:()=>RailPosition|null, write:(progress:number)=>void) {
 let drag:{id:number;x:number;y:number;progress:number;horizontal:boolean}|null=null;
 let suppressClick=false,frame=0,pending:number|undefined;
 const flush=()=>{frame=0;if(pending!==undefined){write(pending);pending=undefined;}};
 const down=(event:PointerEvent)=>{
  if(!event.isPrimary||event.button!==0||surface.closest('.preview-editor-active'))return;
  const position=read();if(!position||position.distance<=0)return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,progress:position.progress,horizontal:false};
  suppressClick=false;
 };
 const move=(event:PointerEvent)=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.horizontal){
   if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
   if(Math.abs(dx)<=Math.abs(dy)*1.2){drag=null;return;}
   drag.horizontal=true;surface.setPointerCapture(event.pointerId);
  }
  const position=read();if(!position){drag=null;return;}
  event.preventDefault();suppressClick=true;
  pending=Math.max(0,Math.min(position.distance,drag.progress-dx));
  if(!frame)frame=requestAnimationFrame(flush);
 };
 const end=(event:PointerEvent)=>{
  if(drag?.id!==event.pointerId)return;
  cancelAnimationFrame(frame);flush();
  if(surface.hasPointerCapture(event.pointerId))surface.releasePointerCapture(event.pointerId);
  drag=null;
 };
 const click=(event:MouseEvent)=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}};
 // A horizontal gesture owns only the row. The document is never moved in
 // response to pointermove, so a native vertical pan cannot fight this writer.
 const blur=()=>{drag=null;pending=undefined;cancelAnimationFrame(frame);frame=0;};
 surface.addEventListener('pointerdown',down);document.addEventListener('pointermove',move);
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);window.addEventListener('blur',blur);
 surface.addEventListener('click',click,true);
 return()=>{
  blur();
  surface.removeEventListener('pointerdown',down);document.removeEventListener('pointermove',move);
  document.removeEventListener('pointerup',end);document.removeEventListener('pointercancel',end);window.removeEventListener('blur',blur);
  surface.removeEventListener('click',click,true);
 };
}
