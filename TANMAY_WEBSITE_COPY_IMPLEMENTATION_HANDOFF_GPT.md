# TANMAY PRACTICE
# WEBSITE COPY IMPLEMENTATION HANDOFF
# For the GPT chat that builds and edits the website

## STATUS

This document is for implementation.

It tells the website-building chat what is already approved, what may be implemented now, what must be removed, and what is still pending.

Do not use this file to invent new copy.

If a field is marked APPROVED, implement it exactly.
If a field is marked REMOVE, remove the corresponding public content.
If a field is marked KEEP, preserve the current implementation unless a technical adjustment is required.
If a section is marked PENDING, do not invent or implement final copy yet.

---

# 1. WORKSPACE AND SOURCE

Workspace:

`C:\Users\ksvec\Documents\Tanmay-Cowork`

Website project:

`Work/website/Source/tanmay-site/`

Public website:

`https://tanmaypractice.com`

Client App public entry:

`https://klient.tanmaypractice.com`

Private Main App:

`https://app.tanmaypractice.com`

CRITICAL:

The public website may link to:

`https://klient.tanmaypractice.com`

The public website must NOT publicly promote or link to:

`https://app.tanmaypractice.com`

Before editing:

1. inspect the live source,
2. inspect current website project docs,
3. inspect current routes and link targets,
4. preserve working visual components unless this handoff explicitly changes them,
5. make the smallest coherent implementation change.

Do not rebuild the website from scratch.

---

# 2. AUTHORITY ORDER

For implementation use:

1. live source for technical reality,
2. this document for the latest approved public copy decisions,
3. current Brand Canonical for brand rules,
4. current public facts authority for factual claims.

If an old source string conflicts with this document:

use this document for the copy.

If a current technical route differs from the visible public label:

preserve the route unless this document explicitly tells you to change it.

Example:

The public label is now:

`O mně`

but the technical route may still be:

`/pribeh`

Do not rename that route without a separate explicit decision.

---

# 3. PUBLIC IDENTITY

Use publicly:

`Kryštof Švec`

Brand:

`Tanmay Practice`

Wordmark:

`tanmay`

Do NOT publicly use:

`Kryštof Tanmay Švec`

Do NOT use:

`Jmenuju se Tanmay`

as the public personal introduction.

Footer identity:

`© [aktuální rok] Kryštof Švec · Tanmay Practice`

---

# 4. IMPLEMENTATION SCOPE NOW

## HOME

Status:

**APPROVED · IMPLEMENT NOW**

The Czech Home copy below is locked.

Do not rewrite it.
Do not improve it.
Do not paraphrase it.
Do not add extra supporting paragraphs.

Only make technical/layout adaptations required to render it correctly.

## SPOLUPRÁCE

Status:

**PARTIALLY APPROVED · DO NOT COMPLETE FROM GUESSWORK**

Some fields are approved and listed later in this document.

Do not invent missing sections.

If the user explicitly asks to implement the approved partial Spolupráce state, implement only the approved fields and preserve / hide unresolved content as instructed.

The preferred workflow is to wait for a complete Spolupráce return template before final public implementation.

## O MNĚ / PRAXE / DENÍK / SOUKROMÍ / 404

Status:

**STRUCTURE DEFINED · FINAL COPY PENDING**

Do not rewrite these pages from this document yet.

The planned structures are included so implementation decisions made on Home do not create future conflicts.

---

# 5. HOME · FINAL APPROVED COPY

Implement exactly:

