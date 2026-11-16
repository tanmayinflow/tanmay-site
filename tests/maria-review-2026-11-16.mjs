import {restoreVideoCarousel} from './video-carousel-2026-11-16.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const mariaReviewDelta = JSON.parse(readFileSync(new URL('./maria-review-2026-11-16.json', import.meta.url)));
export function restoreMariaReview(path, bytes) {
  bytes = restoreVideoCarousel(path, bytes);
  const file = mariaReviewDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
