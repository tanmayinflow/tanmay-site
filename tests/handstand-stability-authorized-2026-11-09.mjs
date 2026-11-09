import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const handstandStabilityDelta=JSON.parse(readFileSync(new URL('./handstand-stability-authorized-2026-11-09.json',import.meta.url)));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function withoutAuthorizedHandstandStability(path,bytes){
 const file=handstandStabilityDelta.files.find(f=>f.path===path);if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact reviewed stable handstand repair: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published e888822 restored byte-for-byte: '+path);return value;
}
export function restoreHandstandStabilityIfCurrent(path,bytes){
 const file=handstandStabilityDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedHandstandStability(path,bytes):bytes;
}
