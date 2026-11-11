import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

export const desktopReviewDelta = JSON.parse(readFileSync(new URL('./desktop-review-authorized-2026-11-10.json', import.meta.url)));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function withoutAuthorizedDesktopReview(path, bytes) {
  const file = desktopReviewDelta.files.find(item => item.path === path);
  if (!file) return bytes;
  assert.equal(sha(bytes), file.afterSha256, 'Exact reviewed desktop flow, materials and local video integration: ' + path);
  let value = bytes;
  for (const change of [...file.replacements].reverse()) {
    const after = Buffer.from(change.after);
    assert.deepEqual(value.subarray(change.offset, change.offset + after.length), after, path);
    value = Buffer.concat([value.subarray(0, change.offset), Buffer.from(change.before), value.subarray(change.offset + after.length)]);
  }
  assert.equal(sha(value), file.beforeSha256, 'Published 5ecf27e restored byte-for-byte: ' + path);
  return value;
}

export function restoreDesktopReviewIfCurrent(path, bytes) {
  const file = desktopReviewDelta.files.find(item => item.path === path);
  return file && sha(bytes) === file.afterSha256 ? withoutAuthorizedDesktopReview(path, bytes) : bytes;
}

const videoSimplification = JSON.parse(readFileSync(new URL('./video-simplification-2026-11-10.json', import.meta.url)));
const ownerPoster = JSON.parse(readFileSync(new URL('./owner-poster-2026-11-10.json', import.meta.url)));
const nameFade = JSON.parse(readFileSync(new URL('./paulin-name-fade-2026-11-11.json', import.meta.url)));
export function verifyDesktopReviewAddition(path, original) {
  const correction = nameFade.find(item => item.path === path && item.afterSha256 === sha(original));
  const corrected = correction ? Buffer.from(correction.before, 'base64') : original;
  const prior = path === ownerPoster.path && sha(corrected) === ownerPoster.afterSha256
    ? Buffer.from(ownerPoster.before, 'base64') : corrected;
  const accepted = videoSimplification.find(item => item.path === path && item.afterSha256 === sha(prior));
  const bytes = accepted ? Buffer.from(accepted.before, 'base64') : prior;
  const file = desktopReviewDelta.newFiles.find(item => item.path === path);
  assert.ok(file, 'Only explicitly reviewed additions are allowed: ' + path);
  assert.equal(bytes.length, file.size, 'Exact reviewed addition size: ' + path);
  assert.equal(sha(bytes), file.sha256, 'Exact reviewed addition SHA-256: ' + path);
  return original;
}
