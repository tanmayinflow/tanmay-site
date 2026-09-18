import test from 'node:test';
import assert from 'node:assert/strict';
import { withoutAuthorizedDesktopMotion } from './desktop-motion-authorized-delta-2026-09-18.mjs';
import { readFileSync } from 'node:fs';
import { ownerCopyDelta, withoutAuthorizedOwnerCopy } from './owner-copy-authorized-delta-2026-09-17.mjs';

test('owner review permits only the 34 recorded bilingual replacements before the original guards', () => {
  assert.equal(ownerCopyDelta.files.reduce((sum, file) => sum + file.replacements.length, 0), 34);
  for (const file of ownerCopyDelta.files) {
    const current = withoutAuthorizedDesktopMotion(file.path, readFileSync(new URL('../' + file.path, import.meta.url)));
    withoutAuthorizedOwnerCopy(file.path, current);
    assert.throws(() => withoutAuthorizedOwnerCopy(file.path, Buffer.concat([current, Buffer.from('\n')])));
    const replacement = file.replacements[0];
    assert.throws(() => withoutAuthorizedOwnerCopy(file.path, Buffer.from(current.toString('utf8').replace(replacement.after, replacement.before))));
  }
});

test('owner copy approval cannot silently change professional boundaries or approved counts', () => {
  for (const relativePath of ['src/App.tsx', 'src/mobile/approved-content.ts']) {
    const current = withoutAuthorizedDesktopMotion(relativePath, readFileSync(new URL('../' + relativePath, import.meta.url))).toString('utf8');
    for (const [before, after] of [['Moje práce je trenérská.', 'Moje práce je fyzioterapie.'], ['150+', '200+']]) {
      assert.ok(current.includes(before));
      assert.throws(() => withoutAuthorizedOwnerCopy(relativePath, Buffer.from(current.replace(before, after))));
    }
  }
});
