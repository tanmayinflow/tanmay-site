import { useState } from 'react';
import { CLIENT_REVIEWS } from '../components/home-reviews.data.js';
import { Arrow, Chapter } from './MobileElements';
import { StoryCard } from './MobileStoryCard';
import { useCircularRail } from './useCircularRail';

const MOBILE_REVIEWS = [...CLIENT_REVIEWS.filter(r=>r.id==='gledis-kmonickova'),...CLIENT_REVIEWS.filter(r=>r.id!=='gledis-kmonickova')];
function ReviewQuote(){return <span className="m-review-quote" aria-hidden="true">„</span>;}

function ReviewText({review,lang}:{review:typeof CLIENT_REVIEWS[number];lang:string}) {
  const [original,setOriginal]=useState(false);
  return <>
    {lang==='en'&&<button className="m-review-original" type="button" onClick={()=>setOriginal(v=>!v)}>{original?'Read English translation':'Translated from Czech · Read original'}</button>}
    <blockquote lang={lang==='en'&&!original?'en':'cs'} className="m-review-full">{review[lang==='en'&&!original?'en':'cs'].map((p:string,i:number)=><p key={i}>{p}</p>)}</blockquote>
  </>;
}

export default function MobileReviews({lang}:{lang:string}) {
  const rail=useCircularRail(MOBILE_REVIEWS.length);
  const title=lang==='en'?'What people say about the work':'Co říkají klienti';
  const activate=(index:number)=>{rail.goTo(index);rail.ref.current?.querySelector<HTMLButtonElement>(`.m-review-original-card--${index}>.m-story-trigger`)?.click();};
  return <Chapter title={title} className="m-reviews m-reviews-m4">
    <div className="m-review-rail" role="region" aria-label={title}>
      <div className="m-review-viewport m-circular-viewport" ref={rail.ref} id={rail.id} tabIndex={0} aria-label={lang==='en'?'Client reviews. Swipe or use arrow keys.':'Zkušenosti klientů. Posouvej tahem nebo šipkami na klávesnici.'} {...rail.viewportProps}>
        {rail.slots.map(({physical,index,clone})=>{
          const review=MOBILE_REVIEWS[index],text=review[lang==='en'?'en':'cs'][0];
          const sentence=text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim()||text;
          const excerpt=sentence.length>150?sentence.slice(0,150).replace(/\s+\S*$/,'')+'…':sentence;
          const preview=<><ReviewQuote/><span>{excerpt}</span><span className="m-review-read">{lang==='en'?'Full review':'Celé znění'}</span></>;
          if(clone)return <div className="m-story-card m-review-card" key={physical} data-carousel-clone="true" data-carousel-index={index} aria-hidden="true" onClick={()=>activate(index)}><div className="m-story-trigger"><span className="m-story-title">{review.name}</span><span className="m-story-preview">{preview}</span></div></div>;
          return <StoryCard key={physical} className={'m-review-card m-review-original-card m-review-original-card--'+index} title={review.name} lang={lang} label={(lang==='en'?'Full review: ':'Celé znění recenze: ')+review.name} preview={preview}><ReviewText review={review} lang={lang}/></StoryCard>;
        })}
      </div>
      <div className="m-review-controls" role="group" aria-label={lang==='en'?'Browse client reviews':'Procházet recenze klientů'}>
        <button type="button" className="m-carousel-arrow m-carousel-arrow--previous" onClick={()=>rail.step(-1)} aria-label={lang==='en'?'Previous review':'Předchozí recenze'} aria-controls={rail.id}><Arrow/></button>
        <span className="m-carousel-status" aria-live="polite" aria-atomic="true">{rail.active+1} / {MOBILE_REVIEWS.length} · {MOBILE_REVIEWS[rail.active].name}</span>
        <button type="button" className="m-carousel-arrow" onClick={()=>rail.step(1)} aria-label={lang==='en'?'Next review':'Další recenze'} aria-controls={rail.id}><Arrow/></button>
      </div>
    </div>
  </Chapter>;
}
