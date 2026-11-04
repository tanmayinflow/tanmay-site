import { previewCopy, previewText } from '../preview-copy';
import { useRef } from 'react';
import { useProcessConnectors } from './PreviewMotion';

// Owner's latest mobile wording; the desktop proposal keeps its reviewed copy.
export const mobilePreviewCopy={...previewCopy,
 oldTitle:['Stará cesta, nebo nová praxe?','The old way, or a new practice?'],
 bio:previewCopy.bio.map(text=>text.replace(' a jasná priorita','').replace(' and a clear priority','')),
 cheer:previewCopy.cheer.map(text=>text.replace('hecuju tě','povzbuzuju').replace('push you on','encourage you')),
 qualification:['Moje celé akreditované vzdělání a osobní příběh','My full accredited education and personal story'],
 firstCta:['Chci první trénink.','I want my first session.'],
 week:previewCopy.week.map(text=>text.replace('20 minut','30 minut').replace('20 minutes','30 minutes')),
};

export function PreviewCurveArrow({className='',connector=false}:{className?:string;connector?:boolean}) {
 return <svg className={'preview-curve-arrow '+className} viewBox={connector?'0 0 100 100':'0 0 88 110'} fill="none" aria-hidden="true"><path d={connector?'M14 12 C78 2 88 48 48 83':'M68 7 C72 49 53 72 18 92'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 8"/><path d={connector?'M48 68 L45 85 L62 81':'M22 77 L16 94 L34 97'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function PreviewSteps({lang,work=false}:{lang:string;work?:boolean}) {
 const root=useRef<HTMLOListElement>(null);useProcessConnectors(root,lang+work);
 return <ol ref={root} className="preview-process-steps">{(work?previewCopy.workSteps:previewCopy.steps).map((step,i)=><li key={i}><div><h3><span className="preview-step-number" aria-hidden="true">0{i+1}</span><span className="preview-step-title">{previewText(step[0],lang)}</span></h3><p><span className="preview-step-copy">{previewText(step[1],lang)}</span></p></div>{i<2&&<PreviewCurveArrow connector className={i===0?'preview-turn-right':'preview-turn-left'}/>}</li>)}</ol>;
}
