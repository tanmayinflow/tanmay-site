import test from 'node:test';
import {mobileDelta,withoutAuthorizedMobileFeedback} from './owner-mobile-preview-authorized-2026-10-29.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {feedbackDelta,withoutAuthorizedFeedback} from './owner-preview-feedback-authorized-2026-10-29.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
test('18-annotation scope restores published previews and rejects any extra source drift',()=>{
 assert.equal(feedbackDelta.baselineCommit,'55060a1940b710a17af65af7ae9f043d7905feff');
 for(const f of feedbackDelta.files){assert.equal(sha(withoutAuthorizedFeedback(f.path,read(f.path))),f.beforeSha256);assert.throws(()=>withoutAuthorizedFeedback(f.path,Buffer.concat([read(f.path),Buffer.from(' ')])));}
 for(const f of feedbackDelta.newFiles)assert.equal(sha(withoutAuthorizedMobileFeedback(f.path,read(f.path))),f.sha256,f.path);
});
test('nine mobile annotations reverse to the reviewed preview and reject extra drift',()=>{
 assert.equal(mobileDelta.baselineCommit,'088ed5a975c4d78dd93952e531cbc3a2fa0a474c');
 for(const f of mobileDelta.files){assert.equal(sha(withoutAuthorizedMobileFeedback(f.path,read(f.path))),f.beforeSha256);assert.throws(()=>withoutAuthorizedMobileFeedback(f.path,Buffer.concat([read(f.path),Buffer.from(' ')])));}
});
