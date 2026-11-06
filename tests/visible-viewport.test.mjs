import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {viewportDelta,withoutAuthorizedViewport} from './visible-viewport-authorized-2026-11-06.mjs';
test('visible-viewport repair only changes three runtime controllers and restores the prior release exactly',()=>{
 assert.deepEqual(viewportDelta.files.map(f=>f.path).sort(),[
  'src/components/story-page-scroll.ts','src/mobile/mobile-story-viewport.ts','src/mobile/preview-mobile-scroll.ts'
 ].sort());
 for(const file of viewportDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedViewport(file.path,bytes);
  assert.throws(()=>withoutAuthorizedViewport(file.path,Buffer.concat([bytes,Buffer.from('\n// unrelated drift')])));
 }
});
