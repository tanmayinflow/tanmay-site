# IMAGE GENERATION BRIEF

Last reviewed: 2026-08-23.

Two things live here:

1. The **photographic edit direction** for the three real masters, so
   that anyone re-editing them stays inside what the brand permits.
2. The **paste-ready generation prompts** for the two material assets.
   The shipped files are not prompted, they are synthesised numerically
   by `scripts/build-media.py`. These prompts are the specification the
   script implements, and the fallback if the assets ever have to be
   produced somewhere else.

Nothing here asks any model to generate a person, a client, a practice
scene, a landscape or a place. Real photography outranks generated
imagery, always.

---

# Part 1 · Photographic edit direction

The masters are phone stills. They do not need rescuing, they need
leaving alone. `scripts/build-media.py` applies the whole treatment; if
someone re-edits a master by hand instead, these are the limits.

## Universal limits

**Allowed**

Exposure correction. White balance. Conservative noise reduction.
Conservative local contrast. Global saturation change. Crop. Natural
texture recovery. Conservative upscaling, only if a master is replaced
by a larger one.

**Not allowed**

A new face. Beauty retouch. Skin smoothing. Teeth whitening. Eye
recolouring. A fitness-model body. Changed hair. Changed clothes. A fake
studio. A fake landscape. Cinematic fog. Dramatic rim light. Artificial
bokeh. Added sunlight. Added mist. An aura or halo. Any symbol. Split
toning, teal and orange, or any cinematic grade. Redrawing a body,
adding missing anatomy, or altering the position of a limb.

## portrait-tanmay

Keep identity, skin texture, hair, ordinary clothing and the available
light exactly as they are. The rock face behind is the real place; do
not replace it and do not blur it into a studio backdrop.

The frame is already 4:5 with the face in the upper third. Do not
recompose it. Background distraction cleanup is allowed only where it
removes a literal distraction and does not invent a new place.

Current treatment: saturation 0.97, contrast 1.02.

If a replacement master is ever shot: 4:5, at least 1600 × 2000, face in
the upper third, bottom 14 % free of anything that matters because the
dissolve mask eats it, natural or available light, ordinary clothes.

**ChatGPT image-edit prompt, if the master ever needs a repair pass**

> Correct exposure and white balance on this photograph only. Keep the
> person's face, skin texture, pores, hair and clothing exactly as they
> are. Do not smooth skin, do not slim or reshape anything, do not
> whiten teeth, do not change eye colour, do not add makeup. Keep the
> real rock face behind him sharp and unaltered; do not add depth of
> field, fog, rim light, sun flare or any colour grade. Do not crop. The
> result must be recognisably the same photograph, only correctly
> exposed.

## practice-handstand-trunk

Keep the real trunk, the moss, the imperfect balance, the actual weather
and the ordinary clothes. Do not redraw the body, do not change the
handstand, do not add missing anatomy, do not replace the trunk, do not
add sunlight, do not make the forest epic, do not over-sharpen foliage.

Current treatment: crop y 88 to 3112 for a 5:7 frame, saturation 0.72,
white balance +3 % warm, contrast 1.03. The saturation move exists
because the public field must not read primarily green; it is one global
value, not a grade.

**ChatGPT image-edit prompt, if the master ever needs a repair pass**

> Reduce noise conservatively and recover natural texture in this
> photograph. Do not change the person's body, position, limbs or
> clothing in any way. Do not alter the fallen trunk or the forest
> behind. Do not add sunbeams, god rays, lens flare, mist or bokeh. Do
> not apply a cinematic colour grade. Keep the spring foliage as it is;
> global saturation may come down slightly but hue must not shift. The
> result must be the same moment, only cleaner.

## practice-sitting-pine

Keep the back-facing figure, the scale of the pine, the bench, the real
ground and the actual low sun including its natural flare. Do not add an
aura, a halo, extra mist, a meditation symbol or a perfect lotus. Do not
build a new landscape and do not intensify the sunset.

Current treatment: crop y 190 to 1090 for a 4:5 frame, saturation 0.88,
contrast 1.02.

The master is a 720 px wide video still. It is displayed at most 470 px
so that it stays above 1×. It is never upscaled. If a photographic
master of the same scene appears, drop it in as
`practice-sitting-pine-master.png` and re-run `npm run media`; the
widths in `scripts/build-media.py` and `src/App.tsx` can then go up.

**ChatGPT image-edit prompt, if the master ever needs a repair pass**

> Reduce digital compression artefacts and recover shadow detail in this
> photograph. Lower saturation slightly and hold the highlights around
> the sun. Do not add mist, glow, halo, god rays or lens flare beyond
> what is already in the frame. Do not change the seated person, the
> bench, the tree or the field. Do not add any symbol. Do not intensify
> the sunset. The result must be the same quiet evening, only cleaner.

---

# Part 2 · Material assets

## Rules for anything generated

