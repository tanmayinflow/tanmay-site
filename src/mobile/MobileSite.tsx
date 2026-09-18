import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BrandWordmark } from '../components/FinalArtwork';
import { CLIENT_APP_URL, WHATSAPP_URL, IG_URL, routePath, otherLangPath } from '../site.js';
import { mobileText as t } from './mobile-copy';
import { MessageIcon, InstagramIcon } from './MobileElements';
import './mobile.css';
import './mobile-m2.css';
import './mobile-m3.css';
import './mobile-rich-m4.css';
import './mobile-pages-m4.css';
import './mobile-m4.css';
import './mobile-typography-m5.css';
import './mobile-controls-m5.css';
import './mobile-m5.css';
import './mobile-carousel-m6.css';
import './mobile-m6.css';
import './mobile-pages-m7.css';
import './mobile-practice-m7.css';
import './mobile-m7.css';
import './mobile-about-m8.css';
import './mobile-practice-m8.css';
import './mobile-m8.css';
import './mobile-about-m9.css';
import './mobile-practice-m9.css';
import './mobile-m9.css';
import './mobile-content-m10.css';
import './mobile-motion-m10.css';
import './mobile-hero-m10.css';
import './mobile-review-m10.css';
import './mobile-focus-m10.css';
import './mobile-composition-review.css';
import './mobile-surfaces-review.css';
import './mobile-affordances-round4.css';
import './mobile-layout-round4.css';
import './mobile-art-round4.css';
import './mobile-story-round4.css';
import { MobileLanguageSwitch, MobileMenuLines } from './MobileHeaderDetails';
import { useMobileContactScroll } from './mobile-contact-scroll';
import { useMobileMotion } from './useMobileMotion';
import { useMobileStoryScroll } from './mobile-story-scroll';
import { MobileContact } from './MobileShared';
import { useMobileDisclosures } from './useMobileDisclosures';
import { useMobileInputFocus } from './mobile-input-focus';
import { useMobileSurfacePhase } from './mobile-surface-phase';

