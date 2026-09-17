import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
test('historical demonstration media is preserved locally and excluded from publication', () => {
  assert.ok(existsSync(new URL('../public/media/demo/', import.meta.url)));
  assert.equal(existsSync(new URL('../dist/media/demo/', import.meta.url)), false);
});
