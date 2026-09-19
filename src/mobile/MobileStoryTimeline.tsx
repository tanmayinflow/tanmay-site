import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { copy } from './MobileElements';
import { RichText } from './MobileRichText';
import './mobile-story-round6.css';

const PHOTOGRAPHS = [
  {src:'/media/mobile-m8/story-before.jpg',fallback:null,width:752,height:564,cs:'Pohybová praxe před nehodou.',en:'Movement practice before the accident.'},
  {src:'/media/mobile-m10/story-descent-lossless.webp',fallback:'/media/mobile-m8/story-descent.png',width:940,height:1673,cs:'Fotografie z období v nemocnici.',en:'A photograph from the time in hospital.'},
  {src:'/media/mobile-m10/story-return-lossless.webp',fallback:'/media/mobile-m8/story-return.png',width:682,height:682,cs:'Návrat k pohybu v přírodě.',en:'Returning to movement outdoors.'},
] as const;
type PhotoState={status:'pending'|'loaded'|'error';fallback:boolean;attempt:number};

/** One sequence control, original photographs and a native reader fallback. */
export default function MobileStoryTimeline({lang}:{lang:string}) {
  const id=useId();
  const host=useRef<HTMLDivElement>(null), reader=useRef<HTMLDivElement>(null);
  const stages=useRef<(HTMLLIElement|null)[]>([]);
  const frame=useRef<number>();
  const [active,setActive]=useState(0);
  const [photoState,setPhotoState]=useState<PhotoState[]>(()=>PHOTOGRAPHS.map(()=>({status:'pending',fallback:false,attempt:0})));
  const c=(index:number)=>copy('PagePribeh',index,lang);
  const titles=[c(14),c(16),c(18)];

  const measure=useCallback(()=>{
    const el=reader.current;if(!el)return;
    const max=el.scrollHeight-el.clientHeight;
    const linear=max<2;
    const boundary=linear?innerHeight*.34:el.getBoundingClientRect().top+el.clientHeight*.34;
    let index=0;
    stages.current.forEach((stage,i)=>{if(stage&&stage.getBoundingClientRect().top<=boundary)index=i;});
    const first=stages.current[0]?.getBoundingClientRect(),last=stages.current[2]?.getBoundingClientRect();
    const progress=linear&&first&&last?(boundary-first.top)/Math.max(1,last.top-first.top):el.scrollTop/Math.max(1,max);
    host.current?.style.setProperty('--story-progress',String(Math.min(1,Math.max(0,progress))));
    setActive(index);
  },[]);
  const schedule=useCallback(()=>{
    cancelAnimationFrame(frame.current||0);
    frame.current=requestAnimationFrame(measure);
  },[measure]);
  useEffect(()=>{
    const el=reader.current;if(!el)return;
    const resize=new ResizeObserver(schedule);resize.observe(el);stages.current.forEach(s=>s&&resize.observe(s));
    // In the enlarged-text linear layout the page supplies the scroll position.
    const pageScroll=()=>{if(el.scrollHeight-el.clientHeight<2)schedule();};
    window.addEventListener('scroll',pageScroll,{passive:true});schedule();
    return()=>{resize.disconnect();window.removeEventListener('scroll',pageScroll);cancelAnimationFrame(frame.current||0);};
  },[schedule]);
  const choose=(index:number)=>{
    const el=reader.current,stage=stages.current[index];if(!el||!stage)return;
    if(host.current?.dataset.storyLayout){host.current.dispatchEvent(new CustomEvent('tanmay:story-phase',{detail:index}));return;}
    const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
    if(el.scrollHeight-el.clientHeight>2)el.scrollTo({top:stage.offsetTop,behavior});
    else stage.scrollIntoView({block:'start',behavior});
    setActive(index);
  };
  const photograph=(index:number,inline=false)=>{
    const photo=PHOTOGRAPHS[index],state=photoState[index];
    // Gallery and large-text inline views share a source; ignore events from a replaced request.
    const update=(status:'loaded'|'error')=>setPhotoState(current=>current.map((value,i)=>{
      if(i!==index||value.attempt!==state.attempt||value.fallback!==state.fallback)return value;
      if(status==='error'&&photo.fallback&&!value.fallback)return {...value,status:'pending',fallback:true};
      return {...value,status};
    }));
    if(state.status==='error')return <div className="m-story-photo-fallback"><p role="status">{lang==='en'?'The photograph could not be loaded.':'Fotografii nelze načíst.'}</p><button type="button" onClick={event=>{event.currentTarget.closest<HTMLElement>('figure')?.focus({preventScroll:true});setPhotoState(current=>current.map((value,i)=>i===index?{status:'pending',fallback:false,attempt:value.attempt+1}:value));}}>{lang==='en'?'Try again':'Zkusit znovu'}</button></div>;
    return <img key={(inline?'inline-':'gallery-')+index+'-'+state.attempt+'-'+state.fallback} src={state.fallback&&photo.fallback?photo.fallback:photo.src} width={photo.width} height={photo.height} alt={photo[lang==='en'?'en':'cs']} loading="lazy" decoding="async" onLoad={()=>update('loaded')} onError={()=>update('error')}/>;
  };

  return <div className="m-story-runway"><div className="m-story-timeline" ref={host} data-active-phase={active} data-photo-state={photoState[active].status}>
    <div className="m-story-phase-controls" role="group" aria-label={lang==='en'?'Stages of the story':'Etapy příběhu'}><span className="m-story-phase-line" aria-hidden="true"><span/></span>{titles.map((title,index)=><button key={title} type="button" aria-controls={id+'-reader'} aria-pressed={active===index} onClick={()=>choose(index)}><span aria-hidden="true">{'0'+(index+1)}</span>{title}</button>)}</div>
      <div className="m-story-scroll" id={id+'-reader'} ref={reader} onScroll={schedule} tabIndex={0} role="region" aria-label={lang==='en'?'My story, scrollable text':'Můj příběh, posuvný text'}>
        <ol className="m-story-stages">{[14,16,18].map((index,phase)=><li key={index} ref={node=>{stages.current[phase]=node;}} data-story-phase={phase} aria-labelledby={id+'-phase-'+phase}><h3 id={id+'-phase-'+phase}><span aria-hidden="true">{'0'+(phase+1)}</span>{c(index)}</h3><p><RichText>{c(index+1)}</RichText></p><figure className="m-story-inline-photo" tabIndex={-1}>{photograph(phase,true)}</figure></li>)}</ol>
      </div>
    <figure className="m-story-media" tabIndex={-1} aria-label={lang==='en'?'Photographs accompanying the story':'Fotografie k příběhu'}>{PHOTOGRAPHS.map((_,index)=><div key={index} className={'m-story-photo'+(active===index&&photoState[index].status!=='pending'?' is-visible':'')} aria-hidden={active!==index}>{photograph(index)}</div>)}<figcaption className="m-story-photo-caption" aria-live="polite">{titles[active]}</figcaption></figure>
  </div></div>;
}
