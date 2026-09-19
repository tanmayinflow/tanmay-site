import { useEffect, type RefObject } from 'react';
import { attachStoryPageScroll } from '../components/story-page-scroll';

/** Both directions use the same native page runway, regardless of pointer position. */
export function useMobileStoryScroll(root:RefObject<HTMLDivElement>,pageKey:string) {
  useEffect(()=>{
    const story=root.current?.querySelector<HTMLElement>('.m-story-timeline');
    const reader=story?.querySelector<HTMLElement>('.m-story-scroll');
    const runway=story?.closest<HTMLElement>('.m-story-runway');
    if(!story||!reader||!runway)return;
    return attachStoryPageScroll(story,reader,runway,{mobile:true});
  },[root,pageKey]);
}
