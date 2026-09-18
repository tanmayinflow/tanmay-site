import { TerrainArtwork } from '../components/TerrainArtwork';
import { routePath } from '../site.js';
import { approvedLists } from './approved-content';
import { mobileText as t, mobileFormatSummaries } from './mobile-copy';
import { copy, Chapter, Photo, Rail, TextLink } from './MobileElements';
import { MobileHero, MobileContact, MobileClosing } from './MobileShared';
import { StoryCard } from './MobileStoryCard';
import MobileReviews from './MobileReviews';
import { RichText } from './MobileRichText';
import { MobileDoubleLine } from './MobileDoubleLine';

export default function MobileHome({lang}:{lang:string}) {
  const c=(group:Parameters<typeof copy>[0],i:number)=>copy(group,i,lang);
  const keywords=lang==='en'?'Strength · Confidence in movement · Personal practice':'Síla · Pohybová jistota · Vlastní praxe';
  return <>
    <MobileHero page="home" lang={lang}/>
    <div className="m-home-field m-dark">
    <section className="m-chapter m-home-intro" id="mobilni-obsah" aria-labelledby="m-home-statement"><div className="m-inner">
      <StoryCard title={t('intro',lang)} lang={lang} className="m-intro-words" preview={keywords}><p><RichText>{c('Opening',2)}</RichText></p><TextLink href={routePath('spoluprace',lang)}>{lang==='en'?'How we work together':'Jak spolupracovat'}</TextLink></StoryCard>
    </div><TerrainArtwork variant="home" className="m-home-current"/><p className="m-eyebrow m-home-anchors">{c('Opening',3)}</p></section>
    <Chapter title={c('HomeAudience',0)} className="m-home-audience m-dark"><div className="m-audience-orbit">
      <Photo asset="salto" alt={t('saltoAlt',lang)} className="m-salto"/>
      <StoryCard title={t('audienceOne',lang)} lang={lang} className="m-audience-one"><p><RichText>{c('HomeAudience',1)}</RichText></p></StoryCard>
      <StoryCard title={t('audienceTwo',lang)} lang={lang} className="m-audience-two"><p><RichText>{c('HomeAudience',2)}</RichText></p></StoryCard>
    </div></Chapter>
    <section className="m-chapter m-home-work" aria-labelledby="m-work-title"><div className="m-inner"><div className="m-work-layout"><div className="m-handstand-composition"><Photo asset="earthField" alt="" className="m-handstand-earth"/><Photo asset="handstand" alt={t('handstandAlt',lang)} className="m-handstand"/></div><div className="m-work-text"><h2 id="m-work-title">{c('HomeWork',0)}</h2><div className="m-work-captions">{[1,3,5].map(n=><StoryCard key={n} title={n===3?t('clearPriorities',lang):c('HomeWork',n)} lang={lang} className="m-work-caption"><p><RichText>{c('HomeWork',n+1)}</RichText></p></StoryCard>)}</div></div></div><TextLink href={routePath('praxe',lang)} arrow>{lang==='en'?'The whole practice':'Více o praxi'}</TextLink></div></section>
    <Chapter title={c('HomeCollab',0)} className="m-home-formats"><div className="m-editorial-rail"><p><RichText>{c('HomeCollab',1)}</RichText></p><p><RichText>{c('HomeCollab',2)}</RichText></p></div><Rail title={t('collaboration',lang)} footerLink={<TextLink href={routePath('spoluprace',lang)} arrow>{lang==='en'?'Ways to work together':'Možnosti spolupráce'}</TextLink>} items={approvedLists.PageSpoluprace.formats.map((r,i)=>[r[0],r[1],mobileFormatSummaries[i][0],r[3],mobileFormatSummaries[i][1]])} lang={lang}/></Chapter>
    <MobileReviews lang={lang}/>
    <section className="m-chapter m-home-about" aria-labelledby="m-about-home-title"><div className="m-inner"><div className="m-about-composition"><Photo asset="prague" alt={c('HomeAbout',3)} className="m-prague"/><div className="m-about-heading"><p className="m-eyebrow">Kryštof Švec</p><h2 id="m-about-home-title">{c('HomeAbout',1)}</h2><img className="m-about-symbol" src="/media/mobile-round4/vajra-bell-copper.png" width="1448" height="1086" alt="" aria-hidden="true" loading="lazy" decoding="async"/></div></div><p className="m-about-bio m-bio-highlight-practice"><RichText>{c('HomeAbout',2)}</RichText></p><TextLink href={routePath('pribeh',lang)} arrow>{lang==='en'?'More about me':'Více o mně'}</TextLink><MobileDoubleLine/></div></section>
    <MobileContact lang={lang} home/>
    </div>
    <MobileClosing lang={lang}/>
  </>;
}