```text
HOME.META.TITLE: Osobní trenér v Praze | Kryštof Švec · Tanmay Practice
HOME.META.DESCRIPTION: Osobní trénink v Praze pro sílu, pohybovou jistotu a praxi, která drží. Individuálně, v menší skupině nebo online. Jednorázově i dlouhodobě.

HOME.NAV.01: Spolupráce
HOME.NAV.02: O mně
HOME.NAV.03: Praxe
HOME.NAV.CLIENT: Vstup pro klienty

HOME.HERO.KICKER: Osobní trénink a pohybová praxe · Praha
HOME.HERO.H1: To, co učím, sám žiju.
HOME.HERO.BODY: Pomáhám lidem budovat sílu, pohybovou jistotu a praxi, která drží i v běžném životě. Osobní trénink propojuju s plánem a průběžnou úpravou podle toho, co se skutečně děje.
HOME.HERO.CTA: Jak spolupracovat
HOME.HERO.STANCE: tělo · praxe · divoká příroda

HOME.AUDIENCE.H2: Pro koho to je
HOME.AUDIENCE.P1: Nechceš pokaždé začínat znovu. Hledáš trénink s jasným směrem, který počítá i s týdny, kdy nejde všechno podle plánu.
HOME.AUDIENCE.P2: Nejde ti o univerzální plán ani nahodilé lekce. Chceš vědět, co má teď smysl, proč to děláš a jak podle reality upravit další krok.

HOME.WORK.H2: Jak spolu pracujeme
HOME.WORK.01.H3: Síla, kterou umíš použít
HOME.WORK.01.BODY: Trénujeme sílu, kontrolu, mobilitu a pohybovou jistotu. Základ tvoří vlastní váha a kalistenika. Kruhy, činky a další pomůcky zapojujeme jen tam, kde pomáhají konkrétnímu cíli.
HOME.WORK.02.H3: Co má teď smysl
HOME.WORK.02.BODY: Každé setkání má pokračování. Společně určíme, co má teď prioritu, kolik práce unese tvůj týden a čeho se držet, když podmínky nejsou ideální.
HOME.WORK.03.H3: Plán podle reality
HOME.WORK.03.BODY: V klientské aplikaci máš svůj plán, termíny a záznamy na jednom místě. Podle toho, co jsi skutečně udělal a jak na to tělo reagovalo, upravujeme objem, náročnost i další krok. Plán se přizpůsobuje realitě, ne naopak.
HOME.WORK.CTA: Více o praxi

HOME.COLLAB.H2: Od setkání k vlastní praxi
HOME.COLLAB.P1: Pracuji individuálně i s menšími skupinami, jednorázově i dlouhodobě, osobně v Praze nebo online.
HOME.COLLAB.P2: Pracujeme tak, abys rozuměl svému tréninku a dokázal svou praxi držet sám.
HOME.COLLAB.STEP.01: REMOVE
HOME.COLLAB.STEP.02: REMOVE
HOME.COLLAB.STEP.03: REMOVE
HOME.COLLAB.STEP.04: REMOVE
HOME.COLLAB.STEP.05: REMOVE
HOME.COLLAB.CTA: Možnosti spolupráce

HOME.REVIEWS.LABEL: Reference
HOME.REVIEWS.H2: Co říkají klienti
HOME.REVIEWS.DEMO_NOTE: KEEP

HOME.REVIEWS.VIDEO.01.TITLE: KEEP
HOME.REVIEWS.VIDEO.01.NAME: KEEP
HOME.REVIEWS.VIDEO.01.TYPE: KEEP
HOME.REVIEWS.VIDEO.01.ASSET: KEEP

HOME.REVIEWS.VIDEO.02.TITLE: KEEP
HOME.REVIEWS.VIDEO.02.NAME: KEEP
HOME.REVIEWS.VIDEO.02.TYPE: KEEP
HOME.REVIEWS.VIDEO.02.ASSET: KEEP

HOME.REVIEWS.VIDEO.03.TITLE: KEEP
HOME.REVIEWS.VIDEO.03.NAME: KEEP
HOME.REVIEWS.VIDEO.03.TYPE: KEEP
HOME.REVIEWS.VIDEO.03.ASSET: KEEP

HOME.REVIEWS.TEXT.01.QUOTE: KEEP
HOME.REVIEWS.TEXT.01.NAME: KEEP
HOME.REVIEWS.TEXT.01.TYPE: KEEP

HOME.REVIEWS.TEXT.02.QUOTE: KEEP
HOME.REVIEWS.TEXT.02.NAME: KEEP
HOME.REVIEWS.TEXT.02.TYPE: KEEP

HOME.REVIEWS.TEXT.03.QUOTE: KEEP
HOME.REVIEWS.TEXT.03.NAME: KEEP
HOME.REVIEWS.TEXT.03.TYPE: KEEP

HOME.REVIEWS.TEXT.04.QUOTE: KEEP
HOME.REVIEWS.TEXT.04.NAME: KEEP
HOME.REVIEWS.TEXT.04.TYPE: KEEP

HOME.ABOUT.LABEL: Kryštof Švec
HOME.ABOUT.H2: Vlastní praxe. Zkušenost s lidmi. Odborné vzdělání.
HOME.ABOUT.BODY: Moje práce vyrostla z deseti let vlastní pohybové praxe a zkušeností s více než 200 klienty. Rok jsem působil jako vedoucí studia a hlavní trenér. Jsem držitelem profesní kvalifikace Osobní trenér ve fitness a instruktorem jógy. Další odborné vzdělání mám v oblasti kondičního a funkčního tréninku, zdravotní tělesné výchovy a rehabilitačního tréninku. V letech 2019 až 2024 jsem studoval psychologii na Univerzitě Palackého.
HOME.ABOUT.CTA: Více o mně

HOME.BOOKING.LABEL: První krok
HOME.BOOKING.H2: Napiš mi.
HOME.BOOKING.BODY: Stačí mi pár vět o tom, co chceš rozvíjet, jakou spolupráci hledáš a kdy máš obvykle čas. Ozvu se a domluvíme první krok.
HOME.BOOKING.CTA.WHATSAPP: Napsat na WhatsApp
HOME.BOOKING.CTA.EMAIL: Napsat e-mail
HOME.BOOKING.CTA.INSTAGRAM: REMOVE

HOME.BOOKING.WHATSAPP.PREFILL: Ahoj Kryštofe, mám zájem o spolupráci.

Co chci rozvíjet:

Jakou spolupráci hledám:

Kdy mám obvykle čas:

HOME.BOOKING.EMAIL.SUBJECT: Zájem o spolupráci
HOME.BOOKING.EMAIL.BODY: Ahoj Kryštofe,

mám zájem o spolupráci.

Co chci rozvíjet:

Jakou spolupráci hledám:

Kdy mám obvykle čas:

HOME.CLIENT.H2: Už se mnou pracuješ?
HOME.CLIENT.BODY: V klientské aplikaci máš na jednom místě svůj plán, termíny, záznamy a zdroje k praxi. Přístup je součástí spolupráce.
HOME.CLIENT.CTA: Vstup pro klienty

HOME.NEXT.H2: REMOVE
HOME.NEXT.STORY.LABEL: REMOVE
HOME.NEXT.STORY.H3: REMOVE
HOME.NEXT.STORY.BODY: REMOVE
HOME.NEXT.PRACTICE.LABEL: REMOVE
HOME.NEXT.PRACTICE.H3: REMOVE
HOME.NEXT.PRACTICE.BODY: REMOVE

HOME.CLOSING.LABEL: REMOVE
HOME.CLOSING.WORDMARK: KEEP
HOME.CLOSING.MEANING: tanmaya · „tím prostoupený“
HOME.CLOSING.STANCE: Staň se tím, co praktikuješ.
HOME.CLOSING.COMPASS.LABEL: REMOVE
HOME.CLOSING.COMPASS.01: REMOVE
HOME.CLOSING.COMPASS.02: REMOVE
HOME.CLOSING.COMPASS.03: REMOVE

HOME.FOOTER.CLIENT: Vstup pro klienty
HOME.FOOTER.PRIVACY: Soukromí
HOME.FOOTER.COPYRIGHT: © [aktuální rok] Kryštof Švec · Tanmay Practice
```

