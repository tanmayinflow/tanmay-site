import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {handstandStabilityDelta,withoutAuthorizedHandstandStability} from './handstand-stability-authorized-2026-11-09.mjs';
test('stable iPhone handstand repair restores the prior approved runtime byte-for-byte',()=>{
 assert.match(handstandStabilityDelta.baseline,/^e888822/);
 assert.deepEqual(handstandStabilityDelta.files.map(f=>f.path),['src/mobile/preview-mobile-scroll.ts']);
 for(const file of handstandStabilityDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedHandstandStability(file.path,bytes);
  assert.throws(()=>withoutAuthorizedHandstandStability(file.path,Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')])));
 }
});
