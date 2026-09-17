import { useId, type ReactNode } from 'react';
import { ThreeAnchorsArtwork } from '../components/FinalArtwork';
import { approvedLists } from './approved-content';
import { DisclosureMark, useFigureDisclosure } from './MobileFigureDisclosure';
import { RichText } from './MobileRichText';
import { MobileAnchorIcon } from './MobileAnchorIcons';

// Each half starts at the shared centre and travels in the opposite direction.
// The wide paths are masked by the supplied alpha artwork: only its original
// brush outlines receive pigment, never a circle's interior.
const outlineHalves = [
  ['M625 704 C225 701 210 115 626 107','M625 704 C1040 707 1035 98 626 107'],
  ['M625 704 C872 967 505 1278 166 1038','M625 704 C296 405 -72 824 166 1038'],
  ['M625 704 C335 1004 758 1274 1085 1022','M625 704 C990 406 1325 820 1085 1022'],
];

export default function MobilePracticeAnchors({lang,stance}:{lang:string;stance:string}) {
  const en=lang==='en',rows=approvedLists.PagePraxe.anchors;
  const mask=useId();
  const description=(i:number)=><div className="m7-anchor-description"><MobileAnchorIcon kind={i}/><div><h3>{rows[i][en?5:2]}</h3><p><RichText>{rows[i][en?6:3]}</RichText></p></div></div>;
  const items:{title:string;text:ReactNode}[]=rows.map((row,i)=>({title:row[en?5:2],text:description(i)}));
  items.push({title:en?'Three anchors together':'Tři kotvy společně',text:<div className="m7-anchor-descriptions">{rows.map((_,i)=><div key={i}>{description(i)}</div>)}</div>});
  const view=useFigureDisclosure(items);
  return <div className="m-interactive-anchors m7-interactive-anchors" ref={view.host} onKeyDown={view.onKeyDown} data-active={view.selected===null?'none':view.selected}>
    <div className="m-anchors-stage m7-anchors-stage">
      <div className="m-anchors-art" aria-hidden="true"><ThreeAnchorsArtwork lang={lang}/></div>
      <svg className="m7-anchor-pigment" viewBox="0 0 1254 1254" fill="none" aria-hidden="true"><defs><mask id={mask} style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><image href="/media/final-v9-13/anchors-strokes.png" width="1254" height="1254"/></mask></defs><g mask={`url(#${mask})`} stroke="currentColor" strokeWidth="115" strokeLinecap="round">{outlineHalves.map((paths,i)=><g key={i} className="m7-anchor-ring" data-active={view.selected===i||view.selected===3}>{paths.map((d,j)=><path key={j} d={d} pathLength="100"/>)}</g>)}</g></svg>
      <p className="m7-presence-legend"><span aria-hidden="true"/>{en?'Presence':'Přítomnost'}</p>
      <div className="m-anchor-controls">{rows.map((row,i)=><button {...view.buttonProps(i)} key={i} className={'m-anchor-button m-anchor-button--'+i}><strong>{i===2?<>{en?'Wild':'Divoká'}<br/>{en?'nature':'příroda'}</>:row[en?5:2]}<DisclosureMark/></strong><small>{row[en?4:1]}</small></button>)}<button {...view.buttonProps(3)} className="m7-anchor-centre" aria-label={en?'Explore all three anchors together':'Prozkoumat všechny tři kotvy společně'}><span aria-hidden="true"/></button></div>
    </div>
    {view.description}
    <p className="m-anchor-stance m7-anchor-stance"><RichText>{stance}</RichText></p>
  </div>;
}