---

# 6. HOME · REQUIRED STRUCTURAL CHANGES

## Navigation

Visible public labels:

1. `Spolupráce`
2. `O mně`
3. `Praxe`
4. `Vstup pro klienty`

Preserve existing technical route for the current `Příběh` page if it is `/pribeh`.

Only its visible public label changes to:

`O mně`

Do not silently change URL architecture.

## Hero

Keep the current approved visual direction.

Do not add extra CTA.

Primary CTA text:

`Jak spolupracovat`

It should lead to the current Spolupráce route.

## Audience

Keep exactly two paragraphs.

Do not add a third audience card / paragraph.

## Work section

Three rows only:

1. `Síla, kterou umíš použít`
2. `Co má teď smysl`
3. `Plán podle reality`

Do not restore older wording.

`Více o praxi` links to the Praxe route.

## Collaboration preview on Home

Keep only:

- H2,
- P1,
- P2,
- CTA.

Remove all five old process steps.

CTA:

`Možnosti spolupráce`

links to the Spolupráce route.

## References

Keep the references component visible in the working build so its interaction can be reviewed.

Important:

The current content is DEMO.

It must remain visibly treated as demo / non-production content.

Do not:
- invent new names,
- invent new quotes,
- invent results,
- remove the demo warning and present the content as real.