A generated asset on this site may not depict people, clients, exercise
scenes, nature, landscapes, spiritual imagery, mandalas, symbols, words
or logos. It is material, or it is not made.

For each one the plan records: the job, why CSS cannot do it, where it
is used, dimensions, format, size target, mobile behaviour, fallback,
the prompt, and the negative constraints. That record is in
`VISUAL-ASSET-PLAN.md`.

## A · `edge-linen-torn.png`

**Job.** The single organic transition on the whole site: the bottom of
the portrait dissolving into the linen field.

**Why not CSS.** A `linear-gradient` mask reads as a fade. A torn
textile edge needs per-pixel fibre at the boundary.

**Where.** Under the portrait on Home, once. Never as a repeated
divider. 2400 × 1200 PNG with alpha, about 35 kB, stretched to the
element with `mask-size: 100% 100%`. On mobile the same mask covers the
portrait band. Fallback: `html[data-edge="off"]`, the portrait is a
plain rectangle.

**Prompt**

> Generate a production alpha mask only, no visible artwork. A
> 2400 × 1200 transparent PNG whose top 84 % is fully opaque pure white
> with no gradient and no texture. In the bottom 16 %, create one
> restrained irregular torn-linen fibre edge, predominantly horizontal,
> with small natural fibre variation and no large waves, scallops,
> drips, mountains, leaves or repeated pattern. Below the edge is fully
> transparent. The transition is crisp enough for CSS masking but
> carries microscopic textile fibres at the boundary. No colour, no
> shadows, no lettering, no objects, no grey haze across the opaque
> field.

**Negative constraints.** No scallops. No drips or comb teeth. No wave.
No repeat. No colour. No shadow. No lettering. No grey haze in the
opaque field. No soft gradient more than about three pixels deep.

**Numeric validation, which the script performs and asserts**

* minimum alpha across the top 84 % must be 255;
* maximum alpha in the last row must be 0;
* the edge line must move by no more than about 14 px across the full
  2400 px, and fibre tips by no more than about 7 px.

**Note on the first attempt.** The first version put fibre tips 30 % of
the band deep. On the page it read as drips, which the prompt forbids.
Depth was cut to a few pixels and the line irregularity to three low
amplitude sinusoids. Judge this asset on the rendered page, never on the
mask.

## B · `surface-ink-cotton.webp`

**Job.** Keeps the dark bands from reading as flat digital black.

**Why not CSS.** A gradient is a gradient. This needs material grain
with no direction and no findable repeat.

**Where.** The single dark band on Home, Praxe, Příběh and Spolupráce.
1024 × 1024 seamless WebP, about 11 kB, drawn at 512 px. Not fetched on
routes without a dark band. Fallback: `html[data-surface="off"]`, the
band is flat Forest Night.

**Prompt**

> Generate a seamless 1024 × 1024 WebP texture tile for a near-black
> editorial website surface. Base colour #1C1C1A. Extremely subtle
> organic cotton pressure and fibre density, perceived before it is
> consciously seen. Pixel variation restrained to approximately ±6 RGB
> levels from the base. No visible weave grid, folds, wrinkles, stains,
> speckles, noise overlay, paper grain, leaves, bark, symbols, light
> beams, gradient, vignette, metallic effect or lettering. Seamless on
> all four edges. Flat diffuse material, no directional light.

**Negative constraints.** No weave grid. No plaid. No diagonal. No
visible tile boundary. No vignette. No gradient. No motif of any kind.

**Numeric validation, which the script performs and asserts**

* peak deviation from the base colour must be ≤ 6 RGB levels; the
  shipped tile is ±3;
* the wrap-around difference between the first and last column, and
  between the first and last row, must be no larger than the difference
  between two adjacent columns one pixel inside the tile.

**Note on the first attempt.** The first version summed low frequency
sinusoids. Mathematically seamless, but once tiled across a wide band it
read as a plaid, which the prompt forbids. It was replaced by smoothed
wrapped white noise with no low frequency component. Judge this asset on
a wide dark band at 1:1, not on the tile.

## C · `surface-stone-shadow.webp`

Not generated, deliberately. The brief allows it only if the finished
render proves a specific section needs one more quiet material
transition. After the photography went in, no section did.

Do not generate it by default. If it is ever needed: very low contrast,
non-representational, no identifiable rock, no leaves, no horizon, no
symbolism, and it goes through the same numeric validation.

---

# Part 3 · Social preview cards

`scripts/build-og.py`, run with `npm run og`. It draws 18 cards from the
route table and the journal entries, in the real Brand V2 typefaces.

Nothing on a card is generated imagery. The headline on a card is the
visible H1 of the route, so a card can never promise something the page
does not say. Linen ground, ink type, one copper bindu, one hairline
rule, the domain. No gradients.

The two home cards carry the real portrait. If the portrait were ever
unavailable, the card falls back to typography only. A generated
portrait is never acceptable, on a card or anywhere else.
