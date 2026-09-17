import { useLayoutEffect, type RefObject } from 'react';

/** Browser chrome must not resize a portrait after the visitor starts scrolling. */
export function useStableHeroViewport(hero:RefObject<HTMLElement>) {
  useLayoutEffect(()=>{
    const el=hero.current;if(!el)return;
    const probe=document.createElement('div');
    probe.style.cssText='position:fixed;left:0;top:0;width:0;height:100vh;visibility:hidden;pointer-events:none;contain:strict';
    if(CSS.supports('height','100lvh'))probe.style.height='100lvh';
    el.append(probe);
    let previousWidth=-1,previousOrientation='',screenLocked=false,frame=0;
    const measure=()=>{
      const width=document.documentElement.clientWidth;
      const orientation=screen.orientation?.type||(width>innerHeight?'landscape':'portrait');
      // An actual phone can report a new layout height as its browser bars hide.
      // Width/orientation still reflow normally. Preview frames resize normally.
      if(screenLocked&&width===previousWidth&&orientation===previousOrientation)return;
      let height=Math.max(probe.getBoundingClientRect().height,innerHeight);
      const topLevel=window.self===window.top;
      const touch=matchMedia('(pointer:coarse)').matches;
      const shortSide=Math.min(screen.width,screen.height),longSide=Math.max(screen.width,screen.height);
      const landscape=orientation.startsWith('landscape');
      const screenWidth=landscape?longSide:shortSide,screenHeight=landscape?shortSide:longSide;
      // Use the full logical phone screen only in a full-width touch window.
      // This excludes desktop windows, preview iframes and tablet split panes.
      screenLocked=topLevel&&touch&&Math.abs(width-screenWidth)<=2&&screenHeight>0;
      if(screenLocked)height=Math.max(height,screenHeight);
      const header=el.closest('.tm-mobile')?.querySelector<HTMLElement>('.m-header');
      const headerHeight=header?.offsetHeight||58;
      el.style.setProperty('--m-screen',`${Math.round(height)}px`);
      el.style.setProperty('--m-hero-header-height',`${headerHeight}px`);
      el.dataset.viewportSizing=screenLocked?'screen-locked':'window';
      previousWidth=width;previousOrientation=orientation;
    };
    const queue=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    measure();
    window.addEventListener('resize',queue);
    screen.orientation?.addEventListener('change',queue);
    // Older iOS exposes orientationchange but no ScreenOrientation events.
    window.addEventListener('orientationchange',queue);
    return()=>{
      cancelAnimationFrame(frame);window.removeEventListener('resize',queue);
      screen.orientation?.removeEventListener('change',queue);
      window.removeEventListener('orientationchange',queue);probe.remove();
      el.style.removeProperty('--m-screen');el.style.removeProperty('--m-hero-header-height');
      delete el.dataset.viewportSizing;
    };
  },[hero]);
}
