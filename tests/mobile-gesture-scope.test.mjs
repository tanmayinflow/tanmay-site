import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {mobileGestureDelta,withoutAuthorizedMobileGesture} from './mobile-gesture-authorized-2026-11-07.mjs';
test('reviewed gesture wave preserves the published baseline, original photo and unrelated source',()=>{
 assert.equal(mobileGestureDelta.baseline,'fe0cb061c8cb71f899a15c1a0a9c62d25429ff64');
 assert.deepEqual(mobileGestureDelta.files.map(f=>f.path).sort(),[
  'src/App.tsx','src/components/PracticeLsitPhoto.tsx','src/components/PreviewReading.tsx',
  'src/components/practice-lsit-photo.css','src/components/story-page-scroll.ts',
  'src/mobile/MobileCollaborationPreview.tsx','src/mobile/MobileSite.tsx','src/mobile/PreviewDetails.tsx',
  'src/mobile/preview-mobile-scroll.ts','src/mobile/preview-rail-swipe.ts','src/mobile/useCircularRail.ts',
  'src/mobile/scroll-layout-scheduler.ts','src/mobile/useMobileBrowserTheme.ts','src/preview-copy.ts','src/preview-v3.css',
  'public/media/practice-lsit-2026-11/copper-edge.svg','public/media/practice-lsit-2026-11/ink-edge.svg'
 ].sort());
 for(const file of mobileGestureDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedMobileGesture(file.path,bytes);
  assert.throws(()=>withoutAuthorizedMobileGesture(file.path,Buffer.concat([bytes,Buffer.from('\nUNREVIEWED')])));
 }
 const original=readFileSync(new URL('../public/media/practice-lsit-2026-11/praxe-original.jpg',import.meta.url));
 assert.equal(createHash('sha256').update(original).digest('hex'),'ddbc0c2ef6ca9a09583384dd6db84af78253ed45a15417e52e2d418b3516c902');
});
