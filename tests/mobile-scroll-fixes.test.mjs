import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {scrollDelta,withoutAuthorizedScrollFixes} from './owner-mobile-scroll-fixes-2026-11-04.mjs';
test('five mobile corrections restore the reviewed proposal and reject extra drift',()=>{
 assert.equal(scrollDelta.baselineCommit,'2330b689e33487a50a7e9eb185b7748dd3121994');
 for(const f of scrollDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(createHash('sha256').update(withoutAuthorizedScrollFixes(f.path,bytes)).digest('hex'),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedScrollFixes(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
