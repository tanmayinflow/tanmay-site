import {restoreBarboraReview} from './barbora-review-2026-11-17.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const circularVideoDelta = JSON.parse(readFileSync(new URL('./video-carousel-circular-2026-11-16.json', import.meta.url)));
export function restoreCircularVideoCarousel(path, bytes) {
  bytes = restoreBarboraReview(path, bytes);
  const file = circularVideoDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
