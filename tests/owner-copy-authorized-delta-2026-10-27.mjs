import { withoutAuthorizedPreview } from './owner-preview-v3-authorized-2026-10-29.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const consultationDelta = JSON.parse(readFileSync(new URL('./owner-copy-authorized-delta-2026-10-27.json', import.meta.url), 'utf8'));
assert.equal(consultationDelta.approvedOn, '2026-10-27');
assert.equal(consultationDelta.baselineCommit, 'ef9e31ebb06fc1b980000f2fe3fc17b72ced817a');
assert.deepEqual(consultationDelta.files.map(file => file.path), [
  'src/App.tsx', 'src/mobile/approved-content.ts', 'src/mobile/mobile-copy.ts', 'src/components/CollaborationPricing.tsx',
  'src/components/content-emphasis.tsx',
  'src/mobile/MobileSite.tsx',
]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Reverse only the exact approved replacements before the immutable older guards.
// Byte offsets distinguish repeated messages with different original wording.
export function withoutAuthorizedConsultationCopy(path, current) {
  current = withoutAuthorizedPreview(path, current);
  const file = consultationDelta.files.find(item => item.path === path);
  if (!file) return current;
  assert.equal(sha(current), file.authorizedSha256, 'Exact approved consultation copy: ' + path);
  let previous = current;
  for (const change of [...file.replacements].reverse()) {
    const after = Buffer.from(change.after);
    assert.deepEqual(previous.subarray(change.offset, change.offset + after.length), after, change.id);
    previous = Buffer.concat([previous.subarray(0, change.offset), Buffer.from(change.before), previous.subarray(change.offset + after.length)]);
  }
  assert.equal(sha(previous), file.beforeSha256, 'Every byte outside approved copy is preserved: ' + path);
  return previous;
}
