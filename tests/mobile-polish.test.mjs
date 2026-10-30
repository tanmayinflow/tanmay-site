import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {polishDelta,withoutAuthorizedMobilePolish} from './owner-mobile-polish-authorized-2026-10-29.mjs';
test('four mobile refinements restore the reviewed source and reject extra drift',()=>{
 assert.equal(polishDelta.baselineCommit,'627c9793c89f5ac68be761f270082b989dbdf704');
 for(const f of polishDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(createHash('sha256').update(withoutAuthorizedMobilePolish(f.path,bytes)).digest('hex'),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedMobilePolish(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