export function useMobileViewport() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches);
  useEffect(() => { const media = window.matchMedia('(max-width: 899px)'); const change = () => setMobile(media.matches); media.addEventListener('change', change); change(); return () => media.removeEventListener('change', change); }, []);
  return mobile;
}
type Location = { routeId: string; lang: string; postId: string | null };
export default function MobileSite({ loc, children }: { loc: Location; children: ReactNode }) {
  const {lang, routeId} = loc;
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();
  useMobileInputFocus(root);
  useMobileSurfacePhase(root,routeId+lang+(loc.postId||''));
  useMobileDisclosures(root);
  useMobileMotion(root,routeId+lang+(loc.postId||''));
  useMobileStoryScroll(root,routeId+lang+(loc.postId||''));
  const contactId = ['home','spoluprace','praxe','pribeh'].includes(routeId) ? 'rezervace' : 'kontakt';
  const contactHref = ['spoluprace','praxe','pribeh'].includes(routeId) ? routePath('home',lang)+'#rezervace' : '#'+contactId;
  const toContact = useMobileContactScroll({root,dock,contactId,routeKey:routeId+lang+(loc.postId||'')});
  const nav = [['home','home'],['spoluprace','collaboration'],['praxe','practice'],['pribeh','about']] as const;
  const finishClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    menu.current?.close();
    setOpen(false);
    setShown(false);
    trigger.current?.focus({preventScroll:true});
  }, []);
  const close = useCallback(() => {
    if (!menu.current?.open) return;
    clearTimeout(closeTimer.current);
    setShown(false);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
    else closeTimer.current = window.setTimeout(finishClose, 300);
  }, [finishClose]);
  useEffect(()=>{const viewport=document.querySelector('meta[name="viewport"]');if(!viewport)return;const previous=viewport.getAttribute('content')||'';viewport.setAttribute('content',previous+', viewport-fit=cover');return()=>viewport.setAttribute('content',previous);},[]);
  useEffect(()=>{close();},[routeId,lang,loc.postId,close]);
  useEffect(()=>()=>clearTimeout(closeTimer.current),[]);
  useEffect(()=>{
    if(!open)return;
    const el=menu.current;if(!el)return;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';el.showModal();
    let frame2=0;
    const frame1=requestAnimationFrame(()=>{frame2=requestAnimationFrame(()=>setShown(true));});
    (el.querySelector('[data-menu-close]') as HTMLElement)?.focus();
    return()=>{cancelAnimationFrame(frame1);cancelAnimationFrame(frame2);el.close();document.body.style.overflow=overflow;};
  },[open]);
  useEffect(()=>{
    const update=()=>setBlocked(!!document.querySelector('dialog[open]'));
    const observer=new MutationObserver(update);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],childList:true});update();
    const viewport=window.visualViewport;
    const keyboardState=()=>{const active=document.activeElement;const editing=active instanceof HTMLElement && (active.matches('input,textarea,select')||active.isContentEditable);setKeyboard(!!editing && !!viewport && viewport.height < window.innerHeight*.75);};
    viewport?.addEventListener('resize',keyboardState);document.addEventListener('focusin',keyboardState);document.addEventListener('focusout',keyboardState);
    return()=>{observer.disconnect();viewport?.removeEventListener('resize',keyboardState);document.removeEventListener('focusin',keyboardState);document.removeEventListener('focusout',keyboardState);};
  },[]);
  useEffect(()=>{
    const observer=new ResizeObserver(()=>{
      if(dock.current?.offsetHeight)root.current?.style.setProperty('--m-dock-height',`${dock.current.offsetHeight}px`);
      if(header.current?.offsetHeight)root.current?.style.setProperty('--m-header-height',`${header.current.offsetHeight}px`);
    });
    if(dock.current)observer.observe(dock.current);
    if(header.current)observer.observe(header.current);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    let frame=0;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      const box=dock.current?.getBoundingClientRect();
      const y=Math.max(0,box?box.top+box.height/2:innerHeight-40);
      const beneath=document.elementsFromPoint(innerWidth/2,y).find(el=>!el.closest('.m-dock'));
      const dark=!!beneath?.closest('.m-home-field,.m-dark,.m-earth-coda,.m-offer,.m-hero-scene,.m-hero--home .m-hero-caption');
      if(root.current)root.current.dataset.dockTheme=dark?'dark':'light';
    });};
    const layout=new ResizeObserver(update);if(root.current)layout.observe(root.current);
    addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
    return()=>{layout.disconnect();removeEventListener('scroll',update);removeEventListener('resize',update);cancelAnimationFrame(frame);};
  },[routeId,lang]);
  return <div className="tm-mobile" lang={lang} ref={root} data-mobile-version="M10" data-page={routeId}>
    <a className="m-skip" href="#main">{t('skip',lang)}</a>
    <header className="m-header" ref={header}>
      <a className="m-logo" href={routePath('home',lang)} aria-label={'tanmay · '+t('home',lang)}><BrandWordmark /></a>
      <MobileLanguageSwitch lang={lang} href={otherLangPath(routeId,lang,loc.postId)}/>
      <button className="m-menu-trigger" type="button" ref={trigger} onClick={()=>setOpen(true)} aria-label={t('menu',lang)} aria-controls="mobile-menu" aria-expanded={open}><span /><span /></button>
    </header>
    <dialog className="m-menu" ref={menu} id="mobile-menu" data-visible={shown} aria-label={lang==='en'?'Navigation':'Navigace'} onKeyDown={e=>{if(e.key!=='Tab')return;const stops=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);const first=stops[0],last=stops[stops.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}} onCancel={e=>{e.preventDefault();close();}} onClose={()=>{setOpen(false);setShown(false);}} onClick={e=>{const sheet=e.currentTarget.querySelector('.m-menu-sheet');if(sheet&&!sheet.contains(e.target as Node))close();}}>
      <div className="m-menu-sheet"><MobileMenuLines/>
        <div className="m-menu-head"><a className="m-menu-client" href={CLIENT_APP_URL} target="_blank" rel="noopener noreferrer">{t('clients',lang)}</a><button type="button" data-menu-close="" className="m-menu-close" onClick={close} aria-label={t('close',lang)}>×</button></div>
        <nav aria-label={lang==='en'?'Main navigation':'Hlavní navigace'}>{nav.map(([route,key])=><a key={route} href={routePath(route,lang)} onClick={close} aria-current={routeId===route?'page':undefined}>{t(key,lang)}</a>)}</nav>
        <div className="m-menu-bottom"><a className="m-instagram" href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram · tanmayflow"><InstagramIcon/></a></div>
      </div>
    </dialog>
    <main id="main" key={routeId+lang+(loc.postId||'')}>{children}{!['home','spoluprace','praxe','pribeh'].includes(routeId)&&<MobileContact lang={lang}/>}</main>
    <footer className="m-footer">{routeId!=='home'&&<a className="m-logo" href={routePath('home',lang)} aria-label={'tanmay · '+t('home',lang)}><BrandWordmark /></a>}<p>© {new Date().getFullYear()} Kryštof Švec<span className="m-footer-brand"> · Tanmay Practice · {t('prague',lang)}</span></p><a href={routePath('soukromi',lang)}>{t('privacy',lang)}</a></footer>
    <div ref={dock} className="m-dock" hidden={blocked||keyboard} aria-label={lang==='en'?'Quick contact':'Rychlý kontakt'}><a className="m-dock-primary" href={contactHref} onClick={toContact}>{t('book',lang)}</a><a className="m-dock-message" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={t('wa',lang)}><MessageIcon /></a></div>
  </div>;
}

