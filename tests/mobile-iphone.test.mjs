import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {phoneDelta,withoutAuthorizedPhone} from './owner-mobile-iphone-2026-11-04.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('iPhone mobile refinements restore the prior approved source and reject unrelated drift',()=>{
 assert.equal(phoneDelta.baselineCommit,'1255102fbb29afd70a5aa8cf74188476aa1ce574');
 for(const f of phoneDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(sha(withoutAuthorizedPhone(f.path,bytes)),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedPhone(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
