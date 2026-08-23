/**
 * Launch gate · routes, metadata and discovery.
 * Runs against the real build output in dist/, not against intentions.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, LANGS, allPages, ROUTES } from "../src/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PAGES = allPages();

const fileFor = (path) =>
  join(DIST, path === "/" ? "index.html" : path.replace(/^\//, "").replace(/\/$/, "") + "/index.html");

const html = (path) => readFileSync(fileFor(path), "utf8");
const one = (s, re) => {
  const m = s.match(re);
  assert.ok(m, `no match for ${re}`);
  return m[1];
};

test("dist exists — run `npm run build` first", () => {
  assert.ok(existsSync(join(DIST, "index.html")), "dist/index.html missing");
});

test("every public route is a real pre-rendered file", () => {
  for (const p of PAGES) {
    assert.ok(existsSync(fileFor(p.path)), `missing file for ${p.path}`);
  }
});

test("each route carries its own title and description", () => {
  const seen = new Map();
  for (const p of PAGES) {
    const s = html(p.path);
    const title = one(s, /<title>([^<]+)<\/title>/);
    const desc = one(s, /<meta name="description" content="([^"]*)"/);
    assert.ok(title.length > 8, `${p.path}: title too short`);
    assert.ok(desc.length > 40, `${p.path}: description too short`);
    assert.ok(!/^\s*$/.test(desc), `${p.path}: empty description`);
    const key = p.lang + "|" + title;
    assert.ok(!seen.has(key), `${p.path}: title identical to ${seen.get(key)}`);
    seen.set(key, p.path);
  }
});

test("canonical, og:url and the served path agree", () => {
  for (const p of PAGES) {
    const s = html(p.path);
    const canon = one(s, /<link rel="canonical" href="([^"]+)"/);
    const ogUrl = one(s, /<meta property="og:url" content="([^"]+)"/);
    assert.equal(canon, ORIGIN + p.path, `${p.path}: wrong canonical`);
    assert.equal(ogUrl, canon, `${p.path}: og:url differs from canonical`);
    assert.equal((s.match(/rel="canonical"/g) || []).length, 1, `${p.path}: not exactly one canonical`);
  }
});

test("every route declares both editions and an x-default", () => {
  for (const p of PAGES) {
    const s = html(p.path);
    for (const l of LANGS) {
      const tag = l === "cs" ? "cs-CZ" : "en";
      assert.ok(
        s.includes(`hreflang="${tag}" href="${ORIGIN + p.alternates[l]}"`),
        `${p.path}: missing hreflang ${tag}`
      );
    }
    assert.ok(s.includes('hreflang="x-default"'), `${p.path}: missing x-default`);
  }
});

test("the alternate of the alternate is the page itself", () => {
  for (const p of PAGES) {
    const other = p.alternates[p.lang === "cs" ? "en" : "cs"];
    const back = PAGES.find((q) => q.path === other);
    assert.ok(back, `${p.path}: alternate ${other} is not a real page`);
    assert.equal(back.alternates[p.lang], p.path, `${p.path}: alternates are not symmetric`);
  }
});

test("html lang matches the route language", () => {
  for (const p of PAGES) {
    assert.match(html(p.path), new RegExp(`<html lang="${p.lang}">`), `${p.path}: wrong html lang`);
  }
});

test("every route has a social preview image that exists", () => {
  for (const p of PAGES) {
    const s = html(p.path);
    const img = one(s, /<meta property="og:image" content="([^"]+)"/);
    assert.ok(img.startsWith(ORIGIN + "/og/"), `${p.path}: og:image is not first party`);
    const f = join(DIST, img.slice(ORIGIN.length));
    assert.ok(existsSync(f), `${p.path}: og:image file ${img} does not exist`);
    assert.match(s, /<meta name="twitter:card" content="summary_large_image">/);
  }
});

test("a crawler that runs no JavaScript still reads the metadata", () => {
  /* The head must be complete before the bundle executes: strip
     everything from <div id="root"> onwards and the tags must survive. */
  const s = html("/spoluprace");
  const head = s.slice(0, s.indexOf('<div id="root">'));
  for (const needle of ["<title>", 'name="description"', 'rel="canonical"', 'property="og:image"']) {
    assert.ok(head.includes(needle), `head is missing ${needle}`);
  }
});

