import assert from 'node:assert/strict';
import {withoutAuthorizedMobileFeedback} from './owner-mobile-preview-authorized-2026-10-29.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const feedbackDelta=JSON.parse(readFileSync(new URL('./owner-preview-feedback-authorized-2026-10-29.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedFeedback(path,bytes){
 const file=feedbackDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 bytes=withoutAuthorizedMobileFeedback(path,bytes);
 assert.equal(sha(bytes),file.afterSha256,'Exact owner feedback scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published preview restored byte-for-byte: '+path);
 return value;
}
