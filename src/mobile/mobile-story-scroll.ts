import { useEffect, type RefObject } from 'react';
import { attachStoryPageScroll } from '../components/story-page-scroll';
import { createStableStoryViewport } from './mobile-story-viewport';

/** Both directions use the same native page runway, regardless of pointer position. */
export function useMobileStoryScroll(root:RefObject<HTMLDivElement>,pageKey:string) {
  useEffect(()=>{
    const story=root.current?.querySelector<HTMLElement>('.m-story-timeline');
    const reader=story?.querySelector<HTMLElement>('.m-story-scroll');
    const runway=story?.closest<HTMLElement>('.m-story-runway');
    if(!story||!reader||!runway)return;
    const viewport=createStableStoryViewport(story);
    const detach=attachStoryPageScroll(story,reader,runway,{mobile:true,viewport:viewport.measure});
    return()=>{detach();viewport.cleanup();};
  },[root,pageKey]);
}