Before public launch this entire demo content must be replaced with real references and consent.

## About

Use the approved copy exactly.

The CTA label:

`Více o mně`

should go to the existing O mně / current `/pribeh` route.

## First contact

This is a contact block, not a public booking calendar.

Label:

`První krok`

H2:

`Napiš mi.`

Only two primary contact CTAs:

- WhatsApp
- e-mail

Remove Instagram as a third CTA from this block.

Instagram may remain in the social/footer/header system.

Preserve the current verified phone and email targets from the live source unless a newer explicit user decision changes them.

Use the approved WhatsApp prefill and email subject/body exactly.

## Client entry

CTA target:

`https://klient.tanmaypractice.com`

Do not point to the private Main App.

## Remove Home NEXT section

Remove the full redundant `Odtud dál` / Home teaser section represented by:

`HOME.NEXT.*`

Do not leave empty wrappers or visual whitespace after removal.

## Closing

Keep wordmark.

Remove old closing label and old three-anchor compass text.

Final content:

`tanmaya · „tím prostoupený“`

and

`Staň se tím, co praktikuješ.`

Do not add the long Tanmay etymology to Home.

That explanation belongs to Praxe.

## Footer

Visible:

- Vstup pro klienty
- Soukromí
- current social icons
- `© [aktuální rok] Kryštof Švec · Tanmay Practice`

---

# 7. HOME · LINK INTENT

Resolve links against the live route system.

Semantic intent:

```text
HOME.NAV.01 -> Spolupráce
HOME.NAV.02 -> O mně / existing story route
HOME.NAV.03 -> Praxe
HOME.NAV.CLIENT -> https://klient.tanmaypractice.com

HOME.HERO.CTA -> Spolupráce
HOME.WORK.CTA -> Praxe
HOME.COLLAB.CTA -> Spolupráce
HOME.ABOUT.CTA -> O mně / existing story route

HOME.BOOKING.CTA.WHATSAPP -> current verified WhatsApp target
HOME.BOOKING.CTA.EMAIL -> current verified email target

HOME.CLIENT.CTA -> https://klient.tanmaypractice.com

HOME.FOOTER.CLIENT -> https://klient.tanmaypractice.com
HOME.FOOTER.PRIVACY -> Soukromí route
```

Do not invent a new route if an existing route already satisfies the semantic target.

---

# 8. HOME · FACT SAFETY

Current approved public factual wording uses:

