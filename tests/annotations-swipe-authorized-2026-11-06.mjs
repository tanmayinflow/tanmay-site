import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const annotationsDelta=JSON.parse(readFileSync(new URL('./annotations-swipe-authorized-2026-11-06.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedAnnotations(path,bytes){
 const file=annotationsDelta.files.find(f=>f.path===path);if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact annotation and swipe scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published 270afa6 restored byte-for-byte: '+path);return value;
}
export function restoreAnnotationsIfCurrent(path,bytes){
 const file=annotationsDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedAnnotations(path,bytes):bytes;
}
