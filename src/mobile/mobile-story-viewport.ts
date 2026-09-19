/** Keep the Story's reading and photo slots independent of mobile browser bars.
 * As with the hero, only a full-width top-level touch window is locked; desktop
 * windows, split panes and preview frames continue to resize normally. */
export function createStableStoryViewport(host:HTMLElement) {
  const probe=document.createElement('div');
  probe.style.cssText='position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none;contain:strict';
  if(!CSS.supports('height','100svh'))probe.style.height='100vh';
  host.append(probe);
  const property='--story-viewport-height';
  const saved=host.style.getPropertyValue(property),priority=host.style.getPropertyPriority(property);
  const marker=host.getAttribute('data-story-viewport');
  let key='',height=0;
  const clear=()=>{if(saved)host.style.setProperty(property,saved,priority);else host.style.removeProperty(property);};
  const measure=()=>{
    const width=document.documentElement.clientWidth;
    const orientation=screen.orientation?.type||(width>innerHeight?'landscape':'portrait');
    const shortSide=Math.min(screen.width,screen.height),longSide=Math.max(screen.width,screen.height);
    const screenWidth=orientation.startsWith('landscape')?longSide:shortSide;
    const locked=self===top&&matchMedia('(pointer:coarse)').matches&&Math.abs(width-screenWidth)<=2&&screenWidth>0;
    if(!locked){if(key){key='';clear();}host.dataset.storyViewport='window';return;}
    // Height-only browser changes never replace this orientation's pixel basis.
    const nextKey=[width,orientation].join(':');
    if(key!==nextKey){
      const visible=(visualViewport?.scale||1)<=1.01?(visualViewport?.height||innerHeight):innerHeight;
      height=Math.min(probe.getBoundingClientRect().height||innerHeight,innerHeight,visible);
      host.style.setProperty(property,height+'px');host.dataset.storyViewport='locked';key=nextKey;
    }
    const dock=host.closest('.tm-mobile')?.querySelector<HTMLElement>('.m-dock')?.getBoundingClientRect();
    const actualBottom=(visualViewport?.offsetTop||0)+(visualViewport?.height||innerHeight);
    const inset=dock&&dock.height>0?Math.max(0,actualBottom-dock.top)+12:16;
    return {top:0,height,bottom:height-inset};
  };
  const cleanup=()=>{probe.remove();clear();if(marker!==null)host.setAttribute('data-story-viewport',marker);else delete host.dataset.storyViewport;};
  return {measure,cleanup};
}
