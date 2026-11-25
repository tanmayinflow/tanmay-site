import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const vladkaReviewDelta = JSON.parse(readFileSync(new URL('./vladka-review-2026-11-24.json', import.meta.url)));
export function restoreVladkaReview(path, bytes) {
  if (path === 'worker/media-range.mjs' && createHash('sha256').update(bytes).digest('hex') === '04c4f871412eb6b8904d9feebf33158fd92831563fa84ed69c2363783a8c433c') {
    bytes = readFileSync(new URL('./fixtures/media-range-before-streaming.txt', import.meta.url));
  }
  const file = vladkaReviewDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