- more than 200 clients,
- ten years of own movement practice,
- approximately one year as studio manager and head trainer,
- professional qualification `Osobní trenér ve fitness`,
- yoga instructor,
- further education in conditioning training,
- functional training,
- health-oriented physical education,
- rehabilitation training as education,
- psychology study at Palacký University from 2019 to 2024.

Do not change `200+` to `300+`.

Do not write:
- psychologist,
- physiotherapist,
- psychotherapist,
- rehabilitation provider,
- medical professional.

Do not turn rehabilitation education into a healthcare service claim.

---

# 9. VISUAL IMPLEMENTATION PRINCIPLES

The copy update must preserve the current Tanmay visual direction.

Core visual character:

- editorial,
- material,
- restrained,
- natural,
- asymmetric where useful,
- real photography,
- no generic wellness aesthetic.

Keep the strongest signature elements where they already belong:

- real hero portrait,
- black-and-white handstand cutout,
- Ink,
- Linen,
- Burnt Earth,
- precise Copper linework.

Do not introduce:

- gradient,
- glow,
- glassmorphism,
- generic fitness card UI,
- fake badges,
- star-rating widgets,
- decorative icon grids,
- generated people,
- SaaS-style feature sections.

Copy hierarchy comes first.

Do not lengthen a section to fill visual space.

Do not keep an empty visual wrapper after text removal.

---

# 10. RESPONSIVE QA

After implementing Home, render and inspect at minimum:

- 390 px
- 834 px
- 1440 px

Check:

## 390
- navigation works,
- hero copy is not clipped,
- portrait does not collide with navigation,
- CTA remains visible,
- no accidental horizontal scroll,
- all removed sections leave no empty space,
- references carousel is usable,
- contact CTAs fit,
- closing remains clean.

## 834
- no awkward tablet dead zones,
- columns do not create large empty gaps,
- reference media/text relationship still works,
- typography does not become oversized.

## 1440
- no huge empty vertical gaps,
- copy and imagery remain connected,
- portrait does not collide with top bar,
- handstand / material elements do not overpower text,
- Copper terrain remains a supporting compositional gesture,
- removed sections do not leave unused height.

---

# 11. ACCESSIBILITY / CONTENT QA

Verify:

- one logical H1,
- correct heading hierarchy,
- buttons and links have clear labels,
- keyboard interaction still works,
- reference carousel controls remain accessible,
- external links preserve appropriate target / rel behavior,
- no text is baked into decorative imagery when it should be HTML,
- contact prefill encodes correctly,
- Czech diacritics render correctly,
- no dead links.

---

# 12. CURRENT SPOLUPRÁCE · APPROVED PARTIAL COPY

This content has been approved in the separate copy workflow.

Do NOT invent the rest of the page.

```text
SPOLUPRACE.HERO.H1: Spolupráce

SPOLUPRACE.HERO.LEAD: Jedno setkání nebo delší vedení. Individuálně, v menší skupině, osobně v Praze nebo online. Zvolíme formu podle toho, co chceš rozvíjet a co se dá skutečně držet.

SPOLUPRACE.HERO.CTA: Napiš mi

SPOLUPRACE.FORMATS.H2: Možnosti spolupráce

SPOLUPRACE.FORMAT.01.H3: Osobní trénink
SPOLUPRACE.FORMAT.01.BODY: Pracujeme přesně s tím, co chceš rozvíjet. Jedno setkání může stát samo o sobě nebo navázat do delšího vedení.

SPOLUPRACE.FORMAT.02.H3: Trénink v menší skupině
SPOLUPRACE.FORMAT.02.BODY: Společný trénink pro lidi, kteří chtějí pracovat podobným směrem. Každý má vlastní úroveň, skupina společný rytmus.

SPOLUPRACE.FORMAT.03.H3: Online vedení
SPOLUPRACE.FORMAT.03.BODY: Máš jasný plán, pravidelnou zpětnou vazbu a úpravy podle skutečného průběhu. Praxe probíhá tam, kde jsi.

SPOLUPRACE.CONTENT.H2: S čím můžeš přijít

SPOLUPRACE.CONTENT.INTRO: Nemusíš mít hotový plán. Stačí vědět, co chceš zvládnout lépe nebo co ti dnes v pohybu chybí.

SPOLUPRACE.CONTENT.01.H3: Síla a kondice
SPOLUPRACE.CONTENT.01.BODY: Chceš zesílit, zlepšit výdrž nebo zvládat fyzickou zátěž s větší rezervou.

SPOLUPRACE.CONTENT.02.H3: Pohybová dovednost
SPOLUPRACE.CONTENT.02.BODY: Chceš zvládnout shyb, stojku, práci na kruzích nebo jiný pohyb, který má pro tebe význam.

SPOLUPRACE.CONTENT.03: PENDING

SPOLUPRACE.CONTENT.04.H3: Pravidelnost a vlastní praxe
SPOLUPRACE.CONTENT.04.BODY: Začínáš, vracíš se po pauze nebo nechceš znovu ztratit směr. Hledáš systém, který se dá skutečně držet.
```

