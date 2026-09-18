import { Children, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ThreeAnchorsArtwork } from '../components/FinalArtwork';
import { MobileAnchorIcon } from '../mobile/MobileAnchorIcons';
import { MobileVajraBell } from '../mobile/MobileVajraBell';
import './desktop-practice.css';

const selectionEvent = 'tanmay:desktop-practice-anchor';
const anchorNames = ['body', 'practice', 'nature'] as const;
const copyId = (index: number) => `d-practice-copy-${anchorNames[index]}`;
// The same broad paint paths used by the mobile figure only reveal pigment
// through the supplied brush alpha. They do not replace the original contours.
const outlineHalves = [
  ['M625 704 C225 701 210 115 626 107', 'M625 704 C1040 707 1035 98 626 107'],
  ['M625 704 C872 967 505 1278 166 1038', 'M625 704 C296 405 -72 824 166 1038'],
  ['M625 704 C335 1004 758 1274 1085 1022', 'M625 704 C990 406 1325 820 1085 1022'],
];

/** One scroll coordinate turns the original three-circle drawing and its hit
 * targets together. Updates are event-driven; there is no idle animation loop. */
export function DesktopPracticeDiagram({ lang }: { lang: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mask = useId() + '-desktop-anchor-pigment';
  const en = lang === 'en';
  const labels = en ? [['Body', 'Gateway'], ['Practice', 'Bridge'], ['Wild nature', 'Mirror']]
    : [['Tělo', 'Brána'], ['Praxe', 'Most'], ['Divoká příroda', 'Zrcadlo']];
  const choose = (index: number | null) => {
    setActive(index);
    host.current?.closest('.practice-anchors-layout')?.dispatchEvent(new CustomEvent(selectionEvent, { detail: index }));
  };

  useEffect(() => { choose(null); }, [lang]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const desktop = matchMedia('(min-width:900px)');
    const reduced = matchMedia('(prefers-reduced-motion:reduce)');
    let frame = 0, visible = true, disposed = false;
    const paint = () => {
      frame = 0;
      if (disposed || document.hidden) return;
      const moving = desktop.matches && !reduced.matches;
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
      element.style.setProperty('--d-practice-angle', `${moving ? progress * 360 : 0}deg`);
      element.dataset.motion = moving ? 'scroll' : 'static';
    };
    const queue = () => {
      if (!frame && visible && !disposed && !document.hidden && desktop.matches && !reduced.matches) frame = requestAnimationFrame(paint);
    };
    const preferenceChanged = () => { cancelAnimationFrame(frame); frame = 0; paint(); };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      element.dataset.inView = String(visible);
      if (visible) queue();
    }, { rootMargin: '15% 0px' });
    const resize = new ResizeObserver(queue);
    observer.observe(element); resize.observe(element);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', preferenceChanged);
    document.addEventListener('visibilitychange', preferenceChanged);
    desktop.addEventListener('change', preferenceChanged);
    reduced.addEventListener('change', preferenceChanged);
    paint();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
      window.removeEventListener('scroll', queue); window.removeEventListener('resize', preferenceChanged);
      document.removeEventListener('visibilitychange', preferenceChanged);
      desktop.removeEventListener('change', preferenceChanged); reduced.removeEventListener('change', preferenceChanged);
      element.style.removeProperty('--d-practice-angle'); delete element.dataset.motion; delete element.dataset.inView;
    };
  }, []);

  return <div ref={host} className="enso-anchors d-practice-diagram" data-active={active === null ? 'none' : active} role="group"
    aria-label={en ? 'Three equal anchors: Body as gateway, Practice as bridge, and Wild nature as mirror. The dot at their shared centre symbolizes presence.' : 'Tři rovnocenné kotvy: Tělo jako brána, Praxe jako most a Divoká příroda jako zrcadlo. Bod ve společném středu symbolizuje přítomnost.'}
    onKeyDown={event => { if (event.key === 'Escape' && active !== null) { event.preventDefault(); choose(null); } }}>
    <div className="d-practice-art" aria-hidden="true"><ThreeAnchorsArtwork lang={lang}/></div>
    <div className="d-practice-anchor-rotor">
      <svg className="d-practice-pigment" viewBox="0 0 1254 1254" fill="none" aria-hidden="true" focusable="false">
        <defs><mask id={mask} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><image href="/media/final-v9-13/anchors-strokes.png" width="1254" height="1254"/></mask></defs>
        <g mask={`url(#${mask})`} stroke="currentColor" strokeWidth="115" strokeLinecap="round">{outlineHalves.map((paths, index) => <g key={index} className="d-practice-ring" data-active={active === index}>{paths.map((d, side) => <path key={side} d={d}/>)}</g>)}</g>
      </svg>
      {labels.map(([title, role], index) => <button type="button" key={anchorNames[index]} className={`d-practice-anchor-button d-practice-anchor-button--${anchorNames[index]}`}
        data-anchor={anchorNames[index]} aria-controls={copyId(index)} aria-pressed={active === index} onClick={() => choose(active === index ? null : index)}>
        <strong>{index === 2 ? <>{en ? 'Wild' : 'Divoká'}<br/>{en ? 'nature' : 'příroda'}</> : title}</strong><small>{role}</small>
      </button>)}
    </div>
  </div>;
}

/** The original articles remain readable, unmodified children. Selection only
 * links a diagram button to its matching paragraph and existing line icon. */
export function DesktopPracticeCopy({ children, lang }: { children: ReactNode; lang: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    const layout = host.current?.closest('.practice-anchors-layout');
    const onSelect = (event: Event) => {
      const value = (event as CustomEvent<number | null>).detail;
      setActive(value === null || Number.isInteger(value) && value >= 0 && value < 3 ? value : null);
    };
    layout?.addEventListener(selectionEvent, onSelect);
    return () => layout?.removeEventListener(selectionEvent, onSelect);
  }, []);
  useEffect(() => { setActive(null); }, [lang]);
  return <div ref={host} className="d-practice-copy">{Children.toArray(children).map((child, index) => <div key={anchorNames[index] || index}
    className="d-practice-copy-row" id={copyId(index)} data-anchor={anchorNames[index]} data-active={active === index}>
    <span className="d-practice-copy-icon" aria-hidden="true"><MobileAnchorIcon kind={index}/></span>{child}
  </div>)}</div>;
}

/** The approved mobile outline, with the same precise dark-earth pigment. */
export function DesktopPracticeHeroArt() {
  return <div className="d-practice-hero-art" aria-hidden="true"><MobileVajraBell/></div>;
}
