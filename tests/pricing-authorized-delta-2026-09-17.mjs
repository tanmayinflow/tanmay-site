import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const pricingDelta = JSON.parse(readFileSync(new URL('./pricing-authorized-delta-2026-09-17.json', import.meta.url), 'utf8'));
assert.equal(pricingDelta.approvedOn, '2026-09-17');
assert.equal(pricingDelta.path, 'src/components/CollaborationPricing.tsx');
assert.deepEqual(pricingDelta.replacements.map(change => change.id), ['prepaid-period-cs', 'prepaid-period-en']);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reverse only the approved pair; all other bytes must match the immutable V9.22 manifest. */
export function verifyAuthorizedPricingBytes(current, originalSha256) {
  assert.equal(pricingDelta.beforeSha256, originalSha256, 'Pricing approval must start from the original locked manifest.');
  assert.equal(sha(current), pricingDelta.authorizedSha256, 'Current pricing must match the precise approved period clarification.');
  let original = current.toString('utf8');
  for (const change of pricingDelta.replacements) {
    assert.equal(original.split(change.after).length - 1, 1, 'Exactly one approved replacement: ' + change.id);
    assert.equal(original.includes(change.before), false, 'The ambiguous period must be absent: ' + change.id);
    original = original.replace(change.after, change.before);
  }
  assert.equal(sha(Buffer.from(original, 'utf8')), originalSha256, 'No other pricing source, term, markup or byte may change.');
}
