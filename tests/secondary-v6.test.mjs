/** V6.1 source/asset gate. Complements, does not replace, the production
 * build, existing tests or browser review. Home is intentionally locked.
 * Updating this snapshot requires an explicit approved change of scope.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const F=JSON.parse(readFileSync(resolve(ROOT,'tests/fixtures/secondary-v6-baseline.json'),'utf8'));
const APP=readFileSync(resolve(ROOT,'src/App.tsx'),'utf8').replace(/\r\n/g,'\n');
const sha=b=>createHash('sha256').update(b).digest('hex');
const part=(name,next)=>APP.slice(APP.indexOf('function '+name+'('),APP.indexOf('function '+next+'('));
const practice=part('PagePraxe','PagePribeh'),about=part('PagePribeh','PageSpoluprace'),collab=part('PageSpoluprace','PageDenik');
const home=APP.slice(APP.indexOf('// HOME\n'),APP.indexOf('// SECONDARY MEDIA · V6.1')).trim();

test('V6 · locked Home block is identical to the supplied baseline',()=>assert.equal(sha(home),F.homeBlockSha256));
test('V6 · no illustration or V6 opt-in enters Home',()=>assert.doesNotMatch(home,/data-secondary-v6|SecondaryIllustration|atlas-squat|atlas-one-arm/));
test('V6 · Home footer remains sand and has no secondary attribute',()=>{
 assert.match(APP,/<Footer lang=\{lang\} variant=\{loc.routeId === "home" \? "sand" : "linen"\}/);
 assert.match(APP,/data-secondary-v6=\{variant === "sand" \? undefined : ""\}/);
});
for(const [path,want] of Object.entries(F.protected)) test('V6 · protected file unchanged: '+path,()=>{
 let b=readFileSync(resolve(ROOT,path));
 // ZIP baseline uses LF; allow a Windows checkout's CRLF for text files.
 if(/\.(tsx?|js|mjs|json|html|md)$/.test(path)||path.endsWith('_redirects')) b=Buffer.from(b.toString('utf8').replace(/\r\n/g,'\n'));
 assert.equal(sha(b),want);
});
test('V6 · paper uses the actual Home tile at 384px',()=>{
 assert.match(APP,/--secondary-paper-image:var\(--tex-sand\)/);assert.match(APP,/background-size:384px 384px/);
});
test('V6 · ashes uses the actual Home tile at 512px',()=>{
 assert.match(APP,/--secondary-ashes-image:var\(--tex-cotton\)/);assert.match(APP,/background-size:512px 512px/);
});
test('V6 · Home sand loading condition remains unchanged',()=>assert.match(APP,/useAsset\(MEDIA.texSandstone, r === "home"\)/));
test('V6 · secondary material edge uses the same strata mask',()=>assert.match(APP,/\[data-secondary-v6\] \.material-edge\{\s*-webkit-mask-image:var\(--strata\);mask-image:var\(--strata\)/));
test('V6 · secondary edge does not float inside section padding',()=>assert.match(APP,/:has\(> \.material-edge\)\{padding-top:0\}/));
test('V6 · drep appears once and only on Spoluprace',()=>{
 assert.equal((APP.match(/src="\/media\/illustration\/atlas-squat.webp"/g)||[]).length,1);assert.match(collab,/atlas-squat.webp/);assert.doesNotMatch(practice,/atlas-squat/);
});
test('V6 · one-arm handstand replaces the duplicate Praxe photograph',()=>{
 assert.match(practice,/atlas-one-arm-handstand.webp/);assert.equal((practice.match(/MEDIA\.handstand/g)||[]).length,1);assert.doesNotMatch(practice,/practice-work-cutout/);
});
test('V6 · Praxe hero is eager and opts into the existing mask',()=>assert.match(practice,/variant="tall" eager ap/));
test('V6 · pine is decorative and restricted to About approach',()=>{
 assert.match(about,/illustration-pine.webp[\s\S]{0,190}decorative/);assert.match(about,/about-approach/);assert.equal((APP.match(/src="\/media\/illustration\/illustration-pine.webp"/g)||[]).length,1);
});
test('V6 · About has one real portrait, no handstand',()=>{
 assert.equal((about.match(/<SecondaryHeroPhoto/g)||[]).length,1);assert.doesNotMatch(about,/MEDIA\.handstand|cutout-bw/);
});
test('V6 · existing real photos and their localized alternatives are preserved',()=>{
 assert.match(about,/about-portrait-sunset.jpg/);assert.match(collab,/collaboration-hero-cutout.png/);
 assert.match(collab,/Kryštof Švec seated on a bench beside parallettes/);
});
test('V6 · exactly three timeline points',()=>assert.equal((about.match(/<SecondaryStoryPoint \/>/g)||[]).length,3));
test('V6 · only one workflow loop, on Spoluprace',()=>{
 assert.equal((APP.match(/<SecondaryPracticeLoop \/>/g)||[]).length,1);assert.match(collab,/<SecondaryPracticeLoop/);
});
test('V6 · new images collapse the whole figure on error',()=>{
 for(const [name,next] of [['SecondaryIllustration','SecondaryHeroPhoto'],['SecondaryHeroPhoto','SecondaryStoryPoint']]){
  const p=part(name,next);assert.match(p,/if \(gone\) return null/);assert.match(p,/onError=\{\(\) => setGone\(true\)\}/);
 }
 assert.match(APP,/:has\(> \.secondary-illustration\)/);assert.match(APP,/\.page-hero-grid:has\(> figure\)/);
});
test('V6 · no reserve notebook/cairn/ring illustration is added',()=>assert.doesNotMatch(practice+about+collab,/illustration-notebook|illustration-cairn|atlas-ringsupport|cutout-training-bw/));
test('V6 · new diagram has no SVG text',()=>assert.doesNotMatch(part('SecondaryPracticeLoop','PagePraxe'),/<text/));
test('V6 · reduced-motion override is scoped and makes the loop static',()=>{
 assert.match(APP,/\[data-secondary-v6\] \.rv\{opacity:1;transform:none;transition:none\}/);
 assert.match(APP,/\[data-secondary-v6\] \.secondary-loop-track\{animation:none!important/);
});

function webpInfo(buffer){
 assert.equal(buffer.toString('ascii',0,4),'RIFF');assert.equal(buffer.toString('ascii',8,12),'WEBP');
 for(let i=12;i+8<buffer.length;){
  const type=buffer.toString('ascii',i,i+4),size=buffer.readUInt32LE(i+4),p=i+8;
  if(type==='VP8L'){
   assert.equal(buffer[p],0x2f);const bits=buffer.readUInt32LE(p+1);
   return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1,alpha:!!((bits>>>28)&1)};
  }
  i+=8+size+(size%2);
 }
 throw Error('Expected lossless VP8L WebP');
}
for(const [name,m] of Object.entries(F.illustrations))test('V6 · asset bytes/dimensions/alpha/budget: '+name,()=>{
 const p=resolve(ROOT,'public/media/illustration',name);assert.ok(existsSync(p));const b=readFileSync(p),info=webpInfo(b);
 assert.equal(sha(b),m.sha256);assert.equal(info.width,m.width);assert.equal(info.height,m.height);assert.ok(info.alpha);
 assert.ok(b.length<260*1024);assert.equal(b.length,m.bytes);
});
test('V6 · exactly three selected illustrations in this baseline overlay',()=>{
 const names=readdirSync(resolve(ROOT,'public/media/illustration')).filter(n=>n.endsWith('.webp')).sort();
 assert.deepEqual(names,Object.keys(F.illustrations).sort());
});
