import type { ReactNode } from 'react';
import { Arrow } from './MobileElements';
import { RichText } from './MobileRichText';
import { mobileText as t } from './mobile-copy';
import { useCircularRail } from './useCircularRail';

export function Rail({title,items,lang,footerLink}:{title:string;items:readonly(readonly string[])[];lang:string;footerLink?:ReactNode}) {
  const rail=useCircularRail(items.length);
  return <div className="m-rail" role="region" aria-label={title}>
    <div className="m-rail-viewport m-circular-viewport" ref={rail.ref} id={rail.id} tabIndex={0} aria-label={title} {...rail.viewportProps}>
      {rail.slots.map(({physical,index,clone})=>{const row=items[index];return <article className="m-rail-slide" key={physical} data-carousel-clone={clone?'true':undefined} data-carousel-index={index} aria-hidden={clone||undefined} aria-label={clone?undefined:`${index+1} / ${items.length}`}><h3>{row[lang==='en'?3:1]}</h3><p><RichText>{row[lang==='en'?4:2]}</RichText></p></article>;})}
    </div>
    <div className="m-rail-footer">{footerLink&&<div className="m-rail-footer-link">{footerLink}</div>}<div className="m-rail-controls" role="group" aria-label={title}><button type="button" className="m-carousel-arrow m-carousel-arrow--previous" onClick={()=>rail.step(-1)} aria-label={t('previous',lang)} aria-controls={rail.id}><Arrow/></button><span className="m-rail-count m-carousel-status" aria-live="polite" aria-atomic="true">{rail.active+1} / {items.length}</span><button type="button" className="m-carousel-arrow" onClick={()=>rail.step(1)} aria-label={t('next',lang)} aria-controls={rail.id}><Arrow/></button></div></div>
  </div>;
}
