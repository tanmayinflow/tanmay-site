#!/usr/bin/env python3
"""
build-media.py · authoring tool, never part of `npm run build`
----------------------------------------------------------------------
Turns the photographic masters into the responsive derivatives that live
in `public/media/`, and synthesises the ink cotton tile.

The torn-linen edge this script used to draw was retired on 2026-08-23:
the hero portrait now ends in the stone aperture mask from the Material
Landscape wave (see scripts/build-material.py), so a second organic
edge under the same photograph had no job left.

Masters are NOT in this repository. They live in the Tanmay-Cowork
workspace at:

    Work/website/Assets/Masters/

Point MASTERS at that directory and run:

    pip install pillow pillow-avif-plugin
    python3 scripts/build-media.py --masters /path/to/Masters

Everything it writes is deterministic. Re-running with the same masters
produces byte-comparable files, so a rebuild never creates noise in the
diff for images that did not change.

Rules this script encodes, from VISUAL-ASSET-PLAN.md:
  * No derivative is ever wider than its master. Nothing is upscaled.
  * Every derivative is stripped of EXIF. Phone stills carry GPS.
  * Photographic treatment is limited to exposure, white balance and
    saturation. No retouching, no smoothing, no invented light.
  * The two generated assets are material only. They are synthesised
    numerically here rather than prompted from an image model, because
    an alpha mask and a near black cotton tile have to be correct to the
    pixel, and a numeric generator can be validated. The equivalent
    paste ready prompts are kept in IMAGE-GENERATION-BRIEF.md.
"""
import argparse
import hashlib
import json
import math
import os
import random
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

try:
    import pillow_avif  # noqa: F401  registers the AVIF plugin
    HAS_AVIF = True
except ImportError:
    HAS_AVIF = False

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media"

# ----------------------------------------------------------------------
# Photographic contracts
# ----------------------------------------------------------------------
# crop is (left, top, right, bottom) in master pixels.
# saturation / warm / contrast are the only treatment allowed.
PHOTOS = [
    {
        "name": "portrait-tanmay",
        "master": "portrait-tanmay-master",
        # Master is already 4:5. Nothing is cropped away.
        "crop": None,
        "ratio": (4, 5),
        "widths": [480, 720, 960, 1280],
        "fallback": 960,
        "saturation": 0.97,
        "warm": 1.0,
        "contrast": 1.02,
    },
    {
        "name": "practice-handstand-trunk",
        "master": "practice-handstand-trunk-master",
        # Master is a 9:16 phone still. A 16:9 crop would cut the figure
        # in half, so the contract is 5:7 with the whole line of the body
        # inside the frame, feet near the top edge, both hands on the
        # trunk near the bottom. Documented deviation, see
        # VISUAL-ASSET-PLAN.md.
        "crop": (0, 88, 2160, 3112),
        "ratio": (5, 7),
        "widths": [480, 720, 1080],
        "fallback": 720,
        # Dense spring foliage is expensive to encode. It also hides
        # compression artefacts, so this one image gets a lower budget.
        "quality": {"avif": 46, "webp": 68},
        # Spring beech forest is very green. Brand V2 says the public
        # field must not read primarily green, so saturation comes down.
        # This is a global saturation move, not a colour grade.
        "saturation": 0.72,
        "warm": 1.03,
        "contrast": 1.03,
    },
    {
        "name": "practice-sitting-pine",
        "master": "practice-sitting-pine-master",
        "crop": (0, 190, 720, 1090),
        "ratio": (4, 5),
        # Master is only 720 px wide. Nothing above it is generated.
        "widths": [360, 480, 720],
        "fallback": 480,
        "saturation": 0.88,
        "warm": 1.0,
        "contrast": 1.02,
    },
]

QUALITY = {"avif": 55, "webp": 76, "jpeg": 82}


def treat(im, spec):
    im = im.convert("RGB")
    if spec["saturation"] != 1.0:
        im = ImageEnhance.Color(im).enhance(spec["saturation"])
    if spec["contrast"] != 1.0:
        im = ImageEnhance.Contrast(im).enhance(spec["contrast"])
    if spec["warm"] != 1.0:
        r, g, b = im.split()
        r = r.point(lambda v: min(255, int(v * spec["warm"])))
        b = b.point(lambda v: int(v * (2 - spec["warm"])))
        im = Image.merge("RGB", (r, g, b))
    return im


def find_master(masters, base):
    """A master may be a jpg, a png or a heic. Take whichever is there."""
    for ext in (".jpg", ".jpeg", ".png", ".tif", ".tiff", ".heic"):
        p = masters / (base + ext)
        if p.exists():
            return p
    return None


