import { previewCopy, previewText } from '../preview-copy';
import { useRef } from 'react';
import { useProcessConnectors } from './PreviewMotion';
import { PreviewProcessRoad } from './PreviewProcessRoad';

// Owner's latest mobile wording; the desktop proposal keeps its reviewed copy.
export const mobilePreviewCopy={...previewCopy,
 oldTitle:['Stará cesta, nebo nová praxe?','The old way, or a new practice?'],
 bio:previewCopy.bio.map(text=>text.replace(' a jasná priorita','').replace(' and a clear priority','')),
 cheer:previewCopy.cheer.map(text=>text.replace('roztleskávač a rovnocenný přítel','roztleskávač, průvodce a rovnocenný přítel').replace('cheerleader and a friend on equal terms','cheerleader, guide and a friend on equal terms').replace('hecuju tě','povzbuzuju').replace('push you on','encourage you')),
 destination:['Silnější a lehčí tělo, které se ti líbí. Energie na celý den. Sebevědomí a klid ve svém těle. Pohyb, na který se těšíš.','A stronger, lighter body you like. Energy for the whole day. Confidence and calm in your own body. Movement you look forward to.'],
 needsClose:['Ten rozdíl překonáme spolu.\nKrok za krokem.','We will overcome the gap together.\nStep by step.'],
 forItems:previewCopy.forItems.map(pair=>pair.map(text=>{const sentence=text.replace('máš málo času, protože práce a rodina,','máš málo času kvůli práci a rodině.').replace('v síle,','v síle a bez bolesti.').replace('many strong years ahead,','many strong, pain-free years ahead.').replace(/[,.;]$/,'.');return sentence.charAt(0).toUpperCase()+sentence.slice(1);})),
 notFor:['Není to pro tebe, když hledáš rychlé zázraky za týden.','This is not for you if you are looking for quick miracles in a week.'],
 qualification:['Moje celé akreditované vzdělání a osobní příběh','My full accredited education and personal story'],
 firstCta:['Chci první trénink.','I want my first session.'],
 week:previewCopy.week.map(text=>text.replace('20 minut','30 minut').replace('20 minutes','30 minutes').replace('Neděle','Průběžně').replace('Sunday','Throughout the week')),
 why:['Proč 4 týdny? Začne tě to bavit a uvidíš, že plán drží i v horším týdnu.','Why 4 weeks? You will start enjoying it and see that the plan holds up even during a difficult week.'],
};

export function PreviewCurveArrow({className='',connector=false}:{className?:string;connector?:boolean}) {
 return <svg className={'preview-curve-arrow '+className} viewBox={connector?'0 0 100 100':'0 0 88 110'} fill="none" aria-hidden="true"><path d={connector?'M14 12 C78 2 88 48 48 83':'M68 7 C72 49 53 72 18 92'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 8"/><path d={connector?'M48 68 L45 85 L62 81':'M22 77 L16 94 L34 97'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function PreviewSteps({lang,work=false,included=false}:{lang:string;work?:boolean;included?:boolean}) {
 const root=useRef<HTMLOListElement>(null);useProcessConnectors(root,lang+work+included);
 const steps=included?previewCopy.startItems:work?previewCopy.workSteps:previewCopy.steps;
 const content=<ol ref={root} className={'preview-process-steps'+(included?' preview-included-steps':'')}>{steps.map((step,i)=><li key={i}><div><h3>{!included&&<span className="preview-step-number" aria-hidden="true">0{i+1}</span>}<span className="preview-step-title">{previewText(step[0],lang)}</span></h3><p><span className="preview-step-copy">{work&&i===0?previewText(step[1],lang).split(/ (?=Odejdeš |You leave )/).map((sentence,index)=><span className="preview-step-sentence" key={sentence}>{index>0?' ':''}{sentence}</span>):previewText(step[1],lang)}</span></p></div>{!work&&i<steps.length-1&&<PreviewCurveArrow connector className={i%2===0?'preview-turn-right':'preview-turn-left'}/>}</li>)}</ol>;
 return work?<PreviewProcessRoad lang={lang}>{content}</PreviewProcessRoad>:content;
}
