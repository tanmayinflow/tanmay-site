type Options = { mobile:boolean; onRead?:(index:number)=>void; onLayout?:(flow:boolean)=>void };

/** Native page travel advances the reader while the complete page composition
 * stays in place. No wheel/touch interception or document scroll lock is needed. */
export function attachStoryPageScroll(host:HTMLElement, reader:HTMLElement, runway:HTMLElement, options:Options) {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const stages=Array.from(reader.querySelectorAll<HTMLElement>('[data-story-phase]'));
  const page=host.closest<HTMLElement>('main');
  const sibling=page?.nextElementSibling;
  const footer=sibling instanceof HTMLElement&&sibling.matches('footer')?sibling:null;
  const spacer=document.createElement('div');
  spacer.dataset.storyPageSpacer='true';spacer.setAttribute('aria-hidden','true');
  spacer.style.cssText='height:0;min-height:0;margin:0;padding:0;border:0;pointer-events:none;overflow-anchor:none';
  // Keep React-owned nodes in their original parents. Only this empty spacer is
  // inserted, and the previous inline styles are restored on every exit.
  const pageStyles=page?['position','top','overflow-anchor','--story-page-offset'].map(name=>({name,value:page.style.getPropertyValue(name),priority:page.style.getPropertyPriority(name)})):[];
  const footerStyles=footer?['position','top'].map(name=>({name,value:footer.style.getPropertyValue(name),priority:footer.style.getPropertyPriority(name)})):[];
  let live=true,frame=0,hashFrame=0,flow:boolean|undefined,escaped=false,travel=0,active=0,capacityFailure='',pageOffset=0,start=0;
  const shiftPage=(offset:number)=>{pageOffset=offset;page?.style.setProperty('--story-page-offset',offset+'px');footer?.style.setProperty('top',(offset-travel)+'px');};
  const attachPage=()=>{
    if(!page)return;
    page.after(spacer);page.style.setProperty('position','relative');page.style.setProperty('top','var(--story-page-offset,0px)');page.style.setProperty('overflow-anchor','none');
    footer?.style.setProperty('position','relative');runway.dataset.storyPage='true';shiftPage(0);
  };
  const restorePage=()=>{
    spacer.remove();pageOffset=0;delete runway.dataset.storyPage;
    pageStyles.forEach(({name,value,priority})=>{if(value)page?.style.setProperty(name,value,priority);else page?.style.removeProperty(name);});
    footerStyles.forEach(({name,value,priority})=>{if(value)footer?.style.setProperty(name,value,priority);else footer?.style.removeProperty(name);});
  };
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
      restorePage();delete runway.dataset.storySticky;
      runway.style.removeProperty('--story-height');runway.style.removeProperty('--story-travel');
      host.dataset.pageScroll='flow';
      if(previous===false&&visible&&stage&&before!==undefined){const shift=stage.getBoundingClientRect().top-before;if(Math.abs(shift)>.5)scrollTo({top:Math.max(0,scrollY+shift),behavior:'instant'});}
    }else attachPage();
  };
  const paint=()=>{
    frame=0;if(!live||!host.isConnected)return;
    if(flow){read();return;}
    const distance=scrollY-start;
    shiftPage(Math.max(0,Math.min(travel,distance)));
    host.dataset.pageScroll=distance<0?'before':distance>travel?'after':'active';
    reader.scrollTop=Math.max(0,Math.min(travel,distance));read();
  };
  const queue=()=>{if(live&&!frame)frame=requestAnimationFrame(paint);};
  const configure=()=>{
    if(!live)return;
    const font=parseFloat(getComputedStyle(document.documentElement).fontSize),scale=visualViewport?.scale||1;
    const dimensions=[innerWidth,viewport().height,font,scale].join(':');
    const short=options.mobile?viewport().height<500:innerHeight<=620;
    const nextFlow=!page||escaped||reduced.matches||short||font>20||scale>1.01||capacityFailure===dimensions;
    const previous=flow;
    if(nextFlow!==flow)setLayout(nextFlow);
    if(nextFlow){queue();return;}
    runway.style.setProperty('--story-pin-top',pinTop()+'px');
    // The main's visual offset must never become part of the native scroll origin.
    start=scrollY+runway.getBoundingClientRect().top-pageOffset-pinTop();
    travel=Math.max(0,reader.scrollHeight-reader.clientHeight);
    if(travel<2||host.getBoundingClientRect().height+pinTop()>lowerEdge()+1){capacityFailure=dimensions;setLayout(true);queue();return;}
    spacer.style.height=travel+'px';
    runway.style.setProperty('--story-height',host.getBoundingClientRect().height+'px');
    runway.style.setProperty('--story-travel',travel+'px');runway.dataset.storySticky='true';
    if(previous===true&&host.getBoundingClientRect().top<lowerEdge()&&host.getBoundingClientRect().bottom>pinTop()){
      scrollTo({top:Math.max(0,start+Math.min(travel,stages[active]?.offsetTop||0)),behavior:'instant'});
    }
    queue();
  };
  const choose=(event:Event)=>{
    const index=(event as CustomEvent<number>).detail,stage=stages[index];if(!stage)return;
    if(flow)stage.scrollIntoView({block:'start',behavior:'instant'});
    else scrollTo({top:Math.max(0,start+Math.min(travel,stage.offsetTop)),behavior:reduced.matches?'instant':'smooth'});
    queue();
  };
  const onKey=(event:KeyboardEvent)=>{
    if(event.defaultPrevented||blocked()||flow||host.dataset.pageScroll!=='active')return;
    if(event.key==='Escape'){escaped=true;host.dataset.storyExit='escape';configure();return;}
    if(event.altKey||event.ctrlKey||event.metaKey||!(event.target instanceof Element)||!reader.contains(event.target)||event.target.closest('a,button,input,textarea,select,[contenteditable=true]'))return;
    const delta=event.key==='ArrowDown'?40:event.key==='ArrowUp'?-40:event.key==='PageDown'||event.key===' '&&!event.shiftKey?reader.clientHeight*.8:event.key==='PageUp'||event.key===' '&&event.shiftKey?-reader.clientHeight*.8:0;
    if(delta){event.preventDefault();scrollBy({top:delta,behavior:'instant'});}
  };
  const scrollToHash=()=>{
    hashFrame=0;if(!live||flow||!page||!location.hash||location.hash.startsWith('#/'))return;
    let target:HTMLElement|null=null;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}
    if(!target||!page.contains(target)&&target!==page)return;
    const phase=target.closest<HTMLElement>('[data-story-phase]');
    if(phase&&reader.contains(phase)){choose(new CustomEvent('tanmay:story-phase',{detail:stages.indexOf(phase)}));return;}
    const natural=scrollY+target.getBoundingClientRect().top-pageOffset;
    const after=natural>=start+pinTop()+host.getBoundingClientRect().height;
    scrollTo({top:Math.max(0,natural+(after?travel:0)-(parseFloat(getComputedStyle(target).scrollMarginTop)||0)),behavior:'instant'});queue();
  };
  const onHash=()=>{cancelAnimationFrame(hashFrame);hashFrame=requestAnimationFrame(scrollToHash);};
  const onAnchor=(event:MouseEvent)=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
    if(!link||link.hasAttribute('download')||link.target&&link.target.toLowerCase()!=='_self')return;
    if(link.hash&&link.origin===location.origin&&link.pathname===location.pathname)onHash();
  };
  const onScroll=()=>{if(!blocked())queue();};
  const resize=new ResizeObserver(configure);if(page)resize.observe(page);resize.observe(host);resize.observe(reader);stages.forEach(stage=>resize.observe(stage));
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',configure,{passive:true});
  visualViewport?.addEventListener('resize',configure);reduced.addEventListener('change',configure);
  window.addEventListener('hashchange',onHash);document.addEventListener('click',onAnchor);
  window.addEventListener('keydown',onKey);host.addEventListener('tanmay:story-phase',choose);reader.addEventListener('scroll',read,{passive:true});
  document.fonts.ready.then(()=>{if(live)configure();});configure();
  return()=>{
    live=false;cancelAnimationFrame(frame);cancelAnimationFrame(hashFrame);resize.disconnect();
    window.removeEventListener('hashchange',onHash);document.removeEventListener('click',onAnchor);
    window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',configure);window.removeEventListener('keydown',onKey);
    visualViewport?.removeEventListener('resize',configure);reduced.removeEventListener('change',configure);host.removeEventListener('tanmay:story-phase',choose);reader.removeEventListener('scroll',read);
    restorePage();delete runway.dataset.storySticky;['--story-height','--story-travel','--story-pin-top'].forEach(name=>runway.style.removeProperty(name));
    delete host.dataset.storyLayout;delete host.dataset.pageScroll;delete host.dataset.storyExit;host.style.removeProperty('--story-progress');
  };
}
