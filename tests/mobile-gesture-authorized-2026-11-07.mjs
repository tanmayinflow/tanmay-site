import {restoreHandstandStabilityIfCurrent} from './handstand-stability-authorized-2026-11-09.mjs';
import {restoreResponsiveIfCurrent} from './responsive-authorized-2026-11-08.mjs';
import {restoreLsitCutoutIfCurrent} from './lsit-cutout-authorized-2026-11-08.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const mobileGestureDelta=JSON.parse(readFileSync(new URL('./mobile-gesture-authorized-2026-11-07.json',import.meta.url)));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function withoutAuthorizedMobileGesture(path,bytes){
 bytes=restoreHandstandStabilityIfCurrent(path,bytes);
 bytes=restoreLsitCutoutIfCurrent(path,bytes);
 bytes=restoreResponsiveIfCurrent(path,bytes);
 const file=mobileGestureDelta.files.find(f=>f.path===path);if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact reviewed mobile gesture wave: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Published fe0cb06 restored byte-for-byte: '+path);return value;
}
export function restoreMobileGestureIfCurrent(path,bytes){
 bytes=restoreHandstandStabilityIfCurrent(path,bytes);
 bytes=restoreLsitCutoutIfCurrent(path,bytes);
 bytes=restoreResponsiveIfCurrent(path,bytes);
 const file=mobileGestureDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedMobileGesture(path,bytes):bytes;
}
