# tanmay-site · Visual Asset Plan

Last updated: 2026-08-16
Scope: implementation support for `tanmaypractice.com`. Not brand authority.
Authority: `Context/Brand/Canonical/` in the Tanmay-Cowork workspace.

This is the single place where every future image, texture and clip for the
website is specified. Do not spread asset requirements across other files.

---

## How the site behaves without any of these files

Every asset below is optional at runtime. The site is complete and usable
with zero media present, which is its current state.

| Mechanism | Where | Behaviour when the file is missing |
|---|---|---|
| `useAsset(url)` probe | `src/App.tsx` | Loads the file once. Returns `false` on error. |
| `<Evidence>` | practice, work-with-me, log | Renders `null`. No empty frame, no broken icon. |
| `<QuietClip>` | practice | Renders `null` if the poster is missing. |
| `Opening` portrait | home | Column collapses, the type block takes the full measure. |
| `html[data-edge]` | portrait mask | Mask is not applied. The photograph keeps a clean rectangle. |
| `html[data-surface]` | dark bands | Bands stay flat Forest Night. |

Drop a file into `public/media/` with the exact name below and it appears.
No code change is required.

---

## Priority order for imagery

1. Real Tanmay photography or a video still.
2. CSS, typography, layout and space.
3. A small generated texture or edge.
4. A generated representational image, only if genuinely necessary.

The site currently uses 1, 2 and 3. It uses no generated representational
imagery, and none is planned.

---

## A · Portrait

### A1 · `portrait-tanmay.jpg`

| Field | Value |
|---|---|
| Asset id | `A1` |
| Purpose | Put a real person on the first screen instead of brand abstraction. |
| Page / section | Home, opening. Desktop right column, mobile above the type. |
| Source | Real photograph. Image system mode 03, portrait and story. |
| Aspect | 4 : 5 desktop. Cropped to a landscape band on mobile by CSS. |
| Dimensions | 920 × 1150 minimum. 1840 × 2300 preferred, downscale on export. |
| Format | JPEG, quality 78 to 82, sRGB, progressive. |
| Size target | Under 180 kB. |
| Desktop crop | Head and upper chest. Eyes on the upper third. Space above the head, no tight top crop. |
| Mobile crop | CSS uses `object-position: 50% 26%` and a fixed height between 230 px and 400 px. The face must sit in the upper third of the frame so the crop never cuts it. |
| Safe focal area | Keep the face inside the middle 60 % horizontally and the top 55 % vertically. The bottom 14 % of the image is consumed by the dissolve mask, so nothing important may sit there. |
| Alt text direction | Czech: `Tanmay, portrét zblízka, přirozené světlo.` English: `Tanmay, a close portrait in natural light.` Already in the source; update only if the picture changes materially. |
| Fallback | Column collapses. Home reads as type only. |

**What the photograph must be.** Prepared composition, chosen place,
considered time of day, deliberate camera position. Natural or available
light. Direct, calm, looking at or slightly past the lens. Ordinary clothing.

**What it must not be.** Personal-brand guru photography. Fitness hero
shot. Luxury founder portrait. Arms crossed. Studio seamless. Golden-hour
wellness filter. Staged spontaneity.

### A2 · `portrait-tanmay-wide.jpg` — reserved, not yet used

Declared in `MEDIA` for a future wide crop. No component consumes it today.
Do not produce it until a layout needs it.

---

## B · Photography from real practice

Three images across the whole site. Not a gallery. Each one carries lived
proof, body, practice, place, scale or human presence, or it does not ship.

### B1 · `practice-handstand-trunk.jpg`

| Field | Value |
|---|---|
| Purpose | Evidence that the physical practice is real and technically serious. |
| Page / section | Practice, after "Who this is for". |
| Source | Still extracted from existing footage. |
| Aspect | 16 : 9 desktop and tablet, 4 : 3 below 600 px (CSS crop). |
| Dimensions | 1600 × 900 minimum. |
| Format | JPEG, quality 78 to 82. Size target under 260 kB. |
| Desktop crop | Full figure with the trunk. Leave headroom above the hands. |
| Mobile crop | Centre crop must still contain the whole body. Keep the figure in the middle 70 % horizontally. |
| Keep natural | Wet wood, cold light, imperfect line, breath, dirt, strain. |
| Do not retouch | Skin, muscle definition, body shape, sky replacement, contrast crushing, warm filter. |
| Alt text | Czech: `Stoj na rukou na padlém kmeni v lese.` |
| Caption | `Brdy · pohybová praxe venku` / `Brdy hills · movement practice outdoors` |
| Fallback | Figure not rendered. |

### B2 · `practice-sitting-pine.jpg`

