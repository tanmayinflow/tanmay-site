import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annotationsDelta,withoutAuthorizedAnnotations} from './annotations-swipe-authorized-2026-11-06.mjs';
test('nine annotations and swipe support preserve the published baseline and reject unrelated drift',()=>{
 assert.deepEqual(annotationsDelta.files.map(f=>f.path).sort(),[
  'src/App.tsx','src/components/PracticeLsitPhoto.tsx','src/components/practice-lsit-photo.css','src/mobile/MobileShared.tsx','src/components/PreviewReading.tsx','src/components/story-page-scroll.ts','src/mobile/useCircularRail.ts','src/mobile/MobileCollaborationPreview.tsx',
  'src/mobile/preview-mobile-scroll.css','src/mobile/preview-mobile-scroll.ts',
  'src/mobile/preview-rail-swipe.ts','src/preview-copy.ts','src/preview-v3.css'
 ].sort());
 for(const file of annotationsDelta.files){
  const bytes=readFileSync(new URL('../'+file.path,import.meta.url));
  withoutAuthorizedAnnotations(file.path,bytes);
  assert.throws(()=>withoutAuthorizedAnnotations(file.path,Buffer.concat([bytes,Buffer.from('\n// unrelated change')])));
 }
});
