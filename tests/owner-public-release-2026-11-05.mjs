import {restoreBodyMandala} from './body-mandala-2026-11-11.mjs';
import assert from 'node:assert/strict';
import {restoreSpacingIfCurrent} from './offer-spacing-authorized-2026-11-06.mjs';
import {restoreFirstLoadIfCurrent} from './first-load-authorized-2026-11-06.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const releaseDelta=JSON.parse(readFileSync(new URL('./owner-public-release-2026-11-05.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function withoutAuthorizedRelease(path,bytes){
 bytes=restoreBodyMandala(path,bytes);
 bytes=restoreSpacingIfCurrent(path,bytes);
 bytes=restoreFirstLoadIfCurrent(path,bytes);
 const file=releaseDelta.files.find(f=>f.path===path);
 if(!file)return bytes;
 assert.equal(sha(bytes),file.afterSha256,'Exact owner-authorized public release: '+path);
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Saved owner layout baseline restored: '+path);
 return value;
}
export function restoreReleaseIfCurrent(path,bytes){
 bytes=restoreBodyMandala(path,bytes);
 bytes=restoreSpacingIfCurrent(path,bytes);
 bytes=restoreFirstLoadIfCurrent(path,bytes);
 const file=releaseDelta.files.find(f=>f.path===path);
 return file&&sha(bytes)===file.afterSha256?withoutAuthorizedRelease(path,bytes):bytes;
}
