import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { consultationDelta, withoutAuthorizedConsultationCopy } from './owner-copy-authorized-delta-2026-10-27.mjs';

test('owner consultation copy reverses exactly to the preceding release and rejects unrelated changes', () => {
  assert.equal(consultationDelta.files.reduce((n, file) => n + file.replacements.length, 0), 96);
  for (const file of consultationDelta.files) {
    const current = readFileSync(new URL('../' + file.path, import.meta.url));
    withoutAuthorizedConsultationCopy(file.path, current);
    assert.throws(() => withoutAuthorizedConsultationCopy(file.path, Buffer.concat([current, Buffer.from('\n')])));
    for (const [before, after] of [['150+', '200+'], ['Moje práce je trenérská.', 'Moje práce je fyzioterapie.'], ['REGULAR_TRAINING.priceForFourCzk', '3300'], ['className=', 'data-altered=']]) {
      if (current.includes(before)) assert.throws(() => withoutAuthorizedConsultationCopy(file.path, Buffer.from(current.toString().replace(before, after))));
    }
  }
});
