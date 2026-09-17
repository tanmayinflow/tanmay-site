import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const approved = JSON.parse(readFileSync(new URL('./desktop-authorized-deltas.json', import.meta.url), 'utf8'));
assert.equal(approved.stage, 'M9');
assert.deepEqual(approved.files.map(file => file.path), ['src/components/CollaborationFaq.tsx', 'src/App.tsx']);
assert.deepEqual(approved.files[0].replacements.map(item => item.id), ['experience-question-cs', 'single-answer-cs', 'single-answer-en']);
assert.deepEqual(approved.files[1].replacements.map(item => item.id), ['practice-meaning-part-cs', 'practice-meaning-part-en']);
export const desktopAuthorizedFiles = approved.files.map(file => file.path);
export const mobileApprovedContent = approved.mobileApprovedContent;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reconstruct only the owner's precise M7/M9 string replacements, not a file exemption. */
export function authorizedDesktopBytes(relativePath, original) {
  const exception = approved.files.find(file => file.path === relativePath);
  if (!exception) return original;
  assert.equal(sha(original), exception.originalSha256, 'The authorized delta must start from locked V9.22.');
  let text = original.toString('utf8');
  for (const change of exception.replacements) {
    assert.equal(text.split(change.before).length - 1, 1, 'Expected exactly one original string: ' + change.id);
    text = text.replace(change.before, change.after);
  }
  const result = Buffer.from(text, 'utf8');
  assert.equal(sha(result), exception.authorizedSha256, 'Only the explicitly recorded M7 FAQ and M9 meaning deltas are permitted.');
  return result;
}

export function verifyApprovedMobileContent(current) {
  assert.equal(mobileApprovedContent.path, 'src/mobile/approved-content.ts');
  assert.equal(sha(current), mobileApprovedContent.authorizedSha256, 'All other approved bilingual content must remain exact.');
  let prior = current.toString('utf8');
  for (const change of approved.files[1].replacements) {
    assert.equal(prior.split(change.after).length - 1, 1, 'Exactly one matching mobile meaning sentence: ' + change.id);
    assert.equal(prior.includes(change.before), false, 'The replaced mobile meaning sentence must be absent.');
    prior = prior.replace(change.after, change.before);
  }
  assert.equal(sha(Buffer.from(prior, 'utf8')), mobileApprovedContent.beforeSha256, 'Only the two M9 authorized content strings may differ from M8.');
}
