import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { POSTS } from '../src/site.js';
import { videoSizes } from '../worker/media-range.mjs';

// Fingerprints let a public checkout check the delivered bundle without
// redistributing the unpublished editorial text as test data.
const paragraphs = new Set(JSON.parse(readFileSync(new URL('./unpublished-fingerprints.json', import.meta.url))));
// Two short paragraphs have only 17 and 22 characters.
const prefixLengths = [17, 22, 36];

export function containsUnpublishedParagraph(text) {
  for (const match of text.matchAll(/["'`>]/g)) {
    const start = match.index + 1;
    for (const length of prefixLengths) {
      const head = text.slice(start, start + length);
      if (head.length === length && paragraphs.has(createHash('sha256').update(head).digest('hex'))) return true;
    }
  }
  return false;
}

export function verifyPublicOutput(dist) {
  if (POSTS.length) throw new Error('Unpublished journal metadata has entered the website.');
  function checkDirectory(dir) {
    for (const entry of readdirSync(dir, {withFileTypes:true})) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) checkDirectory(path);
      else if (/^(?:denik|post-p[123])-(?:cs|en)\.jpg$/.test(entry.name)) throw new Error('Retired journal artwork found in the public output.');
      else if (/\.(?:js|mjs|json|html|map)$/.test(entry.name) && containsUnpublishedParagraph(readFileSync(path,'utf8'))) {
        throw new Error('Unpublished journal text found in the public output.');
      }
    }
  }
  checkDirectory(dist);
  for (const [path, size] of videoSizes) {
    if (statSync(join(dist, path)).size !== size) throw new Error('Update the review video length before releasing '+path);
  }
}
