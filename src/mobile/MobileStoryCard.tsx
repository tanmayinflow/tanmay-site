import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { DisclosureMark } from './MobileFigureDisclosure';

/** A compact mobile invitation opens the complete original text in the top layer. */
export function StoryCard({title,preview,children,lang,className='',label}: {title:string;preview?:ReactNode;children:ReactNode;lang:string;className?:string;label?:string}) {
  const [open,setOpen]=useState(false);
  const [visible,setVisible]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const timer=useRef<number>();
  const closing=useRef(false);
  const id=useId();
  const lastSpace=title.lastIndexOf(' ');
  const finish=useCallback(()=>{closing.current=false;clearTimeout(timer.current);dialog.current?.close();setOpen(false);setVisible(false);trigger.current?.focus({preventScroll:true});},[]);
  const close=useCallback(()=>{
    if(!dialog.current?.open)return;
    closing.current=true;clearTimeout(timer.current);setVisible(false);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)finish();
    else timer.current=window.setTimeout(finish,260);
  },[finish]);
  useEffect(()=>{
    if(!open)return;
    const el=dialog.current;if(!el)return;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';el.showModal();
    el.querySelector<HTMLButtonElement>('[data-story-close]')?.focus({preventScroll:true});
    let second=0;
    const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>setVisible(true));});
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const stop=()=>{if(preference.matches){if(closing.current)finish();else setVisible(true);}};
    preference.addEventListener('change',stop);
    return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);clearTimeout(timer.current);preference.removeEventListener('change',stop);el.close();document.body.style.overflow=overflow;};
  },[open,finish]);
  return <div className={'m-story-card '+className}>
    <button ref={trigger} type="button" className="m-story-trigger" aria-haspopup="dialog" aria-controls={id} aria-expanded={open} aria-label={label} onClick={()=>setOpen(true)}>
      <span className="m-story-title">{lastSpace<0?null:title.slice(0,lastSpace+1)}<span className="m-story-ending">{title.slice(lastSpace+1)}<DisclosureMark/></span></span>{preview&&<span className="m-story-preview">{preview}</span>}
    </button>
    <dialog ref={dialog} id={id} className="m-story-dialog" data-visible={visible} aria-labelledby={id+'-title'} onCancel={e=>{e.preventDefault();close();}} onClose={()=>{setOpen(false);setVisible(false);}} onClick={e=>{const sheet=e.currentTarget.querySelector('.m-story-sheet');if(sheet&&!sheet.contains(e.target as Node))close();}} onKeyDown={e=>{
      if(e.key!=='Tab')return;
      const stops=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
      const first=stops[0],last=stops[stops.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }}>
      <div className="m-story-sheet"><header className="m-story-head"><h3 id={id+'-title'}>{title}</h3><button type="button" data-story-close="" onClick={close} aria-label={lang==='en'?'Close':'Zavřít'}>×</button></header><div className="m-story-body" tabIndex={0}>{children}</div></div>
    </dialog>
  </div>;
}
