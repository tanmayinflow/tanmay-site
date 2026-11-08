import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {responsiveDelta,withoutAuthorizedResponsive} from './responsive-authorized-2026-11-08.mjs';
test('responsive completion preserves the published mobile baseline and original photo',()=>{
 assert.equal(responsiveDelta.baseline,'474534a79e9c442d31248c8f793345b8ae41710d');
 assert.deepEqual(responsiveDelta.files.map(f=>f.path).sort(),[
  'src/App.tsx','src/components/PreviewReading.tsx','src/mobile/useMobileBrowserTheme.ts',
  'src/desktop/ResponsiveHomeAbout.tsx','src/desktop/ResponsiveHomeProcess.tsx',
  'src/desktop/ResponsiveWork.tsx','src/desktop/responsive-hero.css',
  'src/desktop/responsive-home-practice.css','src/desktop/responsive-work-story.css',
  'src/desktop/responsive-accessibility.css'
 ].sort());
 for(const file of responsiveDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedResponsive(file.path,bytes);
  assert.throws(()=>withoutAuthorizedResponsive(file.path,Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')])));
 }
 const original=readFileSync(new URL('../public/media/practice-lsit-2026-11/praxe-original.jpg',import.meta.url));
 assert.equal(createHash('sha256').update(original).digest('hex'),'ddbc0c2ef6ca9a09583384dd6db84af78253ed45a15417e52e2d418b3516c902');
});