| Field | Value |
|---|---|
| Purpose | Evidence that the contemplative half of the practice is equally real. |
| Page / section | Practice log, below the entries. |
| Aspect / dimensions / format | As B1. |
| Desktop crop | Wide enough that the tree and the ground give scale. The figure may be small in the frame. |
| Mobile crop | Do not let the 4 : 3 crop reduce the figure to nothing. If it does, supply a separate tighter frame instead of forcing this one. |
| Keep natural | Low sun, long shadows, ordinary posture. |
| Do not retouch | Do not intensify the sunset. No lens flare. No haze added. This must not become a meditation stock photograph. |
| Alt text | Czech: `Sezení pod borovicí při západu slunce.` |
| Caption | `Podvečer · sezení venku` / `Early evening · sitting outdoors` |

### B3 · `practice-walking-forest.jpg`

| Field | Value |
|---|---|
| Purpose | Evidence for field practice and for "returning to the same places". |
| Page / section | Work with me, after the events list. |
| Aspect / dimensions / format | As B1. |
| Desktop crop | Terrain and path legible. Figure may be partly turned away or absent. |
| Mobile crop | Keep the path or terrain structure readable, not just leaves. |
| Keep natural | Weather, mud, flat light, bare season. A grey day is better than a beautiful one. |
| Do not retouch | No saturation boost on greens. No autumn-colour push. |
| Alt text | Czech: `Chůze lesem, pozdní odpolední světlo.` |
| Caption | `Návraty na stejná místa` / `Returning to the same places` |

---

## C · Motion

### C1 · `mat-unroll.mp4` + `mat-unroll-poster.jpg`

The scroll-linked idea was evaluated and rejected in this form. What is
implemented instead is documented here with the reasoning, because the
decision is the deliverable.

**Evaluated options**

| Option | Verdict |
|---|---|
| Animated GIF | Rejected. No codec efficiency, no alpha control, typically 5 to 20 times the bytes of an equivalent MP4, no `prefers-reduced-motion` control without JavaScript. |
| Scroll-scrubbed image sequence | Rejected. Needs 30 to 60 decoded frames before the first useful paint, is expensive on mobile, and ties the reading rhythm to the scroll wheel. It is animation as a demonstration of skill. |
| Scroll-scrubbed video | Rejected. Frame-accurate seeking is unreliable on iOS Safari and produces stutter under load. |
| CSS reveal / progressive mask | Kept as the fallback shape, but on its own it does not show a movement. |
| **Short muted video, play once on entry, hold the last frame** | **Chosen.** |

**Why the chosen form.** It shows a real movement, costs one small file,
needs no scroll maths, degrades to a single still under reduced motion,
and disappears entirely if the file never arrives. Motion stays secondary
to reading.

| Field | Value |
|---|---|
| Purpose | One quiet piece of evidence that the practice is a daily physical act, placed between the abstract anchors and the concrete "who this is for". |
| Page / section | Practice, immediately after the dark anchors band. |
| Behaviour | Plays once when 50 % visible. No loop. No sound. No controls. Holds the final frame. |
| Reduced motion | The poster still is rendered instead. The `<video>` element is never created. |
| Video spec | MP4 / H.264 High, yuv420p, 1600 × 900, 24 or 25 fps, 4 to 7 seconds, no audio track at all, `faststart` enabled. |
| Size target | Under 1.2 MB. Under 800 kB preferred. |
| Poster spec | `mat-unroll-poster.jpg`, 1600 × 900, matching the **first** frame, quality 78 to 82, under 220 kB. |
| Content | Hands reaching for a rolled mat and unrolling it. Real place, real light. One continuous take. No cut, no zoom, no camera move. |
| Framing | Locked camera. The mat and hands occupy the middle of the frame so the 4 : 3 mobile crop does not lose the action. |
| Alt text | Czech: `Rozbalení podložky na začátku praxe.` |
| Caption | `Ráno · začátek praxe` / `Morning · the start of practice` |
| Fallback | If the poster is missing, nothing renders. The section reads normally. |

**Export command reference** (run locally once the footage exists):

```
ffmpeg -i source.mov -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -vf "scale=1600:-2,fps=25" -crf 24 -preset slow -movflags +faststart \
  mat-unroll.mp4
ffmpeg -i mat-unroll.mp4 -frames:v 1 -q:v 3 mat-unroll-poster.jpg
```

---

## D · Generated assets

Two. Both are surface or edge. Neither depicts anything. Neither carries
lettering. Full prompts are in `IMAGE-GENERATION-BRIEF.md`.

### D1 · `edge-linen-torn.png`

