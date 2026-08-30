# PUBLIC FACTS LEDGER

Last reviewed: 2026-08-30

Every factual claim the public site could carry, with its source and its
status. **Only rows marked `VERIFIED AND APPROVED PUBLIC` are published.**

This file is the reason `tests/content-truth.test.mjs` exists. Each
negative control in that suite enforces a row here. If a status changes,
change this file first, then the site, then the test.

Status values

| Status | Meaning |
|---|---|
| `VERIFIED AND APPROVED PUBLIC` | Sourced, current, and cleared for the public site. Published. |
| `VERIFIED BUT NOT APPROVED PUBLIC` | True and sourced, but a project or a person still gates its publication. Not published. |
| `PENDING` | Waiting on a decision or on external verification. Not published. |
| `UNKNOWN` | No source in the workspace. Not published, not guessed. |
| `RETIRED` | Was public, deliberately removed. Must not come back. |

Sources are paths inside the Tanmay-Cowork workspace.

---

## 1 · Identity and position

| Claim | Source | Current wording | Status | Public use |
|---|---|---|---|---|
| Name `tanmay`, always lowercase | Brand glossary V2, §1 | tanmay | `VERIFIED AND APPROVED PUBLIC` | Wordmark, title, footer |
| Public descriptor | Brand Book V2, message hierarchy | tělo · praxe · divoká příroda | `VERIFIED AND APPROVED PUBLIC` | Home, opening |
| Category line | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5 | Osobní trénink a pohybová praxe · Praha | `VERIFIED AND APPROVED PUBLIC` | Home kicker |
| Brand essence | Brand Book V2, p. 02 | He lives what he passes on → „To, co učím, sám žiju.“ | `VERIFIED AND APPROVED PUBLIC` | Home H1 |
| Practical definition | Brand Book V2, p. 02 | Rebuild a reliable relationship with the body … | `VERIFIED AND APPROVED PUBLIC` | Home lead, meta description |
| North Star, three lines | Brand Book V2, p. 03; glossary §1 | Důvěřuj tělu. Drž svou praxi. Naslouchej divočině. | `VERIFIED AND APPROVED PUBLIC` | Home closing |
| Closing stance | Brand Book V2 | Staň se tím, co praktikuješ. | `VERIFIED AND APPROVED PUBLIC` | Home closing |
| Name meaning, short Home form | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5 | tanmaya · „tím prostoupený“ | `VERIFIED AND APPROVED PUBLIC` | Home closing |
| Three Anchors, roles and functions | Brand Book V2, p. 07–09; glossary §2 | Tělo/Brána, Praxe/Most, Divoká příroda/Zrcadlo | `VERIFIED AND APPROVED PUBLIC` | Praxe, dark band |
| Presence is not a fourth anchor | Brand Canonical README | Přítomnost není čtvrtá kotva. | `VERIFIED AND APPROVED PUBLIC` | Praxe |
| „Divočina je **první** zrcadlo“ | Brand Canonical README, retired terms | — | `RETIRED` | Never. Negative control. |
| „tělo · duše · divoká příroda“ | Brand V1 | — | `RETIRED` | Never. Negative control. |
| Caveat as a handwriting face | Type spec V2 | — | `RETIRED` | Never. Negative control. |

## 2 · Audience

| Claim | Source | Status | Public use |
|---|---|---|---|
| People who know how to commit, yet feel a distance between what they understand and how they live | Brand Strategy V2, p. 03 | `VERIFIED AND APPROVED PUBLIC` | Home, Praxe, Spolupráce |
| Not looking for another identity to perform, not looking for a guru | Brand Strategy V2, p. 03 | `VERIFIED AND APPROVED PUBLIC` | Home, Praxe |
| Not for a fast appearance transformation, passive inspiration, spiritual certainty, or a person seeking diagnosis or treatment | Brand Strategy V2, p. 03 | `VERIFIED AND APPROVED PUBLIC` | Spolupráce |
| Age, profession and gender are not gates | Brand Strategy V2, p. 04 | `VERIFIED AND APPROVED PUBLIC` | Spolupráce FAQ |

## 3 · Professional background

Every row below comes from `Work/offers/OFFER.md` §3.1, where Tanmay
supplied them and they are marked `FAKT`. `Work/offers/STATUS.md`
records that this proof of craft is sufficient to publish. They are
published in exactly the source wording, with no rounding and no title.

