import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {firstLoadDelta,withoutAuthorizedFirstLoad} from './first-load-authorized-2026-11-06.mjs';

test('cold-load fix is confined to seven runtime files and exactly restores the published source',()=>{
 assert.deepEqual(firstLoadDelta.files.map(f=>f.path).sort(),[
  'src/components/story-page-scroll.ts','src/main.tsx','src/mobile/MobileShared.tsx',
  'src/mobile/MobileSite.tsx','src/mobile/mobile-hero-viewport.ts',
  'src/mobile/preview-mobile-scroll.ts','src/styles-ready.ts'
 ].sort());
 for(const file of firstLoadDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedFirstLoad(file.path,bytes);
  assert.throws(()=>withoutAuthorizedFirstLoad(file.path,Buffer.concat([bytes,Buffer.from('\n// unrelated drift')])));
 }
});
