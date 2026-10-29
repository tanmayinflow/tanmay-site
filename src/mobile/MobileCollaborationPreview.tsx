import CollaborationPricing from '../components/CollaborationPricing';
import MobileCollaborationFaq from './MobileCollaborationFaq';
import MobileCycle from './MobileCycle';
import MobileReviews from './MobileReviews';
import { TerrainArtwork } from '../components/TerrainArtwork';
import { routePath } from '../site.js';
import { approved } from './preview-approved-content';
import { Chapter, Photo, Rail, TextLink } from './MobileElements';
import { MobileHero, MobileProof, MobileContact } from './MobileShared';
import { previewCopy as p, previewText, previewWhatsApp } from '../preview-copy';

export default function MobileCollaborationPreview({lang}:{lang:string}) {
 const c=(pair:readonly string[])=>previewText(pair,lang);
 return <>
  <MobileHero page="collaboration" lang={lang} preview/>
  <div className="m-inner m-proof-start"><MobileProof lang={lang} preview/></div>
  <div className="m-inner preview-work-intro"><p className="m-eyebrow">{c(p.workKicker)}</p><p>{c(p.workLead)}</p><TextLink href="#kontakt">{c(p.cta)}</TextLink><p className="small">{c(p.micro)}</p><TextLink href="#co-dostanes" down arrow>{lang==='en'?'What you get':'Co dostaneš'}</TextLink></div>
  <Chapter title={c(p.needsTitle)} id="mobilni-obsah" className="m-needs"><div className="m-needs-opening"><div><p><strong>{lang==='en'?'Now:':'Teď:'}</strong> {c(p.now)}</p><p><strong>{lang==='en'?'Where you want to be:':'Kam chceš:'}</strong> {c(p.destination)}</p></div><Photo asset="pine" alt="" className="m-pine"/></div><h3>{c(p.barriersTitle)}</h3><div className="m-needs-list"><Rail title={c(p.barriersTitle)} lang={lang} items={p.barriers.map((x,i)=>[String(i+1).padStart(2,'0'),x[0][0],x[1][0],x[0][1],x[1][1]])}/></div><p>{c(p.needsClose)}</p><TextLink href="#kontakt">{c(p.cta)}</TextLink></Chapter>
  <Chapter title={c(p.forTitle)} className="m-boundaries"><ul>{p.forItems.map(x=><li key={x[0]}>{c(x)}</li>)}</ul><p><strong>{c(p.forClose)}</strong></p><p>{c(p.notFor)}</p></Chapter>
  <Chapter title={c(p.oldTitle)} className="m-formats"><div className="m-editorial-stack">{p.oldWays.map((x,i)=><article key={i}><p className="preview-old-way">{c(x[0])}</p><h3>{c(x[1])}</h3></article>)}</div><p>{c(p.oldClose)}</p><TextLink href="#kontakt">{c(p.cta)}</TextLink></Chapter>
  <Chapter title={c(p.startTitle)} eyebrow={c(p.startLabel)} id="co-dostanes" className="m-between m-process m-dark"><div className="m-editorial-stack">{p.startItems.map((x,i)=><article key={i}><h3>{c(x[0])}</h3><p>{c(x[1])}</p></article>)}</div><MobileCycle lang={lang}/><p><strong>{c(p.weekTitle)}</strong></p><p>{c(p.week)}</p><p><strong>{c(p.why)}</strong></p><p><strong>{c(p.price)}</strong></p><p className="small">{c(p.priceSmall)}</p><TextLink href="#kontakt">{c(p.cta)}</TextLink><a className="m-text-link" href={previewWhatsApp(lang,true)} target="_blank" rel="noopener noreferrer">{c(p.direct)}</a></Chapter>
  <div className="m-dark"><MobileReviews lang={lang} preview/></div>
  <Chapter title={lang==='en'?'How do you start?':'Jak začneš?'} className="m-process m-dark preview-dark-end"><div className="m-process-opening"><Photo asset="equipment" alt={c(approved.PageSpoluprace[25])} className="m-equipment"/></div><ol className="m-process-steps m-editorial-stack">{p.workSteps.map((x,i)=><li key={i}><span className="m-process-number" aria-hidden="true">0{i+1}</span><div><h3>{c(x[0])}</h3><p>{c(x[1])}</p></div></li>)}</ol><TextLink href="#kontakt">{lang==='en'?'I want to start':'Chci začít'}</TextLink><TerrainArtwork variant="home" className="m-process-current"/></Chapter>
  <Chapter title={c(p.aboutTitle)} eyebrow="Kryštof Švec" className="m-boundaries"><p className="m-accent-copy">{c(p.bio)}</p><p>{c(p.cheer)}</p><p><strong>{c(p.live)}</strong></p><TextLink href={routePath('pribeh',lang)+'#vzdelani'}>{c(p.qualification)}</TextLink><TextLink href={routePath('pribeh',lang)} arrow>{lang==='en'?'My story':'Můj příběh'}</TextLink></Chapter>
  <MobileCollaborationFaq lang={lang} preview/><CollaborationPricing lang={lang} preview/><MobileContact lang={lang} collaboration preview/>
 </>;
}
