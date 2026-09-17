import CollaborationCycle from '../components/CollaborationCycle';
import { copy } from './MobileElements';
import { useFigureDisclosure } from './MobileFigureDisclosure';
import { RichText } from './MobileRichText';

export default function MobileCycle({lang}:{lang:string}) {
  const c=(i:number)=>copy('PageSpoluprace',i,lang);
  const items=[29,31,33].map(i=>({title:c(i),text:<p><RichText>{c(i+1)}</RichText></p>}));
  const view=useFigureDisclosure(items);
  const next=((view.selected??-1)+1)%items.length;
  const choose=(index:number)=>view.buttonProps(index).onClick();
  return <div className="m-interactive-cycle" ref={view.host} onKeyDown={view.onKeyDown}>
    <p className="m-eyebrow m-cycle-caption">{c(28)}</p>
    <div className="m-cycle-row"><div className="m-cycle-illustration"><div className="m-cycle-art"><CollaborationCycle/></div><button type="button" className="m-cycle-next" onClick={()=>choose(next)} aria-controls={view.buttonProps(next)['aria-controls']} aria-label={(lang==='en'?'Next step in the cycle: ':'Další krok cyklu: ')+items[next].title}/></div><div className="m-cycle-controls">{items.map((item,i)=><button {...view.buttonProps(i)} onClick={()=>choose(i)} key={i}>{item.title}</button>)}</div></div>
    {view.description}
  </div>;
}
