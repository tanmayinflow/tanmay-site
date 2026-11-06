import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spacingDelta,withoutAuthorizedSpacing} from './offer-spacing-authorized-2026-11-06.mjs';
test('offer spacing annotations restore the published source exactly and reject unrelated changes',()=>{
 assert.deepEqual(spacingDelta.files.map(f=>f.path).sort(),['src/mobile/PreviewMotion.tsx','src/preview-v3.css'].sort());
 for(const file of spacingDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedSpacing(file.path,bytes);
  assert.throws(()=>withoutAuthorizedSpacing(file.path,Buffer.concat([bytes,Buffer.from('\n// unrelated change')])));
 }
});
