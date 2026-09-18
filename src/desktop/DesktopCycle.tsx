import { Children, cloneElement, isValidElement, useState, type CSSProperties, type ReactNode, type ReactElement } from 'react';
import CollaborationCycle from '../components/CollaborationCycle';

/** The three original paragraphs stay visible; activation explains their cycle. */
export default function DesktopCycle({children,lang}:{children:ReactNode;lang:string}) {
  const [selected,setSelected]=useState(-1);
  const [turns,setTurns]=useState(0);
  const choose=(index:number)=>{setSelected(index);setTurns(n=>n+1);};
  const next=(selected+1)%3;
  const labels=lang==='en'?['A clear plan','A real record','Ongoing adjustment']:['Jasný plán','Skutečný záznam','Průběžná úprava'];
  let item=0;
  function enhance(nodes:ReactNode,step=-1):ReactNode {
    return Children.map(nodes,node=>{
      if(!isValidElement(node))return node;
      const element=node as ReactElement<any>;
      if(element.type===CollaborationCycle)return <div className="d-cycle-art">{element}<button className="d-cycle-next" type="button" onClick={()=>choose(next)} aria-label={(lang==='en'?'Next step in the cycle: ':'Další krok cyklu: ')+labels[next]} /></div>;
      const props=element.props;
      if(typeof element.type!=='string')return element;
      const isItem=String(props.className||'').split(' ').includes('between-item');
      const index=isItem?item++:step;
      if(element.type==='h3'&&index>=0)return cloneElement(element,{},<button className="d-cycle-step" type="button" aria-pressed={selected===index} onClick={()=>choose(index)}>{props.children}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 4 6 6-6 6"/></svg></button>);
      return cloneElement(element,isItem?{'data-cycle-selected':selected===index?'true':'false'}:{},enhance(props.children,index));
    });
  }
  return <div className="wrap between-grid d-cycle" style={{'--d-cycle-turn':`${turns*120}deg`} as CSSProperties} data-cycle-step={selected}>{enhance(children)}</div>;
}
