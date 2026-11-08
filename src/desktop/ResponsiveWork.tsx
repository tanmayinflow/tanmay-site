import { useId, useState } from 'react';
import CollaborationCycle from '../components/CollaborationCycle';
import { copy } from '../mobile/MobileElements';
import { RichText } from '../mobile/MobileRichText';
import { mobilePreviewCopy as p } from '../mobile/PreviewDetails';
import { previewText, previewWhatsApp } from '../preview-copy';
import './responsive-work-story.css';

function Curve({ className = '' }: { className?: string }) {
  return <svg className={'responsive-work-curve ' + className} viewBox="0 0 88 110" fill="none" aria-hidden="true"><path d="M68 7C72 49 53 72 18 92" stroke="currentColor" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round"/><path d="m22 77-6 17 18 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/** Desktop uses the same approved content as the phone, arranged for reading across a wider surface. */
export function ResponsiveWorkNeeds({ lang }: { lang: string }) {
  const c = (pair: readonly string[]) => previewText(pair, lang);
  return <>
    <section className="site-linen responsive-work-needs" id="potreby" aria-labelledby="responsive-work-needs-title"><div className="wrap">
      <h2 className="h-display h2" id="responsive-work-needs-title">{c(p.needsTitle)}</h2>
      <div className="responsive-work-journey">
        <div><h3>{lang === 'en' ? 'Now' : 'Teď'}</h3><p>{c(p.now)}</p></div>
        <Curve/>
        <div className="responsive-work-destination"><h3>{lang === 'en' ? 'Where you want to be' : 'Kam chceš'}</h3><p>{c(p.destination)}</p></div>
      </div>
      <h3 className="responsive-work-barriers-title">{c(p.barriersTitle)}</h3>
      <div className="responsive-work-barriers">{p.barriers.map(([title, body]) => <article key={title[0]}><h3>{c(title)}</h3><p><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h17m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg><span>{c(body)}</span></p></article>)}</div>
      <p className="responsive-work-close">{c(p.needsClose)}</p>
    </div></section>
    <section className="site-linen responsive-work-fit" id="zkusenost" aria-labelledby="responsive-work-fit-title"><div className="wrap">
      <h2 className="h-display h2" id="responsive-work-fit-title">{c(p.forTitle)}</h2>
      <div><ul>{p.forItems.map(item => <li key={item[0]}>{c(item)}</li>)}</ul><p><strong>{c(p.forClose)}</strong></p></div>
    </div></section>
  </>;
}

function ResponsiveWorkCycle({ lang }: { lang: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const uid = useId();
  const items = [29, 31, 33].map(index => ({ title: copy('PageSpoluprace', index, lang), text: copy('PageSpoluprace', index + 1, lang) }));
  const choose = (index: number) => setSelected(current => current === index ? null : index);
  return <div className="responsive-work-cycle" onKeyDown={event => { if (event.key === 'Escape') setSelected(null); }}>
    <div className="responsive-work-cycle-row"><div className="responsive-work-cycle-art"><CollaborationCycle/></div><div className="responsive-work-cycle-buttons">{items.map((item, index) => <button key={item.title} type="button" aria-expanded={selected === index} aria-controls={uid + '-' + index} onClick={() => choose(index)}>{item.title}<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 5 5 5-5 5" stroke="currentColor" strokeWidth="1.4"/></svg></button>)}</div></div>
    {items.map((item, index) => <div key={item.title} id={uid + '-' + index} className="responsive-work-cycle-answer" hidden={selected !== index}><p><RichText>{item.text}</RichText></p></div>)}
  </div>;
}

export function ResponsiveWorkOffer({ lang }: { lang: string }) {
  const c = (pair: readonly string[]) => previewText(pair, lang);
  return <section className="site-ink preview-cotton responsive-work-offer" id="co-dostanes" aria-labelledby="responsive-work-offer-title"><div className="wrap">
    <header className="responsive-work-offer-heading"><h2 className="h-display h2" id="responsive-work-offer-title">{c(p.startLabel)}</h2><p>{c(p.startTitle)}</p></header>
    <div className="responsive-work-inclusions">{p.startItems.map(([title, body], index) => <article key={title[0]}><h3>{c(title)}</h3><p>{c(body)}</p>{index < p.startItems.length - 1 && <Curve className={index % 2 ? 'is-mirrored' : ''}/>}</article>)}</div>
    <div className="responsive-work-week"><div><h3>{c(p.weekTitle).split(/(\([^)]*\))/).map((part, index) => part.startsWith('(') ? <span className="preview-week-example" key={index}>{part}</span> : part)}</h3><p>{c(p.week)}</p></div><ResponsiveWorkCycle lang={lang}/></div>
    <div className="responsive-work-decision"><p className="responsive-work-reason">{c(p.why)}</p><div className="responsive-work-price"><p><strong>{c(p.price)}</strong></p><p className="small">{c(p.priceSmall)}</p><a className="responsive-work-button" href={previewWhatsApp(lang, true)} target="_blank" rel="noopener noreferrer">{c(p.firstCta)}</a><a className="release-consultation" href={previewWhatsApp(lang)} target="_blank" rel="noopener noreferrer">{lang === 'en' ? 'Still unsure? Book 15 free minutes.' : 'Ještě váháš? Domluv si 15 minut zdarma.'}</a></div></div>
  </div></section>;
}
