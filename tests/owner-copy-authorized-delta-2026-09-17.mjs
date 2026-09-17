import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const ownerCopyDelta = JSON.parse(readFileSync(new URL('./owner-copy-authorized-delta-2026-09-17.json', import.meta.url), 'utf8'));
assert.equal(ownerCopyDelta.approvedOn, '2026-09-17');
const sharedIds = ['practice-title', 'practice-intro', 'practice-consistency', 'practice-session', 'roots-title', 'strength', 'regularity'].flatMap(id => [id + '-cs', id + '-en']);
const ids = {
  'src/App.tsx': sharedIds,
  'src/mobile/approved-content.ts': [...sharedIds, 'needs-intro-cs', 'needs-intro-en', 'experience-title-cs', 'experience-title-en'],
  'src/components/content-emphasis.tsx': ['strength-emphasis-cs', 'strength-emphasis-en'],
};
assert.deepEqual(ownerCopyDelta.files.map(file => file.path), Object.keys(ids));
for (const file of ownerCopyDelta.files) assert.deepEqual(file.replacements.map(change => change.id), ids[file.path]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reverse the owner's exact new copy only, then run the unchanged earlier guards. */
export function withoutAuthorizedOwnerCopy(relativePath, current) {
  const file = ownerCopyDelta.files.find(item => item.path === relativePath);
  if (!file) return current;
  assert.equal(sha(current), file.authorizedSha256, 'Only the approved bilingual review copy may change: ' + relativePath);
  let previous = current.toString('utf8');
  for (const change of file.replacements) {
    assert.equal(previous.split(change.after).length - 1, 1, 'Exactly one approved copy replacement: ' + change.id);
    previous = previous.replace(change.after, change.before);
  }
  const bytes = Buffer.from(previous, 'utf8');
  assert.equal(sha(bytes), file.beforeSha256, 'All source bytes outside the approved copy remain unchanged: ' + relativePath);
  return bytes;
}
