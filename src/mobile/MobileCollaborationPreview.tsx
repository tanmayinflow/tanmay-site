import { PreviewHandstand, PreviewBenefits } from '../components/PreviewReading';
import CollaborationPricing from '../components/CollaborationPricing';
import MobileCollaborationFaq from './MobileCollaborationFaq';
import MobileCycle from './MobileCycle';
import MobileReviews from './MobileReviews';
import { TerrainArtwork } from '../components/TerrainArtwork';
import { routePath } from '../site.js';
import { approved } from './preview-approved-content';
import { Arrow, Chapter, Photo, TextLink } from './MobileElements';
import { MobileHero, MobileProof, MobileContact } from './MobileShared';
import { mobilePreviewCopy as p, PreviewSteps, PreviewCurveArrow } from './PreviewDetails';
import { usePreviewPageScroll } from './preview-mobile-scroll';
import { previewText, previewWhatsApp } from '../preview-copy';

export default function MobileCollaborationPreview({lang}:{lang:string}) {
 usePreviewPageScroll(lang);
 const c=(pair:readonly string[])=>previewText(pair,lang);
 return <>
  <MobileHero page="collaboration" lang={lang} preview/>
  <div className="preview-work-story">
   <section className="m-inner preview-work-welcome" aria-label={c(p.startLabel)}>
    <p className="preview-work-manifesto">{c(p.workLead)}</p>
    <p className="preview-work-location">{c(p.workKicker)}</p>
    <a className="preview-work-button" href="#co-dostanes">{lang==='en'?'What you get':'Co dostaneš'}<Arrow down/></a>
   </section>

   <Chapter title={c(p.needsTitle)} id="mobilni-obsah" className="preview-work-needs">
    <div className="preview-work-journey">
     <div><h3>{lang==='en'?'Now':'Teď'}</h3><p>{c(p.now)}</p></div>
     <PreviewCurveArrow/>
     <div className="preview-work-destination"><h3>{lang==='en'?'Where you want to be':'Kam chceš'}</h3><p>{c(p.destination)}</p></div>
    </div>
    <PreviewBenefits lang={lang} kind="barriers" close={c(p.needsClose)}/>
   </Chapter>

   <Chapter title={c(p.forTitle)} className="m-boundaries preview-work-fit">
    <ul>{p.forItems.map(x=><li key={x[0]}>{c(x)}</li>)}</ul>
    <p><strong>{c(p.forClose)}</strong></p><p>{c(p.notFor)}</p>
   </Chapter>

   <div className="m-dark preview-work-ink">
    <PreviewHandstand lang={lang}/>
    <Chapter title={c(p.startLabel)} id="co-dostanes" className="m-between preview-work-start">
     <p className="preview-work-start-lead">{c(p.startTitle)}</p>
     <div className="preview-work-included">{p.startItems.map((x,i)=><article key={i}><h3>{c(x[0])}</h3><p>{c(x[1])}</p></article>)}</div>
     <div className="preview-work-week"><h3>{c(p.weekTitle)}</h3><p>{c(p.week)}</p><MobileCycle lang={lang}/></div>
     <p className="preview-work-reason">{c(p.why)}</p>
     <div className="preview-work-price"><p><strong>{c(p.price)}</strong></p><p className="small">{c(p.priceSmall)}</p><a className="preview-work-button" href="#kontakt">{c(p.cta)}<Arrow/></a><a className="m-text-link" href={previewWhatsApp(lang,true)} target="_blank" rel="noopener noreferrer">{c(p.direct)}</a></div>
    </Chapter>

    <Chapter title={lang==='en'?'How do you start?':'Jak začneš?'} className="m-process preview-work-process">
     <div className="m-process-opening"><Photo asset="equipment" alt={c(approved.PageSpoluprace[25])} className="m-equipment"/></div>
     <PreviewSteps lang={lang} work/>
     <TextLink href="#kontakt" arrow>{lang==='en'?'I want to start':'Chci začít'}</TextLink>
     <TerrainArtwork variant="home" className="m-process-current"/>
    </Chapter>
    <MobileReviews lang={lang} preview/>
   </div>

   <Chapter title={c(p.aboutTitle)} id="kdo-te-povede" className="m-boundaries preview-work-about">
    <div className="preview-work-person"><Photo asset="prague" className="m-prague" alt={lang==='en'?'Kryštof Švec overlooking Prague.':'Kryštof Švec s výhledem na Prahu.'}/><div><h3>Kryštof Švec</h3><p>{c(p.cheer)}</p></div></div>
    <p className="preview-work-bio">{c(p.bio)}</p>
    <TextLink href={routePath('pribeh',lang)+'#vzdelani'} arrow>{c(p.qualification)}</TextLink>
    <div className="preview-work-proof"><MobileProof lang={lang} preview educationLink={false}/></div>
   </Chapter>
   <MobileCollaborationFaq lang={lang} preview/><CollaborationPricing lang={lang} preview/><MobileContact lang={lang} collaboration preview/>
  </div>
 </>;
}
