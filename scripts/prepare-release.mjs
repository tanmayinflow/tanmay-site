// Keep unused historical demo media in source evidence, out of the public build.
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const site = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(site, 'dist');
const demo = resolve(dist, 'media/demo');
if (relative(dist, demo) !== ['media', 'demo'].join(sep)) throw new Error('Invalid demo output path');
if (!existsSync(join(dist, 'index.html'))) throw new Error('Build must exist before release preparation');
function checkReferences(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (path === demo) continue;
    if (entry.isDirectory()) checkReferences(path);
    else if (/\.(?:html|js|css|json|xml)$/.test(entry.name) && /\/media\/demo\//.test(readFileSync(path, 'utf8'))) {
      throw new Error(`Published file still references historical demo media: ${relative(dist, path)}`);
    }
  }
}
checkReferences(dist);
rmSync(demo, { recursive: true, force: true });
console.log('Release output excludes unused historical demo media; source originals retained.');
