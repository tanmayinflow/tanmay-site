import test from 'node:test';
import assert from 'node:assert/strict';
import { withoutAuthorizedDesktopMotion } from './desktop-motion-authorized-delta-2026-09-18.mjs';
import { readFileSync } from 'node:fs';
import { withoutAuthorizedPrivacyChanges } from './privacy-authorized-delta-2026-09-17.mjs';
import { withoutAuthorizedOwnerCopy } from './owner-copy-authorized-delta-2026-09-17.mjs';

test('approved privacy guard rejects changed purposes, EU scope, complaint link and unrelated page edits', () => {
  const current = withoutAuthorizedOwnerCopy('src/App.tsx', withoutAuthorizedDesktopMotion('src/App.tsx', readFileSync(new URL('../src/App.tsx', import.meta.url))));
  withoutAuthorizedPrivacyChanges(current);
  for (const [before, after] of [
    ['Domluvu spolupráce zpracovávám pro kroky před uzavřením smlouvy na tvoji žádost.', 'Domluvu spolupráce zpracovávám na základě souhlasu.'],
    ['Cloudflare Web Analytics is configured not to measure visits from the European Union.', 'Cloudflare Web Analytics measures every visit.'],
    ['href="https://uoou.gov.cz/"', 'href="https://example.com/"'],
    ['Moje práce je trenérská.', 'Moje práce je fyzioterapie.'],
  ]) {
    assert.ok(current.toString('utf8').includes(before));
    assert.throws(() => withoutAuthorizedPrivacyChanges(Buffer.from(current.toString('utf8').replace(before, after))));
  }
});
