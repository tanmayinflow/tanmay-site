# Current public content boundaries

Updated for the GTP M10 integration on 2026-09-17. The owner designated the GTP website as current; the preceding V8 ledger is archived. This file records existing decisions and open questions, not a new approval of facts or legal wording.

The current content authority is the preserved GTP package's `05-CONTENT-LOCK.md`, the locked V9.22 source, and the explicit M7/M9/M10 changes recorded with that work. The exact source remains authoritative for approved wording. Earlier workspace offer drafts or V8 restrictions must not silently replace these newer decisions.

## Identity and professional wording

The current content names Kryštof Švec and the brand tanmay practice. Its approved professional background includes ten years of personal movement practice, 150+ clients, a year as studio lead and head trainer, personal fitness training, yoga instruction and the further education listed in the content lock.

Psychology at Palacký University in 2019–2024 is described as study, not a completed degree or a psychologist's licence. Do not invent qualifications, certification, clinical services or outcomes.

The preserved approved wording is: “Rehabilitační trénink je součást mého vzdělání. Nenahrazuje ale plnohodnotnou fyzioterapii.” The 2026-09-17 review confirmed that current Czech/English desktop and mobile wording distinguishes training from healthcare, study from a completed qualification, and refers acute or unexplained/worsening pain to a doctor or physiotherapist. This closes the source-content boundary review; it does not independently verify qualification documents or certify the business legally.

## Prices and terms

Current data lives in `src/components/collaboration-pricing.data.ts` and is identified there as owner-supplied on 2026-09-12.

| Format | Duration | Price |
|---|---|---|
| Individual, single session | 60 minutes | CZK 1,000 |
| Individual, regular training | 60 minutes | CZK 800 |
| Training for two | 60 minutes | CZK 600 per person |
| Small group, 3–6 people | 75 minutes | CZK 500 per person |

The reduced individual rate requires at least four prepaid sessions; four sessions cost CZK 3,200 and dates are agreed in advance. On 2026-09-17 the owner explicitly defined the period as “Měsíc od prvního tréninku”: one month from the first session. The shared Czech/English pricing component uses that exact meaning on desktop and mobile. This closes the period question in the imported content lock. No online price, cancellation rule, additional expiry rule, transfer entitlement or outcome guarantee may be inferred.

## Client reviews

`src/components/home-reviews.data.js` contains the owner-supplied reviews from Mariana Stojkovová, Zuzana Hofman, Gledis Kmonickova and Lucie Kánská. Czech wording is preserved; English translations are labelled and the originals remain available.

The source is no longer the V8 demo carousel. On 2026-09-17 the owner explicitly confirmed possession of consent and approved publication of the four existing reviews, names and personal/health mentions, including in the public `tanmayinflow/tanmay-site` repository. This closes the consent question in the original content lock for the exact existing material. Do not invent ratings, dates, verification badges, avatars or video testimonials. No client videos were supplied. Legacy demo media is historical material and must not be included in the published output.

## Contacts and application

Use the shared constants in `src/site.js`:

- Client entry: `https://klient.tanmaypractice.com`
- WhatsApp: `https://wa.me/420774121475`
- Email: `tanmay.in.flow@gmail.com`
- Instagram: `https://www.instagram.com/tanmayflow/`

The internal main application must not be linked publicly. Verifying these strings is not proof that the external services or access policies currently work. Do not send test messages or use a client's account for a release check.

## Privacy and publication scope

On 2026-09-17 the owner approved and the site implemented the exact Czech privacy additions and equivalent English wording: pre-contractual steps requested by the visitor, legitimate interests for ordinary correspondence and secure operation, the right to complain to the Czech Office for Personal Data Protection, and the actual EU exclusion in Web Analytics. The dedicated privacy delta guard permits only these precise additions to PagePrivacy; the previous desktop source guard remains active.

The current privacy page identifies the data controller and describes hosting/security processing, correspondence, external services, client application separation, rights and Cloudflare Web Analytics. The Cloudflare dashboard was verified on 2026-09-17: Web Analytics uses automatic injection with the selected option “Enable, excluding visitor data in the EU”, and recent measurements exist. The source contains no beacon; do not add a second one. This establishes the actual configuration, not legal review or post-release production verification. The old blanket assertion “no analytics or third-party requests” is no longer an accurate description of the approved privacy copy.

Only Home, Praxe, Příběh, Spolupráce and Soukromí, each in Czech and English, are public routes. Journal text remaining in source is historical and unpublished. Do not treat its presence as permission to publish it.

Any new public claim, legal text or commercial condition needs its actual source and the owner's decision. Do not re-open already accepted wording merely because an archived document disagrees with it.