| Field | Value |
|---|---|
| Purpose | The single organic transition on the whole site: the portrait dissolves into the Linen page instead of ending on a hard rectangle. |
| Job that CSS cannot do | CSS masks give geometric or wavy shapes. Tany rejected repetitive wavy SVG dividers, and a hand-authored SVG path reads as a graphic device. An irregular alpha ramp derived from a real torn edge does not. |
| Page / section | Home, opening portrait. Used once. |
| Applied as | `mask-image`, `mask-size: 100% 100%`, `mask-repeat: no-repeat`. |
| Dimensions | 1200 × 1500, stretched to the element. |
| Format | PNG with alpha. Greyscale plus alpha is enough. |
| Size target | Under 90 kB. |
| Structure | Fully opaque from the top down to roughly 84 % of the height. Between 84 % and 100 %, an irregular fibrous dissolve to fully transparent. Variation along the horizontal axis on two scales: coarse undulation of roughly 40 to 60 px and fine fibre of roughly 2 to 6 px. |
| Desktop behaviour | Dissolve reads across a 440 px wide column. |
| Mobile behaviour | Same mask over a wider, shorter box. The dissolve compresses but stays irregular. |
| Alt text | None. Decorative mask, not an element. |
| Fallback | `html[data-edge="off"]`. The portrait keeps a clean rectangular bottom edge, which is a legitimate editorial result. |
| Do not | Make it look like torn paper in a scrapbook. Make it symmetrical. Make it a wave. Add texture inside the opaque area. |

### D2 · `surface-forest-cotton.png`

| Field | Value |
|---|---|
| Purpose | Give the two Forest Night bands the material of the master surface system rather than flat digital black. |
| Canonical basis | Type spec V2: "the page grounds are the master surface system: Surface 01 Linen on Linen, Forest Night with organic cotton, Deep Moss with cotton texture." This is not an invented decoration. |
| Job that CSS cannot do | A repeating CSS gradient produces regular banding and moiré at 1× and 2×. A woven surface needs irregular thread positions. |
| Page / section | Every `.band--dark`: the home closing, the practice anchors, the story notebook, the contract. |
| Applied as | `background-image` on `.band--dark`, tiled, `background-size: 520px 520px`. |
| Dimensions | 520 × 520, must tile seamlessly. |
| Format | PNG, 8-bit. |
| Size target | Under 60 kB. |
| Intensity | The weave must be almost invisible. Measured target: no pixel in the tile differs from `#1C1C1A` by more than 6 levels in any channel. If a viewer notices it as texture on a first pass, it is too strong. |
| Desktop / mobile | Identical. Fixed pixel tile, so it does not scale with the viewport. |
| Alt text | None. |
| Fallback | `html[data-surface="off"]`. Bands stay flat Forest Night, which is the current state and is correct. |
| Do not | Add fibre highlights, linen slubs, paper grain, noise, vignette or a colour cast. Do not use it on Linen. |

### Deliberately not produced

| Considered | Decision |
|---|---|
| Linen-on-Linen weave for the light ground | Dropped. Linen's role is visual silence. Whitespace already does the job, and a global texture on the dominant ground is the "fake paper grain everywhere" failure Tany named. |
| Icon set | Dropped. Numerals in Barlow Condensed and one arrow glyph carry all orientation. A line-icon library would clash with the linocut illustration language. |
| Anchor marks for Body, Practice, Wild Nature | Dropped. The canonical three-circle diagram is inline SVG and already carries the relationship. Separate marks would fragment it. |
| Spot illustrations per room or per log entry | Dropped. Illustration explains; the log entries need no explanation. |
| Ridge or treeline silhouette divider | Dropped. It is the nature cliché the brand refuses, and hairline rules plus space already separate sections. |
| Editorial woodcut for the practice log index | Deferred. Possible later, but it would be the first asset that decorates rather than proves. Do not add it without a stated job. |

---

## E · Where the approved offer plugs in

When the Offers project approves the personal-work offer, no layout work
is needed on this site.

| Item | Location |
|---|---|
| Data | `const OFFERS: any[] = []` in `src/App.tsx`. Fill the array. |
| Renderer | `OfferSlot()` in `src/App.tsx`. It already switches from the honest empty state to the list when `OFFERS.length > 0`. |
| Required fields per offer | Who it is for, the problem it solves, the progress it supports, what the process includes, what it excludes, duration, price, scope of competence, next step. Brand Strategy V2, page 09. |
| Rule | Prices are public when an offer is open. No "message me for details". |
| Do not | Publish any price, package name or capacity number before the Offers project approves it. The previous priced cards were removed for exactly this reason. |

---

## F · File checklist

Put files here: `public/media/`

```
portrait-tanmay.jpg              A1   required for the intended first screen
practice-handstand-trunk.jpg     B1   optional
practice-sitting-pine.jpg        B2   optional
practice-walking-forest.jpg      B3   optional
mat-unroll-poster.jpg            C1   required if the clip is used
mat-unroll.mp4                   C1   optional
edge-linen-torn.png              D1   optional
surface-forest-cotton.png        D2   optional
```

Names are exact and case-sensitive. They are read from the `MEDIA` object
at the top of `src/App.tsx`. Changing a name means changing that object.
