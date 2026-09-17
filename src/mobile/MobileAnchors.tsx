import { ThreeAnchorsArtwork } from '../components/FinalArtwork';
import { approvedLists } from './approved-content';
import { DisclosureMark, useFigureDisclosure } from './MobileFigureDisclosure';
import { RichText } from './MobileRichText';

export default function MobileAnchors({lang}:{lang:string}) {
  const rows=approvedLists.PagePraxe.anchors;
  const en=lang==='en';
  const items=rows.map(row=>({title:row[en?5:2],text:<p><RichText>{row[en?6:3]}</RichText></p>}));
  const view=useFigureDisclosure(items);
  return <div className="m-interactive-anchors" ref={view.host} onKeyDown={view.onKeyDown}>
    <div className="m-anchors-stage">
      <div className="m-anchors-art" aria-hidden="true"><ThreeAnchorsArtwork lang={lang}/></div>
      <div className="m-anchor-controls">{items.map((item,i)=><button {...view.buttonProps(i)} key={i} className={'m-anchor-button m-anchor-button--'+i}><strong>{item.title}<DisclosureMark/></strong><small>{rows[i][en?4:1]}</small></button>)}</div>
    </div>
    <p className="m-anchor-legend"><span aria-hidden="true"/>{en?'Presence':'Přítomnost'}</p>
    {view.description}
  </div>;
}
