import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const writtenReviewLoopDelta = JSON.parse(readFileSync(new URL('./written-review-loop-2026-11-17.json', import.meta.url)));
export function restoreWrittenReviewLoop(path, bytes) {
  const file = writtenReviewLoopDelta.files.find(item => item.path === path && item.afterSha256 === createHash('sha256').update(bytes).digest('hex'));
  return file ? Buffer.from(file.before, 'base64') : bytes;
}
