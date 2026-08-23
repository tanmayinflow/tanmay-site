# PUBLIC LAUNCH CHECKLIST

Last run: 2026-08-23 evening, after the Material Landscape wave, against the build of that day.

What can be proved from this repository is proved by `npm run check`.
What can only be proved on the live domain is listed at the end and is
marked as needing Cloudflare or a person.

---

## Automated · `npm run check`

`npm run check` is `npm run build` followed by `npm test`. The build
typechecks, bundles and pre-renders. The tests read the real build
output in `dist/`, never the source's intentions.

| Suite | What it holds | Count |
|---|---|---|
| `tests/routes.test.mjs` | Every route is a real file. Per-route title, description, canonical, hreflang, Open Graph, Twitter card. Symmetric alternates. Structured data carries no Offer, Review, rating, address, hours, credential or Event. 404 is a real page and Cloudflare is configured to serve it. Sitemap equals the pages that exist. Robots allows crawling. Old paths redirect, targets exist, no loops. | 16 |
| `tests/content-truth.test.mjs` | Every negative control in PUBLIC-FACTS-LEDGER.md §12. No price, no package name, no scarcity, no testimonial, no unearned credential, no retired Brand V1 wording, no wellness vocabulary, no placeholder, no invented contact, no Main App link, no invitation vocabulary, no third party host, no secret, no source map. Plus positive controls: the boundary sentence in both editions, the in-progress education wording and its safeguard. | 18 |
| `tests/media.test.mjs` | The manifest matches real files. Nothing is upscaled past its master. The CSS aspect ratio matches the file, so media cannot shift the layout. No EXIF or GPS survives. No asset over 600 kB. Exactly two generated assets. Optional media collapses instead of leaving a frame. | 11 |
| `tests/contrast.test.mjs` | Every text token against the surface it is used on, computed from the stylesheet itself. Copper is never a text colour. The six Brand V2 colours are unchanged. | 11 |
| `tests/browser.test.mjs` | The site as Chromium renders it: one H1 per route, landmarks, skip link, client entry visible in the header at 390 and 1280, no link to the Main App, keyboard menu with Escape, old hash links, pushState navigation with history, language switch, one language per page, images that actually load, a modern format chosen, reduced motion, visible focus, no sideways scroll at 390/834/1440, tap targets, and the whole site with the media folder blocked. | 17 |

**Result 2026-08-23 (Material Landscape): 85 passed, 0 failed** with a browser; the browser suite (20 checks) skips cleanly without one. New since the launch wave: the material-set inventory with per-file budgets, the cutout-used-once negative control, aperture confinement to the three photographs, Burnt Earth token and contrast pairs, the copper-background guard, and the fallback render with the whole media folder blocked.

The browser suite needs a browser, which is an authoring tool and is not
a dependency. `npm run browser:setup` installs `playwright-core` with
`--no-save`. Without it that suite skips and the other 56 still run, so
the Cloudflare build never needs a browser.

---

## Content completeness gate

Every visible block on every route, classified.

| Route | Blocks | Classification |
|---|---|---|
| Home | opening, audience, the work, practice photograph, collaboration, client strip, two teasers, closing | FINAL · APPROVED · one OPTIONAL MEDIA |
| Praxe | what practice means, three anchors, what a session contains, direction to practice, what it is not | FINAL · APPROVED, anchors are canonical |
| Příběh | present day, roots, what I can actually do, three beats, the accident line, notebook poem | FINAL · APPROVED · REAL AUTHORED |
| Spolupráce | who it is for, personal work, where, how it runs, field practice, the application, experience, contract and boundary, FAQ, contact | FINAL · APPROVED |
| Deník | index of three real notes, photograph, rhythm note | REAL AUTHORED · one OPTIONAL MEDIA |
| Deník article ×3 | date, tag, title, body, two links onward | REAL AUTHORED |
| Soukromí | five sections, all checkable in this repository | FINAL |
| 404 | one line and four ways out | FINAL |

Nothing on the site is marked TODO, coming soon, placeholder, or "in
preparation". There is no fake quote, no fake journal entry, no fake app
data, no unapproved offer, no unapproved price, no undefined link and no
empty image frame. All of that is enforced by tests rather than by
memory.

---

## Media

