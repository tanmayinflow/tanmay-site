import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const vladkaReviewDelta = JSON.parse(readFileSync(new URL('./vladka-review-2026-11-24.json', import.meta.url)));
export function restoreVladkaReview(path, bytes) {
  const file = vladkaReviewDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
