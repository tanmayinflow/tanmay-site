/**
 * Launch gate · public truth.
 *
 * These run against the shipped bundle, which is what a visitor actually
 * receives. Every negative control here corresponds to a rule in
 * PUBLIC-FACTS-LEDGER.md. If a rule changes, change the ledger first.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CLIENT_APP_URL, MAIL, IG_URL, WHATSAPP_URL } from "../src/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

/**
 * Everything a visitor can receive that this project actually authored:
 * the app chunk and every HTML, XML and CSS file. The React vendor chunk
 * is skipped, otherwise the library's own minified strings answer for us.
 */
function shipped() {
  let out = "";
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== "fonts") walk(p); continue; }
      else if (/^vendor-.*\.js$/.test(e.name)) continue;
      else if (/\.(js|html|xml|css)$/.test(e.name) || e.name === "robots.txt") {
        out += readFileSync(p, "utf8") + "\n";
      }
    }
  };
  walk(DIST);
  return out;
}

const BUNDLE = existsSync(DIST) ? shipped() : "";
const APP = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");

test("dist exists — run `npm run build` first", () => {
  assert.ok(BUNDLE.length > 1000, "no build output to check");
});

// ---------------------------------------------------------------- client
test("the client entry points at the client app and nowhere else", () => {
  assert.ok(BUNDLE.includes(CLIENT_APP_URL), "klient.tanmaypractice.com is not in the bundle");
  assert.ok(BUNDLE.includes("Vstup pro klienty"), "the Czech client label is missing");
  assert.ok(BUNDLE.includes("Client login"), "the English client label is missing");
});

test("NEGATIVE CONTROL · the Main App is never linked publicly", () => {
  assert.ok(!/app\.tanmaypractice\.com/.test(BUNDLE), "the public site links to the Main App");
});

test("approved Czech Home copy and removals reached the shipped build", () => {
  for (const text of [
    "Osobní trenér v Praze | Kryštof Švec · Tanmay Practice",
    "Osobní trénink a pohybová praxe · Praha",
    "Jak spolupracovat",
    "Nechceš pokaždé začínat znovu.",
    "Jak spolu pracujeme",
    "Síla, kterou umíš použít",
    "Co má teď smysl",
    "Plán podle reality",
    "Od setkání k vlastní praxi",
    "Možnosti spolupráce",
    "Vlastní praxe. Zkušenost s lidmi. Odborné vzdělání.",
    "První krok",
    "Napiš mi.",
    "tanmaya · „tím prostoupený“",
    "Kryštof Švec · Tanmay Practice",
  ]) assert.ok(BUNDLE.includes(text), `approved Home text is missing: ${text}`);
  /* The footer year is interpolated at runtime, so the shipped bundle never
     carries "© <year> Kryštof Švec" as one literal. Check the two halves. */
  assert.match(APP, /© \{new Date\(\)\.getFullYear\(\)\} Kryštof Švec · Tanmay Practice/,
    "the footer copyright line changed unexpectedly");
});

test("NEGATIVE CONTROL · no invitation mechanics are exposed", () => {
  for (const re of [/pozv[aá]nk/i, /\binvite\b/i, /invitation/i, /zvac[ií]/i]) {
    assert.ok(!re.test(BUNDLE), `the bundle mentions invitation mechanics: ${re}`);
  }
});

// ----------------------------------------------------------------- offer
test("NEGATIVE CONTROL · no price is published", () => {
  const priced = BUNDLE.match(/\d[\d\s .,]{2,}\s?(?:K[čc]|CZK|EUR|€)/gi) || [];
  assert.deepEqual(priced, [], `a price reached the public bundle: ${priced.join(", ")}`);
  for (const n of ["5 200", "9 600", "1 500", "30 000", "5200", "9600"]) {
    assert.ok(!BUNDLE.includes(n), `the offer figure ${n} reached the public bundle`);
  }
});

