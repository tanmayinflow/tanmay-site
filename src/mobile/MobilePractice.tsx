import { TanmayCalligraphy } from '../components/FinalArtwork';
import MobilePracticeAnchors from './MobilePracticeAnchors';
import ReflectionStatement from '../components/ReflectionStatement';
import { routePath } from '../site.js';
import { approvedLists } from './approved-content';
import { copy, Chapter, Detail, Photo, TextLink } from './MobileElements';
import { RichText } from './MobileRichText';
import { StoryCard } from './MobileStoryCard';
import { MobileHero } from './MobileShared';

export default function MobilePractice({lang}:{lang:string}) {
  const c=(i:number)=>copy('PagePraxe',i,lang);
  return <>
    <MobileHero page="practice" lang={lang}/>
    <Chapter title={c(1)} id="mobilni-obsah" className="m-practice-intro m-definition m7-practice-definition">
      <div className="m7-definition-copy"><p><RichText>{c(6)}</RichText></p><p><RichText>{c(7)}</RichText></p></div>
      <div className="m-definition-pair">{[8,10].map(i=><div key={i}><h3>{c(i)}</h3>{' '}<span aria-hidden="true">—</span>{' '}<p><RichText>{c(i+1)}</RichText></p></div>)}</div>
    </Chapter>
    <Chapter title={c(13)} eyebrow={c(12)} className="m-anchors m-dark">
      <p className="m-page-lead"><RichText>{c(14)}</RichText></p><MobilePracticeAnchors lang={lang} stance={c(15)}/>
    </Chapter>
    <Chapter title={c(17)} className="m-practice-session">
      <p><RichText>{c(18)}</RichText></p><p className="m-eyebrow m-session-topics">{c(19)}</p>
      <div className="m-session-composition m7-session-composition"><div className="m7-session-topics">{approvedLists.PagePraxe.session.map(r=><StoryCard key={r[0]} title={r[lang==='en'?3:1]} lang={lang} className="m7-session-topic"><p><RichText>{r[lang==='en'?4:2]}</RichText></p></StoryCard>)}</div><Photo asset="rings" alt={c(20)} className="m-rings"/></div>
    </Chapter>
    <Chapter title={c(21)} className="m-reflection">
      <p className="m-statement m7-reflection-subtitle">{c(22)}</p><p><RichText>{c(23)}</RichText></p><ReflectionStatement text={c(24)}/>
    </Chapter>
    <Chapter title={c(28)} eyebrow={c(27)} className="m-meaning m-dark">
      <div className="m-meaning-origin"><TanmayCalligraphy/><div className="m-etymology"><strong className="etymology-term">tad</strong> · {c(25)}<br/><strong className="etymology-term">-maya</strong> · {lang==='en'?'formed from it':'z toho utvořený'}<br/>→ <strong className="etymology-term">tanmaya</strong></div></div>
      <p><RichText>{c(29)}</RichText></p><Detail title={lang==='en'?'Read more':'Číst dál'} className="m7-meaning-more">{[30,31].map(i=><p key={i}><RichText>{c(i)}</RichText></p>)}</Detail>
      <p className="m-meaning-path"><RichText>{c(32)}</RichText></p><p className="m-meaning-closing"><RichText>{c(33)}</RichText></p>
    </Chapter>
    <Chapter title={c(34)} className="m-earth-coda"><p><RichText>{c(35)}</RichText></p><TextLink href={routePath('spoluprace',lang)}>{lang==='en'?'Ways to work together':'Možnosti spolupráce'}</TextLink></Chapter>
  </>;
}
