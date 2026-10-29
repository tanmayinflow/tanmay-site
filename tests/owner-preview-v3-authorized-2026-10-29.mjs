import assert from 'node:assert/strict';
import {withoutAuthorizedFeedback} from './owner-preview-feedback-authorized-2026-10-29.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const previewDelta=JSON.parse(readFileSync(new URL('./owner-preview-v3-authorized-2026-10-29.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedPreview(path,bytes){
 const file=previewDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 bytes=withoutAuthorizedFeedback(path,bytes);
 assert.equal(sha(bytes),file.afterSha256,'Exact owner-authorized preview scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Original source restored byte-for-byte: '+path);
 return value;
}
