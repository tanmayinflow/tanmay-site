/** WebKit can execute a module before the document's stylesheet finishes loading.
 * Layout effects must never freeze measurements of that unstyled document.
 * Wait only for CSS, not photographs or web fonts. Cached CSS is synchronous.
 */
export function stylesReady():Promise<void> {
  const links=Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  return Promise.all(links.map(link=>new Promise<void>(resolve=>{
    if(link.sheet||link.disabled||document.readyState==='complete'){resolve();return;}
    const finish=()=>{
      link.removeEventListener('load',finish);link.removeEventListener('error',finish);
      window.removeEventListener('load',finish);resolve();
    };
    link.addEventListener('load',finish);link.addEventListener('error',finish);
    // Also covers a failed stylesheet whose error preceded module execution.
    window.addEventListener('load',finish);
  }))).then(()=>{});
}
