# MATERIAL ASSET MANIFEST

Last reviewed: 2026-08-23, Material Landscape wave.

One table of truth for every generated or cutout asset on the public
site: what was supplied, what shipped, what was rejected and why.
`scripts/build-material.py` builds exactly the accepted set and
validates each file numerically. `tests/media.test.mjs` fails the build
if the material directory ever diverges from this manifest.

Sources live in the workspace at `Work/website/Assets/Generated/`, not
in this repository. Production derivatives live in
`public/media/material/`.

---

## Accepted

| id | Source | Production | Job | Size | Where | Fallback |
|---|---|---|---|---|---|---|
| strata | `strata-src.png` 1906×825 | `edge-strata.png` + deterministic vertical mirror `edge-strata-top.png`, both 1600×693 alpha PNG, ~33 kB each | One geological transition between section fields; the mirrored derivative also clips the Copper current to the true upper Ink silhouette | ≤220 kB each | Home transitions and the Home hero→Ink Copper window; inner routes reuse the same edge language | Fixed-height bands; without either mask the surfaces degrade to straight boundaries with zero layout shift |
| aperture | `aperture-portrait-src.png` 1122×1402 | `mask-aperture.png` 1000×1258, alpha PNG, 35 kB | Photographs end in real material instead of a hard rectangle | ≤220 kB | Hero portrait (4:5), handstand evidence on Home and Praxe (5:7, gently stretched), pine on Deník | `data-ap` gate: mask class applies only after the file is probed, so a missing mask leaves a plain rectangular photograph in every engine |
| earth-field | `earth-src.png` 1070×1470 | `field-earth.webp` 622×1000, alpha WebP, 68 kB | The mineral slab behind the cutout figure | ≤90 kB | Home, Pro koho chapter, once | `onError` hides the slab, the cutout stands on the ink field alone |
| copper-line | `copper-src.png` 1983×793 | `line-copper-current.png` 1983×793 alpha PNG, 172 kB; compact legacy derivative `line-copper.png` retained | One large terrain current rising counter-clockwise through the upper Ink chapter | ≤220 kB current, ≤100 kB compact | Home, Pro koho chapter, all breakpoints; clipped to the geological Ink edge, above copy and with protected space before the handstand | Missing asset simply removes the current; layout and section boundary remain intact |
| sandstone | `sandstone-src.png` 1254×1254 | `surface-sandstone.webp` 768×768 seamless tile, 12 kB | Materiality of the Sandstone Paper chapters | ≤160 kB | Home work chapter, Praxe session chapter, client strip | `data-sand` gate: plain `--sandstone` colour |
| cutout | `cutout-src.png` 1024×1536, true alpha | `handstand-cutout-bw.webp` 522×1400, 94 kB | The one human cutout, bridging Linen → Ink across the strata edge | ≤260 kB | Home, Pro koho chapter, exactly once on the whole site | `onError` removes figure, slab and terrain line together |
| hero-portrait | `hero shot bez pozadí.png` 1153×1364, true alpha | `portrait-cutout.webp` 1153×1364, alpha WebP, ~310 kB | The real close hero portrait, enlarged and bled to the right and lower hero edges | ≤380 kB | Home hero, once | `onError` removes the whole portrait composition while copy remains complete |
| hero-monolith | `hero-ink-monolith-mask-source.png` 1135×1386 | `hero-ink-monolith-mask.png` 1135×1386, alpha PNG, 34 kB | The primary oblique Ink mineral field behind the real hero portrait | ≤80 kB | Home hero, once | Missing mask removes only the monolith; portrait and page copy remain |
| hero-shoulder | `hero-mineral-shoulder-mask-source.png` 1122×1402 | `hero-mineral-shoulder-mask.png` 1122×1402, alpha PNG, 23 kB | One low secondary Ink fragment behind the outside shoulder | ≤60 kB | Home hero, once | Missing mask removes the depth fragment only |
| hero-foreground | `hero-sandstone-foreground-mask-source.png` 1774×887 | `hero-sandstone-foreground-mask.png` 1774×887, alpha PNG, 17 kB | Returns the exact Sandstone surface in front of the lowest portrait edge | ≤60 kB | Home hero, once | Missing mask leaves the transparent portrait edge visible |
| salto-cutout | `salto bez pozadí(1).png` 1536×1024 | `salto-cutout.webp` 1385×862, alpha WebP, ~186 kB | A real airborne movement cutout replacing the rectangular forest handstand on Home, rendered monochrome in CSS and without a caption | ≤260 kB | Home, What happens in the work, once | `onError` removes the figure and leaves the editorial text column complete |

The ink cotton tile from the launch wave (`public/media/surface-ink-cotton.webp`, 11 kB)
remains the Ink Cotton materiality. Total shipped material is now approximately **1.0 MB**
in `material/` plus that tile.

Validation each build run performs: strata top field min alpha 255 and
bottom row max 0; aperture face-safe zone (upper 60 %) fully open and
≥74 % of the image kept; earth transparency preserved and colour nudged
half-way to `#754437`; copper recoloured to exact `#B87333`; sandstone
re-based to `#E5D8C4`, deviation softened, wrap-around seam ≤ inner
difference +2; cutout alpha ≤2 % semi-transparent and 95th-percentile
saturation ≤14 (monochrome); every file under its budget; no metadata
chunks.

## Rejected

| Source | What it was | Why it does not ship |
|---|---|---|
| `aperture-landscape-src.png` 1568×1003 | Landscape 25:16 photo aperture | No landscape photograph exists in the media inventory. The handstand is a 5:7 vertical (its master forbids a landscape crop) and the pine is 4:5. One aperture mask serves all three photographs; a second mask would be a second ornate frame, which the blueprint forbids. Revisit if a real landscape master arrives. |
| `ink-src.png` 1254×1254 | Ink mineral cotton tile | The site already ships a numerically validated seamless ink tile at ±3 RGB levels around exact `#1C1C1A`. The supplied candidate has a lighter base (≈#222), higher deviation (±9) and weaker seams. The selection rule asks whether the current asset is already enough: it is. |

## Rules the manifest encodes

The handstand cutout appears once in the audience chapter. The real portrait and the real salto are separate evidence assets, each used once on Home and never in cards, footer or menu.
The strata edge appears at most twice on Home and once or twice on an
inner route, never between every section. Burnt Earth carries broad
fields; Copper stays a bindu, a hairline, a focus ring and one terrain
line at 12–28 % opacity, and never becomes a background or body text.
Deník gets no cutout, no Burnt Earth and no Sandstone: reading wins.
Every asset is optional at runtime and the site is complete without any
of them — `tests/browser.test.mjs` renders the site with the whole media
folder blocked and asserts no empty frame survives.

## Rebuilding

```
pip install pillow numpy
python3 scripts/build-material.py --sources ../../Assets/Generated
```

Deterministic: same sources in, same bytes out. A source that fails its
numeric check fails the build of that asset instead of shipping it.

### `hero-ink-monolith-mobile-mask.png`
Deterministic mobile-only derivative of the approved hero monolith mask. It resamples the actual macro-rich central portion of the original eroded left edge at full scale, preserving its broad arcs, mineral ledges and deep recesses, then remaps that edge to one diagonal boundary. Opacity continues to the lower, right and bottom sides, so the original slab's top, bottom and right edges cannot appear at 390 px. It is not a newly generated visual asset.
