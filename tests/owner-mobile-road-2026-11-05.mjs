import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const roadDelta=JSON.parse(readFileSync(new URL('./owner-mobile-road-2026-11-05.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
export function restoreRoadIfCurrent(path,bytes){
 const file=roadDelta.files.find(f=>f.path===path);
 if(!file||sha(bytes)!==file.afterSha256)return bytes;
 let value=bytes;
 for(const change of [...file.replacements].reverse()){
  const after=Buffer.from(change.after);
  assert.deepEqual(value.subarray(change.offset,change.offset+after.length),after,path);
  value=Buffer.concat([value.subarray(0,change.offset),Buffer.from(change.before),value.subarray(change.offset+after.length)]);
 }
 assert.equal(sha(value),file.beforeSha256,'Reviewed owner layout restored: '+path);
 return value;
}
