import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {writtenReviewLoopDelta, restoreWrittenReviewLoop} from './written-review-loop-2026-11-17.mjs';

test('desktop written-review loop restores the published testimonials and reader exactly', () => {
  assert.equal(writtenReviewLoopDelta.baseline, 'b9d20b6');
  assert.deepEqual(writtenReviewLoopDelta.files.map(file => file.path), ['src/components/HomeReferences.tsx', 'src/components/home-reviews.css']);
  for (const file of writtenReviewLoopDelta.files) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    const restored = restoreWrittenReviewLoop(file.path, bytes);
    assert.notEqual(restored, bytes);
    assert.equal(createHash('sha256').update(restored).digest('hex'), file.beforeSha256);
    const changed = Buffer.concat([bytes, Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreWrittenReviewLoop(file.path, changed), changed);
  }
});
