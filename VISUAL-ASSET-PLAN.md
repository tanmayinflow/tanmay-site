# VISUAL ASSET PLAN

Last reviewed: 2026-08-23. Supersedes the pre-photography version of
2026-08-16, which described assets that did not exist yet.

Three real photographs and two generated material assets are in the
site. That is the whole visual inventory and it is deliberately small.

> Reality, not rawness, is the rule. The brand lives primarily through
> images of real practice. Craft is welcome. Fabrication is not.
> — Brand Book V2, p. 16

---

## Where the masters are

Not in this repository. They live in the workspace at:

```
Tanmay-Cowork/Work/website/Assets/Masters/
    portrait-tanmay-master.png            3024 × 3780
    practice-handstand-trunk-master.png   2160 × 3840
    practice-sitting-pine-master.png       720 × 1280
```

`public/media/` holds only derivatives, which are committed because
Cloudflare serves them straight from the repository.

Rebuild every derivative:

```
pip install pillow pillow-avif-plugin
npm run media -- --masters ../Assets/Masters
```

The script is deterministic. Same masters in, same bytes out.

---

## The pipeline

`scripts/build-media.py` is the only thing that writes into
`public/media/`. For each photograph it crops to the declared ratio,
applies the permitted treatment, and writes AVIF and WebP at the
declared widths plus one JPEG fallback. It refuses to build a derivative
wider than its master, strips metadata, and writes `manifest.json`,
which `tests/media.test.mjs` checks against the files and against the
widths declared in `src/App.tsx`.

Permitted treatment, and nothing else: exposure, white balance,
saturation, conservative local contrast, a crop. No retouching, no
smoothing, no invented light, no generated content.

Delivery is `<picture>` with AVIF, WebP and a JPEG fallback, `srcset`,
a `sizes` hint that accounts for the page gutter, intrinsic `width` and
`height`, and a matching CSS `aspect-ratio` so nothing shifts. The hero
is eager and high priority; everything else is lazy.

Missing media collapses. Each figure removes itself on `onError`, so an
absent file leaves no frame and no broken icon, and nothing is fetched
twice to find out whether it exists.

---

## 01 · portrait-tanmay

| | |
|---|---|
| Master | 3024 × 3780, already 4:5, nothing cropped away |
| Ratio | 4 : 5 |
| Widths | 480, 720, 960, 1280 · JPEG fallback 960 |
| Treatment | saturation 0.97, contrast 1.02, no colour shift |
| Where | Home opening, right column on desktop, band above the type on mobile |
| Loading | eager, `fetchpriority="high"` |
| Sizes | `(min-width:880px) 430px, 100vw` |
| Mask | the torn linen edge, bottom of the frame |

Desktop is a calm 4:5 column on the right of a linen field, type on the
left, no text over the face, no full-bleed cinematic hero. Mobile puts
the portrait first as a band of `clamp(250px, 42svh, 420px)`, face in
the upper third, `object-position: 50% 20%`.

The bottom 14 % of the frame is chest and clothing, which is what the
dissolve mask eats. Nothing important is down there.

What the frame actually contains: available late light, a rock face
behind, ordinary clothes, real skin texture, real hair. All of it kept.

## 02 · practice-handstand-trunk

| | |
|---|---|
| Master | 2160 × 3840, a 9:16 phone still |
| Crop | y 88 to 3112, giving 2160 × 3024 |
| Ratio | 5 : 7 |
| Widths | 480, 720, 1080 · JPEG fallback 720 |
| Treatment | saturation 0.72, white balance +3 % warm, contrast 1.03 |
| Where | Home, the real practice proof section |
| Loading | lazy |
| Sizes | `(min-width:760px) 560px, calc(100vw - 44px)` |
| Rendered | `max-width: 560px`, left aligned, no mask, no rounding |

**Documented deviation.** The brief asked for a 16:9 master with a 4:3
mobile crop. The master is a vertical phone still of a body standing on
its hands: the figure spans from y ≈ 150 to y ≈ 2680. Any landscape crop
cuts it in half. The contract is therefore 5:7, which holds the feet
near the top edge, both palms on the trunk near the bottom, and the
figure inside the middle 70 % horizontally.

**Why the saturation comes down to 0.72.** It is a beech forest in
spring and the master is overwhelmingly green. Brand V2 says the public
field must not read primarily green. This is a single global saturation
move, not a colour grade: no split toning, no teal and orange, no
added sun.

Kept: the real trunk, the moss, the imperfect balance, the actual
weather, the ordinary clothes.

## 03 · practice-sitting-pine

