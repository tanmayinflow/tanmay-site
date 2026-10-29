import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { allPages, ROUTES, matchPath, otherLangPath } from '../src/site.js';
import { previewDelta, withoutAuthorizedPreview } from './owner-preview-v3-authorized-2026-10-29.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
test('preview scope reverses exactly and rejects drift, including newly copied components',()=>{
 assert.equal(previewDelta.baselineCommit,'40d90992f6ea0c65f5345d7e1a28661595fabb40');
 for(const file of previewDelta.files){const current=read(file.path);assert.equal(sha(withoutAuthorizedPreview(file.path,current)),file.beforeSha256);assert.throws(()=>withoutAuthorizedPreview(file.path,Buffer.concat([current,Buffer.from(' ')])));}
 for(const file of previewDelta.newFiles)assert.equal(sha(read(file.path)),file.sha256,file.path);
});
test('four independent previews are noindex, excluded from discovery, and language-paired',()=>{
 const previews=allPages().filter(p=>p.preview);assert.equal(previews.length,4);
 const sitemap=read('dist/sitemap.xml').toString(),robots=read('dist/robots.txt').toString();
 assert.equal((sitemap.match(/<loc>/g)||[]).length,10);assert.ok(!/nahled|preview/.test(sitemap));
 assert.equal(robots,'User-agent: *\nAllow: /\n\nSitemap: https://tanmaypractice.com/sitemap.xml\n');
 for(const p of previews){assert.equal(matchPath(p.path).routeId,p.routeId);assert.equal(ROUTES.find(r=>r.id===p.routeId).nav,false);assert.ok(previews.some(q=>q.path===otherLangPath(p.routeId,p.lang)));const html=read('dist/'+p.path.slice(1)+'/index.html').toString();assert.ok(html.includes('name="robots" content="noindex, nofollow"'));}
 for(const p of allPages().filter(p=>!p.preview)){const html=read('dist/'+(p.path==='/'?'':p.path.slice(1).replace(/\/$/,'')+'/')+'index.html').toString();assert.ok(!html.includes('noindex'));assert.ok(!/hreflang[^>]+(?:nahled|preview)/.test(html));}
});
test('public factual correction, education anchors and isolated preview styles',()=>{
 for(const p of ['src/App.tsx','src/mobile/approved-content.ts','src/mobile/preview-approved-content.ts','src/mobile/MobileShared.tsx','src/components/content-emphasis.tsx','src/site.js'])assert.ok(!read(p).toString().includes('150+'),p);
 for(const p of ['src/App.tsx','src/mobile/MobileAbout.tsx'])assert.ok(read(p).toString().includes('id="vzdelani"'),p);
 const css=read('src/preview-v3.css').toString();for(const rule of css.replace(/\/\*[\s\S]*?\*\//g,'').split('}')){const selector=rule.split('{').at(-2);if(selector&&!selector.trim().startsWith('@'))assert.ok(selector.includes('[data-preview="v3"]'),selector);}
});
