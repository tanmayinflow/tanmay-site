import { MobileVajra } from './MobileVajra';
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
    <p><strong>{c(p.forClose)}</strong></p>
   </Chapter>

   <div className="m-dark preview-work-ink">
    <PreviewHandstand lang={lang}/>
    <Chapter title={c(p.startLabel)} id="co-dostanes" className="m-between preview-work-start">
     <p className="preview-work-start-lead">{c(p.startTitle)}</p>
     <PreviewSteps lang={lang} included/>
     <div className="preview-work-week"><h3>{c(p.weekTitle).split(/(\([^)]*\))/).map((part,i)=>part.startsWith('(')?<span className="preview-week-example" key={i}>{part}</span>:part)}</h3><p>{c(p.week)}</p><MobileCycle lang={lang}/></div>
     <p className="preview-work-reason">{c(p.why)}</p>
     <div className="preview-work-price"><p><strong>{c(p.price)}</strong></p><p className="small">{c(p.priceSmall)}</p><a className="preview-work-button" href={previewWhatsApp(lang,true)} target="_blank" rel="noopener noreferrer">{c(p.firstCta)}</a><a className="m-text-link release-consultation" href={previewWhatsApp(lang)} target="_blank" rel="noopener noreferrer">{lang==='en'?'Still unsure? Book 15 free minutes.':'Ještě váháš? Domluv si 15 minut zdarma.'}</a></div>
    </Chapter>
   </div>

    <Chapter title={lang==='en'?'How do you start?':'Jak začneš?'} className="m-process preview-work-process">
     <div className="m-process-opening"><Photo asset="equipment" alt={c(approved.PageSpoluprace[25])} className="m-equipment"/></div>
     <PreviewSteps lang={lang} work/>
     <TextLink href="#kontakt">{lang==='en'?'I want to start':'Chci začít'}</TextLink>
     <TerrainArtwork variant="home" className="m-process-current"/>
    </Chapter>
    <MobileReviews lang={lang} preview/>

   <Chapter title={c(p.aboutTitle)} id="kdo-te-povede" className="m-boundaries preview-work-about">
    <div className="preview-work-person"><Photo asset="prague" className="m-prague" alt={lang==='en'?'Kryštof Švec overlooking Prague.':'Kryštof Švec s výhledem na Prahu.'}/><div><h3>Kryštof Švec</h3><p>{c(p.cheer)}</p><MobileVajra className="preview-coach-vajra"/></div></div>
    <p className="preview-work-bio">{c(p.bio)}</p>
    <a className="m-text-link preview-education-link" href={routePath('pribeh',lang)}>{c(p.qualification)}</a>
    <div className="preview-work-proof"><MobileProof lang={lang} preview educationLink={false}/></div>
   </Chapter>
   <MobileCollaborationFaq lang={lang} preview/><CollaborationPricing lang={lang} preview/><MobileContact lang={lang} collaboration preview/>
  </div>
 </>;
}
