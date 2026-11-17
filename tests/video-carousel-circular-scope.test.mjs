import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {circularVideoDelta, restoreCircularVideoCarousel} from './video-carousel-circular-2026-11-16.mjs';

test('circular navigation and two-arrow controls restore the published carousel exactly', () => {
  assert.equal(circularVideoDelta.baseline,'1a14856');
  assert.deepEqual(circularVideoDelta.files.map(file=>file.path), ['src/components/ReviewVideoCarousel.tsx','src/components/review-video.css']);
  for(const file of circularVideoDelta.files) {
    const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
    const restored=restoreCircularVideoCarousel(file.path,bytes);
    assert.notEqual(restored,bytes);
    assert.equal(createHash('sha256').update(restored).digest('hex'),file.beforeSha256);
    const changed=Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')]);
    assert.equal(restoreCircularVideoCarousel(file.path,changed),changed);
  }
});
