# tanmay-site · Image Generation Brief

Last updated: 2026-08-16
Scope: design implementation support. **Not brand authority.**
Authority: `Context/Brand/Canonical/` in the Tanmay-Cowork workspace.
Asset contracts: `VISUAL-ASSET-PLAN.md` in this repository.

Two generated assets. Both are surface or edge. Neither depicts a subject.
Neither contains lettering. Everything else the site needs is either a real
photograph or CSS.

---

## Rules that apply to every prompt here

1. No text, letters, numbers, watermarks or signatures inside any generated image.
2. No gradients, no glow, no metallic simulation, no three-dimensional rendering, no photorealism.
3. No representational content. These are materials, not pictures.
4. Nothing generated may be presented as documentary evidence of practice.
5. Every result is reviewed against the intensity numbers in `VISUAL-ASSET-PLAN.md` before it ships.
6. Do not over-specify. Two documented failures from the Quiet Print experiment apply here: over-constrained prompts produced measurably deader output, and individually attractive assets never proved a direction. Anchor on one reference and keep one continuous conversation per asset rather than adding more rules to the prompt.

---

## Prompt 01 · `edge-linen-torn.png`

**Visual role.** An alpha mask. It is never seen as an image. Its only job
is to dissolve the bottom of one photograph into the Linen page ground so
the site has one organic transition instead of a hard rectangle or a wavy
SVG divider.

**Paste this into ChatGPT image generation:**

```
A pure greyscale alpha map, not a picture of anything.

The top 84 percent of the frame is solid, even, pure white with no texture,
no grain and no variation whatsoever.

The bottom 16 percent is a dissolve from that solid white to solid black.
The dissolve is not a straight line and not a wave. It is the profile of a
torn edge of heavy natural linen cloth: an irregular horizontal boundary
that wanders up and down by a small amount, with individual threads and
fibres pulling downward from it at uneven intervals and uneven lengths.
Some fibres are long and thin, most are short. The gaps between them are
irregular. Below the fibres the tone falls off quickly to solid black.

Two scales of variation only: a slow undulation of the boundary across the
width, and fine thread detail at the boundary itself. Nothing else.

Flat, even, printed quality. No lighting, no shadow, no depth, no
perspective, no paper, no photograph of cloth, no colour, no text.

Vertical format, tall, roughly 4 by 5.
```

**Aspect ratio.** 4 : 5 vertical, approximately 1200 × 1500.
**Transparency required.** No. Deliver greyscale. Convert white to opaque
and black to transparent when saving the PNG.
**Edge behaviour.** Left and right edges must reach the frame. Do not let
the fibre detail stop short of either side.
**Background behaviour.** Not applicable. There is no background.

**Post-processing before it ships.**
1. Check the top 84 percent is a flat 255. Any gradient there will fade the whole photograph and is a fail.
2. Convert to an alpha channel: luminance becomes alpha, image becomes white.
3. Save as PNG with alpha, under 90 kB.
4. Drop into `public/media/`, reload the site, look at the home page at 390 px and at 1440 px.

**Reject if.** The boundary reads as a wave. The tear looks like torn paper
rather than woven cloth. The dissolve is symmetrical or repeats. There is
any texture inside the opaque area. There is a soft grey haze instead of a
clean falloff.

---

## Prompt 02 · `surface-forest-cotton.png`

**Visual role.** A seamless tile that gives the site's two dark bands the
material named in the brand's own master surface system, so Forest Night
reads as cloth rather than as flat digital black. It must be felt before
it is noticed.

**Paste this into ChatGPT image generation:**

```
A seamless tileable square texture of plain-weave organic cotton, viewed
flat and straight on, filling the whole frame.

The colour is a single very dark warm near-black, hex 1C1C1A. The weave is
visible only as an extremely subtle variation in that same tone. The
lightest thread and the darkest gap differ by only a few levels of
brightness. There is no second colour anywhere.

Regular over-under plain weave, with slight natural irregularity in thread
spacing and thickness so it does not look like a digital grid.

Completely even lighting across the whole frame. No highlight, no shadow,
no vignette, no fold, no drape, no depth, no fibres standing up, no slubs,
no dust, no noise, no colour cast, no text.

Square format. The pattern must tile seamlessly with no visible seam at any
edge.
```

