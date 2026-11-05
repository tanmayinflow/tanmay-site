import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {finalDelta,withoutAuthorizedFinal} from './owner-mobile-final-2026-11-05.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('Nineteen mobile annotations and owner layout preserve the reviewed source baseline',()=>{
 assert.equal(finalDelta.baselineCommit,'a443c2e57f469b51423349d39d6149f6051602f3');
 for(const f of finalDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(sha(withoutAuthorizedFinal(f.path,bytes)),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedFinal(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