Do not finalize Spolupráce while `SPOLUPRACE.CONTENT.03` and all later sections are pending.

---

# 13. TARGET STRUCTURE · SPOLUPRÁCE

Future final structure:

1. Hero
2. Možnosti spolupráce
3. S čím můžeš přijít
4. Jak to probíhá
5. Co drží práci mezi setkáními
6. Důvěra / hranice / krátké FAQ / kontakt

Important cleanup direction for the old page:

- remove repeated `Pro koho` if it duplicates Home,
- stop presenting only one-to-one regular Prague work as the only model,
- reduce the old five-step process,
- remove `Praxe v terénu` as a public open offer unless later explicitly approved,
- merge experience into a short trust layer,
- remove the standalone manifesto-style `Úmluva`,
- keep professional boundaries short and human,
- reduce FAQ,
- keep one final contact action.

Do not apply unresolved copy yet.

---

# 14. TARGET STRUCTURE · O MNĚ

Final copy is pending.

Public H1 will be:

`O mně`

Planned structure:

1. Kryštof Švec
2. Jak moje práce vznikla
3. Odborné zázemí
4. Kořeny
5. Pád · sestup · návrat
6. Co to změnilo v mé práci
7. Co nabízím dnes
8. CTA do Spolupráce

Important:

The accident story may exist deeper on the page.

It must not be the first-screen marketing hook.

Princip:

`Nehoda vysvětluje závazek. Není to kvalifikace.`

Do not implement final copy until a dedicated O mně return template arrives.

---

# 15. TARGET STRUCTURE · PRAXE

Final copy is pending except for the approved Tanmay meaning concept.

Planned structure:

1. Co tady znamená praxe
2. Tělo · praxe · divoká příroda
3. Co může obsahovat trénink / setkání
4. Jak se plán potkává s realitou
5. Client App / kontinuita
6. Co tato práce není
7. Význam jména Tanmay
8. CTA do Spolupráce

Approved future Tanmay meaning block:

```text
LABEL: Význam jména

H2: Nejde jen o praxi, kterou děláš.

BODY.01: Tanmay vychází ze sanskrtského tad, „to“, a přípony -maya, „z toho utvořený“ nebo „tím prostoupený“. Označuje stav, kdy je člověk v něčem zcela pohroužený, až se to stává součástí toho, kým je.

BODY.02: Muṇḍaka upanišada zachycuje tento význam obrazem šípu, který po zásahu nezůstává vedle cíle, ale stává se s ním jedním. Pro mě je to přesný obraz praxe. Nestačí něco vědět ani občas splnit plán. To, čemu dáváš tělo, pozornost a čas, začne postupně utvářet, jak se hýbeš, vnímáš a žiješ.

BODY.03: Proto Tanmay Practice není jen soubor tréninků. Je to cesta od poznání k vlastní zkušenosti a od společného setkání k praxi, kterou dokážeš držet sám.

VISUAL.ETYMOLOGY: tad · „to“ + -maya · „z toho utvořený, tím prostoupený“ → tanmaya

VISUAL.PATH: poznat → praktikovat → žít

CLOSING: Nejde jen o praxi, kterou děláš. Jde o praxi, která utváří tebe.
```

