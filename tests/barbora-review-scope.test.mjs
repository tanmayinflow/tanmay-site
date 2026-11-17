import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {barboraReviewDelta, restoreBarboraReview} from './barbora-review-2026-11-17.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('fourth review and exact media routing restore the previous release byte-for-byte', () => {
  assert.equal(barboraReviewDelta.baseline, '2506616');
  assert.deepEqual(barboraReviewDelta.files.map(file => file.path), ['src/components/ReviewVideo.tsx', 'src/components/ReviewVideoCarousel.tsx', 'worker/media-range.mjs', 'wrangler.jsonc']);
  for (const file of barboraReviewDelta.files) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    const restored = restoreBarboraReview(file.path, bytes);
    assert.notEqual(restored, bytes);
    assert.equal(sha(restored), file.beforeSha256);
    const changed = Buffer.concat([bytes, Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreBarboraReview(file.path, changed), changed);
  }
});

test('Barbora component and supplied media retain their exact reviewed bytes', () => {
  assert.deepEqual(barboraReviewDelta.additions.map(file => file.path), ['src/components/BarboraReviewVideo.tsx', 'public/media/reviews/barbora-recenze-titulky-en.mp4', 'public/media/reviews/barbora-poster-frame-417.jpg']);
  for (const file of barboraReviewDelta.additions) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    assert.equal(bytes.length, file.size);
    assert.equal(sha(bytes), file.sha256);
  }
});
