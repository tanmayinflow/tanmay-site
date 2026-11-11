import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const delta=JSON.parse(readFileSync(new URL('./lsit-edge-refinement-2026-11-11.json',import.meta.url)));
const shadow=JSON.parse(readFileSync(new URL('./lsit-shadow-2026-11-11.json',import.meta.url)));
export function restoreLsitEdges(path,bytes){
 if(path===shadow.path&&createHash('sha256').update(bytes).digest('hex')===shadow.afterSha256)return Buffer.from(shadow.before,'base64');
 return path===delta.path&&createHash('sha256').update(bytes).digest('hex')===delta.afterSha256?Buffer.from(delta.before,'base64'):bytes;
}