| Claim | Source | Current wording | Status | Public use |
|---|---|---|---|---|
| Trainer and yoga instructor | OFFER.md §3.1.1 | Jsem trenér a lektor jógy. | `VERIFIED AND APPROVED PUBLIC` | Příběh, Spolupráce |
| Professional qualification and yoga instruction, Home wording | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §8 | Jsem držitelem profesní kvalifikace Osobní trenér ve fitness a instruktorem jógy. | `VERIFIED AND APPROVED PUBLIC` | Home About |
| More than three hundred clients | OFFER.md §3.1.2 | Přímo jsem pracoval s více než třemi sty klienty. | `VERIFIED AND APPROVED PUBLIC` | Příběh, Spolupráce |
| Conservative Home client count | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §8 | zkušeností s více než 200 klienty | `VERIFIED AND APPROVED PUBLIC` | Home About |
| Roughly a year as head trainer and studio manager | OFFER.md §3.1.3 | zhruba rok jsem dělal hlavního trenéra a vedoucího studia | `VERIFIED AND APPROVED PUBLIC` | Příběh, Spolupráce |
| Bodyweight training and calisthenics as the spine | OFFER.md §3.1.4, §4 | Těžištěm je trénink s vlastní vahou a kalistenika. | `VERIFIED AND APPROVED PUBLIC` | Home, Praxe, Příběh |
| Parkour and yoga as background | OFFER.md §3.1.5 | Parkour a jóga jsou zázemí, ze kterého se čerpá. | `VERIFIED AND APPROVED PUBLIC` | Home, Příběh |
| Further trainer education **in progress** | OFFER.md §3.1.6, approved phrasing | Aktuálně si dodělávám další odborné trenérské vzdělání zaměřené na rehabilitační, kondiční a fitness trénink. | `VERIFIED AND APPROVED PUBLIC` | Příběh, with the safeguard below |
| Additional education, Home wording | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §8 | Další odborné vzdělání mám v oblasti kondičního a funkčního tréninku, zdravotní tělesné výchovy a rehabilitačního tréninku. | `VERIFIED AND APPROVED PUBLIC` | Home About; education only, not a healthcare service claim |
| Safeguard next to the word rehabilitation | OFFER.md §3.1, „Pojistka“ | To zaměření neznamená, že poskytuju rehabilitaci. Rehabilitace, diagnostika a léčba zůstávají mimo můj rozsah. | `VERIFIED AND APPROVED PUBLIC` | Příběh, Spolupráce boundary |
| The exact name of that education | OFFER.md §3.2 | — | `PENDING` external verification | Not published. The site says out loud that there is no title yet. |
| Any title, „certifikovaný“, „diplomovaný“, „akreditovaný“ | OFFER.md §11.5 | — | `RETIRED` | Never. Negative control. |
| Ten years of own movement practice | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §8 | deseti let vlastní pohybové praxe | `VERIFIED AND APPROVED PUBLIC` | Home About |
| Psychology study at Palacký University, 2019–2024 | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §8 | V letech 2019 až 2024 jsem studoval psychologii na Univerzitě Palackého. | `VERIFIED AND APPROVED PUBLIC` | Home About |
| International yoga or meditation training | no source | — | `UNKNOWN` | Not published |
| Vajrayana or any contemplative lineage | Website DECISIONS.md, locked | — | `VERIFIED BUT NOT APPROVED PUBLIC` | Never public. Public wording stays „meditace a psychologická práce“. |

## 4 · The accident

| Claim | Source | Status | Public use |
|---|---|---|---|
| Near fatal accident and coma; two years back to basics; still practising | Website source since Brand V2; Brand Book V2 role of the story | `VERIFIED AND APPROVED PUBLIC` | Příběh, fourth section, never the opening hook |
| The accident is testimony, not a credential | Brand Book V2; OFFER.md §2.7 | `VERIFIED AND APPROVED PUBLIC` | Stated on the route in those words |
| „Umřel jsem dřív, než jsem stihl žít.“ | Authored poem, in the site since Brand V2 | `VERIFIED AND APPROVED PUBLIC` | Kept. Placed after the three beats, in the notebook band, with context. It is authored voice, not a claim. |
| Any dated timeline of the recovery | no source | `UNKNOWN` | Not published. No milestone was invented. |
| Any medical detail, diagnosis or prognosis | no source, and out of scope | `UNKNOWN` | Not published |

## 5 · The offer

`Work/offers/` holds a commercial frame Tanmay approved on 2026-08-16.
It is **not** cleared for the public site:

* `OFFER.md` §8.1 lists five decisions that must exist before the offer
  is published anywhere: session length, the place in Prague, the
  cancellation rule, the contact path and first step, and how many
  clients he is taking.
* `OFFER.md` §13 lists eight items needing external verification, four
  of which gate the first paid client.
* `Work/offers/PROJECT.md`, out of scope: "Final public prices,
  qualifications and legal terms. Those require Tanmay's explicit
  approval and external verification."

