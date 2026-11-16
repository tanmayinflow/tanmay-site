import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {mariaReviewDelta, restoreMariaReview} from './maria-review-2026-11-16.mjs';

test('Maria addition and Olga full-name correction restore the prior approved reviews exactly', () => {
  assert.deepEqual(mariaReviewDelta.files.map(file=>file.path), ['src/components/ReviewVideo.tsx','src/components/OlgaReviewVideo.tsx']);
  for (const file of mariaReviewDelta.files) {
    const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
    const restored=restoreMariaReview(file.path,bytes);
    assert.notEqual(restored,bytes);
    assert.equal(createHash('sha256').update(restored).digest('hex'),file.beforeSha256);
    const changed=Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreMariaReview(file.path,changed),changed);
  }
});
