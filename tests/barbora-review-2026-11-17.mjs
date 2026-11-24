import {restoreVladkaReview} from './vladka-review-2026-11-24.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const barboraReviewDelta = JSON.parse(readFileSync(new URL('./barbora-review-2026-11-17.json', import.meta.url)));
export function restoreBarboraReview(path, bytes) {
  bytes = restoreVladkaReview(path, bytes);
  const file = barboraReviewDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
