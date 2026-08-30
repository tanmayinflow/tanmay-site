/**
 * Launch gate · the site as a browser actually renders it.
 *
 * Structure, keyboard and media cannot be judged from source, so this
 * suite drives the production build in headless Chromium.
 *
 * It needs a browser, which is an authoring tool and therefore is NOT a
 * dependency of this project. Install it on demand:
 *
 *     npm run browser:setup
 *
 * Without it the whole suite skips cleanly, so `npm test` still passes
 * on a machine that has no browser, and the Cloudflare build never has
 * to install one.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, allPages, CLIENT_APP_URL, GATE_META } from "../src/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

let chromium = null;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  /* not installed, the suite skips */
}
const SKIP = chromium ? false : "no browser · run `npm run browser:setup`";

/* --------------------------------------------------------------- server */
/** Mirrors Cloudflare Workers Assets: directory index, 404 page, _redirects. */
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".svg": "image/svg+xml",
};

function readRedirects() {
  const f = join(ROOT, "public", "_redirects");
  const map = new Map();
  if (!existsSync(f)) return map;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [from, to, code] = t.split(/\s+/);
    if (from && to) map.set(from, [to, Number(code) || 302]);
  }
  return map;
}

let server, base;

before(async () => {
  if (SKIP) return;
  const redirects = readRedirects();
  server = createServer((req, res) => {
    const p = decodeURI(req.url.split("?")[0]);
    if (redirects.has(p)) {
      const [to, code] = redirects.get(p);
      res.writeHead(code, { Location: to });
      return res.end();
    }
    const cands = [join(DIST, p), join(DIST, p, "index.html")];
    for (const c of cands) {
      if (existsSync(c) && statSync(c).isFile()) {
        res.writeHead(200, { "Content-Type": TYPES[extname(c)] || "application/octet-stream" });
        return res.end(readFileSync(c));
      }
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(readFileSync(join(DIST, "404.html")));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = "http://127.0.0.1:" + server.address().port;
});

after(async () => {
  if (server) await new Promise((r) => server.close(r));
});

async function withPage(fn, opts = {}) {
  const b = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ["--no-sandbox"],
  });
  const ctx = await b.newContext({
    viewport: opts.viewport || { width: 1280, height: 900 },
    reducedMotion: opts.reducedMotion,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/status of 404/.test(m.text())) errors.push(m.text());
  });
  try {
    return await fn(page, errors);
  } finally {
    await b.close();
  }
}

const PAGES = allPages();

/* ---------------------------------------------------------------- tests */
test("every route renders exactly one H1, and it is not empty", { skip: SKIP }, async () => {
  await withPage(async (page, errors) => {
    for (const p of PAGES) {
      await page.goto(base + p.path, { waitUntil: "load" });
      const h1s = await page.$$eval("h1", (ns) => ns.map((n) => n.textContent.trim()));
      assert.equal(h1s.length, 1, `${p.path}: ${h1s.length} H1 elements`);
      assert.ok(h1s[0].length > 1, `${p.path}: empty H1`);
      const lang = await page.getAttribute("html", "lang");
      assert.equal(lang, p.lang, `${p.path}: html lang is ${lang}`);
    }
    assert.deepEqual(errors, [], "console errors while rendering the routes");
  });
});

test("404 renders the not-found page, not the home page", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    const res = await page.goto(base + "/tohle-tady-neni", { waitUntil: "load" });
    assert.equal(res.status(), 404);
    const h1 = await page.textContent("h1");
    assert.match(h1, /není|not here/i);
  });
});

test("landmarks and the skip link work", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    assert.equal(await page.locator("main#main").count(), 1, "no main landmark");
    assert.ok((await page.locator("nav").count()) >= 1, "no nav landmark");
    assert.equal(await page.locator("footer").count(), 1, "no footer landmark");
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement.className);
    assert.match(first, /skip/, "the skip link is not the first tab stop");
    await page.keyboard.press("Enter");
    assert.match(page.url(), /#main$/, "the skip link does not target the content");
  });
});