test("NEGATIVE CONTROL · no package name, capacity or scarcity", () => {
  for (const re of [
    /[Rr]ytmus\s+[AB]\b/, /[Rr]hythm\s+[AB]\b/,
    /posledn[ií]ch?\s+\d+\s+m[ií]st/i, /only\s+\d+\s+(spots?|places?)/i,
    /omezen[ýy]\s+po[čc]et\s+m[ií]st/i, /sleva/i, /discount/i,
    /z[áa]ruk[au]\s+v[ýy]sledku/i, /guarantee/i,
  ]) {
    assert.ok(!re.test(BUNDLE), `offer language that is not approved: ${re}`);
  }
});

// ----------------------------------------------------------------- proof
test("the Home reference module remains visibly demo and non-production", () => {
  assert.ok(BUNDLE.includes("Co říkají klienti"), "the approved Home references heading is missing");
  assert.ok(
    BUNDLE.includes("Ukázkový obsah pro návrh. Před zveřejněním bude nahrazen skutečnými referencemi a videi se souhlasem jejich autorů."),
    "the Home demo warning is missing"
  );
  assert.ok(BUNDLE.includes("Fiktivní ukázka"), "the video demo badge is missing");
  for (const re of [/hodnocen[ií]\s*:\s*\d/i, /★/, /p[řr]ed\s+a\s+po\b/i, /before\s+and\s+after/i]) {
    assert.ok(!re.test(BUNDLE), `unapproved proof pattern: ${re}`);
  }
});

test("NEGATIVE CONTROL · no credential is claimed before it exists", () => {
  for (const re of [/certifikovan/i, /diplomovan/i, /akreditovan/i, /\bcertified\b/i, /\baccredited\b/i]) {
    assert.ok(!re.test(BUNDLE), `an unearned credential word appears: ${re}`);
  }
});

test("rehabilitation education never reads as a healthcare service", () => {
  /* The word "rehabilitační" may appear only as education, and only with the
     limit stated next to it. Wording per the V3 secondary-page copy. */
  assert.ok(
    BUNDLE.includes("Rehabilitační trénink je součást mého vzdělání."),
    "the rehabilitation education framing is missing"
  );
  assert.ok(
    BUNDLE.includes("Nenahrazuje fyzioterapii ani zdravotní rehabilitaci."),
    "the safeguard next to the rehabilitation wording is missing"
  );
  for (const re of [/poskytuji?\s+rehabilitaci/i, /nab[ií]z[ií]m\s+rehabilitaci/i, /fyzioterapeut\b(?!\w)/i]) {
    const hit = BUNDLE.match(re);
    if (hit) assert.ok(
      /patří nejdřív k lékaři nebo fyzioterapeutovi/.test(BUNDLE),
      `rehabilitation reads as a service on offer: ${re}`
    );
  }
});

test("the professional boundary is stated in both editions", () => {
  assert.ok(BUNDLE.includes("Kde jsou hranice"), "the Czech boundary section is missing");
  assert.ok(BUNDLE.includes("Where the boundaries are"), "the English boundary section is missing");
  assert.ok(
    BUNDLE.includes("Moje práce je trenérská."),
    "the Czech boundary does not say the work is coaching"
  );
  assert.ok(
    BUNDLE.includes("patří nejdřív k lékaři nebo fyzioterapeutovi"),
    "the Czech boundary does not route injury and pain to a clinician first"
  );
});

// -------------------------------------------------------------- brand V2
test("NEGATIVE CONTROL · retired Brand V1 wording stays retired", () => {
  for (const re of [
    /prvn[ií]\s+zrcadlo/i, /first\s+mirror/i,
    /t[ěe]lo\s*[·.,]\s*du[šs]e/i, /body\s*[·.,]\s*soul/i,
    /Caveat/,
    /integr[áa]tor/i, /poj[ií]tko/i,
  ]) {
    assert.ok(!re.test(BUNDLE), `retired Brand V1 wording is back: ${re}`);
  }
});