test("structured data covers only visible verified facts", () => {
  const forbidden = ["Offer", "AggregateRating", "Review", "priceCurrency", "openingHours", "hasCredential", '"Event"'];
  for (const p of PAGES) {
    const s = html(p.path);
    const blocks = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    for (const b of blocks) {
      const raw = b[1];
      JSON.parse(raw); // must be valid JSON
      for (const f of forbidden) {
        assert.ok(!raw.includes(f), `${p.path}: structured data contains ${f}`);
      }
    }
  }
});

test("404 is a real page, not the home page", () => {
  const s = readFileSync(join(DIST, "404.html"), "utf8");
  assert.match(s, /content="notfound:cs"/);
  assert.match(s, /<title>Str.nka nenalezena/);
  const w = readFileSync(join(ROOT, "wrangler.jsonc"), "utf8");
  assert.match(w, /"not_found_handling"\s*:\s*"404-page"/, "Cloudflare would not serve 404.html");
});

test("sitemap lists exactly the pages that exist", () => {
  const s = readFileSync(join(DIST, "sitemap.xml"), "utf8");
  const locs = [...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const want = PAGES.map((p) => ORIGIN + p.path).sort();
  assert.deepEqual(locs.slice().sort(), want);
  assert.equal(new Set(locs).size, locs.length, "sitemap has duplicates");
});

test("robots allows crawling and names the sitemap", () => {
  const s = readFileSync(join(DIST, "robots.txt"), "utf8");
  assert.match(s, /^User-agent: \*/m);
  assert.match(s, /^Allow: \/$/m);
  assert.match(s, new RegExp("^Sitemap: " + ORIGIN + "/sitemap.xml$", "m"));
  assert.ok(!/Disallow: \/$/m.test(s), "robots blocks the whole site");
});

test("old public paths still resolve", () => {
  const s = readFileSync(join(ROOT, "public", "_redirects"), "utf8");
  for (const [from, to] of [
    ["/udalosti", "/spoluprace"],
    ["/kontakt", "/spoluprace"],
    ["/zapisky", "/denik"],
    ["/poezie", "/pribeh"],
  ]) {
    const line = s.split("\n").find((l) => l.trim().startsWith(from + " "));
    assert.ok(line, `no redirect for ${from}`);
    assert.ok(line.includes(to), `${from} does not point at ${to}`);
    assert.ok(line.includes("301"), `${from} is not a permanent redirect`);
  }
  /* A redirect target must itself be a real page, or the old link 404s. */
  for (const l of s.split("\n")) {
    const parts = l.trim().split(/\s+/);
    if (l.trim().startsWith("#") || parts.length < 2) continue;
    assert.ok(PAGES.some((p) => p.path === parts[1]), `redirect target ${parts[1]} is not a page`);
  }
});

test("no redirect loops", () => {
  const s = readFileSync(join(ROOT, "public", "_redirects"), "utf8");
  const map = new Map();
  for (const l of s.split("\n")) {
    const parts = l.trim().split(/\s+/);
    if (l.trim().startsWith("#") || parts.length < 2) continue;
    map.set(parts[0], parts[1]);
  }
  for (const from of map.keys()) {
    let cur = from;
    for (let i = 0; i < 10 && map.has(cur); i++) cur = map.get(cur);
    assert.ok(!map.has(cur), `redirect chain from ${from} does not terminate`);
  }
});

test("the four rooms are the navigation, and nothing else is", () => {
  const nav = ROUTES.filter((r) => r.nav).map((r) => r.id);
  assert.deepEqual(nav, ["praxe", "pribeh", "spoluprace", "denik"]);
});
