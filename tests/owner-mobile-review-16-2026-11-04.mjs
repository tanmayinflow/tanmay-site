import {restoreProcessIfCurrent} from './owner-mobile-process-2026-11-04.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const reviewDelta=JSON.parse(readFileSync(new URL('./owner-mobile-review-16-2026-11-04.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedReview16(path,bytes){
 bytes=restoreProcessIfCurrent(path,bytes);
 const file=reviewDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact sixteen-annotation mobile scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Previous preview restored: '+path);
 return value;
}
// Older guard chains also receive already-restored historical bytes.
export function restoreReview16IfCurrent(path,bytes){
 bytes=restoreProcessIfCurrent(path,bytes);
 const file=reviewDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedReview16(path,bytes):bytes;
}
