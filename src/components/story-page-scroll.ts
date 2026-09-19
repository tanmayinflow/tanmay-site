type Options = { mobile:boolean; onRead?:(index:number)=>void; onLayout?:(flow:boolean)=>void };

/** Native page travel supplies a reversible runway. Gestures that begin outside
 * the reader still work; nothing captures wheel/touch or locks the document. */
export function attachStoryPageScroll(host:HTMLElement, reader:HTMLElement, runway:HTMLElement, options:Options) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const stages=Array.from(reader.querySelectorAll<HTMLElement>('[data-story-phase]'));
  let live=true,frame=0,flow:boolean|undefined,escaped=false,travel=0,active=0,capacityFailure='';
  const viewport=()=>({top:visualViewport?.offsetTop||0,height:options.mobile?(visualViewport?.height||innerHeight):innerHeight});
  const pinTop=()=>{
    const header=document.querySelector<HTMLElement>(options.mobile?'.m-header':'.topbar');
    const rect=header?.getBoundingClientRect(),fixed=header&&['fixed','sticky'].includes(getComputedStyle(header).position);
    return Math.max(viewport().top+16,fixed&&rect&&rect.bottom>0?rect.bottom+(options.mobile?12:24):0);
  };
  const lowerEdge=()=>{
    const v=viewport(),dock=options.mobile?document.querySelector<HTMLElement>('.m-dock')?.getBoundingClientRect():null;
    return dock&&dock.height>0?Math.min(v.top+v.height-12,dock.top-12):v.top+v.height-16;
  };
  const blocked=()=>!!document.querySelector('dialog[open],.mmenu:not([hidden]),.m-menu[data-open=true]');
  const read=()=>{
    const boundary=flow?pinTop()+viewport().height*.28:reader.getBoundingClientRect().top+reader.clientHeight*.34;
    let next=0;stages.forEach((stage,index)=>{if(stage.getBoundingClientRect().top<=boundary)next=index;});
    active=next;options.onRead?.(next);
    const first=stages[0]?.getBoundingClientRect(),last=stages[stages.length-1]?.getBoundingClientRect();
    const progress=flow&&first&&last?(boundary-first.top)/Math.max(1,last.top-first.top):reader.scrollTop/Math.max(1,travel);
    host.style.setProperty('--story-progress',String(Math.max(0,Math.min(1,progress))));
  };
  const setLayout=(next:boolean)=>{
    const previous=flow,stage=stages[active],visible=host.getBoundingClientRect().bottom>pinTop()&&host.getBoundingClientRect().top<lowerEdge();
    const before=stage?.getBoundingClientRect().top;
    flow=next;host.dataset.storyLayout=next?'flow':'scroll';if(!options.mobile)host.dataset.layout=next?'flow':'reader';options.onLayout?.(next);
    if(next){
      delete runway.dataset.storySticky;
      runway.style.removeProperty('--story-height');runway.style.removeProperty('--story-travel');
      host.dataset.pageScroll='flow';
      if(previous===false&&visible&&stage&&before!==undefined){const shift=stage.getBoundingClientRect().top-before;if(Math.abs(shift)>.5)scrollTo({top:Math.max(0,scrollY+shift),behavior:'instant'});}
    }
  };
  const paint=()=>{
    frame=0;if(!live||!host.isConnected)return;
    if(flow){read();return;}
    const distance=pinTop()-runway.getBoundingClientRect().top;
    host.dataset.pageScroll=distance<0?'before':distance>travel?'after':'active';
    reader.scrollTop=Math.max(0,Math.min(travel,distance));read();
  };
  const queue=()=>{if(live&&!frame)frame=requestAnimationFrame(paint);};
  const configure=()=>{
    if(!live)return;
    const font=parseFloat(getComputedStyle(document.documentElement).fontSize),scale=visualViewport?.scale||1;
    const dimensions=[innerWidth,viewport().height,font,scale].join(':');
    const short=options.mobile?viewport().height<500:innerHeight<=620;
    const nextFlow=escaped||reduced.matches||short||font>20||scale>1.01||capacityFailure===dimensions;
    const previous=flow;
    if(nextFlow!==flow)setLayout(nextFlow);
    if(nextFlow){queue();return;}
    runway.style.setProperty('--story-pin-top',pinTop()+'px');
    travel=Math.max(0,reader.scrollHeight-reader.clientHeight);
    if(travel<2||host.getBoundingClientRect().height+pinTop()>lowerEdge()+1){capacityFailure=dimensions;setLayout(true);queue();return;}
    runway.style.setProperty('--story-height',host.getBoundingClientRect().height+'px');
    runway.style.setProperty('--story-travel',travel+'px');runway.dataset.storySticky='true';
    if(previous===true&&host.getBoundingClientRect().top<lowerEdge()&&host.getBoundingClientRect().bottom>pinTop()){
      scrollTo({top:Math.max(0,scrollY+runway.getBoundingClientRect().top-pinTop()+(stages[active]?.offsetTop||0)),behavior:'instant'});
    }
    queue();
  };
  const choose=(event:Event)=>{
    const index=(event as CustomEvent<number>).detail,stage=stages[index];if(!stage)return;
    if(flow)stage.scrollIntoView({block:'start',behavior:'instant'});
    else scrollTo({top:Math.max(0,scrollY+runway.getBoundingClientRect().top-pinTop()+Math.min(travel,stage.offsetTop)),behavior:reduced.matches?'instant':'smooth'});
    queue();
  };
  const onKey=(event:KeyboardEvent)=>{
    if(event.defaultPrevented||blocked()||flow||host.dataset.pageScroll!=='active')return;
    if(event.key==='Escape'){escaped=true;host.dataset.storyExit='escape';configure();return;}
    if(event.altKey||event.ctrlKey||event.metaKey||!(event.target instanceof Element)||!reader.contains(event.target)||event.target.closest('a,button,input,textarea,select,[contenteditable=true]'))return;
    const delta=event.key==='ArrowDown'?40:event.key==='ArrowUp'?-40:event.key==='PageDown'||event.key===' '&&!event.shiftKey?reader.clientHeight*.8:event.key==='PageUp'||event.key===' '&&event.shiftKey?-reader.clientHeight*.8:0;
    if(delta){event.preventDefault();scrollBy({top:delta,behavior:'instant'});}
  };
  const onScroll=()=>{if(!blocked())queue();};
  const resize=new ResizeObserver(configure);resize.observe(host);resize.observe(reader);stages.forEach(stage=>resize.observe(stage));
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',configure,{passive:true});
  visualViewport?.addEventListener('resize',configure);reduced.addEventListener('change',configure);
  window.addEventListener('keydown',onKey);host.addEventListener('tanmay:story-phase',choose);reader.addEventListener('scroll',read,{passive:true});
  document.fonts.ready.then(()=>{if(live)configure();});configure();
  return()=>{
    live=false;cancelAnimationFrame(frame);resize.disconnect();
    window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',configure);window.removeEventListener('keydown',onKey);
    visualViewport?.removeEventListener('resize',configure);reduced.removeEventListener('change',configure);host.removeEventListener('tanmay:story-phase',choose);reader.removeEventListener('scroll',read);
    delete runway.dataset.storySticky;['--story-height','--story-travel','--story-pin-top'].forEach(name=>runway.style.removeProperty(name));
    delete host.dataset.storyLayout;delete host.dataset.pageScroll;delete host.dataset.storyExit;host.style.removeProperty('--story-progress');
  };
}
