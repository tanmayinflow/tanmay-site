import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { desktopMotionDelta, withoutAuthorizedDesktopMotion } from './desktop-motion-authorized-delta-2026-09-18.mjs';
import { withoutAuthorizedOwnerCopy } from './owner-copy-authorized-delta-2026-09-17.mjs';
import { withoutAuthorizedPrivacyChanges } from './privacy-authorized-delta-2026-09-17.mjs';

const path = 'src/App.tsx';
const current = readFileSync(new URL('../src/App.tsx', import.meta.url));

test('desktop motion reconstructs the exact backed-up App before the unchanged content guards', () => {
  const previous = withoutAuthorizedDesktopMotion(path, current);
  assert.equal(createHash('sha256').update(previous).digest('hex'), desktopMotionDelta.beforeSha256);
  withoutAuthorizedPrivacyChanges(withoutAuthorizedOwnerCopy(path, previous));
  const original = previous.toString('utf8'), enhanced = current.toString('utf8');
  // The new story, anchor and cycle containers receive every existing article unchanged.
  for (const [start, end] of [
    ['<div className="story-beats">', '</div><p className="stance-line rv" style={{marginTop:"clamp(30px,4vw,48px)"}}>'],
    ['<div className="practice-anchors-layout"><div>', '\n        </div>\n        <AnchorDiagram />'],
    ['<div className="wrap between-grid">', '</div><div className="wrap collaboration-practice-link-v920">'],
  ]) {
    const begin = original.indexOf(start), finish = original.indexOf(end, begin + start.length);
    assert.ok(begin >= 0 && finish > begin, start);
    assert.ok(enhanced.includes(original.slice(begin + start.length, finish)), 'Original content nodes stay intact: ' + start);
  }
});

test('desktop visual authorization rejects changed qualifications, counts, artwork and arbitrary source drift', () => {
  const text = current.toString('utf8');
  for (const [before, after] of [
    ['Moje práce je trenérská.', 'Moje práce je fyzioterapie.'],
    ['150+', '200+'],
    ['Osobní trenér ve fitness', 'Fyzioterapeut'],
    ['/media/home-v9-4/salto-bw-1385.webp', '/media/generated-replacement.webp'],
    ['useDesktopMotion(loc.routeId + loc.lang + (loc.postId || ""), !mobile)', 'useDesktopMotion(loc.routeId + loc.lang + (loc.postId || ""), true)'],
  ]) {
    assert.ok(text.includes(before), before);
    assert.throws(() => withoutAuthorizedDesktopMotion(path, Buffer.from(text.replace(before, after))));
  }
  assert.throws(() => withoutAuthorizedDesktopMotion(path, Buffer.concat([current, Buffer.from('\n')])));
});