test("the client entry is reachable and points at the client app", { skip: SKIP }, async () => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await withPage(async (page) => {
      await page.goto(base + "/", { waitUntil: "load" });
      /* Visible in the header without opening any menu. */
      const header = page.locator(".topbar a.centry");
      assert.equal(await header.count(), 1, `${viewport.width}px: no client entry in the header`);
      assert.ok(await header.isVisible(), `${viewport.width}px: the client entry is hidden`);
      assert.equal(await header.getAttribute("href"), CLIENT_APP_URL);
      assert.equal(await header.getAttribute("target"), "_blank");
      assert.match(await header.getAttribute("rel"), /noopener/);
      const box = await header.boundingBox();
      assert.ok(box.height >= 24, `${viewport.width}px: client entry is only ${box.height}px tall`);
    }, { viewport });
  }
});

test("no public link reaches the Main App", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    for (const p of PAGES) {
      await page.goto(base + p.path, { waitUntil: "load" });
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
      for (const h of hrefs) {
        assert.ok(!/app\.tanmaypractice\.com/.test(h), `${p.path} links to the Main App`);
        assert.ok(h && h !== "#" && h !== "undefined", `${p.path} has an empty link`);
      }
    }
  });
});

test("the mobile menu opens, closes on Escape, and keeps the client entry out of hiding", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    const burger = page.locator("button.burger");
    assert.ok(await burger.isVisible(), "no menu button at 390px");
    assert.equal(await page.locator("#tm-menu").isVisible(), false);
    await burger.focus();
    await page.keyboard.press("Enter");
    assert.equal(await burger.getAttribute("aria-expanded"), "true");
    assert.ok(await page.locator("#tm-menu").isVisible(), "the menu did not open");
    await page.keyboard.press("Escape");
    assert.equal(await burger.getAttribute("aria-expanded"), "false");
    assert.equal(await page.locator("#tm-menu").isVisible(), false, "Escape did not close the menu");
  }, { viewport: { width: 390, height: 844 } });
});

test("old hash links still land on the right room", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    /* Cílové místnosti jsou během dočasného spuštění za bránou, takže
       správná odpověď je adresa místnosti + věta brány. Staré adresy
       Deníku (zapisky) končí na /praxe. */
    for (const [hash, path, heading] of [
      ["#/praxe", "/praxe", /pracuji/i],
      ["#/udalosti", "/spoluprace", /pracuji/i],
      ["#/kontakt", "/spoluprace", /pracuji/i],
      ["#/zapisky", "/praxe", /pracuji/i],
      ["#/poezie", "/pribeh", /pracuji/i],
    ]) {
      await page.goto(base + "/" + hash, { waitUntil: "load" });
      await page.waitForTimeout(120);
      assert.ok(page.url().endsWith(path), `${hash} became ${page.url()}, expected ${path}`);
      assert.match(await page.textContent("h1"), heading, `${hash}: wrong room`);
    }
  });
});

test("internal navigation updates the address, the title and history", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    await page.click('a[href="/praxe"]');
    await page.waitForTimeout(120);
    assert.ok(page.url().endsWith("/praxe"), "pushState did not change the address");
    assert.equal(await page.title(), GATE_META.cs.title, "the title did not follow the gated route");
    assert.equal(
      await page.getAttribute('link[rel="canonical"]', "href"),
      ORIGIN + "/praxe",
      "the canonical did not follow the route"
    );
    await page.goBack();
    await page.waitForTimeout(120);
    assert.ok(page.url().endsWith("/") || page.url().endsWith(":" + new URL(base).port + "/"), "back did not return home");
    await page.goForward();
    await page.waitForTimeout(120);
    assert.ok(page.url().endsWith("/praxe"), "forward did not work");
  });
});