test("NEGATIVE CONTROL · no wellness or funnel vocabulary", () => {
  for (const re of [
    /odemkni?\s+(sv[ůu]j\s+)?potenci[áa]l/i, /unlock\s+your\s+potential/i,
    /nejlep[šs][ií]\s+verze\s+sebe/i, /best\s+version\s+of\s+yourself/i,
    /nastartuj/i, /transformac[ei]\s+[žz]ivota/i, /life\s+transformation/i,
    /discovery\s+call/i, /apply\s+now/i, /join\s+the\s+journey/i,
    /biohack/i, /holistick/i,
  ]) {
    assert.ok(!re.test(BUNDLE), `wellness or funnel vocabulary: ${re}`);
  }
});

// -------------------------------------------------------- completeness
test("NEGATIVE CONTROL · nothing unfinished is visible", () => {
  for (const re of [
    /\bTODO\b/, /\bFIXME\b/, /lorem ipsum/i,
    /coming\s+soon/i, /brzy\s+p[řr]ibude/i, /p[řr]ipravujeme/i,
    /placeholder/i, /\bTBD\b/, /\bXXX\b/,
    /undefined<\//, /\[object Object\]/,
  ]) {
    assert.ok(!re.test(BUNDLE), `unfinished content is visible: ${re}`);
  }
});

test("only verified contact details are public", () => {
  const mails = [...new Set(BUNDLE.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [])];
  assert.deepEqual(mails, [MAIL], `unexpected e-mail addresses: ${mails.join(", ")}`);
  assert.ok(BUNDLE.includes(WHATSAPP_URL), "the approved WhatsApp link is missing");
  assert.ok(!BUNDLE.includes("+420 774 121 475"), "the phone number should remain icon-only in page copy");
  for (const re of [/otev[řr]ac[ií]\s+doba/i, /opening\s+hours/i, /Praha\s+\d/, /\b\d{3}\s?\d{2}\s+Praha/]) {
    assert.ok(!re.test(BUNDLE), `an unverified location or hours claim: ${re}`);
  }
});

test("only the approved outbound destinations are linked", () => {
  const hosts = [...new Set(
    (BUNDLE.match(/https?:\/\/[a-z0-9.-]+/gi) || []).map((u) => u.replace(/^https?:\/\//i, "").toLowerCase())
  )];
  const allowed = new Set([
    "tanmaypractice.com",
    "klient.tanmaypractice.com",
    "www.instagram.com",
    "wa.me",
    "schema.org",
    "www.w3.org",
    "www.sitemaps.org",
  ]);
  const extra = hosts.filter((h) => !allowed.has(h));
  assert.deepEqual(extra, [], `unexpected outbound hosts: ${extra.join(", ")}`);
  assert.ok(BUNDLE.includes(IG_URL), "the Instagram link is missing");
});

test("no third party asset host, so the privacy statement stays true", () => {
  for (const re of [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/, /cdn\.jsdelivr/, /unpkg\.com/, /googletagmanager/, /google-analytics/]) {
    assert.ok(!re.test(BUNDLE), `a third party host is referenced: ${re}`);
  }
  assert.ok(
    /nepouž[íi]v[áa]m[^.]*cookies/i.test(BUNDLE),
    "the privacy page no longer states what the site does not collect"
  );
});

test("no secret or internal identifier leaks", () => {
  for (const re of [
    /CLOUDFLARE_[A-Z_]+/, /API_KEY/i, /SECRET/i, /BEARER\s+[A-Za-z0-9]/i,
    /sk_live/, /-----BEGIN/,
  ]) {
    assert.ok(!re.test(BUNDLE), `a secret-looking string is in the bundle: ${re}`);
  }
  const walkMaps = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walkMaps(join(dir, e.name)) : (e.name.endsWith(".map") ? [e.name] : []));
  assert.deepEqual(walkMaps(DIST), [], "a source map shipped");
});

test("NEGATIVE CONTROL · no unverified or in-preparation event is published", () => {
  assert.ok(!BUNDLE.includes("Zimní tichá praxe"), "an unverified future event is published");
  assert.ok(!/Připravuje se/.test(BUNDLE), "an in-preparation state is visible");
});
