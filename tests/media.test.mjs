/**
 * Launch gate · media pipeline.
 * Photographs are evidence, so the files themselves are checked, not the
 * intention to have them.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = join(ROOT, "public", "media");
const DIST = join(ROOT, "dist");
const APP = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");

const manifest = existsSync(join(MEDIA, "manifest.json"))
  ? JSON.parse(readFileSync(join(MEDIA, "manifest.json"), "utf8"))
  : {};

test("the manifest describes real files", () => {
  assert.ok(Object.keys(manifest).length >= 3, "fewer than three photographs are built");
  for (const [name, m] of Object.entries(manifest)) {
    for (const w of m.widths) {
      for (const ext of ["avif", "webp"]) {
        const f = join(MEDIA, `${name}-${w}.${ext}`);
        assert.ok(existsSync(f), `missing derivative ${name}-${w}.${ext}`);
      }
    }
    assert.ok(existsSync(join(MEDIA, `${name}.jpg`)), `missing JPEG fallback for ${name}`);
    assert.ok(m.widths.includes(m.fallback), `${name}: fallback width is not built`);
  }
});

test("nothing is upscaled beyond its master", () => {
  for (const [name, m] of Object.entries(manifest)) {
    for (const w of m.widths) {
      assert.ok(w <= m.width, `${name}: derivative ${w}px is wider than the master ${m.width}px`);
    }
  }
});

test("the aspect ratio the CSS reserves matches the file", () => {
  /* A wrong ratio here is a layout shift on every load. */
  const ratios = { "portrait-tanmay": 4 / 5, "practice-handstand-trunk": 5 / 7, "practice-sitting-pine": 4 / 5 };
  for (const [name, want] of Object.entries(ratios)) {
    const m = manifest[name];
    if (!m) continue;
    const got = m.width / m.height;
    assert.ok(Math.abs(got - want) < 0.005, `${name}: ratio ${got.toFixed(4)} is not ${want.toFixed(4)}`);
  }
});

test("the app declares the same widths the pipeline built", () => {
  for (const [name, m] of Object.entries(manifest)) {
    const key = name.replace("practice-", "").replace("portrait-tanmay", "portrait");
    const decl = APP.match(new RegExp(`base:\\s*"/media/${name}",\\s*widths:\\s*\\[([^\\]]+)\\]`));
    assert.ok(decl, `App.tsx does not declare ${name} (${key})`);
    const widths = decl[1].split(",").map((s) => Number(s.trim()));
    assert.deepEqual(widths, m.widths, `${name}: App.tsx widths differ from the built files`);
  }
});

test("no public derivative carries camera metadata", () => {
  for (const f of readdirSync(MEDIA)) {
    if (!/\.(jpg|webp|avif|png)$/.test(f)) continue;
    const head = readFileSync(join(MEDIA, f)).subarray(0, 8192).toString("latin1");
    for (const marker of ["Exif", "GPS", "ICC_PROFILE\0\0", "http://ns.adobe.com/xap"]) {
      assert.ok(!head.includes(marker), `${f} still carries ${marker}`);
    }
  }
});

test("no single asset blows the image budget", () => {
  const LIMIT = 600 * 1024;
  for (const f of readdirSync(MEDIA)) {
    if (!/\.(jpg|webp|avif|png)$/.test(f)) continue;
    const size = statSync(join(MEDIA, f)).size;
    assert.ok(size <= LIMIT, `${f} is ${(size / 1024).toFixed(0)} kB, over the ${LIMIT / 1024} kB budget`);
  }
});

test("generated material assets are material, and validated", () => {
  assert.ok(existsSync(join(MEDIA, "edge-linen-torn.png")), "the linen edge mask is missing");
  assert.ok(existsSync(join(MEDIA, "surface-ink-cotton.webp")), "the ink cotton tile is missing");
  /* Only two generated assets are allowed on the public site. */
  const generated = readdirSync(MEDIA).filter((f) => /^(edge-|surface-)/.test(f));
  assert.equal(generated.length, 2, `expected two generated assets, found ${generated.join(", ")}`);
});

test("optional media collapses instead of leaving an empty frame", () => {
  assert.match(APP, /onError=\{\(\) => setGone\(true\)\}/, "photographs do not remove themselves when absent");
  assert.match(APP, /onError=\{\(\) => setNoPortrait\(true\)\}/, "the portrait does not collapse when absent");
  assert.match(APP, /if \(gone\) return null;/, "the figure still renders after an error");
});

test("every photograph declares its intrinsic size and a sizes hint", () => {
  const imgs = [...APP.matchAll(/<img[\s\S]{0,600}?\/>/g)].map((m) => m[0]);
  assert.ok(imgs.length >= 2, "no img tags found");
  for (const img of imgs) {
    assert.match(img, /width=\{/, "an img has no width");
    assert.match(img, /height=\{/, "an img has no height");
    assert.match(img, /sizes=/, "an img has no sizes");
    assert.match(img, /(loading=|decoding="sync")/, "an img declares no loading behaviour");
  }
});

test("the hero is eager and everything else is lazy", () => {
  assert.match(APP, /fetchPriority: "high"/, "the hero portrait is not prioritised");
  assert.match(APP, /loading=\{eager \? "eager" : "lazy"\}/, "below-fold images are not lazy");
});

test("what is in public/media reaches dist/media", () => {
  if (!existsSync(join(DIST, "media"))) return;
  for (const f of readdirSync(MEDIA)) {
    if (!/\.(jpg|webp|avif|png)$/.test(f)) continue;
    assert.ok(existsSync(join(DIST, "media", f)), `${f} did not reach dist`);
  }
});