test("the language switch swaps the edition and keeps the room", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/spoluprace", { waitUntil: "load" });
    await page.click('.topbar .lang a[hreflang="en"]');
    await page.waitForTimeout(120);
    assert.ok(page.url().endsWith("/en/work-with-me"), "the switch left the room");
    assert.equal(await page.getAttribute("html", "lang"), "en");
    const text = await page.textContent("body");
    assert.ok(!/Spolupráce/.test(await page.textContent("h1")), "two editions on one page");
    assert.match(text, /Work with me/);
  });
});

test("only one complete language is on a page", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/praxe", { waitUntil: "load" });
    const cs = await page.textContent("main");
    assert.ok(!/Three anchors/.test(cs), "English copy on the Czech route");
    await page.goto(base + "/en/practice", { waitUntil: "load" });
    const en = await page.textContent("main");
    assert.ok(!/Tři kotvy/.test(en), "Czech copy on the English route");
  });
});

test("every rendered image actually loads and reserves its space", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    for (const path of ["/", "/denik", "/en/", "/en/journal"]) {
      await page.goto(base + path, { waitUntil: "load" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);
      const imgs = await page.$$eval('img:not([aria-hidden="true"])', (ns) =>
        ns.map((n) => ({
          src: n.currentSrc || n.src,
          ok: n.complete && n.naturalWidth > 0,
          w: n.getAttribute("width"),
          h: n.getAttribute("height"),
        }))
      );
      for (const i of imgs) {
        assert.ok(i.ok, `${path}: image did not load: ${i.src}`);
        assert.ok(i.w && i.h, `${path}: image without intrinsic size: ${i.src}`);
      }
    }
  });
});

test("the browser picks a modern format, not the JPEG fallback", { skip: SKIP }, async () => {
  /* Od Wave 25 nemá Home fotografii .portrait — hrdina je výřez s alfou.
     Moderní formát se posuzuje na pražském portrétu v bloku O mně,
     který je líný pod ohybem, takže se k němu nejdřív doroluje. */
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    const src = await page.$eval("figure.figure img", (n) => n.currentSrc);
    assert.match(src, /\.(avif|webp)$/, `the portrait fell back to ${src}`);
  });
});

test("reduced motion shows everything without scrolling", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/spoluprace", { waitUntil: "load" });
    const hidden = await page.$$eval(".rv", (ns) =>
      ns.filter((n) => getComputedStyle(n).opacity === "0").length
    );
    assert.equal(hidden, 0, `${hidden} elements stay invisible under reduced motion`);
  }, { reducedMotion: "reduce" });
});

test("focus is always visible", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/spoluprace", { waitUntil: "load" });
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const style = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return { outline: s.outlineStyle, width: s.outlineWidth, tag: el.tagName };
      });
      if (!style) continue;
      assert.notEqual(style.outline, "none", `focus on ${style.tag} has no outline`);
    }
  });
});

test("no page scrolls sideways at any of the three widths", { skip: SKIP }, async () => {
  for (const w of [390, 834, 1440]) {
    await withPage(async (page) => {
      for (const p of PAGES) {
        await page.goto(base + p.path, { waitUntil: "load" });
        const over = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        assert.ok(over <= 1, `${p.path} at ${w}px overflows by ${over}px`);
      }
    }, { viewport: { width: w, height: 900 } });
  }
});

test("tap targets in the header are large enough on a phone", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    const boxes = await page.$$eval(".topbar a, .topbar button", (ns) =>
      ns.filter((n) => n.offsetParent !== null).map((n) => {
        const r = n.getBoundingClientRect();
        return { t: n.textContent.trim().slice(0, 20), w: r.width, h: r.height };
      })
    );
    for (const b of boxes) {
      assert.ok(b.h >= 24 && b.w >= 24, `tap target "${b.t}" is ${b.w.toFixed(0)}x${b.h.toFixed(0)}`);
    }
  }, { viewport: { width: 390, height: 844 } });
});

