import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {processDelta,withoutAuthorizedProcess} from './owner-mobile-process-2026-11-04.mjs';
test('three mobile process refinements restore prior source and reject extra drift',()=>{
 assert.equal(processDelta.baselineCommit,'aeffa0431859c4b38e6ca20023ccff83d89602e5');
 for(const f of processDelta.files){const bytes=readFileSync(new URL('../'+f.path,import.meta.url));assert.equal(createHash('sha256').update(withoutAuthorizedProcess(f.path,bytes)).digest('hex'),f.beforeSha256);assert.throws(()=>withoutAuthorizedProcess(f.path,Buffer.concat([bytes,Buffer.from(' ')])));}
});
