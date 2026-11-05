import {restoreFinalIfCurrent} from './owner-mobile-final-2026-11-05.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {certificatesDelta,withoutAuthorizedCertificates} from './owner-mobile-certificates-2026-11-05.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('Sixteen mobile annotations restore the approved baseline and reject unrelated drift',()=>{
 assert.equal(certificatesDelta.baselineCommit,'46c79cfb4627b275f134657dd40a805744f150d7');
 for(const f of certificatesDelta.files){
  const bytes=readFileSync(new URL('../'+f.path,import.meta.url));
  assert.equal(sha(withoutAuthorizedCertificates(f.path,bytes)),f.beforeSha256);
  assert.throws(()=>withoutAuthorizedCertificates(f.path,Buffer.concat([bytes,Buffer.from(' ')])));
 }
 for(const f of certificatesDelta.newFiles)assert.equal(sha(restoreFinalIfCurrent(f.path,readFileSync(new URL('../'+f.path,import.meta.url)))),f.sha256,f.path);
});