| Claim | Source | Status | Public use |
|---|---|---|---|
| Monthly price of rhythm A and rhythm B, entry session price | OFFER.md §1, §5.1 | `VERIFIED BUT NOT APPROVED PUBLIC` | **Not published.** Negative control on every currency figure. |
| Package names „rytmus A“ and „rytmus B“ | OFFER.md §5.1 | `VERIFIED BUT NOT APPROVED PUBLIC` | Not published |
| Number of sessions per month | OFFER.md §5.1 | `VERIFIED BUT NOT APPROVED PUBLIC` | Not published |
| Session length | OFFER.md §8.1.01 | `PENDING` Tanmay | Not published |
| How many clients are being taken | OFFER.md §8.1.05 | `PENDING` Tanmay | Not published |
| Cancellation, rescheduling, unused sessions | OFFER.md §8.1.03 | `PENDING` Tanmay | Not published. No FAQ entry invents one. |
| The work is one to one, in Prague, with regular sessions and practice between them | OFFER.md §4, §5.1, §9 | `VERIFIED AND APPROVED PUBLIC` | Spolupráce, `OfferSlot` empty state |
| A session is mostly movement: technical work on two or three movements, strength through range, a note at the end | OFFER.md §4 | `VERIFIED AND APPROVED PUBLIC` | Home, Praxe, Spolupráce |
| The aim is that the client eventually runs the practice alone | OFFER.md §1 compensating mechanisms | `VERIFIED AND APPROVED PUBLIC` | Home, Spolupráce |
| First step is writing to Tanmay | OFFER.md §8.1.04 recommends it; the site already used it | `VERIFIED AND APPROVED PUBLIC` | Spolupráce |
| Discount, pilot price, scarcity, guarantee | OFFER.md §11.11, §1 | `RETIRED` / never existed | Never. Negative control. |

**How to publish the offer when it is approved.** Fill the `OFFERS`
array in `src/App.tsx`. `OfferSlot()` renders it in place of the current
description with no layout change. Then relax the price negative control
in `tests/content-truth.test.mjs` and record it here.

## 6 · Location and availability

| Claim | Source | Status | Public use |
|---|---|---|---|
| Prague | Brand Strategy V2, Buyer Now; Offers PROJECT.md | `VERIFIED AND APPROVED PUBLIC` | Everywhere |
| Training happens indoors and outdoors, exact place agreed at the start | OFFER.md §8.1.02 is undecided, so no venue is named | `VERIFIED AND APPROVED PUBLIC` as written | Spolupráce, „Kde“ |
| A named studio, an address, a map point, opening hours | no source, and §8.1.02 open | `UNKNOWN` | Not published. Negative control. |
| Remote or online work | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §12 | online | `VERIFIED AND APPROVED PUBLIC` | Home collaboration preview; Spolupráce final copy still pending |
| Individual, smaller group, one-off and long-term formats | `TANMAY_WEBSITE_COPY_IMPLEMENTATION_HANDOFF_GPT.md` §5, §12 | individuálně i s menšími skupinami, jednorázově i dlouhodobě | `VERIFIED AND APPROVED PUBLIC` | Home collaboration preview |
| English speaking clients in Prague | OFFER.md §12.07 | `PENDING` Tanmay | Not published as an offer. The English edition exists as a brand layer. |

## 7 · Events

| Claim | Source | Status | Public use |
|---|---|---|---|
| „Den v lese“, říjen 2026, Brdy, sobota, nejvýš osm lidí | On the public site since Brand V2; corroborated as publicly announced by OFFER.md §14.2 | `VERIFIED AND APPROVED PUBLIC` | Spolupráce, Praxe v terénu, with a concrete next step so „Otevřeno“ means something a person can act on |
| „Zimní tichá praxe“, únor 2027, Šumava, nejvýš šest lidí | Only the old site. No other source. | `PENDING` Tanmay | **Removed from the public site on 2026-08-23.** It was eighteen months out, unverified anywhere else, and its „připravuje se“ state was a coming-soon marker, which the launch gate forbids. The wording is preserved in the comment above `EVENTS` in `src/App.tsx`; adding it back is one array entry. |
| Any other event, retreat or workshop | no source | `UNKNOWN` | Not published |

## 8 · Client proof

| Claim | Source | Status | Public use |
|---|---|---|---|
| Testimonials, reviews, ratings, client results, before and after | OFFER.md §3.3: none collected, and inventing them is forbidden | `UNKNOWN` | Never. Negative control on `testimonial`, `★`, „před a po“, and rating patterns. |
| The honest statement that client words will appear when they are theirs | Already on the site; Brand Book V2 client proof | `VERIFIED AND APPROVED PUBLIC` | Spolupráce, dark band |
| Visibly labelled fictional examples used to review the Home reference carousel | Tanmay instruction, 2026-08-26 | `PENDING` | Development preview only. Must be replaced by consented client material or removed before public launch. |

