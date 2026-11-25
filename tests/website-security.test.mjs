import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { verifyPublicOutput } from '../scripts/check-publication.mjs';

test('public build contains no retired journal records, paragraphs or social cards', () => {
  verifyPublicOutput(fileURLToPath(new URL('../dist/', import.meta.url)));
});

test('static assets ship the reviewed browser policy including the optional analytics beacon', () => {
  const text = readFileSync(new URL('../dist/_headers', import.meta.url), 'utf8');
  const [route, ...rules] = text.trim().split(/\r?\n/);
  assert.equal(route, '/*');
  const headers = new Headers();
  for (const rule of rules) {
    const colon = rule.indexOf(':');
    headers.set(rule.slice(0,colon).trim(), rule.slice(colon+1).trim());
  }
  const csp = headers.get('Content-Security-Policy').split(';').map(s => s.trim());
  assert.ok(csp.includes("script-src 'self' https://static.cloudflareinsights.com"));
  assert.ok(csp.includes("connect-src 'self' https://cloudflareinsights.com"));
  for (const boundary of ["object-src 'none'", "form-action 'none'", "frame-ancestors 'self'", "base-uri 'none'"]) assert.ok(csp.includes(boundary));
  assert.equal(headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(headers.get('X-Frame-Options'), 'SAMEORIGIN');
  assert.equal(headers.get('Strict-Transport-Security'), 'max-age=31536000');
  assert.equal(headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
});
