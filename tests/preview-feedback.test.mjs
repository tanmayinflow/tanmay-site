import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {feedbackDelta,withoutAuthorizedFeedback} from './owner-preview-feedback-authorized-2026-10-29.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
test('18-annotation scope restores published previews and rejects any extra source drift',()=>{
 assert.equal(feedbackDelta.baselineCommit,'55060a1940b710a17af65af7ae9f043d7905feff');
 for(const f of feedbackDelta.files){assert.equal(sha(withoutAuthorizedFeedback(f.path,read(f.path))),f.beforeSha256);assert.throws(()=>withoutAuthorizedFeedback(f.path,Buffer.concat([read(f.path),Buffer.from(' ')])));}
 for(const f of feedbackDelta.newFiles)assert.equal(sha(read(f.path)),f.sha256,f.path);
});
