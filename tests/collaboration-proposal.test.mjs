import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {proposalDelta,withoutAuthorizedCollaborationProposal} from './owner-collaboration-proposal-2026-11-04.mjs';
test('Collaboration proposal restores the accepted mobile source and rejects extra drift',()=>{
 assert.equal(proposalDelta.baselineCommit,'e0622307b61c1188dca83b7ff6725c68d9b1b9c3');
 for(const f of proposalDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(createHash('sha256').update(withoutAuthorizedCollaborationProposal(f.path,bytes)).digest('hex'),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedCollaborationProposal(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
});
