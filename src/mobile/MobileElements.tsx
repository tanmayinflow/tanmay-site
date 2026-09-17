import { useEffect, useId, useState, type ReactNode } from 'react';
import { RichText } from './MobileRichText';
import { approved } from './approved-content';

export const copy = (group: keyof typeof approved, index: number, lang: string): string => {
  const text = approved[group][index][lang === 'en' ? 1 : 0];
  return lang === 'en' ? text : text.replace(/(^|[\s\u00a0(„"])([ksvzouaiKSVZOUAI])[ \t]+/g, '$1$2\u00a0').replace(/(^|[\s\u00a0(„"])([ksvzouaiKSVZOUAI])[ \t]+/g, '$1$2\u00a0');
};
export const smooth = (): ScrollBehavior => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

export function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="m-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={down ? { transform: 'rotate(90deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}
export function MessageIcon() {
  return <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M23.5 13.3a9.4 9.4 0 0 1-9.5 9.3 10 10 0 0 1-4-.8L4 23.4l1.6-5.8a9.1 9.1 0 0 1-1.1-4.3A9.4 9.4 0 0 1 14 4a9.4 9.4 0 0 1 9.5 9.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>;
}
export function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
export function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.3" cy="6.8" r="1" fill="currentColor"/></svg>;
}
export function MaterialEdge({ tone='linen', className='' }: {tone?:'linen'|'dark'|'earth';className?:string}) {
  return <div className={'m-material-edge m-material-edge--'+tone+' '+className} aria-hidden="true" />;
}
export function Chapter({ title, eyebrow, children, className = '', id }: {title: string; eyebrow?: string; children: ReactNode; className?: string; id?: string}) {
  const uid = useId();
  return <section className={'m-chapter ' + className} id={id} aria-labelledby={uid}><div className="m-inner">{eyebrow && <p className="m-eyebrow">{eyebrow}</p>}<h2 id={uid}>{title}</h2>{children}</div></section>;
}
export function Detail({ title, children, number, className = '' }: {title: string; children: ReactNode; number?: string; className?: string}) {
  return <details className={'m-detail ' + className} data-step={number}><summary><span className="m-detail-title">{title}<svg className="m-disclosure-mark" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 1.5 7 5 3 8.5Z" fill="currentColor" /></svg></span></summary><div className="m-detail-body">{children}</div></details>;
}
export function TextLink({ href, children, down = false, arrow = false }: { href: string; children: ReactNode; down?: boolean; arrow?: boolean }) {
  return <a className="m-text-link" href={href}>{children}{arrow&&<Arrow down={down} />}</a>;
}
type Asset = { src: string; fallback?: string; widths?: readonly number[]; prefix?: string; width: number; height: number };
export const mobileAssets = {
  home: { src: '/media/home-v9-1/portrait-home-1153.webp', widths: [480,720,960,1153], prefix: '/media/home-v9-1/portrait-home-', width: 1153, height: 1364 },
  collaboration: { src: '/media/collaboration-v9-8/collaboration-hero-1086.webp', widths: [540,720,1086], prefix: '/media/collaboration-v9-8/collaboration-hero-', width:1086,height:1448 },
  practice: {src: '/media/practice-v9-6-3/practice-rock-native.webp', fallback: '/media/practice-v9-6-3/practice-rock-native.png',width:810,height:902},
  about: {src:'/media/about-v9-12c/about-portrait-1025.webp',fallback:'/media/about-v9-12c/about-portrait-native.png',widths:[480,720,960,1025],prefix:'/media/about-v9-12c/about-portrait-',width:1025,height:1417},
  salto: {src:'/media/home-v9-4/salto-bw-1385.webp',width:1385,height:862},
  handstand: {src:'/media/material/handstand-cutout-bw.webp',width:522,height:1400},
  earthField: {src:'/media/material/field-earth.webp',width:684,height:1100},
  prague: {src:'/media/home-v9-5-1/about-prague-820.webp',fallback:'/media/home-v9-5-1/about-prague.jpg',widths:[360,480,720,820],prefix:'/media/home-v9-5-1/about-prague-',width:820,height:1025},
  forest: {src:'/media/about-v9-12c/about-forest-1080.webp',fallback:'/media/about-v9-12c/about-forest-original.jpg',widths:[480,720,1080],prefix:'/media/about-v9-12c/about-forest-',width:1080,height:1070},
  equipment:{src:'/media/refine-v9-17/equipment-linen-720.webp',fallback:'/media/refine-v9-17/equipment-linen-native.png',widths:[360,540,720,960,1405],prefix:'/media/refine-v9-17/equipment-linen-',width:1405,height:903},
  rings:{src:'/media/final-v9-13/pine-rings-720.webp',fallback:'/media/final-v9-13/pine-rings-native.png',widths:[360,540,720,998],prefix:'/media/final-v9-13/pine-rings-',width:998,height:1496},
  pine:{src:'/media/illustration/illustration-pine.webp',width:640,height:960},
} satisfies Record<string, Asset>;

/** Original supplied files, framed by the mobile composition. Failed optional images remove their frame. */
export function Photo({ asset, alt, className='', eager=false, sizes='(min-width:600px) 540px, 100vw' }: {asset: keyof typeof mobileAssets; alt:string; className?:string; eager?:boolean; sizes?:string}) {
  const [stage, setStage] = useState(0);
  const a: Asset = mobileAssets[asset];
  if (stage > (a.fallback ? 1 : 0)) return null;
  return <figure className={'m-photo '+className}><img key={stage} src={stage===0 ? a.src : a.fallback} srcSet={stage===0 && a.widths ? a.widths.map(w=>`${a.prefix}${w}.webp ${w}w`).join(', ') : undefined} sizes={sizes} width={a.width} height={a.height} alt={alt} loading={eager?'eager':'lazy'} decoding="async" fetchPriority={eager?'high':'auto'} onError={()=>setStage(s=>s+1)} /></figure>;
}
export function Mineral({ kind }: {kind:'home'|'collaboration'|'about'}) {
  const mask = '/media/mobile-m6/hero-mask-alpha.png';
  const [ready,setReady] = useState(false);
  useEffect(()=>{let live=true;const img=new Image();img.onload=()=>img.decode().then(()=>{if(live)setReady(true)},()=>{});img.src=mask;return()=>{live=false;img.onload=null};},[mask]);
  return ready ? <div className={'m-mineral m-mineral--'+kind} aria-hidden="true" /> : null;
}
export { Rail } from './MobileCarousel';
