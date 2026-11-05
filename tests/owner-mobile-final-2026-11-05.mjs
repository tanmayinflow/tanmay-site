import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const finalDelta=JSON.parse(readFileSync(new URL('./owner-mobile-final-2026-11-05.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedFinal(path,bytes){
 const file=finalDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact nineteen annotations and saved owner layout: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Previous certificate preview restored: '+path);
 return value;
}
export function restoreFinalIfCurrent(path,bytes){
 const file=finalDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedFinal(path,bytes):bytes;
}
