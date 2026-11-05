import { MobileVajra } from './MobileVajra';
import { PreviewHandstand, PreviewBenefits } from '../components/PreviewReading';
import { MobilePreviewWants as PreviewWants } from './PreviewMotion';
import { routePath } from '../site.js';
import { approved } from './preview-approved-content';
import { mobileText as t } from './mobile-copy';
import { Chapter, Photo, TextLink } from './MobileElements';
import { MobileHero, MobileContact, MobileClosing } from './MobileShared';
import { StoryCard } from './MobileStoryCard';
import MobileReviews from './MobileReviews';
import { MobileDoubleLine, MobileHomeLines } from './MobileDoubleLine';
import { mobilePreviewCopy as p, PreviewSteps } from './PreviewDetails';
import { usePreviewPageScroll } from './preview-mobile-scroll';
import { previewText } from '../preview-copy';

export default function MobileHomePreview({lang}:{lang:string}) {
 usePreviewPageScroll(lang);
 const c=(pair:readonly string[])=>previewText(pair,lang);
 const keywords=lang==='en'?'Strength · Confidence in movement · Personal practice':'Síla · Pohybová jistota · Vlastní praxe';
 return <>
  <MobileHero page="home" lang={lang} preview/>
  <div className="m-home-field m-dark">
   <section className="m-chapter m-home-intro" id="mobilni-obsah" aria-labelledby="m-home-statement"><div className="m-inner"><StoryCard closeOnNavigate title={t('intro',lang)} lang={lang} className="m-intro-words" preview={keywords}><p>{c(p.homeLead)}</p><p>{c(p.micro)}</p><TextLink href="#rezervace">{c(p.cta)}</TextLink></StoryCard></div><MobileHomeLines/></section>
   <Chapter title={c(p.audienceTitle)} className="m-home-audience m-dark"><div className="m-audience-orbit"><Photo asset="salto" alt={t('saltoAlt',lang)} className="m-salto"/><div className="preview-audience-copy"><PreviewWants lang={lang}/><div className="preview-missing"><h3>{lang==='en'?"What’s missing":'Co ti chybí'}</h3><p>{c(p.audienceClose)}</p><TextLink href="#rezervace">{lang==='en'?'I want a plan made for me':'Chci plán přesně pro mě'}</TextLink></div></div></div></Chapter>
   <PreviewHandstand lang={lang}/>
   <PreviewBenefits lang={lang}/>
   <Chapter title={c(p.howTitle)} id="jak-to-funguje" className="m-process m-dark"><PreviewSteps lang={lang}/><div className="preview-process-links"><TextLink href="#rezervace">{lang==='en'?'I want to start':'Chci začít'}</TextLink><TextLink href={routePath('spoluprace',lang)+'#co-dostanes'} arrow>{lang==='en'?'What exactly you get':'Co přesně dostaneš'}</TextLink></div></Chapter>
   <MobileReviews lang={lang} preview/>
   <section className="m-chapter m-home-about" aria-labelledby="m-about-home-title"><div className="m-inner"><div className="m-about-composition"><Photo asset="prague" alt={c(approved.HomeAbout[3])} className="m-prague"/><div className="m-about-heading"><p className="m-eyebrow">Kryštof Švec</p><h2 id="m-about-home-title">{c(p.aboutTitle)}</h2><div className="preview-about-aside"><p>{c(p.cheer)}</p><MobileVajra className="preview-coach-vajra"/></div></div></div><p className="m-about-bio m-bio-highlight-practice">{c(p.bio)}</p><a className="m-text-link preview-education-link" href={routePath('pribeh',lang)}>{c(p.qualification)}</a><MobileDoubleLine/></div></section>
   <MobileContact lang={lang} home preview/>
  </div><MobileClosing lang={lang}/>
 </>;
}
