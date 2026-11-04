import {withoutAuthorizedProcess} from './owner-mobile-process-2026-11-04.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {reviewDelta,withoutAuthorizedReview16} from './owner-mobile-review-16-2026-11-04.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('sixteen mobile annotations restore the reviewed source and reject extra drift',()=>{
 assert.equal(reviewDelta.baselineCommit,'05fbadb1c4a41b97754d664b724dd6663619a2da');
 for(const f of reviewDelta.files){const bytes=readFileSync(new URL('../'+f.path,import.meta.url));assert.equal(sha(withoutAuthorizedReview16(f.path,bytes)),f.beforeSha256);assert.throws(()=>withoutAuthorizedReview16(f.path,Buffer.concat([bytes,Buffer.from(' ')])));}
 for(const f of reviewDelta.newFiles)assert.equal(sha(withoutAuthorizedProcess(f.path,readFileSync(new URL('../'+f.path,import.meta.url)))),f.sha256,f.path);
});
