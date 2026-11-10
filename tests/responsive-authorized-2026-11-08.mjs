import {restoreDesktopReviewIfCurrent} from './desktop-review-authorized-2026-11-10.mjs';
import {restoreDesktopEdgesIfCurrent} from './desktop-edge-authorized-2026-11-09.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const responsiveDelta=JSON.parse(readFileSync(new URL('./responsive-authorized-2026-11-08.json',import.meta.url)));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function withoutAuthorizedResponsive(path,bytes){
 bytes=restoreDesktopReviewIfCurrent(path,bytes);
 bytes=restoreDesktopEdgesIfCurrent(path,bytes);
 const file=responsiveDelta.files.find(f=>f.path===path);if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact reviewed responsive wave: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published 474534a restored byte-for-byte: '+path);return value;
}
export function restoreResponsiveIfCurrent(path,bytes){
 bytes=restoreDesktopReviewIfCurrent(path,bytes);
 bytes=restoreDesktopEdgesIfCurrent(path,bytes);
 const file=responsiveDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedResponsive(path,bytes):bytes;
}
