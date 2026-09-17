import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pricingDelta, verifyAuthorizedPricingBytes } from './pricing-authorized-delta-2026-09-17.mjs';

test('approved prepaid-period guard rejects changes outside the exact bilingual clarification', () => {
  const manifest = JSON.parse(readFileSync(new URL('./fixtures/desktop-v922/original-site-manifest.json', import.meta.url), 'utf8'));
  const original = manifest.find(entry => entry.path === pricingDelta.path);
  assert.ok(original);
  const current = readFileSync(new URL('../' + pricingDelta.path, import.meta.url));
  verifyAuthorizedPricingBytes(current, original.sha256);
  for (const mutation of [
    current.toString('utf8').replace('od prvního tréninku', 'od zaplacení'),
    current.toString('utf8').replace('from the first session', 'from payment'),
    current.toString('utf8').replace('REGULAR_TRAINING.priceForFourCzk', '3300'),
    current.toString('utf8').replace('className="pricing-terms"', 'className="changed-terms"'),
  ]) {
    assert.throws(() => verifyAuthorizedPricingBytes(Buffer.from(mutation), original.sha256));
  }
});
