import {restoreFinalIfCurrent} from './owner-mobile-final-2026-11-05.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const certificatesDelta=JSON.parse(readFileSync(new URL('./owner-mobile-certificates-2026-11-05.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedCertificates(path,bytes){
 bytes=restoreFinalIfCurrent(path,bytes);
 const file=certificatesDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact sixteen mobile annotations scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Previous approved mobile preview restored: '+path);
 return value;
}
export function restoreCertificatesIfCurrent(path,bytes){
 bytes=restoreFinalIfCurrent(path,bytes);
 const file=certificatesDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedCertificates(path,bytes):bytes;
}
