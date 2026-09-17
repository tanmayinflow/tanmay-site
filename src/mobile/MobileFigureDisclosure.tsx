import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type Item = { title: string; text: ReactNode };

/** A mobile illustration and its controls share one measured, interruptible description panel. */
export function useFigureDisclosure(items: Item[]) {
  const [selected, setSelected] = useState<number | null>(null);
  const last = useRef<number | null>(null);
  if (selected !== null) last.current = selected;
  const host = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation>();
  const id = useId();
  const choose = (index: number) => setSelected(current => current === index ? null : index);

  useLayoutEffect(() => {
    const el = panel.current, inner = content.current;
    if (!el || !inner) return;
    const start = el.getBoundingClientRect().height;
    motion.current?.cancel();
    const end = selected === null ? 0 : inner.getBoundingClientRect().height;
    el.style.height = `${end}px`;
    el.toggleAttribute('inert', selected === null);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(start-end)<1) {
      el.style.height = selected === null ? '0px' : 'auto';
      return;
    }
    const animation = el.animate([{height:`${start}px`},{height:`${end}px`}],{duration:280,easing:'cubic-bezier(.22,.68,.2,1)'});
    motion.current = animation;
    animation.onfinish = () => { if (motion.current === animation) el.style.height = selected === null ? '0px' : 'auto'; };
    return () => { animation.onfinish = null; };
  }, [selected]);
  useEffect(() => {
    const closeOutside = (e: MouseEvent) => { if (e.target instanceof Node && !host.current?.contains(e.target)) setSelected(null); };
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const stopMotion = () => { if (preference.matches && panel.current) { motion.current?.cancel(); panel.current.style.height = panel.current.getAttribute('aria-hidden') === 'true' ? '0px' : 'auto'; } };
    document.addEventListener('click', closeOutside);
    preference.addEventListener('change', stopMotion);
    return () => { document.removeEventListener('click', closeOutside); preference.removeEventListener('change', stopMotion); motion.current?.cancel(); };
  }, []);
  const description = <div ref={panel} className="m-figure-panel" id={id+'-panel'} role="region" aria-labelledby={selected === null ? undefined : id+'-'+selected} aria-hidden={selected===null}>
    <div ref={content} className="m-figure-panel-inner">{items.map((item,i)=><div key={i} hidden={last.current!==i}>{item.text}</div>)}</div>
  </div>;
  const buttonProps = (i:number) => ({id:id+'-'+i,type:'button' as const,'aria-expanded':selected===i,'aria-controls':id+'-panel',onClick:()=>choose(i)});
  const onKeyDown = (e:React.KeyboardEvent) => {
    if(e.key==='Escape'&&selected!==null){e.preventDefault();host.current?.querySelector<HTMLButtonElement>('[aria-expanded=true]')?.focus({preventScroll:true});setSelected(null);}
  };
  return {host,selected,buttonProps,description,onKeyDown};
}

export function DisclosureMark() {
  return <svg className="m-disclosure-mark" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 1.5 7 5 3 8.5Z" fill="currentColor"/></svg>;
}