test("the site works with the media folder empty", { skip: SKIP }, async () => {
  /* Optional media must collapse, never leave an empty frame: the
     photographs, the cutout with its earth slab, the strata edges and
     the aperture masks all fall back to plain surfaces. */
  await withPage(async (page) => {
    await page.route("**/media/**", (r) => r.abort());
    await page.goto(base + "/", { waitUntil: "load" });
    /* Líné obrázky pod ohybem se o načtení pokusí až při dorolování —
       teprve pak se smí počítat, co po chybě zmizelo. */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    assert.equal(await page.locator(".portrait").count(), 0, "an empty portrait frame is left behind");
    assert.equal(await page.locator("figure.figure").count(), 0, "an empty figure frame is left behind");
    assert.equal(await page.locator(".cutwrap").count(), 0, "an empty cutout frame is left behind");
    assert.equal(await page.locator("h1").count(), 1, "the page broke without media");
    /* The strata band keeps its fixed height with or without the mask,
       so a late-loading asset can never shift layout; without the asset
       it degrades to a straight boundary. */
    const strataHeights = await page.$$eval(".strata", (ns) =>
      ns.map((n) => n.getBoundingClientRect().height)
    );
    for (const h of strataHeights) {
      assert.ok(h > 0 && h <= 100, `a strata band has an unexpected height ${h}px`);
    }
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    assert.ok(over <= 1, "layout breaks without media");
  });
});

test("material surfaces carry the chapters, the cutout appears once", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/", { waitUntil: "load" });
    await page.waitForTimeout(400);
    assert.equal(await page.locator('img[src*="handstand-cutout"]').count(), 1, "the cutout is not on Home exactly once");
    assert.ok((await page.locator(".surf--sand").count()) >= 1, "no sandstone chapter on Home");
    /* Inkoustové a Burnt Earth kapitoly žijí v místnostech, které jsou
       během dočasného spuštění za bránou — brána je klidná, bez
       materiálových povrchů a bez výřezu. Až se místnosti odemknou,
       vrátí se sem jejich původní kontrola. */
    for (const path of ["/praxe", "/pribeh", "/spoluprace", "/denik"]) {
      await page.goto(base + path, { waitUntil: "load" });
      assert.equal(
        await page.locator('img[src*="handstand-cutout"]').count(), 0,
        `${path}: the cutout must appear only on Home`
      );
      for (const sel of [".surf--earth", ".surf--sand", ".band--dark"]) {
        assert.equal(await page.locator(sel).count(), 0, `${path}: a material surface on the launch gate (${sel})`);
      }
    }
  });
});

test("the launch gate shows the approved copy and a way home", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    await page.goto(base + "/praxe", { waitUntil: "load" });
    assert.equal((await page.textContent("h1")).trim(), "Na této stránce právě pracuji.");
    const zpet = page.locator('main a:has-text("Zpět na hlavní stránku")');
    assert.equal(await zpet.count(), 1, "the way home is missing");
    assert.equal(await zpet.getAttribute("href"), "/", "the way home does not lead home");
    assert.equal(await page.locator("main a").count(), 1, "the gate must offer no other CTA");
    await page.goto(base + "/en/practice", { waitUntil: "load" });
    assert.equal((await page.textContent("h1")).trim(), "This page is currently being prepared.");
    assert.equal(await page.locator('main a:has-text("Back to home")').count(), 1);
  });
});

test("the aperture mask lands only on the approved photographs", { skip: SKIP }, async () => {
  await withPage(async (page) => {
    for (const path of ["/", "/praxe", "/denik"]) {
      await page.goto(base + path, { waitUntil: "load" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      const srcs = await page.$$eval(".ap img", (ns) => ns.map((n) => n.currentSrc || n.src));
      for (const src of srcs) {
        assert.match(
          src, /portrait-tanmay|practice-handstand-trunk|practice-sitting-pine/,
          `${path}: the aperture mask crept onto ${src}`
        );
      }
    }
  });
});
