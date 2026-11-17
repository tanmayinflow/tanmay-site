import {restoreCircularVideoCarousel} from './video-carousel-circular-2026-11-16.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {videoCarouselDelta, restoreVideoCarousel} from './video-carousel-2026-11-16.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('owner-requested carousel restores the three approved video cards and styling exactly', () => {
  assert.deepEqual(videoCarouselDelta.files.map(file=>file.path), [
    'src/components/ReviewVideo.tsx', 'src/components/OlgaReviewVideo.tsx',
    'src/components/MariaReviewVideo.tsx', 'src/components/review-video.css',
  ]);
  for (const file of videoCarouselDelta.files) {
    const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
    const restored=restoreVideoCarousel(file.path,bytes);
    assert.notEqual(restored,bytes);
    assert.equal(sha(restored),file.beforeSha256);
    const changed=Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreVideoCarousel(file.path,changed),changed);
  }
});

test('shared carousel and player match the reviewed implementation exactly', () => {
  assert.deepEqual(videoCarouselDelta.additions.map(file=>file.path), [
    'src/components/ReviewVideoCarousel.tsx', 'src/components/ReviewVideoPlayer.tsx',
  ]);
  for (const file of videoCarouselDelta.additions) {
    const bytes=restoreCircularVideoCarousel(file.path,readFileSync(new URL('../'+file.path,import.meta.url)));
    assert.equal(bytes.length,file.size);
    assert.equal(sha(bytes),file.sha256);
  }
});
