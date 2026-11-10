import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {desktopReviewDelta, withoutAuthorizedDesktopReview, restoreDesktopReviewIfCurrent, verifyDesktopReviewAddition} from './desktop-review-authorized-2026-11-10.mjs';

test('desktop flow, natural transitions and local review integration restore the published source exactly', () => {
  assert.equal(desktopReviewDelta.baseline, '5ecf27ebd61ab62690768ab9b522498b83a4f1c3');
  assert.deepEqual(desktopReviewDelta.files.map(file => file.path), [
    'src/App.tsx',
    'src/components/HomeReferences.tsx',
    'src/desktop/ResponsiveHomeProcess.tsx',
    'src/desktop/ResponsiveWork.tsx',
    'src/mobile/MobileReviews.tsx',
  ]);
  for (const file of desktopReviewDelta.files) {
    assert.ok(file.replacements.length > 0, 'Record an actual reviewed change: ' + file.path);
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    const restored = withoutAuthorizedDesktopReview(file.path, bytes);
    assert.deepEqual(restoreDesktopReviewIfCurrent(file.path, bytes), restored);
    const unreviewed = Buffer.concat([bytes, Buffer.from('\nUNREVIEWED')]);
    assert.throws(() => withoutAuthorizedDesktopReview(file.path, unreviewed));
    assert.equal(restoreDesktopReviewIfCurrent(file.path, unreviewed), unreviewed);
    const changed = Buffer.from(bytes);
    changed[file.replacements[0].offset] ^= 1;
    assert.throws(() => withoutAuthorizedDesktopReview(file.path, changed));
    assert.equal(restoreDesktopReviewIfCurrent(file.path, changed), changed);
  }
  const unrelated = Buffer.from('unrelated source remains unchanged');
  assert.equal(withoutAuthorizedDesktopReview('src/mobile/preview-mobile-scroll.ts', unrelated), unrelated);
  assert.equal(restoreDesktopReviewIfCurrent('src/mobile/preview-mobile-scroll.ts', unrelated), unrelated);
});

test('new CSS, video component and supplied media retain their exact reviewed bytes', () => {
  assert.deepEqual(desktopReviewDelta.newFiles.map(file => file.path), [
    'src/components/ReviewVideo.tsx',
    'src/components/review-video.css',
    'src/desktop/responsive-material-edges.css',
    'src/desktop/responsive-work-flow.css',
    'public/media/reviews/paulina-recenze-titulky.mp4',
    'public/media/reviews/paulina-recenze-titulky-poster.jpg',
  ]);
  for (const file of desktopReviewDelta.newFiles) {
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    assert.equal(verifyDesktopReviewAddition(file.path, bytes), bytes);
    const changed = Buffer.from(bytes);
    changed[Math.floor(changed.length / 2)] ^= 1;
    assert.throws(() => verifyDesktopReviewAddition(file.path, changed));
    assert.throws(() => verifyDesktopReviewAddition(file.path, bytes.subarray(0, bytes.length - 1)));
  }
  assert.throws(() => verifyDesktopReviewAddition('public/media/reviews/unreviewed.mp4', Buffer.from('not reviewed')));
});

test('owner-selected clean poster preserves the exact chosen JPEG', () => {
  const choice = JSON.parse(readFileSync(new URL('./owner-poster-2026-11-10.json', import.meta.url)));
  const bytes = readFileSync(new URL('../' + choice.poster.path, import.meta.url));
  assert.equal(bytes.length, choice.poster.size);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), choice.poster.sha256);
  const component = readFileSync(new URL('../' + choice.path, import.meta.url), 'utf8');
  assert.ok(component.includes('poster="' + choice.poster.path.replace(/^public/, '') + '"'));
});
