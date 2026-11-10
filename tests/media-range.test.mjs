import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker, { videoPath } from '../worker/media-range.mjs';

const data = Uint8Array.from({ length: 100 }, (_, i) => i);
function env() {
  return { ASSETS: { async fetch(request) {
    return new Response(request.method === 'HEAD' ? null : data, {
      headers: { 'Content-Length': '100', 'Content-Type': 'video/mp4', ETag: '"review"' },
    });
  } } };
}
const request = (headers = {}, method = 'GET') => new Request('https://tanmaypractice.com' + videoPath, { headers, method });

test('native media ranges return exact bytes, lengths and bounds', async () => {
  for (const [range, start, end] of [['bytes=0-1',0,1],['bytes=40-49',40,49],['bytes=95-',95,99],['bytes=-4',96,99],['bytes=98-999',98,99]]) {
    const response = await worker.fetch(request({ Range: range }), env());
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/100`);
    assert.equal(response.headers.get('Content-Length'), String(end-start+1));
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data.slice(start,end+1));
  }
});

test('invalid bounds, conditional requests and HEAD keep HTTP semantics', async () => {
  for (const range of ['bytes=100-', 'bytes=50-40', 'bytes=-0']) {
    const response = await worker.fetch(request({ Range: range }), env());
    assert.equal(response.status,416); assert.equal(response.headers.get('Content-Range'),'bytes */100');
    assert.equal((await response.arrayBuffer()).byteLength,0);
  }
  for (const headers of [{}, {Range:'bytes=0-1,4-5'}, {Range:'bytes=0-1','If-Range':'"old"'}]) {
    const response=await worker.fetch(request(headers),env());
    assert.equal(response.status,200);assert.equal((await response.arrayBuffer()).byteLength,100);
  }
  const valid=await worker.fetch(request({Range:'bytes=0-1','If-Range':'"review"'}),env());
  assert.equal(valid.status,206);
  const head=await worker.fetch(request({Range:'bytes=0-1'},'HEAD'),env());
  assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
});

test('only the approved video is routed first; other routes and errors pass through', async () => {
  const config=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url)));
  assert.deepEqual(config.assets.run_worker_first,[videoPath]);
  assert.equal(config.assets.not_found_handling,'404-page');
  assert.equal(config.assets.binding,'ASSETS');
  for (const url of [videoPath,'/spoluprace/','/missing']) {
    const response=new Response('unchanged',{status:404});
    assert.equal(await worker.fetch(new Request('https://tanmaypractice.com'+url),{ASSETS:{fetch:async()=>response}}),response);
  }
});
