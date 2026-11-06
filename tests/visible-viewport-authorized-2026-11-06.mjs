import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const viewportDelta=JSON.parse(readFileSync(new URL('./visible-viewport-authorized-2026-11-06.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedViewport(path,bytes){
 const file=viewportDelta.files.find(f=>f.path===path);
 if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact visible-viewport repair: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published 2683fdb baseline restored: '+path);
 return value;
}
export function restoreViewportIfCurrent(path,bytes){
 const file=viewportDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedViewport(path,bytes):bytes;
}
