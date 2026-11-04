import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {editorDelta,withoutAuthorizedEditor} from './owner-mobile-editor-2026-11-04.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
test('mobile editor and seven annotations reverse exactly and reject unrelated source drift',()=>{
 assert.equal(editorDelta.baselineCommit,'d8654c8d1889018e7eabe8c9d9d6380505f907df');
 for(const f of editorDelta.files){const bytes=readFileSync(new URL('../'+f.path,import.meta.url));assert.equal(sha(withoutAuthorizedEditor(f.path,bytes)),f.beforeSha256);assert.throws(()=>withoutAuthorizedEditor(f.path,Buffer.concat([bytes,Buffer.from(' ')])));}
 for(const f of editorDelta.newFiles)assert.equal(sha(readFileSync(new URL('../'+f.path,import.meta.url))),f.sha256,f.path);
});
