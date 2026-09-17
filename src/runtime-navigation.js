import { HASH_ALIASES, LANGS, ORIGIN, matchPath, routePath } from './site.js';
import { jsonLd, pageMetadata } from './page-metadata.js';

/** Location, including an unknown address, owns its language. */
export function resolveLocation(pathname, hash = '') {
  const lang = /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'cs';
  const legacy = hash.match(/^#\/([^/?#]*)/);
  if (legacy) {
    const target = Object.prototype.hasOwnProperty.call(HASH_ALIASES, legacy[1]) ? HASH_ALIASES[legacy[1]] : null;
    const route = target ? matchPath(routePath(target, lang)) : null;
    return route || { routeId: 'notfound', lang, postId: null };
  }
  return matchPath(pathname) || { routeId: 'notfound', lang, postId: null };
}

export function syncRouteMetadata(doc, loc, pathname) {
  const page = pageMetadata(loc, pathname), lang = page.lang;
  const url = ORIGIN + page.path, image = ORIGIN + `/og/${page.ogSlug}-${lang}.jpg`;
  const put = (selector, tag, attributes) => {
    let element = doc.head.querySelector(selector);
    if (!element) { element = doc.createElement(tag); doc.head.append(element); }
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    return element;
  };
  const meta = (kind, key, content) => put(`meta[${kind}="${key}"]`, 'meta', { [kind]: key, content });
  doc.documentElement.lang = lang; doc.title = page.title;
  meta('name', 'tm-route', `${page.routeId}:${lang}${page.postId ? ':' + page.postId : ''}`);
  meta('name', 'description', page.description);
  put('link[rel="canonical"]', 'link', { rel:'canonical', href:url });
  for (const edition of [...LANGS, 'x-default']) {
    const hreflang = edition === 'cs' ? 'cs-CZ' : edition;
    put(`link[rel="alternate"][hreflang="${hreflang}"]`, 'link', { rel:'alternate', hreflang, href:ORIGIN + page.alternates[edition === 'x-default' ? 'cs' : edition] });
  }
  const og = { 'site_name':'tanmay', type:page.routeId === 'post' ? 'article' : 'website', locale:lang === 'cs' ? 'cs_CZ' : 'en_US', 'locale:alternate':lang === 'cs' ? 'en_US' : 'cs_CZ', url, title:page.title, description:page.description, image, 'image:width':'1200', 'image:height':'630', 'image:alt':page.title };
  for (const [key, value] of Object.entries(og)) meta('property', 'og:' + key, value);
  for (const [key, value] of Object.entries({ card:'summary_large_image', title:page.title, description:page.description, image })) meta('name', 'twitter:' + key, value);
  const structured = jsonLd(page), old = doc.head.querySelector('script[type="application/ld+json"]');
  if (structured) put('script[type="application/ld+json"]', 'script', { type:'application/ld+json' }).textContent = JSON.stringify(structured);
  else old?.remove();
  if (page.routeId === 'notfound') meta('name', 'robots', 'noindex,follow');
  else doc.head.querySelector('meta[name="robots"]')?.remove();
  const fonts = lang === 'cs' ? ['eb-garamond-400-normal.woff2', 'dm-sans-400-normal.woff2'] : ['cormorant-garamond-400-normal.woff2', 'dm-sans-400-normal.woff2'];
  const preloads = [...doc.head.querySelectorAll('link[rel="preload"][as="font"]')];
  fonts.forEach((font, index) => {
    const link = preloads[index] || doc.createElement('link');
    for (const [key,value] of Object.entries({ rel:'preload', as:'font', type:'font/woff2', href:'/fonts/' + font, crossorigin:'' })) link.setAttribute(key,value);
    if (!link.isConnected) doc.head.append(link);
  });
  preloads.slice(fonts.length).forEach(link => link.remove());
}

/** Focus new content after a menu finishes closing; preserve the scroll position. */
export function scheduleRouteFocus(doc, win) {
  let frame = 0, observer;
  const focus = () => {
    frame = win.requestAnimationFrame(() => {
      const target = doc.querySelector('main h1') || doc.querySelector('main');
      if (!target) return;
      const added = !target.hasAttribute('tabindex');
      if (added) target.setAttribute('tabindex','-1');
      target.focus({ preventScroll:true });
      if (added) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once:true });
    });
  };
  if (doc.querySelector('dialog[open]')) {
    observer = new win.MutationObserver(() => {
      if (!doc.querySelector('dialog[open]')) { observer.disconnect(); focus(); }
    });
    observer.observe(doc.body, { subtree:true, childList:true, attributes:true, attributeFilter:['open'] });
  } else focus();
  return () => { win.cancelAnimationFrame(frame); observer?.disconnect(); };
}
