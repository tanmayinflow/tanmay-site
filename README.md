# tanmay-site

The public Czech and English website for [tanmaypractice.com](https://tanmaypractice.com), built with React, TypeScript and Vite.

## Current source

This repository now contains the GTP M10 pass5 source. The owner designated that work as the current website on 2026-09-17. It supersedes the older Claude/V8 implementation.

- Desktop from 900 CSS px: locked V9.22 appearance and content, with the accepted M7 FAQ and M9 meaning-text changes.
- Below 900 CSS px: the M10 responsive implementation, including phone, tablet and landscape layouts.
- M10 also repairs shared navigation, unpublished routes, language of error pages, metadata and keyboard focus.
- The owner approved two precise content clarifications on 2026-09-17: prepaid sessions cover one month from the first session, and the privacy page states processing bases, the complaint right and actual EU analytics exclusion. Dedicated reversible source guards preserve the rest of the locked implementation.

Integration is prepared on `integration/gtp-m10-2026-09-17`. Migration does not mean publication. Current integration results and next actions belong in the workspace's `Work/website/STATUS.md`.

The full original GTP package and its QA history are preserved under `Work/website/References/GTP-2026-09-17/Work/tanmay-work-mobil-desktop-v922/TANMAY-WORK-PREDANI-2026-09-15/`. The preceding source and controls are preserved under `Work/website/Archive/2026-09-17-before-gtp/`. These are workspace paths, not files expected on the public host.

## Structure and scope

| Path | Purpose |
|---|---|
| `src/site.js` | Public routes, language pairs, metadata and shared contact destinations |
| `src/App.tsx`, `src/components/` | Accepted desktop implementation and shared components/data |
| `src/mobile/` | Responsive interface below 900 CSS px |
| `src/components/collaboration-pricing.data.ts` | Owner-supplied price data |
| `src/components/home-reviews.data.js` | Owner-supplied client reviews and labelled English translations |
| `src/runtime-navigation.js`, `src/page-metadata.js` | Shared navigation and metadata behavior |
| `scripts/postbuild.mjs` | Per-route HTML metadata, 404 document, sitemap and robots |
| `public/` | First-party fonts, media and redirect rules |
| `tests/` | Route, preview, metadata and precise source-protection checks |

There are ten published route variants: Home, Praxe / Practice, Příběh / Story, Spolupráce / Work with me, and Soukromí / Privacy, each in Czech and English. Czech uses the root; English uses `/en/`. The journal and its articles remain unpublished. Do not restore them from old documentation or old redirects.

Each public route gets its own HTML metadata. Page content is rendered by React; this is not full server-rendered page content. Without JavaScript, the document provides a contact fallback.

## Local work

```sh
npm ci
npm run dev
npm run check
npm run preview
```

`check` runs the production build, including TypeScript, then the tests. `preview` serves generated route documents and actual local 404 responses. Historical M10 QA is evidence about the original work; it is not a new test of this integration. See [PUBLIC-LAUNCH-CHECKLIST.md](PUBLIC-LAUNCH-CHECKLIST.md).

Preserve the locked desktop reference, original photographs, fonts and exact approved source changes. Do not regenerate photographs or revive retired asset-generation tools as part of ordinary development. Workspace instructions and Brand Canonical remain the shared context for future changes; [PUBLIC-FACTS-LEDGER.md](PUBLIC-FACTS-LEDGER.md) records the current content boundaries.

## Publication

The existing deployment path is GitHub to Cloudflare for `tanmaypractice.com`. The build command is `npm run build`, with `dist` as the output. The intended asset configuration serves unknown paths through `404.html` with an HTTP 404 response.

Verify the actual connected repository, production branch, Cloudflare project, domain and analytics configuration before pushing a release. A push to a connected branch may deploy automatically. Local build success does not verify the production host. The launch checklist records the remaining content decisions and hosting checks.
