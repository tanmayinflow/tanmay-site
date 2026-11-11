import {restoreOriginalLsit} from './lsit-original-2026-11-11.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const delta=JSON.parse(readFileSync(new URL('./lsit-cutout-authorized-2026-11-08.json',import.meta.url)));
export function restoreLsitCutoutIfCurrent(path,bytes){
 bytes=restoreOriginalLsit(path,bytes);
 const file=delta.files.find(f=>f.path===path);
 return file&&createHash('sha256').update(bytes).digest('hex')===file.afterSha256?Buffer.from(file.before):bytes;
}
