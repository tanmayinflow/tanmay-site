import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const delta = JSON.parse(readFileSync(new URL('./olga-review-2026-11-16.json', import.meta.url)));
export function restoreOlgaReview(path, bytes) {
  return path === delta.path && createHash('sha256').update(bytes).digest('hex') === delta.afterSha256
    ? Buffer.from(delta.before, 'base64') : bytes;
}
