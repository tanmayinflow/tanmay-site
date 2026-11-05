import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {releaseDelta,withoutAuthorizedRelease} from './owner-public-release-2026-11-05.mjs';
import {roadPair} from '../src/mobile/road-geometry.mjs';
test('Public release preserves the owner-integrated baseline and rejects unreviewed drift',()=>{
 assert.ok(releaseDelta.baselineCommit.startsWith('9778c02'));
 for(const f of releaseDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  const prior=withoutAuthorizedRelease(f.path,bytes);
  assert.equal(createHash('sha256').update(prior).digest('hex'),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedRelease(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
test('Perspective bends widen continuously without crossing or unequal tip heights',()=>{
 for(const [height,bend,from,to] of [[48,26.4,3,11],[60,-33,11,23],[90,-49.5,11,23]]){
  const edges=roadPair({x:100,y:20,height,bend},from,to);
  let previous=0;
  edges[0].forEach(([x,y],i)=>{
   const [otherX,otherY]=edges[1][i],t=i/(edges[0].length-1);
   assert.equal(y,otherY);assert.ok(otherX>x);
   const normalWidth=(otherX-x)/Math.hypot(1,bend*Math.PI*Math.cos(Math.PI*t)/height);
   assert.ok(normalWidth>previous);previous=normalWidth;
   if(i)assert.ok(y>edges[0][i-1][1]);
  });
  assert.ok(Math.abs(previous-to)<1e-9);
 }
});
