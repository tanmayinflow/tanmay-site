import { Children, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import './desktop-story.css';

// The same untouched photographs and descriptions already used in the mobile story.
const PHOTOGRAPHS = [
  { src:'/media/mobile-m8/story-before.jpg', fallback:null, width:752, height:564, cs:'Pohybová praxe před nehodou.', en:'Movement practice before the accident.', titleCs:'Pád', titleEn:'The fall' },
  { src:'/media/mobile-m10/story-descent-lossless.webp', fallback:'/media/mobile-m8/story-descent.png', width:940, height:1673, cs:'Fotografie z období v nemocnici.', en:'A photograph from the time in hospital.', titleCs:'Sestup', titleEn:'The descent' },
  { src:'/media/mobile-m10/story-return-lossless.webp', fallback:'/media/mobile-m8/story-return.png', width:682, height:682, cs:'Návrat k pohybu v přírodě.', en:'Returning to movement outdoors.', titleCs:'Návrat', titleEn:'The return' },
] as const;

function StoryPhoto({ index, lang }: { index:number; lang:string }) {
  const photo=PHOTOGRAPHS[index];
  const [state,setState]=useState({ fallback:false, status:'pending' as 'pending'|'loaded'|'error' });
  const source=state.fallback&&photo.fallback?photo.fallback:photo.src;
  const update=(status:'loaded'|'error')=>setState(current=>{
    // A replaced primary request must not overwrite its fallback's result.
    if(current.fallback!==state.fallback||current.status==='error')return current;
    if(status==='error'&&photo.fallback&&!current.fallback)return {fallback:true,status:'pending'};
    return {...current,status};
  });
  return <div className="d-story-image" data-photo-state={state.status} data-photo-source={state.fallback?'fallback':'primary'}>
    {state.status==='error'?<p className="d-story-photo-error" role="status">{lang==='en'?'The photograph could not be loaded.':'Fotografii nelze načíst.'}</p>:<img key={source} src={source} width={photo.width} height={photo.height} alt={photo[lang==='en'?'en':'cs']} loading="lazy" decoding="async" onLoad={()=>update('loaded')} onError={()=>update('error')}/>}
  </div>;
}

/** Original chapters remain in normal page flow; only the accompanying photograph stays. */
export default function DesktopStory({ children, lang }: { children:ReactNode; lang:string }) {
  const id=useId(),host=useRef<HTMLDivElement>(null),chapters=useRef<(HTMLDivElement|null)[]>([]);
  const entries=Children.toArray(children),valid=entries.length===PHOTOGRAPHS.length;
  const [active,setActive]=useState(0);
  const [flow,setFlow]=useState(()=>typeof window!=='undefined'&&(window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 620px)').matches||parseFloat(getComputedStyle(document.documentElement).fontSize)>20));

  useEffect(()=>{
    const element=host.current;if(!element||!valid)return;
    const gallery=element.querySelector<HTMLElement>('.d-story-gallery');
    const preference=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height: 620px)');
    let frame=0,visible=true,live=true;
    const measure=()=>{
      frame=0;if(!live)return;
      setFlow(preference.matches||short.matches||parseFloat(getComputedStyle(document.documentElement).fontSize)>20);
      // The final chapter needs exactly enough runway to keep the whole gallery visible.
      const galleryHeight=`${gallery?.getBoundingClientRect().height||0}px`;
      if(element.style.getPropertyValue('--d-story-gallery-height')!==galleryHeight)element.style.setProperty('--d-story-gallery-height',galleryHeight);
      const header=document.querySelector('.topbar')?.getBoundingClientRect().height||66;
      const readingLine=header+Math.max(64,(window.innerHeight-header)*.34);
      let next=0;
      chapters.current.forEach((chapter,index)=>{if(chapter&&chapter.getBoundingClientRect().top<=readingLine)next=index;});
      setActive(next);
    };
    const schedule=()=>{if(live&&!frame)frame=requestAnimationFrame(measure);};
    const onScroll=()=>{if(visible)schedule();};
    const resize=new ResizeObserver(schedule);
    resize.observe(element);
    if(gallery)resize.observe(gallery);
    chapters.current.forEach(chapter=>{
      if(chapter)resize.observe(chapter);
      const article=chapter?.querySelector('.story-beat');if(article)resize.observe(article);
    });
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();},{rootMargin:'15% 0px'});
    intersection.observe(element);
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',schedule);
    preference.addEventListener('change',schedule);short.addEventListener('change',schedule);
    document.fonts.ready.then(schedule);measure();
    return()=>{live=false;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',schedule);preference.removeEventListener('change',schedule);short.removeEventListener('change',schedule);};
  },[valid]);

  const choose=(index:number)=>{
    chapters.current[index]?.scrollIntoView({block:'start',behavior:flow||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  // Preserve all supplied content if a future caller passes a different chapter structure.
  if(!valid)return <div className="story-beats">{children}</div>;
  return <div className="d-story" ref={host} data-active-phase={active} data-layout={flow?'flow':'sticky'}>
    <div className="d-story-copy">{entries.map((chapter,index)=><div className="d-story-chapter" id={id+'-chapter-'+index} key={index} ref={node=>{chapters.current[index]=node;}} data-story-phase={index}>
      {chapter}
      <figure className="d-story-inline-photo"><StoryPhoto index={index} lang={lang}/></figure>
    </div>)}</div>
    <div className="d-story-gallery">
      <div className="d-story-controls" role="group" aria-label={lang==='en'?'Stages of the story':'Etapy příběhu'}>
        {PHOTOGRAPHS.map((photo,index)=><button type="button" key={index} aria-current={active===index?'step':undefined} aria-controls={id+'-chapter-'+index} aria-label={(lang==='en'?'Go to ':'Přejít na ')+('0'+(index+1))+': '+photo[lang==='en'?'titleEn':'titleCs']} onClick={()=>choose(index)}>{'0'+(index+1)}</button>)}
        <span className="d-story-progress" aria-hidden="true"><span style={{transform:`translateX(${active*100}%)`}}/></span>
      </div>
      <figure className="d-story-media">
        <div className="d-story-photographs">{PHOTOGRAPHS.map((_,index)=><div key={index} className="d-story-photo" data-active={active===index} aria-hidden={active!==index}><StoryPhoto index={index} lang={lang}/></div>)}</div>
        <figcaption>{PHOTOGRAPHS[active][lang==='en'?'titleEn':'titleCs']}</figcaption>
      </figure>
    </div>
  </div>;
}
