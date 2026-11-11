import {restoreDesktopFourFixes} from './desktop-four-fixes-2026-11-11.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

export const desktopEdgeDelta = JSON.parse(readFileSync(new URL('./desktop-edge-authorized-2026-11-09.json', import.meta.url)));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

export function withoutAuthorizedDesktopEdges(path, bytes) {
  bytes = restoreDesktopFourFixes(path, bytes);
  const file = desktopEdgeDelta.files.find(item => item.path === path);
  if (!file) return bytes;
  assert.equal(sha(bytes), file.afterSha256, 'Exact reviewed desktop hero and viewport-edge correction: ' + path);
  let value = bytes;
  for (const change of [...file.replacements].reverse()) {
    const after = Buffer.from(change.after);
    assert.deepEqual(value.subarray(change.offset, change.offset + after.length), after, path);
    value = Buffer.concat([
      value.subarray(0, change.offset),
      Buffer.from(change.before),
      value.subarray(change.offset + after.length),
    ]);
  }
  assert.equal(sha(value), file.beforeSha256, 'Published 02d0df1 restored byte-for-byte: ' + path);
  return value;
}

export function restoreDesktopEdgesIfCurrent(path, bytes) {
  bytes = restoreDesktopFourFixes(path, bytes);
  const file = desktopEdgeDelta.files.find(item => item.path === path);
  return file && sha(bytes) === file.afterSha256 ? withoutAuthorizedDesktopEdges(path, bytes) : bytes;
}
