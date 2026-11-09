import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {desktopEdgeDelta, withoutAuthorizedDesktopEdges, restoreDesktopEdgesIfCurrent} from './desktop-edge-authorized-2026-11-09.mjs';

test('desktop hero and viewport-edge corrections preserve the prior approved source byte-for-byte', () => {
  assert.equal(desktopEdgeDelta.baseline, '02d0df1e755ee1ed419a4fdc0fb21ee995da10fa');
  assert.deepEqual(desktopEdgeDelta.files.map(file => file.path), [
    'src/desktop/responsive-hero.css',
    'src/desktop/responsive-home-practice.css',
  ]);
  for (const file of desktopEdgeDelta.files) {
    assert.ok(file.replacements.length > 0, 'Record an actual reviewed change: ' + file.path);
    const bytes = readFileSync(new URL('../' + file.path, import.meta.url));
    const restored = withoutAuthorizedDesktopEdges(file.path, bytes);
    assert.deepEqual(restoreDesktopEdgesIfCurrent(file.path, bytes), restored);
    const unreviewed = Buffer.concat([bytes, Buffer.from('\nUNREVIEWED')]);
    assert.throws(() => withoutAuthorizedDesktopEdges(file.path, unreviewed));
    assert.equal(restoreDesktopEdgesIfCurrent(file.path, unreviewed), unreviewed);
  }
  const unrelated = Buffer.from('unrelated source remains unchanged');
  assert.equal(withoutAuthorizedDesktopEdges('src/mobile/preview-mobile-scroll.ts', unrelated), unrelated);
});
