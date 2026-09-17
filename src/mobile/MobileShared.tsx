import { useId, useLayoutEffect, useRef } from 'react';
import { BrandWordmark } from '../components/FinalArtwork';
import { WHATSAPP_URL, MAIL, CLIENT_APP_URL } from '../site.js';
import { copy, Photo, Mineral, MessageIcon, MailIcon, MaterialEdge } from './MobileElements';
import { RichText } from './MobileRichText';
import { mobileText as t } from './mobile-copy';
import { MobileVajra } from './MobileVajra';
import { MobileCollaborationPortrait } from './MobileCollaborationPortrait';
import { useStableHeroViewport } from './mobile-hero-viewport';

export function MobileHero({ page, lang }: {page:'home'|'collaboration'|'practice'|'about';lang:string}) {
  const hero=useRef<HTMLElement>(null);
  useStableHeroViewport(hero);
  useLayoutEffect(()=>{
    const el=hero.current;if(!el)return;
    const identity=el.querySelector<HTMLElement>('.m-hero-identity');
    const scene=el.querySelector<HTMLElement>('.m-hero-scene');
    if(!identity||!scene)return;
    const measure=()=>{
      el.style.setProperty('--m-identity-height',identity.offsetHeight+'px');
      el.style.setProperty('--m-caption-height','0px');
      el.dataset.expandedHeading=identity.offsetHeight>125?'true':'false';
      el.dataset.largeText=parseFloat(getComputedStyle(document.documentElement).fontSize)>20?'true':'false';
      const scale=Math.min(scene.clientHeight/1282,scene.clientWidth*.98/684);
      el.style.setProperty('--m-collab-scale',String(Math.max(.1,scale)));
    };
    const observer=new ResizeObserver(measure);observer.observe(identity);observer.observe(scene);observer.observe(document.documentElement);measure();
    window.addEventListener('resize',measure);
    return()=>{observer.disconnect();window.removeEventListener('resize',measure);};
  },[]);
  const topic=t(page,lang);
  const subtitle=page==='home'?copy('Opening',0,lang):page==='collaboration'?copy('PageSpoluprace',5,lang):page==='practice'?copy('PagePraxe',3,lang):(lang==='en'?'A trainer who spent a year in a wheelchair':'Trenér, co strávil rok na vozíku');
  const intro=page==='practice'?copy('PagePraxe',2,lang):null;
  const benefits=lang==='en'?['More strength.','Confidence in movement.','Training that fits you.']:['Více síly.','Jistota v pohybu.','Trénink, který ti sedne.'];
  const alt=page==='home'?copy('Opening',4,lang):page==='collaboration'?copy('PageSpoluprace',8,lang):page==='practice'?copy('PagePraxe',4,lang):(lang==='en'?'Kryštof Švec, a portrait in a plain black T-shirt.':'Kryštof Švec, portrét v černém tričku bez potisku.');
  return <><header className={'m-hero m-hero--'+page} ref={hero}>
    <div className="m-hero-identity">{page==='practice'&&<MobileVajra className="m10-hero-vajra"/>}<h1>{page==='home'?'Kryštof Švec':topic}</h1><p className="m-hero-service">{page==='about'?<><span>{lang==='en'?'A trainer':'Trenér,'}</span><span>{lang==='en'?'who spent a year in a wheelchair':'co strávil rok na vozíku'}</span></>:subtitle}</p>{page==='collaboration'&&<p className="m-hero-intro m-hero-benefits">{benefits.map(benefit=><span key={benefit}>{benefit}</span>)}</p>}{intro&&<p className="m-hero-intro"><RichText>{intro}</RichText></p>}</div>
    <div className="m-hero-scene">{page!=='practice'&&<Mineral kind={page}/>} {page==='collaboration'?<MobileCollaborationPortrait alt={alt}/>:<Photo asset={page} alt={alt} eager className="m-hero-photo"/>}<MaterialEdge tone={page==='home'?'dark':'linen'}/></div>
  </header>{page==='home'&&<div className="m-hero-caption m10-home-caption m-dark"><h2 id="m-home-statement">{copy('Opening',1,lang)}</h2></div>}</>;
}
export function MobileProof({lang}:{lang:string}) {
  const c=(i:number)=>copy('PagePribeh',i,lang);
  const credentials=[...c(6).split(' · '),...c(7).split(' · ')].map(item=>item.charAt(0).toUpperCase()+item.slice(1)).sort((a,b)=>b.length-a.length);
  return <div className="m-proof"><div className="m-proof-education"><h2 className="m-eyebrow">{lang==='en'?'Professional education':'Odborné vzdělání'}</h2><ul className="m-proof-credentials">{credentials.map(item=><li key={item}>{item}</li>)}</ul></div><div className="m-proof-numbers"><div><strong>{lang==='en'?'10 years':'10 let'}</strong><span>{lang==='en'?'personal practice':'vlastní praxe'}</span></div><div><strong>150+</strong><span>{lang==='en'?'happy clients':'spokojených klientů'}</span></div></div></div>;
}
export function ClientAccess({lang}:{lang:string}) {
  const text=copy('ClientStrip',2,lang);
  const phrase=lang==='en'?'client app':'klientské aplikaci';
  const at=text.replace(/\u00a0/g,' ').indexOf(phrase);
  const body=at>=0?<>{text.slice(0,at)}<strong className="copy-emphasis">{text.slice(at,at+phrase.length)}</strong>{text.slice(at+phrase.length)}</>:<>{lang==='en'?<>In the <strong className="copy-emphasis">client app</strong>, </>:null}{lang==='en'?text.charAt(0).toLowerCase()+text.slice(1):text}</>;
  return <div className="m-client-access"><h3>{copy('ClientStrip',1,lang)}</h3><p>{body}</p><a className="m-client-entry" href={CLIENT_APP_URL} target="_blank" rel="noopener noreferrer">{t('clients',lang)}</a></div>;
}
export function MobileContact({lang, home=false, collaboration=false}:{lang:string;home?:boolean;collaboration?:boolean}) {
  const headingId=useId();
  const c=(i:number)=>copy('HomeBooking',i,lang);
  const source=collaboration?'PageSpoluprace':'HomeBooking';
  const whatsapp=WHATSAPP_URL+'?text='+encodeURIComponent(copy(source,0,lang));
  const mail='mailto:'+MAIL+'?subject='+encodeURIComponent(copy(source,1,lang))+'&body='+encodeURIComponent(copy(source,2,lang));
  return <section className="m-chapter m-contact" id={home?'rezervace':'kontakt'} aria-labelledby={headingId}><div className="m-inner"><div className="m-contact-target" data-mobile-contact-target="" style={{scrollMarginTop:'max(16px, env(safe-area-inset-top, 0px))'}}><p className="m-eyebrow">{c(3)}</p><h2 id={headingId} tabIndex={-1}>{collaboration?copy('PageSpoluprace',38,lang):c(4)}</h2><p className="m-lead"><RichText>{c(5)}</RichText></p><div className="m-contact-actions"><a className="m-contact-main" href={whatsapp} target="_blank" rel="noopener noreferrer">{c(6)}<MessageIcon /></a><a className="m-contact-mail" href={mail}><MailIcon/>{c(7)}</a></div></div><ClientAccess lang={lang}/></div></section>;
}
export function MobileClosing({lang}:{lang:string}) {
  return <section className="m-closing"><MaterialEdge/><div className="m-inner"><BrandWordmark /><p className="m-closing-meaning">{copy('Closing',0,lang)}</p><p className="m-closing-stance">{copy('Closing',1,lang)}</p></div></section>;
}
