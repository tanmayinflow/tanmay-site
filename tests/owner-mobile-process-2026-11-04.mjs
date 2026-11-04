import assert from 'node:assert/strict';
import {restoreEditorIfCurrent} from './owner-mobile-editor-2026-11-04.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const processDelta=JSON.parse(readFileSync(new URL('./owner-mobile-process-2026-11-04.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedProcess(path,bytes){
 bytes=restoreEditorIfCurrent(path,bytes);
 const file=processDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)===file.beforeSha256)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact mobile process annotation scope: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Previous mobile preview restored: '+path);
 return value;
}
export function restoreProcessIfCurrent(path,bytes){
 bytes=restoreEditorIfCurrent(path,bytes);
 const file=processDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedProcess(path,bytes):bytes;
}
