import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { authorizedDesktopBytes, desktopAuthorizedFiles } from './desktop-authorized-deltas.mjs';

export const runtimeDelta = JSON.parse(readFileSync(new URL('./runtime-authorized-deltas-m10.json',import.meta.url),'utf8'));
assert.equal(runtimeDelta.stage,'M10');
const ids = {
  'src/App.tsx':['runtime-import','location-public-scope-and-locale','complete-metadata-and-navigation-focus','public-legacy-rewrite-only','recover-home-from-legacy-error'],
  'src/site.js':['journal-not-public','unpublished-post-routes','no-journal-hash-alias','no-journal-notes-hash-alias','resolve-public-routes-only'],
  'scripts/postbuild.mjs':['shared-structured-metadata-import','single-structured-metadata-definition'],
  'public/_redirects':['remove-unpublished-journal-target'],
};
assert.deepEqual(runtimeDelta.files.map(f=>f.path),Object.keys(ids));
for(const file of runtimeDelta.files)assert.deepEqual(file.replacements.map(r=>r.id),ids[file.path]);
assert.deepEqual(runtimeDelta.newFiles.map(f=>f.path),['src/page-metadata.js','src/runtime-navigation.js']);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export const workingAuthorizedFiles = [...new Set([...desktopAuthorizedFiles,...Object.keys(ids)])];

/** Every original byte outside these exact replacements remains protected. */
export function authorizedWorkingBytes(relativePath, original) {
  let bytes = authorizedDesktopBytes(relativePath,original);
  const rule = runtimeDelta.files.find(f=>f.path===relativePath);
  if(!rule)return bytes;
  if(relativePath==='src/App.tsx')bytes=Buffer.from(bytes.toString('utf8').replaceAll('\r\n','\n'));
  assert.equal(sha(bytes),rule.beforeSha256,'Runtime repair must start at the recorded M9 source: '+relativePath);
  let text=bytes.toString('utf8');
  for(const change of rule.replacements){
    assert.equal(text.split(change.before).length-1,1,'Exactly one runtime replacement: '+change.id);
    text=text.replace(change.before,change.after);
  }
  bytes=Buffer.from(text);
  assert.equal(sha(bytes),rule.authorizedSha256,'Only recorded M10 runtime changes are allowed: '+relativePath);
  return bytes;
}

export function verifyNewRuntimeFiles(site) {
  for(const file of runtimeDelta.newFiles){
    const bytes=readFileSync(new URL(file.path,site));
    assert.equal(bytes.length,file.bytes,'Runtime module size: '+file.path);
    assert.equal(sha(bytes),file.sha256,'Runtime module exact bytes: '+file.path);
  }
}
