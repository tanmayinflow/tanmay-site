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
| strata | `strata-src.png` 1906×825 | `edge-strata.png` 1600×693, alpha PNG, 33 kB | The one geological transition between section fields | ≤220 kB | Home 2× (Linen→Ink, Ink→Sandstone), Praxe 1× (Ink→Sandstone), Spolupráce 1× (Linen→Earth) | Fixed-height band; without the mask it degrades to a straight boundary, with zero layout shift either way |
| aperture | `aperture-portrait-src.png` 1122×1402 | `mask-aperture.png` 1000×1258, alpha PNG, 35 kB | Photographs end in real material instead of a hard rectangle | ≤220 kB | Hero portrait (4:5), handstand evidence on Home and Praxe (5:7, gently stretched), pine on Deník | `data-ap` gate: mask class applies only after the file is probed, so a missing mask leaves a plain rectangular photograph in every engine |
| earth-field | `earth-src.png` 1070×1470 | `field-earth.webp` 622×1000, alpha WebP, 68 kB | The mineral slab behind the cutout figure | ≤90 kB | Home, Pro koho chapter, once | `onError` hides the slab, the cutout stands on the ink field alone |
| copper-line | `copper-src.png` 1983×793 | `line-copper.png` 1800×273, palette PNG, 29 kB | One thin terrain current across the Ink chapter | ≤100 kB | Home, Pro koho chapter, behind the figure at 20 % opacity, desktop only, never behind body text | `onError` is inert; the element simply does not paint |
| sandstone | `sandstone-src.png` 1254×1254 | `surface-sandstone.webp` 768×768 seamless tile, 12 kB | Materiality of the Sandstone Paper chapters | ≤160 kB | Home work chapter, Praxe session chapter, client strip | `data-sand` gate: plain `--sandstone` colour |
| cutout | `cutout-src.png` 1024×1536, true alpha | `handstand-cutout-bw.webp` 522×1400, 94 kB | The one human cutout, bridging Linen → Ink across the strata edge | ≤260 kB | Home, Pro koho chapter, exactly once on the whole site | `onError` removes figure, slab and terrain line together |

The ink cotton tile from the launch wave (`public/media/surface-ink-cotton.webp`, 11 kB)
remains the Ink Cotton materiality. Total shipped material: **272 kB**
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

The cutout appears once, on Home, and never in cards, footer or menu.
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
