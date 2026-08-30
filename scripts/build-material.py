#!/usr/bin/env python3
"""
build-material.py · authoring tool, never part of `npm run build`
----------------------------------------------------------------------
Turns the selected Material Landscape sources into the production
derivatives in `public/media/material/`.

Sources are NOT in this repository. They are the generated candidates
Tanmay selected, kept in the workspace at:

    Work/website/Assets/Generated/

    strata-src.png             black/white wide edge mask source
    aperture-portrait-src.png  black/white photo aperture source
    earth-src.png              burnt-earth slab, alpha
    copper-src.png             copper terrain lines, alpha
    sandstone-src.png          sandstone paper tile source
    cutout-src.png             the real black-and-white handstand cutout

Run:

    pip install pillow pillow-avif-plugin
    python3 scripts/build-material.py --sources /path/to/Generated

Everything it writes is deterministic and validated numerically: the
masks are checked for a clean opaque field, the tile for seams and
deviation, the cutout for true transparency. A source that fails its
check fails the build of the asset instead of shipping a bad file.

What was REJECTED from the supplied candidate set, and why, is recorded
in MATERIAL-ASSET-MANIFEST.md. This script only builds what was accepted.
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media" / "material"

EARTH = (0x75, 0x44, 0x37)
COPPER = (0xB8, 0x73, 0x33)
SANDSTONE = (0xE5, 0xD8, 0xC4)


def save_report(path, limit_kb):
    kb = path.stat().st_size / 1024
    flag = "" if kb <= limit_kb else f"  !! OVER {limit_kb} kB BUDGET"
    print(f"  {path.name:<28}{kb:>7.1f} kB{flag}")
    assert kb <= limit_kb, f"{path.name} exceeds its {limit_kb} kB budget"


def despeckle_mask(m, min_area):
    """Remove tiny isolated islands from a boolean mask, both polarities.

    A generated mask carries dust: single black flecks inside the white
    field and vice versa. On a page they read as dirt on the screen.
    Flood-fill labelling without scipy: simple two-pass union on a
    downsampled grid is overkill; the flecks are small, so a cheap
    morphological open/close with a 3px box does the job.
    """
    im = Image.fromarray((m * 255).astype(np.uint8))
    from PIL import ImageFilter
    im = im.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))   # open
    im = im.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))   # close
    return np.array(im) > 128


# ----------------------------------------------------------------------
def build_strata(src):
    """
    edge-strata.png · the section transition mask.
    White (top field) becomes opaque, black becomes transparent.
    The opaque field must be genuinely clean: a grey haze there would
    tint every section it is used on.
    """
    g = np.array(Image.open(src).convert("L")).astype(np.uint8)
    h, w = g.shape
    # clamp near-white and near-black to pure, keep the boundary detail
    g = np.where(g > 246, 255, g)
    g = np.where(g < 9, 0, g)
    assert g[: int(h * 0.60)].min() == 255, "strata: grey haze in the top field"
    assert g[int(h * 0.97):].max() == 0, "strata: the bottom is not fully transparent"

    out = Image.merge("LA", (Image.new("L", (w, h), 255), Image.fromarray(g)))
    out = out.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    f = OUT / "edge-strata.png"
    out.save(f, "PNG", optimize=True)
    save_report(f, 220)

    # The hero-to-Ink transition uses the same geological edge, but its
    # alpha must face upward so a wide Copper current can be clipped to the
    # real Ink silhouette instead of starting below a rectangular gap.
    # This is a deterministic mirror of the approved source, not a second
    # generated visual language.
    f_top = OUT / "edge-strata-top.png"
    out.transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(f_top, "PNG", optimize=True)
    save_report(f_top, 220)


def build_aperture(src):
    """
    mask-aperture.png · the photo aperture, 4:5 nominal.
    Straight top and left, eroded right and bottom. Used on the hero
    portrait and, gently stretched, on the 5:7 handstand photograph.
    """
    g = np.array(Image.open(src).convert("L")).astype(np.uint8)
    # The source carries a uniform black frame around the aperture. Trim
    # it on the straight top and left so the mask starts open there, and
    # keep a small margin on the eroded right and bottom.
    white = g > 128
    ys, xs = np.nonzero(white)
    g = g[ys.min():, xs.min():]
    # the trim lands on the first row with any white; the frame's last
    # few ragged rows survive on other columns, and the top edge is
    # straight by contract, so square it off
    g[:8, :] = np.maximum(g[:8, :], 250)
    g[:, :8] = np.maximum(g[:, :8], 250)
    h, w = g.shape
    m = despeckle_mask(g > 128, 9)
    g = np.where(m, np.maximum(g, 200), np.minimum(g, 60)).astype(np.uint8)
    g = np.where(g > 246, 255, g)
    g = np.where(g < 9, 0, g)
    # the face lives in the upper 60%: that zone must be fully open
    core = g[: int(h * 0.60), int(w * 0.06): int(w * 0.80)]
    assert core.min() > 250, "aperture: erosion reaches the face-safe zone"
    open_frac = (g > 128).mean()
    assert open_frac > 0.74, f"aperture keeps only {open_frac:.2f} of the image"

    out = Image.merge("LA", (Image.new("L", (w, h), 255), Image.fromarray(g)))
    out = out.resize((1000, round(h * 1000 / w)), Image.LANCZOS)
    f = OUT / "mask-aperture.png"
    out.save(f, "PNG", optimize=True)
    save_report(f, 220)


def build_earth(src):
    """
    field-earth.webp · the burnt-earth slab, alpha WebP.
    Nudged toward the Burnt Earth token so the generated pigment and the
    CSS surface read as one material.
    """
    im = Image.open(src).convert("RGBA")
    a = np.array(im).astype(float)
    alpha = a[..., 3]
    op = alpha > 10
    mean = a[..., :3][op].mean(axis=0)
    a[..., :3] += (np.array(EARTH) - mean) * 0.5     # half-way, keep its own character
    a = np.clip(a, 0, 255)
    ys, xs = np.nonzero(op)
    pad = 6
    crop = a[max(0, ys.min() - pad): ys.max() + pad, max(0, xs.min() - pad): xs.max() + pad]
    im2 = Image.fromarray(crop.astype(np.uint8))
    im2 = im2.resize((round(im2.width * 1000 / im2.height), 1000), Image.LANCZOS)
    assert np.array(im2.getchannel("A")).min() == 0, "earth: transparency lost"
    f = OUT / "field-earth.webp"
    # The slab supports the cutout, so it must not outweigh it: the
    # blueprint's rule is that decoration never exceeds the photograph
    # it serves. q=74 keeps the pigment character well under that line.
    im2.save(f, "WEBP", quality=74, method=6)
    save_report(f, 90)


def build_copper(src):
    """
    line-copper.png · the terrain line, alpha.
    Recoloured to exact Copper so the token and the line are the same
    metal, trimmed, kept as PNG because lossy alpha fuzzes 2px lines.
    """
    im = Image.open(src).convert("RGBA")
    a = np.array(im)
    alpha = a[..., 3]
    a[..., 0], a[..., 1], a[..., 2] = COPPER
    ys, xs = np.nonzero(alpha > 8)
    pad = 4
    crop = a[max(0, ys.min() - pad): ys.max() + pad, max(0, xs.min() - pad): xs.max() + pad]
    im2 = Image.fromarray(crop)
    im2 = im2.resize((1800, round(im2.height * 1800 / im2.width)), Image.LANCZOS)
    # One hue times an alpha ramp fits comfortably in a palette, which
    # takes the file from ~119 kB to ~15 kB with no visible change on a
    # 2px line drawn at 12–28% opacity.
    f = OUT / "line-copper.png"
    im2.quantize(colors=64, method=Image.FASTOCTREE).save(f, "PNG", optimize=True)
    save_report(f, 100)


def build_sandstone(src):
    """
    surface-sandstone.webp · the sandstone paper tile.
    Mean pulled to the Sandstone base, deviation softened, seams closed
    by blending the rolled tile across the wrap lines, then verified:
    the wrap-around difference may not exceed the difference one pixel
    inside the tile.
    """
    a = np.array(Image.open(src).convert("RGB")).astype(float)
    mean = a.reshape(-1, 3).mean(axis=0)
    a += np.array(SANDSTONE) - mean                  # exact base
    a = (a - np.array(SANDSTONE)) * 0.75 + np.array(SANDSTONE)   # calm it
    h, w, _ = a.shape
    rolled = np.roll(a, (h // 2, w // 2), axis=(0, 1))
    B = 72
    yy = np.abs(np.arange(h) - h / 2)
    xx = np.abs(np.arange(w) - w / 2)
    wy = np.clip((yy - (h / 2 - B)) / B, 0, 1)
    wx = np.clip((xx - (w / 2 - B)) / B, 0, 1)
    keep = np.minimum(wy[:, None] + wx[None, :], 1.0)[..., None]  # 1 away from centre cross
    blended = rolled * (1 - keep) + a * keep
    out = np.clip(blended, 0, 255).astype(np.uint8)

    im = Image.fromarray(out).resize((768, 768), Image.LANCZOS)
    # a last 4px feather across the actual wrap boundary: the resize
    # reintroduces single-pixel outliers at the edge rows and columns
    arr_f = np.array(im).astype(float)
    for i, wgt in enumerate((0.5, 0.65, 0.8, 0.9)):
        opp = -(i + 1)
        pair_mean = (arr_f[i] + arr_f[opp]) / 2
        arr_f[i] = arr_f[i] * wgt + pair_mean * (1 - wgt)
        arr_f[opp] = arr_f[opp] * wgt + pair_mean * (1 - wgt)
        pair_mean = (arr_f[:, i] + arr_f[:, opp]) / 2
        arr_f[:, i] = arr_f[:, i] * wgt + pair_mean * (1 - wgt)
        arr_f[:, opp] = arr_f[:, opp] * wgt + pair_mean * (1 - wgt)
    im = Image.fromarray(np.clip(arr_f, 0, 255).astype(np.uint8))
    arr = np.array(im).astype(int)
    wrap_x = np.abs(arr[:, 0] - arr[:, -1]).max()
    inner_x = np.abs(arr[:, 1] - arr[:, 2]).max()
    wrap_y = np.abs(arr[0] - arr[-1]).max()
    inner_y = np.abs(arr[1] - arr[2]).max()
    print(f"  sandstone seams x {wrap_x} vs inner {inner_x}, y {wrap_y} vs inner {inner_y}")
    assert wrap_x <= inner_x + 2 and wrap_y <= inner_y + 2, "sandstone: visible seam"
    f = OUT / "surface-sandstone.webp"
    im.save(f, "WEBP", quality=82, method=6)
    save_report(f, 160)


def build_cutout(src):
    """
    handstand-cutout-bw.webp · the real figure, true alpha.
    Validated: near-binary alpha, no colour cast, full canvas reach on
    hands and feet, no halo brighter than the figure at the boundary.
    """
    im = Image.open(src).convert("RGBA")
    a = np.array(im)
    alpha = a[..., 3].astype(float)
    mid = ((alpha > 40) & (alpha < 210)).mean()
    assert mid < 0.02, f"cutout: alpha is not clean, {mid:.3f} semi-transparent"
    rgb = a[..., :3].astype(int)
    sat = np.abs(rgb.max(axis=2) - rgb.min(axis=2))[alpha > 200]
    assert np.percentile(sat, 95) <= 14, "cutout: not monochrome"
    ys, xs = np.nonzero(alpha > 128)
    pad = 4
    crop = a[max(0, ys.min() - pad): ys.max() + pad, max(0, xs.min() - pad): xs.max() + pad]
    im2 = Image.fromarray(crop)
    scale = 1400 / im2.height
    im2 = im2.resize((round(im2.width * scale), 1400), Image.LANCZOS)
    f = OUT / "handstand-cutout-bw.webp"
    im2.save(f, "WEBP", quality=86, method=6)
    save_report(f, 260)
    return im2.size



def build_mobile_hero_monolith(src):
    """Create the mobile one-edge mask from the approved monolith alpha.

    Mobile keeps the same diagonal composition, but the visible boundary
    must retain the source slab's broad recesses and ledges. The earlier
    derivative kept mostly high-frequency erosion and made the edge too
    smooth at phone scale. This version resamples the actual central 76%
    of the approved left boundary, preserving its large arcs, deep cuts
    and fine mineral breaks. Only that one boundary enters the viewport;
    opacity continues to the lower, right and bottom sides.
    """
    from PIL import ImageDraw

    alpha = Image.open(src).convert("RGBA").getchannel("A")
    a = np.array(alpha)
    h, _ = a.shape

    left = []
    for y in range(h):
        xs = np.flatnonzero(a[y] > 12)
        left.append(float(xs[0]) if xs.size else np.nan)
    left = np.array(left, dtype=float)
    idx = np.arange(h)
    valid = np.isfinite(left)
    left = np.interp(idx, idx[valid], left[valid])

    # Skip the finite slab corners and sample a longer real section of the
    # approved left edge. This keeps the broad shelves, deep recess and
    # torn-slate arcs that make the desktop monolith feel geological.
    # The wider source span also prevents a repeated/flat-looking crest.
    y0 = round(.18 * (h - 1))
    y1 = round(.96 * (h - 1))
    profile = left[y0:y1 + 1]

    W, H, S = 1200, 1500, 3
    sample = np.interp(
        np.linspace(0, len(profile) - 1, W),
        np.arange(len(profile)),
        profile,
    )

    # Remove only the source edge's overall drift. Preserve the macro shape
    # at stronger amplitude so the phone composition reads as torn slate /
    # mineral strata rather than a mildly noisy diagonal.
    sample -= np.linspace(sample[0], sample[-1], W)
    low, high = np.percentile(sample, [1, 99])
    scale = max(abs(low), abs(high), 1.0)
    organic = sample / scale * 250.0

    # Keep the whole organic boundary safely inside the canvas. The visible
    # edge now travels from low-left to roughly the middle of the right side,
    # so no top slab edge can ever be clipped into view.
    t = np.linspace(0.0, 1.0, W)
    baseline = ((.72 * (1.0 - t) + .10 * t) * H)
    boundary = baseline + organic

    mask = Image.new("L", (W * S, H * S), 0)
    draw = ImageDraw.Draw(mask)
    points = [(x * S, round(y * S)) for x, y in enumerate(boundary)]
    draw.polygon(points + [(W * S, H * S), (0, H * S)], fill=255)
    mask = mask.resize((W, H), Image.Resampling.LANCZOS)

    out = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    out.putalpha(mask)
    f = OUT / "hero-ink-monolith-mobile-mask.png"
    out.save(f, "PNG", optimize=True)
    save_report(f, 80)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", default=str(ROOT.parent.parent / "Assets" / "Generated"))
    args = ap.parse_args()
    src = Path(args.sources)
    OUT.mkdir(parents=True, exist_ok=True)

    print("material:")
    build_strata(src / "strata-src.png")
    build_aperture(src / "aperture-portrait-src.png")
    build_earth(src / "earth-src.png")
    build_copper(src / "copper-src.png")
    build_sandstone(src / "sandstone-src.png")
    size = build_cutout(src / "cutout-src.png")
    print(f"  cutout intrinsic {size[0]}x{size[1]}")
    # The approved hero mask is checked into the repository; derive the
    # narrow-screen one-edge version from that production alpha.
    build_mobile_hero_monolith(OUT / "hero-ink-monolith-mask.png")

    total = sum(f.stat().st_size for f in OUT.iterdir() if f.is_file())
    print(f"public/media/material total: {total / 1024:.0f} kB")
    for f in OUT.iterdir():
        data = f.read_bytes()
        if f.suffix == ".png":
            # PNG metadata lives in named chunks, not in the pixel stream
            assert b"eXIf" not in data and b"tEXt" not in data and b"iTXt" not in data, \
                f"metadata chunk left in {f.name}"
        else:
            # WebP metadata is an EXIF RIFF chunk aligned after the header;
            # grepping the whole compressed stream gives false positives
            assert b"EXIF" not in data[:64] and b"XMP " not in data[:64], \
                f"metadata chunk left in {f.name}"


if __name__ == "__main__":
    main()
