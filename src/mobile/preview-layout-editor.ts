// Local review tool only. It never runs on the public domain or outside the phone wrapper.
type Offset={x:number;y:number;angle:number;styles?:Record<string,string>;text?:string};
type Layout=Record<string,Offset>;
const properties=['font-family','font-size','font-weight','font-style','line-height','letter-spacing','text-align','text-transform','text-decoration','color','background-color','opacity','width','height','min-width','max-width','min-height','max-height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','border-width','border-color','border-style','border-radius','box-shadow','display','flex-direction','justify-content','align-items','gap','align-self','order','object-fit','object-position','overflow','z-index','scale'];
function validStyles(styles:unknown):styles is Record<string,string> {
 return !!styles&&typeof styles==='object'&&!Array.isArray(styles)&&Object.entries(styles).every(([k,v])=>properties.includes(k)&&typeof v==='string'&&v.length<=180&&/^[\w\s#.,%()'"/+\-]*$/.test(v)&&!/(url|expression|image-set)\s*\(/i.test(v));
}
const selectorPattern=/^\.tm-mobile(?: > [a-z][a-z0-9-]*:nth-of-type\([1-9][0-9]*\)){1,32}$/;
export function validLayout(value:unknown):value is Layout {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>600)return false;
 return Object.entries(value).every(([key,v])=>selectorPattern.test(key)&&v&&Object.keys(v).every(k=>['x','y','angle','styles','text'].includes(k))&&['x','y','angle'].every(k=>typeof v[k]==='number'&&Number.isFinite(v[k])&&Math.abs(v[k])<=(k==='angle'?360:2000))&&(v.styles===undefined||validStyles(v.styles))&&(v.text===undefined||typeof v.text==='string'&&v.text.length<=5000));
}
export function startLayoutEditor(root:HTMLElement) {
 if(!['127.0.0.1','localhost'].includes(location.hostname)||parent===window||new URLSearchParams(location.search).get('layoutEditor')!=='1')return ()=>{};
 const allowed=new Set(['http://127.0.0.1:5184','http://127.0.0.1:5186','http://localhost:5184','http://localhost:5186']);
 let origin='';try{origin=new URL(document.referrer).origin;}catch{return ()=>{};}if(!allowed.has(origin))return ()=>{};
 let active=false,selected:HTMLElement|SVGElement|null=null,layout:Layout={},undo:Layout[]=[],redo:Layout[]=[],frame=0,width=innerWidth,dirty=false;
 const originals=new Map<HTMLElement|SVGElement,{translate:string;rotate:string;baseTranslate:string;baseRotate:string;props:Record<string,[string,string]>;text?:string}>();
 const channel='tanmay-layout-v1',route=location.pathname;
 const post=(type:string,extra:Record<string,unknown>={})=>parent.postMessage({channel,type,route,width,...extra},origin);
 const box=document.createElement('div');box.className='preview-editor-selection';box.hidden=true;
 box.innerHTML='<button type="button" aria-label="Otočit vybraný prvek" title="Tažením otočit">↻</button><button class="preview-editor-resize" type="button" aria-label="Změnit velikost prvku" title="Tažením změnit rozměry">↘</button>';
 const handle=box.firstElementChild as HTMLButtonElement;
 const resizeHandle=box.lastElementChild as HTMLButtonElement;
 const style=document.createElement('style');style.textContent=`.preview-editor-selection{position:fixed;z-index:2147483646;outline:2px solid #d5ad83;pointer-events:none;box-sizing:border-box}.preview-editor-selection[hidden]{display:none}.preview-editor-selection button{position:absolute;left:calc(50% - 20px);top:-45px;width:40px;height:40px;border:1px solid #d5ad83;border-radius:50%;background:#f4f0eb;color:#1c1c1a;pointer-events:auto;touch-action:none;font:24px sans-serif}.preview-editor-active{cursor:move}.preview-editor-active .preview-curve-arrow{opacity:1!important}.preview-editor-active ::selection{background:#d5ad8355}`;
 document.head.append(style);document.body.append(box);
 style.textContent+=`.preview-editor-selection .preview-editor-resize{left:auto;top:auto;right:-15px;bottom:-15px;width:30px;height:30px;border-radius:7px;font-size:20px}.preview-editor-active svg,.preview-editor-active img,.preview-editor-active figure{pointer-events:auto!important}.preview-editor-active [data-editor-hidden]{visibility:visible!important;opacity:.2!important;outline:1px dashed #ef966b}`;
 const selector=(el:Element)=>{
  const parts:string[]=[];let target:Element|null=el;
  while(target&&target!==root){const tag=target.tagName.toLowerCase(),siblings=Array.from(target.parentElement?.children||[]).filter(s=>s.tagName===target!.tagName);parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(target)+1})`);target=target.parentElement;}
  return '.tm-mobile > '+parts.join(' > ');
 };
 const zero=():Offset=>({x:0,y:0,angle:0});
 const paint=()=>{frame=0;if(!selected||!active){box.hidden=true;return;}const b=selected.getBoundingClientRect();box.hidden=!b.width||!b.height;Object.assign(box.style,{left:b.left+'px',top:b.top+'px',width:b.width+'px',height:b.height+'px'});};
 const queue=()=>{if(!frame)frame=requestAnimationFrame(paint);};
 const restore=()=>{for(const [el,v] of originals){el.style.translate=v.translate;el.style.rotate=v.rotate;for(const [name,[value,priority]]of Object.entries(v.props)){if(value)el.style.setProperty(name,value,priority);else el.style.removeProperty(name);}if(v.text!==undefined)el.textContent=v.text;}};
 const apply=()=>{
  restore();
  for(const [key,v] of Object.entries(layout)){
   const el=root.ownerDocument.querySelector<HTMLElement|SVGElement>(key);if(!el||!root.contains(el))continue;
   if(!originals.has(el)){const cs=getComputedStyle(el);originals.set(el,{translate:el.style.translate,rotate:el.style.rotate,baseTranslate:cs.translate,baseRotate:cs.rotate,props:{}});}
   const base=originals.get(el)!,xy=base.baseTranslate==='none'?['0px','0px']:base.baseTranslate.split(' ');
   el.style.translate=`calc(${xy[0]} + ${v.x}px) calc(${xy[1]||'0px'} + ${v.y}px)`;
   el.style.rotate=`calc(${base.baseRotate==='none'?'0deg':base.baseRotate} + ${v.angle}deg)`;
   for(const [name,value]of Object.entries(v.styles||{})){if(!base.props[name])base.props[name]=[el.style.getPropertyValue(name),el.style.getPropertyPriority(name)];el.style.setProperty(name,value,'important');}
   if(v.text!==undefined&&el.childElementCount===0&&!el.closest('svg')){if(base.text===undefined)base.text=el.textContent||'';el.textContent=v.text;}
  }queue();
 };
 const label=(el:Element)=>{
  if(el.matches('.preview-curve-arrow')){const item=el.closest('li');return item?'Šipka za krokem: '+(item.querySelector('.preview-step-title')?.textContent||''):'Zakřivená šipka';}
  return (el.getAttribute('aria-label')||el.getAttribute('alt')||el.textContent?.trim()||el.tagName).replace(/\s+/g,' ').slice(0,85);
 };
 const announce=()=>{post('state',{active,dirty,canUndo:!!undo.length,canRedo:!!redo.length,count:Object.keys(layout).length,selected:selected?{selector:selector(selected),label:label(selected),computed:Object.fromEntries(properties.map(p=>[p,getComputedStyle(selected!).getPropertyValue(p)])),canEditText:selected.childElementCount===0&&!selected.closest('svg')&&!!selected.textContent?.trim(),content:selected.textContent?.trim().slice(0,5000),...layout[selector(selected)]||zero()}:null});if(dirty)post('draft',{layout:structuredClone(layout)});};
 const elements=()=>post('elements',{items:Array.from(root.querySelectorAll('header,footer,section,article,div,figure,img,svg,h1,h2,h3,h4,p,span,a,button,li,ul,ol,table,td,th')).filter(el=>!el.closest('svg')||el.tagName.toLowerCase()==='svg').map(el=>({selector:selector(el),label:el.tagName.toLowerCase()+' · '+label(el)}))});
 const clone=()=>structuredClone(layout);
 const checkpoint=()=>{undo.push(clone());if(undo.length>80)undo.shift();redo=[];};
 const choose=(el:HTMLElement|SVGElement|null)=>{selected=el;paint();announce();};
 const update=(v:Offset)=>{if(!selected)return;layout[selector(selected)]=v;dirty=true;apply();announce();};
 const candidate=(target:EventTarget|null)=>{
  if(!(target instanceof Element)||!root.contains(target))return null;
  let el:Element|null=target.closest('svg')||target.closest('img,h1,h2,h3,h4,p,a,button,figure,li,article,section,span,div');
  if(el===root)el=null;return el as HTMLElement|SVGElement|null;
 };
 let drag:null|{pointer:number;x:number;y:number;value:Offset;turn:boolean;resize:boolean;w:number;h:number;cx:number;cy:number;start:number;moved:boolean;snapshot:Layout}=null;
 const down=(e:PointerEvent)=>{
  if(!active||e.button!==0)return;
  const turning=e.target===handle,resizing=e.target===resizeHandle,el=turning||resizing?selected:candidate(e.target);if(!el)return;
  e.preventDefault();e.stopPropagation();choose(el);
  const b=el.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;
  drag={pointer:e.pointerId,x:e.clientX,y:e.clientY,value:structuredClone(layout[selector(el)]||zero()),turn:turning,resize:resizing,w:parseFloat(getComputedStyle(el).width)||b.width,h:parseFloat(getComputedStyle(el).height)||b.height,cx,cy,start:Math.atan2(e.clientY-cy,e.clientX-cx),moved:false,snapshot:clone()};
  (e.target as Element).setPointerCapture?.(e.pointerId);
 };
 const move=(e:PointerEvent)=>{
  if(!drag||e.pointerId!==drag.pointer)return;e.preventDefault();
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<3)return;
  if(!drag.moved){undo.push(drag.snapshot);redo=[];drag.moved=true;}
  const clamp=(n:number,limit=2000)=>Math.max(-limit,Math.min(limit,Math.round(n)));
  const v={...drag.value};
  if(drag.turn)v.angle=clamp(v.angle+(Math.atan2(e.clientY-drag.cy,e.clientX-drag.cx)-drag.start)*180/Math.PI,360);
  else if(drag.resize){v.styles={...v.styles,width:Math.max(16,clamp(drag.w+e.clientX-drag.x))+'px',height:Math.max(16,clamp(drag.h+e.clientY-drag.y))+'px','max-width':'none','max-height':'none'};}
  else{v.x=clamp(v.x+e.clientX-drag.x);v.y=clamp(v.y+e.clientY-drag.y);}update(v);
 };
 const up=()=>{drag=null;};
 const click=(e:MouseEvent)=>{if(active&&root.contains(e.target as Node)){e.preventDefault();e.stopImmediatePropagation();}};
 const key=(e:KeyboardEvent)=>{
  if(!active)return;if(e.key==='Escape'){choose(null);return;}if(!selected)return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
   e.preventDefault();checkpoint();const v={...layout[selector(selected)]||zero()},n=e.shiftKey?10:1;
   if(e.key==='ArrowLeft')v.x-=n;if(e.key==='ArrowRight')v.x+=n;if(e.key==='ArrowUp')v.y-=n;if(e.key==='ArrowDown')v.y+=n;
   v.x=Math.max(-2000,Math.min(2000,v.x));v.y=Math.max(-2000,Math.min(2000,v.y));update(v);
  }
 };
 const receive=(e:MessageEvent)=>{
  if(e.source!==parent||e.origin!==origin||e.data?.channel!==channel)return;
  const m=e.data;
  if(m.type==='mode'){active=!!m.active;root.classList.toggle('preview-editor-active',active);root.style.touchAction=active?'none':'';queue();announce();if(active)elements();}
  if(m.type==='load'&&m.route===route&&m.width===width&&validLayout(m.layout)){layout=structuredClone(m.layout);undo=[];redo=[];dirty=false;selected=null;apply();announce();}
  if(m.type==='set'&&selected&&validLayout({[selector(selected)]:m.value})){checkpoint();update({...layout[selector(selected)],...m.value});}
  if(m.type==='style'&&selected&&validStyles(m.styles)&&Object.entries(m.styles as Record<string,string>).every(([k,v])=>!v||CSS.supports(k,v))){checkpoint();const v=structuredClone(layout[selector(selected)]||zero());v.styles={...v.styles,...m.styles};for(const k of Object.keys(v.styles))if(v.styles[k]==='')delete v.styles[k];update(v);}
  else if(m.type==='style')post('error',{message:'Tuto hodnotu prohlížeč nepodporuje. Zkus například 24px, 80% nebo auto podle zvoleného pole.'});
  if(m.type==='text'&&selected&&selected.childElementCount===0&&!selected.closest('svg')&&typeof m.text==='string'&&m.text.length<=5000){checkpoint();update({...layout[selector(selected)]||zero(),text:m.text});}
  if(m.type==='elements')elements();
  if(m.type==='select'&&typeof m.selector==='string'&&selectorPattern.test(m.selector)){
   const el=document.querySelector<HTMLElement|SVGElement>(m.selector);if(el&&root.contains(el)){
    const id=el.id,url=location.href;el.id='preview-editor-focus';const a=document.createElement('a');a.href='#preview-editor-focus';document.body.append(a);a.click();a.remove();el.id=id;history.replaceState(history.state,'',url);choose(el);
   }
  }
  if(m.type==='parent'&&selected&&selected.parentElement!==root)choose(selected.parentElement);
  if(m.type==='reset'&&selected){checkpoint();delete layout[selector(selected)];dirty=true;apply();announce();}
  if(m.type==='undo'&&undo.length){redo.push(clone());layout=undo.pop()!;dirty=true;apply();announce();}
  if(m.type==='redo'&&redo.length){undo.push(clone());layout=redo.pop()!;dirty=true;apply();announce();}
  if(m.type==='save')post('save',{layout:clone()});
  if(m.type==='saved'){dirty=false;announce();}
 };
 const resize=()=>{if(innerWidth!==width){post('draft',{layout:clone()});width=innerWidth;layout={};selected=null;apply();post('ready');}queue();};
 window.addEventListener('message',receive);window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',resize);
 document.addEventListener('pointerdown',down,true);document.addEventListener('pointermove',move,true);document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);window.addEventListener('click',click,true);window.addEventListener('keydown',key);
 const beforeUnload=()=>post('draft',{layout:clone()});window.addEventListener('pagehide',beforeUnload);post('ready');
 return()=>{beforeUnload();restore();root.classList.remove('preview-editor-active');root.style.touchAction='';box.remove();style.remove();cancelAnimationFrame(frame);window.removeEventListener('message',receive);window.removeEventListener('scroll',queue);window.removeEventListener('resize',resize);window.removeEventListener('keydown',key);window.removeEventListener('pagehide',beforeUnload);document.removeEventListener('pointerdown',down,true);document.removeEventListener('pointermove',move,true);document.removeEventListener('pointerup',up,true);document.removeEventListener('pointercancel',up,true);window.removeEventListener('click',click,true);};
}
