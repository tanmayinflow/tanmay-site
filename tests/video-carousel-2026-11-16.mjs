import {restoreCircularVideoCarousel} from './video-carousel-circular-2026-11-16.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const videoCarouselDelta = JSON.parse(readFileSync(new URL('./video-carousel-2026-11-16.json', import.meta.url)));
export function restoreVideoCarousel(path, bytes) {
  bytes = restoreCircularVideoCarousel(path, bytes);
  const file = videoCarouselDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