**Aspect ratio.** 1 : 1 square, delivered large and downscaled to 520 × 520.
**Transparency required.** No.
**Edge behaviour.** Must tile seamlessly on all four edges. Verify by
placing four copies in a two-by-two grid and looking for a seam.
**Background behaviour.** The texture is the background.

**Post-processing before it ships.**
1. Downscale to 520 × 520.
2. Measure. No pixel may differ from `#1C1C1A` by more than 6 levels in any channel. If it does, reduce contrast until it does not. This is the measurable review gate, not a matter of taste.
3. Confirm the mean colour is `#1C1C1A` within 1 level per channel, so the band does not shift hue.
4. Save as PNG, under 60 kB.
5. Drop into `public/media/`, reload, and look at the practice page dark band at 1× and at 2×. If you can see a pattern from normal reading distance, it is too strong.

**Reject if.** It reads as fabric photography. It has any warm or cool cast.
It shows a fold, a highlight or a shadow. It tiles with a visible seam. It
adds perceptible noise to the type sitting on it.

---

## Editing prompts for real photographs

These are **edit** prompts for Tanmay's own images. They are never used to
generate a person. The person in every photograph on this site is the real
Tanmay in a real place. Anything else would be fabricated documentary
evidence, which the brand forbids outright.

### Allowed operations

Exposure. Contrast. White balance. Necessary colour correction. Crop.
Straighten. Sensor dust removal. Compression for the web.

### Forbidden operations

Reshaping the body. Smoothing skin. Enhancing muscle definition. Slimming
or enlarging anything. Replacing the sky. Adding light, flare, haze, mist
or god rays. Removing sweat, dirt, scars or strain. Any warm wellness
filter. Any cinematic teal-and-orange grade. Generating or replacing the
person, the place or the weather.

### Prompt template for a still from footage

```
Edit this photograph of me. Keep it recognisably the same person, the same
body, the same place and the same weather. Do not change my face, my
proportions or anything in the scene.

Only do this:
- Lift the exposure slightly if the frame is underexposed from the video.
- Recover shadow detail without flattening the image.
- Correct the white balance to neutral. Do not warm it.
- Reduce video compression artefacts and mild motion softness.
- Keep the grain, the weather and the imperfection.

Do not smooth skin. Do not enhance muscle definition. Do not change my body
shape. Do not replace or brighten the sky. Do not add glow, flare, mist or
any filter. Do not remove sweat, dirt or marks. Do not make it look like a
fitness or wellness photograph.

Return it at the original framing and aspect ratio.
```

### Per-image notes

**B1 · handstand on the trunk.** Video stills of movement are usually one
to two stops under and slightly soft. Lift and sharpen only. Wet wood must
stay wet. Cold hands must stay red.

**B2 · sitting under the pine at sunset.** The one image most likely to be
pushed into a wellness photograph. Add nothing to the sun. If the frame is
already saturated from the camera profile, pull saturation **down** towards
neutral. A quieter sunset is the correct result.

**B3 · walking in the forest.** Do not raise green saturation. Flat winter
or early-spring light is preferred over an attractive autumn frame.

**A1 · portrait.** Skin retouching is not permitted beyond removing a
transient blemish. Do not even out skin tone. Do not brighten the eyes. Do
not sharpen the iris. If the portrait needs work to be usable, take another
photograph instead of editing this one further.

---

## Review gate before anything ships

1. Does the asset do a job named in `VISUAL-ASSET-PLAN.md`?
2. Would CSS, typography or whitespace have done that job?
3. Does it pass its measured intensity threshold?
4. Does the site still read correctly with the file deleted?

If any answer is no, the asset does not ship.
