import { useId } from 'react';

/** Stable language positions let the active marker move when the route changes. */
export function MobileLanguageSwitch({lang,href}:{lang:string;href:string}) {
  const choice=(code:'cs'|'en')=>lang===code
    ? <span className="m-language-choice" aria-current="true">{code==='cs'?'CZ':'EN'}</span>
    : <a className="m-language-choice" href={href} hrefLang={code} aria-label={code==='cs'?'Přepnout do češtiny':'Switch to English'}>{code==='cs'?'CZ':'EN'}</a>;
  return <div className="m-languages" data-current-language={lang} role="group" aria-label={lang==='en'?'Language':'Jazyk'}>{choice('cs')}<span className="m-language-dot" aria-hidden="true">·</span>{choice('en')}</div>;
}

/** The supplied transparent artwork is turned vertically and coloured without altering it. */
export function MobileMenuLines() {
  const id=useId();
  return <svg className="m-menu-lines" viewBox="0 0 724 2172" preserveAspectRatio="none" aria-hidden="true"><defs><mask id={id} x="0" y="0" width="724" height="2172" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/mobile-m6/menu-lines.png" width="2172" height="724" transform="translate(724 0) rotate(90)"/></mask></defs><rect width="724" height="2172" fill="currentColor" mask={`url(#${id})`}/></svg>;
}
