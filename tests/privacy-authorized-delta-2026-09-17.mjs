import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const privacyDelta = JSON.parse(readFileSync(new URL('./privacy-authorized-delta-2026-09-17.json', import.meta.url), 'utf8'));
assert.equal(privacyDelta.approvedOn, '2026-09-17');
assert.equal(privacyDelta.path, 'src/App.tsx');
assert.deepEqual(privacyDelta.replacements.map(change => change.id), [
  'technical-basis-cs', 'technical-basis-en',
  'analytics-eu-cs', 'analytics-eu-en',
  'correspondence-basis-cs', 'correspondence-basis-en',
  'complaint-right-bilingual',
]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reverse only the approved privacy clarification, then apply the existing M10 desktop guard. */
export function withoutAuthorizedPrivacyChanges(current) {
  assert.equal(sha(current), privacyDelta.authorizedSha256, 'App must match the exact approved privacy delta.');
  let original = current.toString('utf8');
  const privacyStart = original.indexOf('function PagePrivacy(');
  const privacyEnd = original.indexOf('// ----------------------------------------------------------------------', privacyStart);
  assert.ok(privacyStart >= 0 && privacyEnd > privacyStart);
  const privacyPage = original.slice(privacyStart, privacyEnd);
  for (const change of privacyDelta.replacements) {
    assert.equal(original.split(change.after).length - 1, 1, 'Exactly one approved privacy replacement: ' + change.id);
    assert.ok(privacyPage.includes(change.after), 'Replacement must be inside PagePrivacy: ' + change.id);
    original = original.replace(change.after, change.before);
  }
  const bytes = Buffer.from(original, 'utf8');
  assert.equal(sha(bytes), privacyDelta.beforeSha256, 'No other App source or byte may change.');
  return bytes;
}
