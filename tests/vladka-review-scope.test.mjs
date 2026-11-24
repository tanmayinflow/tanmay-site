import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {vladkaReviewDelta, restoreVladkaReview} from './vladka-review-2026-11-24.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('fifth review and exact media routing restore the previous release byte-for-byte', () => {
  assert.equal(vladkaReviewDelta.baseline, '29d4b42');
  assert.deepEqual(vladkaReviewDelta.files.map(file => file.path), ['src/components/ReviewVideo.tsx', 'src/components/ReviewVideoCarousel.tsx', 'worker/media-range.mjs', 'wrangler.jsonc']);
  for (const file of vladkaReviewDelta.files) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    const restored = restoreVladkaReview(file.path, bytes);
    assert.notEqual(restored, bytes);
    assert.equal(sha(restored), file.beforeSha256);
    const changed = Buffer.concat([bytes, Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreVladkaReview(file.path, changed), changed);
  }
});

test('Vladimira component and supplied media retain their exact reviewed bytes', () => {
  assert.deepEqual(vladkaReviewDelta.additions.map(file => file.path), ['src/components/VladkaReviewVideo.tsx', 'public/media/reviews/vladka-recenze-titulky-en.mp4', 'public/media/reviews/vladka-poster-frame-310.jpg']);
  for (const file of vladkaReviewDelta.additions) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    assert.equal(bytes.length, file.size);
    assert.equal(sha(bytes), file.sha256);
  }
});
