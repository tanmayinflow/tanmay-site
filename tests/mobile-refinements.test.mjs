import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {refinementsDelta,withoutAuthorizedRefinements} from './owner-mobile-refinements-2026-11-05.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('Seventeen mobile annotations restore the prior approved source and reject unrelated drift',()=>{
 assert.equal(refinementsDelta.baselineCommit,'94a81712956d54e9a227d91260fb256625bbf03b');
 for(const f of refinementsDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(sha(withoutAuthorizedRefinements(f.path,bytes)),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedRefinements(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
