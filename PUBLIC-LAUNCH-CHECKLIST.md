# Public launch checklist

Current integration: GTP M10 pass5, 2026-09-17. This replaces the V8 checklist. The integrated site has not been published. Record new verification results in the workspace project status; do not substitute old QA results for a new integration check.

## Existing evidence

The preserved GTP package records pass5 build/typecheck and 23 tests, a 96-case responsive matrix, 32 hero cases and 16 native captures. Desktop 16/16 combines an earlier full matrix with targeted repeat checks. Runtime 32/32 belongs to pass4; motion and image-fallback evidence belongs to pass3. The reports retain those distinctions.

The current visual evidence is `WORKING/mobile-refinement/M10/final/pass5/` inside the archived GTP reference package. Physical iPhone/Safari and production hosting were not verified by those runs.

## Resolve before release

- Client-review consent is confirmed: on 2026-09-17 the owner approved the four current reviews, names and personal/health mentions, including publication in the public GitHub repository. Keep the exact approved material; this gate is closed.
- Clarify what “měsíční období” means for the four prepaid individual sessions. Preserve the approved prices; do not invent cancellation, expiry, transfer or refund conditions. This question is explicitly left open in `05-CONTENT-LOCK.md`.
- Complete the professional/legal boundary review requested in that same content lock, including the approved rehabilitation-training wording. Do not replace accepted text with an unapproved claim.
- Obtain the owner's final review of the responsive result. Desktop V9.22 and its recorded M7/M9 changes remain accepted.

## Verify the integrated release

- Run installation from the lockfile and `npm run check` on the integrated source. Keep the exact source-protection checks and their reference evidence working after relocation.
- Review the final responsive pages and key interactions in both languages. Preserve the desktop reference from 900 CSS px; verify phone, tablet, landscape and enlarged-text layouts.
- Check on a physical iPhone/Safari, or explicitly record that limitation when deciding whether to release. A headless browser is not this device check.
- Ensure the final `dist` contains no unused demo reference videos/posters. Preserve their historical originals outside the published output.

## Verify deployment access and configuration

Verified on 2026-09-17: GitHub read and write dry-run access; public repository tanmayinflow/tanmay-site; existing Cloudflare static-assets Worker tanmay-site; main production branch; npm run build and npx wrangler deploy; apex and www custom domains. Non-production branch builds were enabled with npx wrangler deploy too, so resolve that setting before pushing an integration branch. Web Analytics automatically injects outside the EU; EU visitor data is excluded. No production deployment was performed by this verification.

- Identify the connected GitHub repository and production branch, confirm write access, and inspect whether a push triggers deployment.
- Verify the Cloudflare site/project and `tanmaypractice.com` domain binding; use the existing deployment rather than assuming a new project is needed.
- Confirm build `npm run build`, output `dist`, and actual HTTP 404 handling. Local preview behavior alone does not prove Cloudflare behavior.
- Check whether Cloudflare Web Analytics is enabled and functioning. The current privacy page says it is used; the source does not contain a beacon. Do not infer dashboard injection from that copy.

## Verify after the approved deployment

- Open all ten Czech/English direct routes and language switches on the production domain. Check metadata, assets, mobile navigation and the client-entry link.
- Verify unknown Czech and English addresses return HTTP 404 and show the correct language. Journal paths and journal hashes must not expose the retired journal.
- Verify legacy redirects and the `www` to apex redirect, without assuming the dashboard rule exists.
- Check canonical URLs, sitemap and representative social previews against the deployed build.
- Check the external contact destinations without sending test messages or entering a client's account. Record deployment identity and any remaining limitation in `Work/website/STATUS.md`.