| File | Master | Public derivatives | Where |
|---|---|---|---|
| `portrait-tanmay` | 3024 × 3780, 4:5 | AVIF and WebP at 480 / 720 / 960 / 1280, JPEG fallback at 960 | Home opening, stone aperture, eager, high priority |
| `practice-handstand-trunk` | 2160 × 3024, 5:7 | AVIF and WebP at 480 / 720 / 1080, JPEG fallback at 720 | Home work chapter and Praxe, stone aperture, lazy |
| `practice-sitting-pine` | 720 × 900, 4:5 | AVIF and WebP at 360 / 480 / 720, JPEG fallback at 480 | Deník, stone aperture, lazy |
| `surface-ink-cotton.webp` | generated | one seamless tile, 1024 × 1024 | The Ink Cotton bands |
| `material/` | see MATERIAL-ASSET-MANIFEST.md | strata edge, aperture mask, earth slab, copper line, sandstone tile, the real b/w cutout — 272 kB total | The Material Landscape wave |

Three real photographs, one real cutout, no video. The generated set is
exactly the manifest's accepted list; two supplied candidates were
rejected there with reasons, and the launch-wave torn-linen edge is
retired.

Masters live in the workspace at `Work/website/Assets/Masters/` and are
not in Git. `npm run media` rebuilds every derivative from them.

---

## Measured, not claimed

Production preview served like Cloudflare static assets, headless
Chromium, uncompressed transfer sizes. Cloudflare compresses text, so
the JS and HTML numbers are roughly a third of this over the wire.

| Route | View | HTML | JS | Fonts | Images | Total | FCP | LCP | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 1440 | 7 kB | 236 kB | 138 kB | 379 kB | 761 kB | 136 ms | 244 ms | 0.001 |
| `/` | 390 @2× | 7 kB | 236 kB | 138 kB | 408 kB | 790 kB | 112 ms | 928 ms | 0.002 |
| `/praxe` | 1440 | 6 kB | 236 kB | 138 kB | 153 kB | 534 kB | 112 ms | 192 ms | 0.002 |
| `/spoluprace` | 1440 | 7 kB | 236 kB | 138 kB | 59 kB | 441 kB | 112 ms | 872 ms | 0.002 |
| `/denik` | 1440 | 6 kB | 236 kB | 138 kB | 112 kB | 493 kB | 116 ms | 848 ms | 0.002 |
| `/denik/les-nehodnoti` | 390 @2× | 7 kB | 236 kB | 115 kB | 4 kB | 362 kB | 80 ms | 80 ms | 0.003 |

JS is 94 kB of site plus 142 kB of React, split so that a content edit
does not invalidate the library in anyone's cache. Gzipped that is
29 kB + 45 kB.

CLS is below 0.005 everywhere, because every image declares its
intrinsic size and the CSS reserves the same ratio the file has.

LCP on the text routes is the moment the display face swaps in. It is
served first party and preloaded; the local single-threaded preview
serialises requests, so the real figure behind Cloudflare's HTTP/2 will
be lower. LCP on Home is the portrait.

Lighthouse was **not** run. No Lighthouse score is claimed anywhere.

---

## Visual review

48 full-page screenshots: eight page types × Czech and English ×
390 / 834 / 1440, reviewed as a contact sheet and individually for Home,
Praxe, Příběh, Spolupráce, Deník, one article, privacy and 404.

Checked for AI look, template look, excessive symmetry, image crop, copy
density, route differentiation, CTA clarity, client entry visibility,
brand restraint, real human presence, mobile pacing, dark band
repetition, copper excess, empty placeholders and broken media.

Two things were changed because of what the screenshots showed rather
than what the code said:

1. The first cotton tile read as a visible plaid once it repeated across
   a wide band. It was regenerated from smoothed wrapped noise with no
   low frequency component, and the deviation was cut to ±3 RGB levels.
2. The first torn linen edge read as drips. The fibre depth was cut from
   30 % of the band to a few pixels, and the line irregularity to about
   14 px across 2400.

No console errors on any of the 48 renders, except the expected 404
status on the not-found route. No horizontal overflow anywhere.

---

## Still needs Cloudflare or a person

These cannot be proved from this repository.

1. **`www` → apex redirect.** A Cloudflare Redirect Rule, not source.
   Verify `https://www.tanmaypractice.com/` returns 301 to the apex.
2. **`not_found_handling`.** `wrangler.jsonc` now sets `404-page`.
   Confirm after deploy that `https://tanmaypractice.com/xxx` answers
   404 and shows the not-found page rather than the home page.
3. **`_redirects`.** Confirm `https://tanmaypractice.com/udalosti`
   answers 301 to `/spoluprace`.
4. **Social preview.** Paste `https://tanmaypractice.com/spoluprace`
   into a preview debugger and confirm the card, then one article URL.
5. **Search Console.** Submit `https://tanmaypractice.com/sitemap.xml`.
6. **Lighthouse.** Run it on the live apex if a score is wanted.
7. **The client entry on a real device.** Open
   `https://klient.tanmaypractice.com` from the header and confirm the
   Access policy behaves as expected.
