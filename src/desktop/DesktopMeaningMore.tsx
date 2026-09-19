import type { ReactNode } from 'react';
import './desktop-meaning.css';
export default function DesktopMeaningMore({lang,children}:{lang:string;children:ReactNode}){
 return <details className="d-meaning-more"><summary><span className="d-meaning-read">{lang==='en'?'Read more':'Číst dál'}</span><span className="d-meaning-close">{lang==='en'?'Read less':'Zavřít'}</span><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></summary><div className="d-meaning-content">{children}</div></details>;
}
