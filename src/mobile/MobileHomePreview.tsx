import { routePath } from '../site.js';
import { approved } from './preview-approved-content';
import { mobileText as t } from './mobile-copy';
import { Chapter, Photo, Rail, TextLink } from './MobileElements';
import { MobileHero, MobileContact, MobileClosing } from './MobileShared';
import { StoryCard } from './MobileStoryCard';
import MobileReviews from './MobileReviews';
import { MobileDoubleLine, MobileHomeLines } from './MobileDoubleLine';
import { MobileVajra } from './MobileVajra';
import { previewCopy as p, previewText } from '../preview-copy';

export default function MobileHomePreview({lang}:{lang:string}) {
 const c=(pair:readonly string[])=>previewText(pair,lang);
 const keywords=lang==='en'?'Strength · Confidence in movement · Personal practice':'Síla · Pohybová jistota · Vlastní praxe';
 return <>
  <MobileHero page="home" lang={lang} preview/>
  <div className="m-home-field m-dark">
   <section className="m-chapter m-home-intro" id="mobilni-obsah" aria-labelledby="m-home-statement"><div className="m-inner"><StoryCard closeOnNavigate title={t('intro',lang)} lang={lang} className="m-intro-words" preview={keywords}><p>{c(p.homeLead)}</p><p>{c(p.micro)}</p><TextLink href="#rezervace">{c(p.cta)}</TextLink></StoryCard><TextLink href="#rezervace">{c(p.cta)}</TextLink><TextLink href="#jak-to-funguje" down arrow>{lang==='en'?'How it works':'Jak to funguje'}</TextLink></div><MobileHomeLines/><p className="m-eyebrow m-home-anchors">{c(approved.Opening[3])}</p></section>
   <Chapter title={c(p.audienceTitle)} className="m-home-audience m-dark"><div className="m-audience-orbit"><Photo asset="salto" alt={t('saltoAlt',lang)} className="m-salto"/><StoryCard closeOnNavigate title={lang==='en'?'What you want':'Co chceš'} lang={lang} className="m-audience-one">{p.wants.map(x=><p key={x[0]}>{c(x)}</p>)}</StoryCard><StoryCard closeOnNavigate title={lang==='en'?"What’s missing":'Co ti chybí'} lang={lang} className="m-audience-two"><p><strong>{c(p.audienceClose)}</strong></p><TextLink href="#rezervace">{lang==='en'?'I want a plan made for me':'Chci plán přesně pro mě'}</TextLink></StoryCard></div></Chapter>
   <section className="m-chapter m-home-work" aria-labelledby="m-work-title"><div className="m-inner"><div className="m-work-layout"><div className="m-handstand-composition"><Photo asset="earthField" alt="" className="m-handstand-earth"/><Photo asset="handstand" alt={t('handstandAlt',lang)} className="m-handstand"/></div><div className="m-work-text"><h2 id="m-work-title">{c(p.oldTitle)}</h2><div className="m-work-captions">{p.oldWays.map((x,i)=><StoryCard closeOnNavigate key={i} title={c(x[1])} preview={<span className="preview-old-way">{c(x[0])}</span>} lang={lang} className="m-work-caption"><p className="preview-old-way">{c(x[0])}</p><p><strong>{c(x[1])}</strong></p></StoryCard>)}</div></div></div><p>{c(p.oldClose)}</p></div></section>
   <Chapter title={c(p.benefitsTitle)} className="m-home-formats"><Rail title={c(p.benefitsTitle)} items={p.benefits.map((x,i)=>[String(i+1).padStart(2,'0'),x[0][0],x[1][0],x[0][1],x[1][1]])} lang={lang} footerLink={<TextLink href="#rezervace" arrow>{c(p.cta)}</TextLink>}/><p><strong>{c(p.benefitsClose)}</strong></p></Chapter>
   <Chapter title={c(p.howTitle)} id="jak-to-funguje" className="m-process m-dark"><ol className="m-process-steps m-editorial-stack">{p.steps.map((x,i)=><li key={i}><span className="m-process-number" aria-hidden="true">0{i+1}</span><div><h3>{c(x[0])}</h3><p>{c(x[1])}</p></div></li>)}</ol><TextLink href="#rezervace">{lang==='en'?'I want to start':'Chci začít'}</TextLink><TextLink href={routePath('spoluprace-preview',lang)+'#co-dostanes'} arrow>{lang==='en'?'What exactly you get':'Co přesně dostaneš'}</TextLink></Chapter>
   <MobileReviews lang={lang} preview/>
   <section className="m-chapter m-home-about" aria-labelledby="m-about-home-title"><div className="m-inner"><div className="m-about-composition"><Photo asset="prague" alt={c(approved.HomeAbout[3])} className="m-prague"/><div className="m-about-heading"><p className="m-eyebrow">Kryštof Švec</p><h2 id="m-about-home-title">{c(p.aboutTitle)}</h2><MobileVajra className="m-about-symbol"/></div></div><p className="m-about-bio m-bio-highlight-practice">{c(p.bio)}</p><p>{c(p.cheer)}</p><p><strong>{c(p.live)}</strong></p><TextLink href={routePath('pribeh',lang)+'#vzdelani'}>{c(p.qualification)}</TextLink><TextLink href={routePath('pribeh',lang)} arrow>{lang==='en'?'My story':'Můj příběh'}</TextLink><MobileDoubleLine/></div></section>
   <MobileContact lang={lang} home preview/>
  </div><MobileClosing lang={lang}/>
 </>;
}
