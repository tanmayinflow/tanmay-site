import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const delta = JSON.parse(readFileSync(new URL('./body-mandala-2026-11-11.json', import.meta.url)));
export function restoreBodyMandala(path, bytes) {
 const hash = createHash('sha256').update(bytes).digest('hex');
 const file = delta.find(item => item.path === path && item.afterSha256 === hash);
 return file ? Buffer.from(file.before, 'base64') : bytes;
}
