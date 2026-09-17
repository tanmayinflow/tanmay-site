import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { allPages, matchPath, HASH_ALIASES, POST_ROUTES } from '../src/site.js';
import { resolveLocation } from '../src/runtime-navigation.js';
import { jsonLd, pageMetadata } from '../src/page-metadata.js';
import { runtimeDelta, authorizedWorkingBytes, verifyNewRuntimeFiles } from './runtime-authorized-deltas-m10.mjs';

test('unpublished journal cannot be reached by route, post, or legacy hash',()=>{
 assert.equal(allPages().length,10);assert.deepEqual(POST_ROUTES,[]);
 for(const path of ['/denik','/en/journal','/denik/les-nehodnoti','/en/journal/the-forest-does-not-judge'])assert.equal(matchPath(path),null);
 for(const hash of ['#/denik','#/zapisky','#/unknown','#/constructor','#/Praxe','#/praxe-extra'])assert.equal(resolveLocation('/',hash).routeId,'notfound');
 for(const id of Object.values(HASH_ALIASES))assert.ok(allPages().some(p=>p.routeId===id));
 assert.equal(resolveLocation('/','#/praxe').routeId,'praxe');assert.equal(resolveLocation('/en/','#/pribeh').lang,'en');
 const redirects=readFileSync(new URL('../public/_redirects',import.meta.url),'utf8');
 for(const line of redirects.split('\n').filter(l=>l.trim()&&!l.startsWith('#')))assert.ok(matchPath(line.trim().split(/\s+/)[1]),'Redirect must have a published destination: '+line);
});

test('unknown English and Czech locations retain their URL language',()=>{
 for(const [url,lang] of [['/missing','cs'],['/en/missing','en'],['/english/missing','cs'],['/en','en']]){
  const location=resolveLocation(url);assert.equal(location.lang,lang);
  if(url!='/en')assert.equal(location.routeId,'notfound');
 }
 assert.deepEqual(resolveLocation('/en/','#/denik'),{routeId:'notfound',lang:'en',postId:null});
});

test('runtime route metadata and generated direct documents share structured data',()=>{
 for(const page of allPages()){
  const runtime=pageMetadata({routeId:page.routeId,lang:page.lang,postId:page.postId},page.path);
  assert.deepEqual(runtime,page);
  const relative=page.path==='/'?'index.html':page.path.replace(/^\//,'').replace(/\/$/,'')+'/index.html';
  const html=readFileSync(new URL('../dist/'+relative,import.meta.url),'utf8');
  const ld=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.deepEqual(ld?JSON.parse(ld[1]):null,jsonLd(runtime));
  assert.ok(html.includes('href="https://tanmaypractice.com'+page.alternates.en+'"'));
  assert.ok(html.includes('content="https://tanmaypractice.com/og/'+page.ogSlug+'-'+page.lang+'.jpg"'));
 }
});

test('M10 runtime repairs and new helper modules match only their exact authorized deltas',()=>{
 verifyNewRuntimeFiles(new URL('../',import.meta.url));
 const source=new URL('../scripts/postbuild.mjs',import.meta.url);
 const baseline=readFileSync(new URL('./fixtures/desktop-v922/baseline/scripts/postbuild.mjs',import.meta.url));
 assert.deepEqual(readFileSync(source),authorizedWorkingBytes('scripts/postbuild.mjs',baseline));
 for(const file of runtimeDelta.newFiles)assert.equal(createHash('sha256').update(readFileSync(new URL('../'+file.path,import.meta.url))).digest('hex'),file.sha256);
});