Visual direction for this future block:

- HTML/SVG, not a generated image,
- large `तन्मय`,
- Ink background,
- Linen text,
- Copper line,
- two unequal columns desktop,
- stacked mobile.

Do not implement this full page until its dedicated return template is approved.

---

# 16. TARGET STRUCTURE · DENÍK PRAXE

Final copy pending.

Keep:

- real authored posts only,
- date,
- tag,
- title,
- excerpt,
- simple editorial list,
- quiet photography.

Do not fabricate posts.

Do not keep a promise like:

`Nový zápis jednou za dva až tři týdny`

unless the user explicitly decides to maintain that publishing rhythm.

---

# 17. TARGET STRUCTURE · SOUKROMÍ

Final copy must be verified against the actual production stack.

Before publishing claims such as:

- no cookies,
- no analytics,
- no third-party requests,
- no tracking,

verify them technically.

Do not copy old absolute privacy claims if the production website no longer satisfies them.

---

# 18. 404

Keep short.

Future visible links should align with:

- Domů
- Spolupráce
- O mně
- Praxe
- optionally Deník praxe

---

# 19. IMPLEMENTATION CHECKLIST FOR HOME

Before declaring the update complete:

```text
[ ] Home metadata updated
[ ] Primary nav labels updated
[ ] Existing route structure preserved unless explicitly changed
[ ] Hero copy updated
[ ] Audience copy updated
[ ] Work section contains exactly 3 approved rows
[ ] Work CTA points to Praxe
[ ] Home collaboration contains no old 5-step process
[ ] Collaboration CTA points to Spolupráce
[ ] References remain working and visibly demo
[ ] About copy updated
[ ] About CTA points to O mně / existing story route
[ ] Booking label/H2/body updated
[ ] WhatsApp prefill updated
[ ] Email subject/body updated
[ ] Instagram removed only as booking CTA
[ ] Client entry points to klient.tanmaypractice.com
[ ] HOME.NEXT section fully removed
[ ] No empty wrappers remain after NEXT removal
[ ] Closing reduced to approved wordmark/meaning/stance
[ ] Footer copyright updated
[ ] No public link to app.tanmaypractice.com
[ ] 390 render checked
[ ] 834 render checked
[ ] 1440 render checked
[ ] no horizontal overflow
[ ] no broken internal links
[ ] build passes
```

---

# 20. REQUIRED IMPLEMENTATION OUTPUT

After applying the approved Home update, return:

## IMPLEMENTATION VERDICT

## HOME CHANGES APPLIED

List the major changes.

## ROUTES / LINKS

Confirm resolved targets.

## REMOVED CONTENT

Confirm:
- old 5 collaboration steps removed,
- HOME.NEXT removed,
- booking Instagram CTA removed,
- old closing compass content removed.

## REFERENCES STATUS

State clearly that current reference content is still demo and not production-ready.

## RESPONSIVE QA

Report:
- 390
- 834
- 1440

## BUILD / CHECKS

Report exact commands and results.

## FILES CHANGED

## DIFF SUMMARY

## BLOCKERS

Only real blockers.

Do not claim public launch readiness while demo references remain.

---

# 21. FUTURE UPDATE PROTOCOL

The separate copy chat will continue producing approved return templates page by page.

When the user later sends an updated copy handoff:

1. compare it with this implementation handoff,
2. identify only newly approved deltas,
3. implement only those deltas,
4. do not reopen already locked Home copy,
5. preserve unrelated visual and technical work,
6. re-run responsive and build checks.

This file is therefore the baseline implementation authority until replaced by a newer explicit copy implementation handoff.
