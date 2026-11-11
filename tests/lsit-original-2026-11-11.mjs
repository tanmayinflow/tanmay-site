import {restoreLsitEdges} from './lsit-edge-refinement-2026-11-11.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const delta=JSON.parse(readFileSync(new URL('./lsit-original-2026-11-11.json',import.meta.url)));
export function restoreOriginalLsit(path,bytes){
 bytes=restoreLsitEdges(path,bytes);
 return path===delta.path&&createHash('sha256').update(bytes).digest('hex')===delta.afterSha256?Buffer.from(delta.before,'base64'):bytes;
}
