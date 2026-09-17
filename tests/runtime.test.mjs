import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { verifyApprovedMobileContent } from './desktop-authorized-deltas.mjs';
import { authorizedWorkingBytes, workingAuthorizedFiles } from './runtime-authorized-deltas-m10.mjs';
import { matchPath, otherLangPath, CLIENT_APP_URL, WHATSAPP_URL } from '../src/site.js';
const site=fileURLToPath(new URL('../',import.meta.url));
const fixtures=join(site,'tests/fixtures/desktop-v922');
const routes=[['home','/','/en/'],['spoluprace','/spoluprace','/en/work-with-me'],['praxe','/praxe','/en/practice'],['pribeh','/pribeh','/en/story'],['soukromi','/soukromi','/en/privacy']];
for(const [id,cs,en] of routes)for(const [lang,url,other] of [['cs',cs,en],['en',en,cs]])test(`${id} ${lang}: direct route, language and built metadata`,()=>{
  assert.equal(matchPath(url)?.routeId,id);assert.equal(matchPath(url)?.lang,lang);assert.equal(otherLangPath(id,lang),other);
  const html=readFileSync(join(site,'dist',url==='/'?'index.html':url.replace(/^\//,'').replace(/\/$/,'')+'/index.html'),'utf8');
  assert.ok(html.includes(`<html lang="${lang}">`));assert.ok(html.includes(`content="${id}:${lang}"`));assert.ok(html.includes(`rel="canonical" href="https://tanmaypractice.com${url}"`));
  assert.ok(html.includes('hreflang="cs-CZ"'));assert.ok(html.includes('hreflang="en"'));assert.ok(html.includes('@font-face'));
});
test('approved contact targets',()=>{assert.equal(CLIENT_APP_URL,'https://klient.tanmaypractice.com');assert.equal(WHATSAPP_URL,'https://wa.me/420774121475')});
test('journal not added to generated publication scope',()=>{const xml=readFileSync(join(site,'dist/sitemap.xml'),'utf8');assert.equal((xml.match(/<loc>/g)||[]).length,10);assert.ok(!/denik|journal/.test(xml));assert.ok(!existsSync(join(site,'dist/denik/index.html')))});
test('built public identity uses approved name and photograph',()=>{const html=readFileSync(join(site,'dist/index.html'),'utf8');const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);const person=ld['@graph'].find(e=>e['@type']==='Person');assert.equal(person.name,'Kryštof Švec');assert.ok(existsSync(join(site,'dist',new URL(person.image).pathname)));});
test('all nine restored fonts match source hashes',()=>{const entries=JSON.parse(readFileSync(join(fixtures,'local-font-restore-index.json'),'utf8'));assert.equal(entries.length,9);for(const r of entries){const data=readFileSync(join(site,r.path));assert.equal(createHash('sha256').update(data).digest('hex'),r.sha256,r.path)}});
test('all 327 original shared files remain exact except precisely authorized copy and M10 runtime deltas',()=>{
  const entries=JSON.parse(readFileSync(join(fixtures,'original-site-manifest.json'),'utf8')).filter(r=>(r.path.startsWith('src/')||r.path.startsWith('public/'))&&r.path!=='src/App.tsx');
  assert.equal(entries.length,327);
  for(const r of entries){
    const expected=workingAuthorizedFiles.includes(r.path)
      ?createHash('sha256').update(authorizedWorkingBytes(r.path,readFileSync(join(fixtures,'site',r.path)))).digest('hex')
      :r.sha256;
    assert.equal(createHash('sha256').update(readFileSync(join(site,r.path))).digest('hex'),expected,r.path);
  }
});

test('App preserves locked desktop source plus exact copy/runtime deltas behind the mobile adapter',()=>{
  const original=authorizedWorkingBytes('src/App.tsx',readFileSync(join(fixtures,'site/src/App.tsx'))).toString('utf8').replaceAll('\r\n','\n');
  const current=readFileSync(join(site,'src/App.tsx'),'utf8').replaceAll('\r\n','\n');
  const desktop=current
    .replace(/^import .* from "\.\/mobile\/.*";\n/gm,'')
    .replace('  const mobile = useMobileViewport();\n','')
    .replace(' + (mobile ? "mobile" : "desktop")','')
    .replace(/      \{mobile \? <MobileSite loc=\{loc\}>[\s\S]*?      <\/MobileSite> : <>\n/,'')
    .replace('      </>}\n','');
  assert.equal(desktop,original,'Only the isolated mobile adapter and explicitly recorded copy/runtime replacements may differ from locked App.');
});
test('approved bilingual mobile content differs from M8 only by the same two M9 meaning strings',()=>{
  verifyApprovedMobileContent(readFileSync(join(site,'src/mobile/approved-content.ts')));
});
test('unknown address resolves to no public route; built 404 exists',()=>{assert.equal(matchPath('/m00-unknown-page'),null);assert.ok(existsSync(join(site,'dist/404.html')))});
