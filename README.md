# tanmay-site · tanmaypractice.com

The public website. React and Vite, no libraries beyond React.

Brand authority is `Context/Brand/Canonical/` in the Tanmay-Cowork
workspace. Read it before touching copy or visual direction, and read
`tanmay_brand_glosar_V2_CZ_master.md` before writing any Czech.

What may be published is `PUBLIC-FACTS-LEDGER.md` in this repository.
Read it before adding any factual claim to the site.

---

## Structure

| Path | What it is |
|---|---|
| `src/site.js` | The public surface contract: routes, per-route metadata, journal entries, aliases. Plain JavaScript because the build reads it too. **There is no second copy of the route map.** |
| `src/App.tsx` | The whole site: stylesheet, content, components. |
| `scripts/postbuild.mjs` | Turns the one built shell into a real pre-rendered file per route, plus `404.html`, `sitemap.xml` and `robots.txt`. Runs inside `npm run build`. |
| `scripts/build-media.py` | Photographic derivatives and the two generated material assets. Authoring tool, run by hand. |
| `scripts/build-fonts.py` | The four Brand V2 typefaces, subset, as first party woff2. Authoring tool. |
| `scripts/build-og.py` | The 18 social preview cards. Authoring tool. |
| `tests/` | The launch gate. See `PUBLIC-LAUNCH-CHECKLIST.md`. |
| `public/_redirects` | Old public paths, kept alive. |
| `wrangler.jsonc` | Cloudflare: assets from `./dist`, unknown paths get `404.html`. |

Authoring tools are never dependencies. They fetch what they need with
`npm install --no-save`, so the Cloudflare build installs React and Vite
and nothing else.

---

## Routes

Czech lives at the root. English lives under `/en/`. The path decides
the language, so a shared link always opens in the language it was
shared in.

| Czech | English |
|---|---|
| `/` | `/en/` |
| `/praxe` | `/en/practice` |
| `/pribeh` | `/en/story` |
| `/spoluprace` | `/en/work-with-me` |
| `/denik` | `/en/journal` |
| `/denik/<slug>` | `/en/journal/<slug>` |
| `/soukromi` | `/en/privacy` |

Every one of those is a real pre-rendered HTML file with its own title,
description, canonical, hreflang pair, Open Graph card and structured
data. A crawler that never runs JavaScript still reads all of it.

**Old links keep working.** The hash routes the site used to serve
(`#/praxe`, `#/pribeh`, `#/spoluprace`, `#/denik`, and the aliases
`#/udalosti`, `#/kontakt`, `#/zapisky`, `#/poezie`) are rewritten to the
clean path on load, without a reload. The old bare paths redirect 301
through `public/_redirects`. Do not remove either: the site is live.

---

## Language

One complete language per page, never two. The switch in the header is a
link to the counterpart URL, which is also the `hreflang` alternate.
`localStorage` is not involved; there is nothing to go stale and nothing
to disagree with the address bar.

Czech display type is EB Garamond, English is Cormorant Garamond, set by
`html[lang]`. The wordmark stays Cormorant in both. Czech metadata uses
reduced tracking because the words carry diacritics. A non-breaking
space is inserted automatically after single-letter Czech prepositions
and conjunctions.

CZ and EN are separate editorial versions. Do not translate line by
line.

---

## Fonts

Served from this domain, subset to Latin-1 plus Latin Extended-A plus
the punctuation the brand sets. Nine faces, 181 kB on disk, about 138 kB
on a Czech page. All four families are SIL OFL 1.1; `public/fonts/OFL.txt`
carries the licence.

Google Fonts is not used. The footer says there are no third parties and
that has to be true.

Regenerate: `npm run fonts`. It rewrites `public/fonts/` and
`public/fonts/tanmay-fonts.css`, which `postbuild.mjs` inlines into every
page.

---

## Media

`public/media/` holds committed derivatives. The masters are in the
workspace, not here. Names, crops, treatment and contracts are in
`VISUAL-ASSET-PLAN.md`; edit direction and the generation prompts are in
`IMAGE-GENERATION-BRIEF.md`.

Every photograph is optional at runtime. A figure removes itself if its
file is missing, so an absent file leaves no frame and no broken icon.
The site is complete and intentional without any of them.

Rebuild: `npm run media -- --masters ../Assets/Masters`.

---

## What to edit in `src/App.tsx`

Everything editable is in the `DATA` section near the top, or in
`src/site.js`.

| Where | What |
|---|---|
| `src/site.js` · `ROUTES` | Paths, navigation labels, per-route title and description |
| `src/site.js` · `POSTS` | Journal entries: slug, date, title, tag, excerpt |
| `src/App.tsx` · `BODIES` | The text of each journal entry |
| `src/App.tsx` · `MEDIA` | Photograph base names and built widths |
| `src/App.tsx` · `ANCHORS` | The three anchors. Canonical text. Change only when the Brand Book changes. |
| `src/App.tsx` · `OFFERS` | **Empty on purpose.** See below. |
| `src/App.tsx` · `EVENTS` | Real, announced events only |

Adding a journal entry means: one entry in `POSTS`, one in `BODIES`,
then `npm run og`. The routes, the sitemap, the metadata and the card
follow by themselves.

---

## The offer

`OFFERS` is an empty array and `OfferSlot()` renders a complete, true
description of what the personal work is and how it starts, with no
price and no placeholder.

The commercial frame exists and Tanmay approved it on 2026-08-16, but
`Work/offers/` still gates its publication on five decisions and eight
items of external verification. Until Offers releases it, no price, no
package name and no session count goes on this site. See
`PUBLIC-FACTS-LEDGER.md` §5.

When it is released: fill `OFFERS`, the section renders without any
layout change, then relax the price negative control in
`tests/content-truth.test.mjs` and record the change in the ledger.

---

## Commands

```
npm install
npm run dev              # local development

npm run typecheck        # tsc --noEmit
npm run build            # typecheck, bundle, pre-render every route
npm test                 # the launch gate
npm run check            # build then test, this is the one that matters

npm run browser:setup    # installs playwright-core --no-save, for the browser suite
npm run fonts            # regenerate public/fonts/
npm run media            # regenerate public/media/
npm run og               # regenerate public/og/
```

`npm test` without a browser runs 56 checks and skips the browser suite
cleanly. With `npm run browser:setup` it runs 73.

---

## Deployment

GitHub repo → Cloudflare Workers & Pages → custom domain
`tanmaypractice.com`. Build command `npm run build`, output `dist`.
Every commit deploys in about a minute.

**A correct commit proves nothing.** Before believing a wave shipped:

```
git archive HEAD | tar x -C <empty dir>
cd <empty dir> && npm ci && npm run build
```

If `npm ci` fails, the Cloudflare build is dead and the last bundle that
built is still being served, with no error anywhere a visitor can see.
Never hand-edit dependencies in `package.json`; use npm so the lockfile
moves with it.

Two things live in the Cloudflare dashboard rather than here and have to
be verified there: the `www` → apex 301 redirect rule, and that the
deploy picked up `not_found_handling`.

---

## Client access

"Vstup pro klienty" / "Client login" points at
`https://klient.tanmaypractice.com`, from the desktop header, the mobile
header, the Home strip, the Spolupráce block and the footer. It is a
utility action, visually distinct from the public call to action, and
never the primary one.

The public site never links to `app.tanmaypractice.com` and never
exposes invitation mechanics. Both are enforced by tests.

Clients are granted access by adding their e-mail to the Cloudflare Zero
Trust Access policy on that app.
