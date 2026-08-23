/**
 * Launch gate · colour contrast.
 *
 * The palette is fixed in the stylesheet, so contrast can be proved by
 * arithmetic rather than by eye. Every text token is checked against the
 * surface it is actually used on.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Read a token out of the stylesheet, so the test cannot drift from it. */
function token(name) {
  const m = APP.match(new RegExp("--" + name + ":\\s*([^;]+);"));
  assert.ok(m, `token --${name} not found in the stylesheet`);
  const v = m[1].trim();
  if (v.startsWith("#")) return { rgb: hex(v), a: 1 };
  const r = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  assert.ok(r, `token --${name} is not a colour: ${v}`);
  return { rgb: [+r[1], +r[2], +r[3]], a: r[4] === undefined ? 1 : +r[4] };
}

const over = (fg, bg) => fg.rgb.map((c, i) => fg.a * c + (1 - fg.a) * bg.rgb[i]);

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fgToken, bgToken) {
  const bg = token(bgToken);
  const fg = over(token(fgToken), bg);
  const a = luminance(fg);
  const b = luminance(bg.rgb);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* [foreground, background, minimum, what it is used for] */
const PAIRS = [
  ["text", "linen", 4.5, "body and headings on the linen field"],
  ["text-2", "linen", 4.5, "secondary body text, labels, nav"],
  ["text-3", "linen", 4.5, "metadata, captions, dates"],
  ["on-dark", "forest", 4.5, "headings inside the dark bands"],
  ["on-dark-2", "forest", 4.5, "body text inside the dark bands"],
  ["on-dark-3", "forest", 4.5, "metadata inside the dark bands"],
  ["sand", "forest", 4.5, "anchor roles and dark-band labels"],
  /* Non-text contrast, WCAG 1.4.11: 3:1 is the bar. */
  ["copper", "linen", 3.0, "focus ring and the copper bindu"],
  ["rule-3", "linen", 3.0, "the border of the client entry control"],
];

for (const [fg, bg, min, use] of PAIRS) {
  test(`contrast · --${fg} on --${bg} (${use})`, () => {
    const r = ratio(fg, bg);
    assert.ok(r >= min, `--${fg} on --${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
  });
}

test("the six Brand V2 colours are unchanged", () => {
  const want = { forest: "#1C1C1A", linen: "#F4F0EB", copper: "#B87333", sage: "#7C8C6E", sand: "#C5B49A" };
  for (const [name, value] of Object.entries(want)) {
    assert.match(APP, new RegExp("--" + name + ":\\s*" + value + ";"), `--${name} is not ${value}`);
  }
});

test("copper never carries small text", () => {
  /* Brand rule. Copper is a gesture, not a text colour. */
  const rules = APP.match(/[^{}]+\{[^{}]*(?:^|[;{\s])color:var\(--copper\)[^{}]*\}/gm) || [];
  for (const r of rules) {
    assert.ok(
      /::selection/.test(r),
      `copper is used as a text colour in: ${r.slice(0, 80)}`
    );
  }
});