| | |
|---|---|
| Master | 720 × 1280, a video still, low resolution |
| Crop | y 190 to 1090, giving 720 × 900 |
| Ratio | 4 : 5 |
| Widths | 360, 480, 720 · JPEG fallback 480 |
| Treatment | saturation 0.88, contrast 1.02 |
| Where | Deník, after the index |
| Loading | lazy |
| Sizes | `(min-width:600px) 470px, calc(100vw - 44px)` |
| Rendered | `max-width: 470px`, pushed to the right of the column |

**Why it is capped at 470 px.** The master is only 720 px wide. Nothing
is upscaled, so the display width is chosen to keep the file above 1×
even on a dense screen rather than to fill the page.

Kept: the back-facing figure, the pine, the bench, the actual low sun
and its flare, the real ground in the foreground. No aura was added, no
mist, no symbol, and the sunset was not intensified.

## 04 · Not used, and why

| Asset | Status |
|---|---|
| `practice-walking-forest.jpg` | No master exists. Nothing renders. |
| `mat-unroll.mp4` and `mat-unroll-poster.jpg` | No real footage exists. The site ships no `<video>` element at all rather than an empty one. |
| A Client App screenshot | No current screenshot with synthetic data exists. Producing one safely would delay launch, and the brief says the text and the link are sufficient. |
| Movement Atlas plates | Never ambient decoration. Not used. |

Each of these has a place in the layout the moment a real file arrives.
None of them leaves a gap in the meantime.

---

## Generated material assets

Two, both material only, both synthesised numerically by
`scripts/build-media.py` rather than prompted from an image model. An
alpha mask and a near-black tile have to be right to the pixel, and a
numeric generator can be validated. The script asserts its own output
and fails the build if it drifts. The equivalent paste-ready prompts are
kept in `IMAGE-GENERATION-BRIEF.md`.

Neither depicts a person, a client, an exercise, a landscape, a symbol,
a mandala, a word or a logo.

### `edge-linen-torn.png`

| | |
|---|---|
| Job | The one organic transition on the whole site: the bottom of the portrait dissolving into the linen field |
| Why CSS is not enough | A gradient mask reads as a fade. A torn textile edge needs per-pixel fibre. |
| Type | Alpha mask, 2400 × 1200 PNG, 35 kB |
| Contract | Top 84 % fully opaque, no gradient, no texture. Edge in the lower band, moving about 14 px across the full width. Fibre tips a few pixels deep, on rather less than half the width. Below the edge fully transparent. |
| Validation | The script asserts the top 84 % has minimum alpha 255 and the last row has maximum alpha 0. |
| Used once | Under the portrait. It is never repeated as a divider. |
| Fallback | `html[data-edge="off"]` and the portrait is simply a rectangle. |
| Mobile | Same mask, stretched to the band. |

### `surface-ink-cotton.webp`

| | |
|---|---|
| Job | Keeps the dark bands from reading as flat digital black |
| Why CSS is not enough | A CSS gradient is a gradient; this needs material grain with no direction and no repeat that the eye can find. |
| Type | Seamless 1024 × 1024 WebP, 11 kB, drawn at 512 px |
| Contract | Base `#1C1C1A`. Deviation ±3 RGB levels. No weave grid, no folds, no vignette, no directional light. |
| Validation | The script asserts peak deviation ≤ 6 levels and that the wrap-around difference is no larger than the difference one pixel inside the tile. |
| Used | The one dark band on Home, Praxe, Příběh and Spolupráce. Not fetched on the routes that have no dark band. |
| Fallback | `html[data-surface="off"]` and the band is flat Forest Night. |

### `surface-stone-shadow.webp`

Not generated. The brief allows it only if the finished render proves a
section needs it. After the photography went in, no section did. A
generated asset that is not needed does not get made.

---

## Social preview cards

`public/og/`, 18 cards, one per route and one per journal entry, in both
editions. `scripts/build-og.py` draws them in the real Brand V2
typefaces: linen ground, ink type, one copper bindu, a hairline rule,
the visible H1 of the route, and the domain. No gradients.

The two home cards carry the real portrait in the right third. No other
card carries an image, and no card carries a generated portrait.

Rebuild: `npm run og`.

---

## What is forbidden, restated

Gradient blobs. Glow. Glassmorphism. Floating cards. Perfect symmetry.
Icon grids. Device mockups. 3D objects. Animated particles. Pseudo
organic SVG waves. Stock leaves. Boho textures. Mystical symbols.
Generated people. Fake clients. Hyper-polished fitness imagery.
Cinematic orange and teal. Dramatic sun rays. AI bokeh. Retouched skin.

And the structural ones, which are easier to break by accident: not
every section gets an image, not every image is the same aspect ratio,
not every image ends in the same rounded rectangle, and no two routes
are paced the same way.
