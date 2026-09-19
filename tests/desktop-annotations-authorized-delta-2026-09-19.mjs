import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
export const annotationDelta=JSON.parse(readFileSync(new URL('./desktop-annotations-authorized-delta-2026-09-19.json',import.meta.url),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function withoutAuthorizedAnnotations(path,current){
 if(path!==annotationDelta.path)return current;
 assert.equal(sha(current),annotationDelta.authorizedSha256,'Only the exact owner-approved disclosure bridge is allowed.');
 let previous=current.toString('utf8');
 for(const change of [...annotationDelta.replacements].reverse()){
  assert.equal(previous.split(change.after).length-1,1,change.id);
  previous=previous.replace(change.after,change.before);
 }
 const bytes=Buffer.from(previous);assert.equal(sha(bytes),annotationDelta.beforeSha256);return bytes;
}
