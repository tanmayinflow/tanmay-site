import {restoreReview16IfCurrent} from './owner-mobile-review-16-2026-11-04.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const scrollDelta=JSON.parse(readFileSync(new URL('./owner-mobile-scroll-fixes-2026-11-04.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedScrollFixes(path,bytes){
 bytes=restoreReview16IfCurrent(path,bytes);
 const file=scrollDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact owner mobile scroll corrections: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Previous mobile proposal restored: '+path);
 return value;
}