def build_photos(masters):
    manifest = {}
    for spec in PHOTOS:
        src = find_master(masters, spec["master"])
        if src is None:
            print(f"  skip {spec['name']}: no master named {spec['master']}.* in {masters}")
            continue
        im = Image.open(src)
        if spec["crop"]:
            im = im.crop(spec["crop"])
        rw, rh = spec["ratio"]
        # Force the exact declared ratio by trimming, never by stretching.
        want_h = round(im.width * rh / rw)
        if want_h != im.height:
            if want_h < im.height:
                top = (im.height - want_h) // 2
                im = im.crop((0, top, im.width, top + want_h))
            else:
                want_w = round(im.height * rw / rh)
                left = (im.width - want_w) // 2
                im = im.crop((left, 0, left + want_w, im.height))
        im = treat(im, spec)
        assert spec["fallback"] in spec["widths"], f"{spec['name']}: fallback width is not built"
        entry = {"width": im.width, "height": im.height, "widths": [], "fallback": spec["fallback"]}
        for w in spec["widths"]:
            if w > im.width:
                print(f"  skip {spec['name']}@{w}: wider than master ({im.width})")
                continue
            h = round(w * im.height / im.width)
            small = im.resize((w, h), Image.LANCZOS)
            if w < im.width * 0.7:
                small = small.filter(ImageFilter.UnsharpMask(radius=0.6, percent=42, threshold=3))
            q = dict(QUALITY, **spec.get("quality", {}))
            small.save(OUT / f"{spec['name']}-{w}.webp", "WEBP", quality=q["webp"], method=6)
            if HAS_AVIF:
                small.save(OUT / f"{spec['name']}-{w}.avif", "AVIF", quality=q["avif"])
            if w == spec["fallback"]:
                small.save(
                    OUT / f"{spec['name']}.jpg", "JPEG",
                    quality=q["jpeg"], optimize=True, progressive=True,
                )
            entry["widths"].append(w)
        manifest[spec["name"]] = entry
        print(f"  {spec['name']}: {im.width}x{im.height} -> {entry['widths']}")
    return manifest


# ----------------------------------------------------------------------
# Generated material asset B · surface-ink-cotton.webp
# ----------------------------------------------------------------------
def build_cotton():
    """
    A seamless 1024 x 1024 tile for the dark bands. Base #1C1C1A.
    Perceived before it is consciously seen: variation stays inside
    about six RGB levels. No weave grid, no folds, no vignette.
    """
    N = 1024
    base = (0x1C, 0x1C, 0x1A)
    rnd = random.Random(4711)

    # Smoothed white noise, wrapped, so the tile is seamless by
    # construction. Deliberately no low frequency components: those are
    # what turn a texture into a visible plaid once it repeats across a
    # wide band. What is left is cotton pressure, not a weave grid.
    field = [[rnd.random() - 0.5 for _ in range(N)] for _ in range(N)]
    for _ in range(3):
        nxt = [[0.0] * N for _ in range(N)]
        for y in range(N):
            ym, yp = (y - 1) % N, (y + 1) % N
            fy, fym, fyp = field[y], field[ym], field[yp]
            for x in range(N):
                xm, xp = (x - 1) % N, (x + 1) % N
                nxt[y][x] = (
                    fy[x] * 0.36
                    + (fy[xm] + fy[xp] + fym[x] + fyp[x]) * 0.13
                    + (fym[xm] + fym[xp] + fyp[xm] + fyp[xp]) * 0.03
                )
        field = nxt

    lo = min(min(r) for r in field)
    hi = max(max(r) for r in field)
    span = hi - lo or 1.0

    im = Image.new("RGB", (N, N))
    px = im.load()
    peak = 0
    for y in range(N):
        for x in range(N):
            # Three levels either side of the base colour. Perceived
            # before it is consciously seen, and never a pattern.
            d = round(((field[y][x] - lo) / span - 0.5) * 6.0)
            peak = max(peak, abs(d))
            px[x, y] = (
                max(0, min(255, base[0] + d)),
                max(0, min(255, base[1] + d)),
                max(0, min(255, base[2] + d)),
            )
    im.save(OUT / "surface-ink-cotton.webp", "WEBP", quality=92, method=6)

    # Numeric seam check: the wrap-around difference must be no larger
    # than the difference one pixel inside the tile.
    def col(i):
        return [im.getpixel((i, y))[0] for y in range(N)]

    def row(i):
        return [im.getpixel((x, i))[0] for x in range(N)]

    wrap_x = max(abs(a - b) for a, b in zip(col(0), col(N - 1)))
    inner_x = max(abs(a - b) for a, b in zip(col(1), col(2)))
    wrap_y = max(abs(a - b) for a, b in zip(row(0), row(N - 1)))
    inner_y = max(abs(a - b) for a, b in zip(row(1), row(2)))
    print(f"  surface-ink-cotton.webp: peak deviation +/-{peak} levels (target <= 6), "
          f"seam x {wrap_x} vs inner {inner_x}, seam y {wrap_y} vs inner {inner_y}")
    assert peak <= 6, "cotton tile exceeds the six level budget"
    assert wrap_x <= inner_x + 1 and wrap_y <= inner_y + 1, "cotton tile is not seamless"


# ----------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--masters", default=str(ROOT.parent / "Assets" / "Masters"))
    ap.add_argument("--only", choices=["photos", "material"], default=None)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    manifest = {}
    if args.only != "material":
        print("photographs:")
        if not HAS_AVIF:
            print("  warning: pillow-avif-plugin missing, no AVIF written")
        manifest = build_photos(Path(args.masters))
    if args.only != "photos":
        print("material:")
        build_cotton()

    if manifest:
        (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")

    total = 0
    for f in sorted(OUT.iterdir()):
        if f.is_file() and f.suffix in {".avif", ".webp", ".jpg", ".png"}:
            total += f.stat().st_size
            with open(f, "rb") as fh:
                head = fh.read(4096)
            assert b"GPS" not in head and b"Exif" not in head, f"metadata left in {f.name}"
    print(f"public/media total: {total / 1024:.0f} kB")


if __name__ == "__main__":
    main()
