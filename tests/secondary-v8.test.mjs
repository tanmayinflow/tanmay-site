/** Approved V8 photos + completed V7 compositions. No production-build claim. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const app=readFileSync(resolve(ROOT,'src/App.tsx'),'utf8');
const part=(a,b)=>app.slice(app.indexOf('function '+a),app.indexOf('function '+b));
const praxe=part('PagePraxe','PagePribeh'),about=part('PagePribeh','PageSpoluprace'),collab=part('PageSpoluprace','PageDenik');
const data=JSON.parse(readFileSync(resolve(ROOT,'tests/fixtures/secondary-v8-assets.json'),'utf8'));
for(const x of data.assets)test('V8 · delivered asset intact: '+x.path,()=>{
 const file=resolve(ROOT,'public',x.path);assert.ok(existsSync(file));const b=readFileSync(file);
 assert.equal(b.length,x.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),x.sha256);
 if(file.endsWith('.svg')){const s=b.toString();assert.match(s,/<path/);assert.doesNotMatch(s,/<image|<script|data:|https?:\/\/(?!www\.w3\.org)/);}
});
test('V8 · photos are not accidentally reused on Home or About',()=>{
 assert.doesNotMatch(about,/collaboration-hero-1086|practice-pines-hero-1080/);
 assert.equal((praxe.match(/<SecondaryHeroPhoto/g)||[]).length,1);
 assert.equal((collab.match(/<SecondaryHeroPhoto/g)||[]).length,1);
 assert.doesNotMatch(praxe,/MEDIA\.handstand|practice-handstand-trunk/);
});
test('V8 · both replacement photos have three real width candidates',()=>{
 for(const str of [praxe,collab]){assert.match(str,/540w/);assert.match(str,/720w/);assert.match(str,/108[06]w/);}
});
test('V8 · figure error state is keyed to source without mount-reset race',()=>{
 const h=part('SecondaryHeroPhoto','SecondaryMaterialMask');
 assert.match(h,/failedSrc === src/);assert.match(h,/if \(gone\) return null/);
 assert.doesNotMatch(h,/useEffect\(\(\) => setGone\(false\)/);
});
test('V8 · one intended place for each decorative design',()=>{
 for(const name of ['m01.svg','m01-m.svg'])assert.ok(collab.includes(name));
 assert.match(praxe,/<SecondaryTransition kind="practice"/);assert.match(about,/<SecondaryTransition kind="story"/);
 assert.match(praxe,/<SecondaryTerrain kind="l02"/);assert.match(collab,/<SecondaryTerrain kind="l01"/);
 assert.match(about,/<SecondaryHeroPhoto material/);
});
test('V8 · collaboration final contact is light',()=>assert.match(collab,/site-linen contact-coda" id="kontakt"/));
test('V8 · correct parallel-bar alt, never a bench',()=>{
 assert.match(collab,/černých bradlech/);assert.match(collab,/black parallel bars/);assert.doesNotMatch(collab,/lavičce|seated on a bench/);
});
test('V8 · the full pine image is not cut out or grayscale',()=>{
 assert.match(app,/\.practice-hero-photo img\{[^}]*object-fit:contain[^}]*filter:none[^}]*mask:none/);
 assert.match(praxe,/width=\{1080\} height=\{1070\}/);
});
test('V8 · masks load before applying and are non-interactive',()=>{
 assert.match(part('SecondaryMaterialMask','SecondaryTransition'),/if \(!ready\) return null/);
 assert.match(app,/\.v8-art\{[^}]*pointer-events:none/);
});