## 9 · Contact

| Claim | Source | Status | Public use |
|---|---|---|---|
| `tanmay.in.flow@gmail.com` | Website STATUS.md, confirmed 2026-08-15 | `VERIFIED AND APPROVED PUBLIC` | Header menu, Spolupráce, footer, privacy |
| Instagram `tanmayflow` | Website STATUS.md, confirmed 2026-08-15 | `VERIFIED AND APPROVED PUBLIC` | Menu, footer |
| WhatsApp `+420 774 121 475` | User confirmation, 2026-08-24 | `VERIFIED AND APPROVED PUBLIC` | Footer icon links to `https://wa.me/420774121475`; the formatted number is not printed in page copy |
| Phone number | no source | `UNKNOWN` | Not published. Negative control. |
| Postal or home address | private | `VERIFIED BUT NOT APPROVED PUBLIC` | Never |

## 10 · The application

| Claim | Source | Status | Public use |
|---|---|---|---|
| Clients have a space with the plan, sessions, records and sources | OFFER.md §9 | `VERIFIED AND APPROVED PUBLIC` | Home strip, Spolupráce |
| Access is granted by Tanmay at the start of the collaboration | Repo README, Cloudflare Access policy | `VERIFIED AND APPROVED PUBLIC` | Home strip, Spolupráce |
| The app is not required; the written plan is the base | OFFER.md §9 pojistka | `VERIFIED AND APPROVED PUBLIC` | Spolupráce, FAQ |
| Client entry destination `https://klient.tanmaypractice.com` | Website STATUS.md; this task's instruction | `VERIFIED AND APPROVED PUBLIC` | Header, mobile menu, Home strip, Spolupráce, footer |
| Main App `https://app.tanmaypractice.com` | internal | `VERIFIED BUT NOT APPROVED PUBLIC` | **Never linked publicly.** Negative control. |
| The client invite word, member details, internal routes | internal | `VERIFIED BUT NOT APPROVED PUBLIC` | Never. Negative control on invite vocabulary. |
| A screenshot of the client app | no current safe screenshot with synthetic data exists | `PENDING` | Not used. Text and the link are sufficient, per the brief. |

## 11 · Legal and privacy

Nothing on the privacy route is a legal guarantee. Every sentence there
describes something that can be checked in this repository.

| Claim | Basis | Status |
|---|---|---|
| No cookies, no analytics, no tracking | There is no analytics code and no storage write in `src/App.tsx` | `VERIFIED AND APPROVED PUBLIC` |
| No third party requests | Fonts, images and code are all first party since 2026-08-23. Enforced by a test. | `VERIFIED AND APPROVED PUBLIC` |
| An e-mail goes to Tanmay's mailbox only | `mailto:` link, no form, no server | `VERIFIED AND APPROVED PUBLIC` |
| The client app is a separate service on its own subdomain | Cloudflare Access on `klient.tanmaypractice.com` | `VERIFIED AND APPROVED PUBLIC` |
| Company identifiers, IČO, registered address, terms of business, GDPR controller statement | `OFFER.md` §13 lists these as unverified | `PENDING` | **Not published.** No legal text was written from memory. |

## 12 · Words that need current authority before use

The launch gate fails the build if any of these appear:

`certifikovaný` · `diplomovaný` · `akreditovaný` · `certified` ·
`accredited` · any price in Kč, CZK or € · `rytmus A` / `rytmus B` ·
`testimonial` · `před a po` · `coming soon` / `připravujeme` ·
`první zrcadlo` / `first mirror` · `tělo · duše` / `body · soul` ·
`Caveat` · `app.tanmaypractice.com` · invitation vocabulary ·
`odemkni potenciál` / `unlock your potential` · `discovery call` ·
`holistick*` · unverified phone numbers · opening hours.

`rehabilitace` and `diagnóza` are allowed only inside the two sentences
recorded in section 3, and the tests assert that both of those sentences
are present rather than merely that the words are absent.

---

## What would change this file

1. Offers releases the offer → section 5 rows move to
   `VERIFIED AND APPROVED PUBLIC`, `OFFERS` is filled, the price
   negative control is relaxed.
2. The trainer education finishes and its public name is verified →
   section 3 gains one row, the „do té doby žádný nemám“ sentence goes.
3. Tanmay confirms the winter event → one entry returns to `EVENTS`.
4. Consented client words arrive → section 8 gains rows, and the
   „ohlasy sem přibudou“ sentence is replaced by the real ones.
5. Legal verification completes → section 11 can carry a real
   business-terms route.
