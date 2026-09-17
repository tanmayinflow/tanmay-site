import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createPreviewServer } from '../scripts/preview-built.mjs';

test('local preview serves generated metadata for every direct route, with or without trailing slash',async()=>{
 const server=createPreviewServer(fileURLToPath(new URL('../dist/',import.meta.url)));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const base='http://127.0.0.1:'+server.address().port;
  for(const [lang,paths] of [['cs',['/','/spoluprace','/praxe','/pribeh','/soukromi']],['en',['/en/','/en/work-with-me','/en/practice','/en/story','/en/privacy']]])for(const path of paths)for(const slash of ['', '/']){
   const url=path.replace(/\/$/,'')+slash||'/';
   const response=await fetch(base+url);assert.equal(response.status,200,url);
   const html=await response.text();assert.ok(html.includes('<html lang="'+lang+'">'),url);assert.ok(html.includes('name="tm-route"'),url);
  }
  const missing=await fetch(base+'/unknown-preview-page');assert.equal(missing.status,404);
  const head=await fetch(base+'/en/practice',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }finally{await new Promise(resolve=>server.close(resolve));}
});
