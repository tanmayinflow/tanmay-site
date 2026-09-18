import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ownerCopyDelta } from './owner-copy-authorized-delta-2026-09-17.mjs';

export const desktopMotionDelta = JSON.parse(readFileSync(new URL('./desktop-motion-authorized-delta-2026-09-18.json', import.meta.url), 'utf8'));
assert.equal(desktopMotionDelta.approvedOn, '2026-09-18');
assert.equal(desktopMotionDelta.baselineCommit, 'dd31d1a42e457e24fe0fd7a859ca5543828c0bf0');
assert.equal(desktopMotionDelta.path, 'src/App.tsx');
assert.equal(desktopMotionDelta.beforeSha256, ownerCopyDelta.files.find(file => file.path === 'src/App.tsx').authorizedSha256);
assert.deepEqual(desktopMotionDelta.scope, [
  'desktop-salto-scroll-motion', 'desktop-practice-illustrations-and-diagram',
  'desktop-story-original-photographs-and-motion', 'desktop-plan-record-adjust-cycle',
]);
assert.deepEqual(desktopMotionDelta.replacements.map(change => change.id), [
  'desktop-module-imports', 'desktop-motion-lifecycle', 'practice-hero-decoration',
  'practice-copy-open', 'practice-copy-close-and-diagram',
  'story-wrapper-open', 'story-wrapper-close', 'cycle-wrapper-open', 'cycle-wrapper-close',
]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reverse only the approved desktop adapters, then run every earlier content guard. */
export function withoutAuthorizedDesktopMotion(relativePath, current) {
  if (relativePath !== desktopMotionDelta.path) return current;
  assert.equal(sha(current), desktopMotionDelta.authorizedSha256, 'Desktop work permits only its exact recorded App bridge.');
  let previous = current.toString('utf8');
  for (const change of [...desktopMotionDelta.replacements].reverse()) {
    assert.equal(previous.split(change.after).length - 1, 1, 'Exactly one desktop adapter replacement: ' + change.id);
    previous = previous.replace(change.after, change.before);
  }
  const bytes = Buffer.from(previous, 'utf8');
  assert.equal(sha(bytes), desktopMotionDelta.beforeSha256, 'All pre-existing desktop content, markup and styles outside the adapters remain exact.');
  return bytes;
}
