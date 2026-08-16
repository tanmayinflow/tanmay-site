# tanmay-site · tanmaypractice.com

Public website. Single-file React / Vite, same pattern as the client app:
everything lives in `src/App.tsx`, no libraries beyond React.

Brand authority is `Context/Brand/Canonical/` in the Tanmay-Cowork
workspace. Read it before touching copy or visual direction. Read
`tanmay_brand_glosar_V2_CZ_master.md` before writing any Czech.

---

## Structure

- `src/App.tsx` — the whole site: CSS, data, components. The only file you normally edit.
- `src/main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.json` — scaffold.
- `wrangler.jsonc` — Cloudflare, assets from `./dist`.
- `public/media/` — optional photography, video and textures. Empty by default.
- `VISUAL-ASSET-PLAN.md` — the contract for every future image, clip and texture.
- `IMAGE-GENERATION-BRIEF.md` — exact prompts for the two generated assets and edit prompts for real photographs.

## Rooms

Home plus four rooms, hash routed.

| Route | CZ | EN |
|---|---|---|
| `#/` | domů | home |
| `#/praxe` | Praxe | The practice |
| `#/pribeh` | Příběh | The story |
| `#/spoluprace` | Spolupráce | Work with me |
| `#/denik` | Deník praxe | Practice log |

Old routes still resolve so live links do not break:
`#/udalosti` and `#/kontakt` land on Spolupráce, `#/zapisky` on Deník,
`#/poezie` on Příběh. Anything unknown lands on home.

## Language

Single-page CZ / EN toggle. `L(cs, en)` resolves at render time.
Preference in `localStorage` under `tm-lang`. Auto-detect falls back to
`cs` for Czech and Slovak browsers, `en` otherwise.

Czech display type is EB Garamond, set by `html[lang="cs"]`. The wordmark
stays Cormorant in both editions. Czech metadata uses reduced tracking
because the words carry diacritics. A non-breaking space is inserted
automatically after single-letter Czech prepositions and conjunctions.

## Media

Every file in `public/media/` is optional at runtime. If a file is absent
the component that would use it renders nothing. There is never an empty
frame or a broken icon. Drop a correctly named file in and it appears with
no code change. Names and crops are specified in `VISUAL-ASSET-PLAN.md`.

## What to edit in `src/App.tsx`

Everything editable sits in the `DATA` section near the top.

- `MAIL`, `APP_URL`, `IG_URL`
- `MEDIA` — file names for photography, video and textures
- `ROOMS` — the four rooms and their one-line descriptions
- `ANCHORS` — the three anchors. Canonical text. Change only when the Brand Book changes.
- `OFFERS` — **empty on purpose.** See below.
- `EVENTS` — real dated events
- `POSTS` — practice log entries

## The offer

`OFFERS` is an empty array and `OfferSlot()` renders an honest one-line
statement of the current state instead of a priced card. The personal-work
offer is being defined in the Offers project. No price, package name or
capacity number goes on this site before that project approves it. When it
does, fill `OFFERS`; the section renders without any layout change.

The previous priced cards were removed in the 2026-08-16 redesign because
the numbers in them were a proposal, not an approved offer, and the project
status already recorded pricing as not public.

## Local development

```
npm install
npm run dev
```

## Validation

```
npm run typecheck    # tsc --noEmit
npm run build        # typecheck, then vite build
```

`npm run build` will not produce a bundle if the types fail.

## Deployment

GitHub repo → Cloudflare Workers & Pages → custom domain
`tanmaypractice.com`. Build command `npm run build`, output `dist`.
Every commit deploys in about a minute.

## Client access

"Vstup pro klienty" points at `klient.tanmaypractice.com`. Clients are
granted access by adding their email to the Cloudflare Zero Trust Access
policy on that app.
