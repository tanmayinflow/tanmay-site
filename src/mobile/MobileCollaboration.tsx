import CollaborationPricing from '../components/CollaborationPricing';
import MobileCollaborationFaq from './MobileCollaborationFaq';
import MobileCycle from './MobileCycle';
import { TerrainArtwork } from '../components/TerrainArtwork';
import { routePath } from '../site.js';
import { approvedLists } from './approved-content';
import { mobileText as t } from './mobile-copy';
import { copy, Chapter, Photo, Rail, TextLink } from './MobileElements';
import { RichText } from './MobileRichText';
import { MobileHero, MobileProof } from './MobileShared';

export default function MobileCollaboration({lang}:{lang:string}) {
  const c=(i:number)=>copy('PageSpoluprace',i,lang);
  const row=(r:readonly string[],index:number)=>r[index+(lang==='en'?2:0)];
  return <>
    <MobileHero page="collaboration" lang={lang}/>
    <Chapter title={c(16)} id="mobilni-obsah" className="m-needs">
      <div className="m-needs-opening"><p><RichText>{c(17)}</RichText></p><Photo asset="pine" alt="" className="m-pine"/></div>
      <div className="m-needs-list"><Rail title={c(16)} lang={lang} items={approvedLists.PageSpoluprace.needs}/></div>
    </Chapter>
    <Chapter title={c(18)} className="m-experience">
      <div className="m-proof-start m-experience-proof"><MobileProof lang={lang}/></div>
      <TextLink href={routePath('pribeh',lang)}><span className="m-experience-about-label">{lang==='en'?'More about me':'Více o mně'}</span></TextLink>
    </Chapter>
    <Chapter title={c(22)} className="m-formats"><Rail title={c(22)} lang={lang} items={approvedLists.PageSpoluprace.formats}/></Chapter>
    <CollaborationPricing lang={lang}/>
    <Chapter title={c(23)} className="m-process m-dark">
      <div className="m-process-opening"><p className="m-process-standalone"><RichText>{c(24)}</RichText></p><Photo asset="equipment" alt={c(25)} className="m-equipment"/></div>
      <ol className="m-process-steps m-editorial-stack">{approvedLists.PageSpoluprace.process.map(r=><li key={r[0]}><span className="m-process-number" aria-hidden="true">{r[0]}</span><div><h3>{row(r,1)}</h3><p><RichText>{row(r,2)}</RichText></p></div></li>)}</ol>
      <TerrainArtwork variant="home" className="m-process-current"/>
    </Chapter>
    <Chapter title={c(27)} eyebrow={c(26)} className="m-between m-dark">
      <p className="m-accent-copy">{lang==='en'?<>In longer-term work, your plan, sessions, records and feedback live together in the <strong className="copy-emphasis">client app</strong>.</>:<>Při delší spolupráci máš v <strong className="copy-emphasis">klientské aplikaci</strong> svůj plán, termíny, záznamy a zpětnou vazbu na jednom místě.</>}</p>
      <MobileCycle lang={lang}/>
      <TextLink href={routePath('praxe',lang)}>{t('practice',lang)}</TextLink>
    </Chapter>
    <Chapter title={c(35)} className="m-boundaries"><p className="m-boundary-stance">{c(36)}</p><p className="m-accent-copy"><RichText>{c(37)}</RichText></p></Chapter>
    <MobileCollaborationFaq lang={lang}/>
  </>;
}
