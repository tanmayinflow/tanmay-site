# Public launch checklist

Current release line: GTP M10 pass5 with the owner-approved prepaid-period and privacy clarifications of 2026-09-17. This replaces the V8 checklist. Actual deployment identity and results belong in the workspace project STATUS; this checklist by itself is not proof of publication.

## Existing evidence

The preserved GTP package records pass5 build/typecheck and 23 tests, a 96-case responsive matrix, 32 hero cases and 16 native captures. Desktop 16/16 combines an earlier full matrix with targeted repeat checks. Runtime 32/32 belongs to pass4; motion and image-fallback evidence belongs to pass3. The reports retain those distinctions.

The current visual evidence is `WORKING/mobile-refinement/M10/final/pass5/` inside the archived GTP reference package. Physical iPhone/Safari and production hosting were not verified by those runs.

## Approved content and source review

- Client-review consent is confirmed: on 2026-09-17 the owner approved the four current reviews, names and personal/health mentions, including publication in the public GitHub repository. Keep the exact approved material; this gate is closed.
- The prepaid period is confirmed: on 2026-09-17 the owner specified “Měsíc od prvního tréninku” (one month from the first session). This closes the question in the imported `05-CONTENT-LOCK.md`; the shared Czech/English pricing component reflects it. Prices and all other terms remain unchanged. Do not invent cancellation, additional expiry, transfer or refund conditions.
- Professional-boundary source review is complete: accepted qualification/study wording, training versus healthcare limits and referral wording agree in CZ/EN and desktop/mobile. It is a content consistency review, not independent verification of qualifications or legal certification.
- The owner approved the exact privacy additions concerning processing bases, the complaint right and actual EU analytics exclusion. Both languages implement them under a precise source guard.
- Obtain the owner's final review of the responsive result. Desktop V9.22 and its recorded M7/M9 changes remain accepted.

## Verify the integrated release

The final local build and all 26 tests passed with both accepted clarifications. Pricing passed 24 targeted cases across six widths, two languages and normal/doubled terms text. Privacy passed six native browser cases (CZ/EN at 320/900/1440). The earlier complete migration matrix remains recorded separately: 176 browser cases. No unapproved styling or visual-asset change was made.

- Run installation from the lockfile and `npm run check` on the integrated source. Keep the exact source-protection checks and their reference evidence working after relocation.
- Review the final responsive pages and key interactions in both languages. Preserve the desktop reference from 900 CSS px; verify phone, tablet, landscape and enlarged-text layouts.
- Check on a physical iPhone/Safari, or explicitly record that limitation when deciding whether to release. A headless browser is not this device check.
- Ensure the final `dist` contains no unused demo reference videos/posters. Preserve their historical originals outside the published output.

## Verify deployment access and configuration

Verified on 2026-09-17: GitHub read and write dry-run access; public repository tanmayinflow/tanmay-site; existing Cloudflare static-assets Worker tanmay-site; main production branch; npm run build and npx wrangler deploy; apex and www custom domains. Non-production branch builds have now been disabled and the saved Cloudflare setting was verified. The integration branch can therefore be stored without that automatic deployment path. Web Analytics automatically injects outside the EU; EU visitor data is excluded. No production deployment was performed by this configuration change.

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
