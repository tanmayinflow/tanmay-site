import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPreviewServer } from '../scripts/preview-built.mjs';

function read(endpoint, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request({ ...endpoint, path, method, agent: false }, async response => {
      try {
        const chunks = [];
        for await (const chunk of response) chunks.push(chunk);
        resolve({ status: response.statusCode, text: Buffer.concat(chunks).toString('utf8') });
      } catch (error) { reject(error); }
    });
    req.on('error', reject);
    req.end();
  });
}

async function listen(server, ...address) {
  const ready = once(server, 'listening');
  server.listen(...address);
  await ready;
}

async function close(server) {
  if (server.listening) await new Promise(resolve => server.close(resolve));
}

async function localEndpoint(server, t) {
  try {
    await listen(server, 0, '127.0.0.1');
    const endpoint = { hostname: '127.0.0.1', port: server.address().port };
    await read(endpoint, '/', 'HEAD');
    return endpoint;
  } catch (error) {
    if (error.code !== 'EACCES' && error.code !== 'EPERM') throw error;
    await close(server);
  }
  // Managed Windows sessions can deny loopback TCP. Local IPC still carries
  // real HTTP messages through the same Node server, including HEAD and 404.
  const name = 'tanmay-preview-' + randomBytes(6).toString('hex');
  const socketPath = process.platform === 'win32' ? '\\\\.\\pipe\\LOCAL\\' + name : join(tmpdir(), name + '.sock');
  await listen(server, socketPath);
  t.diagnostic('Loopback TCP unavailable. Testing the HTTP server over local IPC.');
  return { socketPath };
}

test('local preview serves generated metadata for every direct route, with or without trailing slash', async t => {
  const server = createPreviewServer(fileURLToPath(new URL('../dist/', import.meta.url)));
  try {
    const endpoint = await localEndpoint(server, t);
    const editions = [
      ['cs', ['/', '/spoluprace', '/praxe', '/pribeh', '/soukromi']],
      ['en', ['/en/', '/en/work-with-me', '/en/practice', '/en/story', '/en/privacy']],
    ];
    for (const [lang, paths] of editions) for (const path of paths) for (const slash of ['', '/']) {
      const url = path.replace(/\/$/, '') + slash || '/';
      const response = await read(endpoint, url);
      assert.equal(response.status, 200, url);
      assert.ok(response.text.includes('<html lang="' + lang + '"'), url);
      assert.ok(response.text.includes('name="tm-route"'), url);
    }
    assert.equal((await read(endpoint, '/unknown-preview-page')).status, 404);
    const head = await read(endpoint, '/en/practice', 'HEAD');
    assert.equal(head.status, 200);
    assert.equal(head.text, '');
  } finally { await close(server); }
});
