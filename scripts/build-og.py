#!/usr/bin/env python3
"""
build-og.py · authoring tool, never part of `npm run build`
----------------------------------------------------------------------
Draws the Open Graph preview cards into `public/og/`.

One card per route per language, plus one per journal entry per language.
Everything on a card is set in the real Brand V2 typefaces, taken from
`public/fonts/`, so a shared link looks like the site and not like a
default social preview.

    python3 scripts/build-og.py

Rules:
  * Linen ground, Ink type, one Copper bindu. No gradients.
  * The headline on a card is the visible H1 of the route. Nothing is
    written on a card that is not written on the page.
  * The home card carries the real portrait. No other card carries an
    image, and no card ever carries a generated portrait.
"""
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "public" / "fonts"
MEDIA = ROOT / "public" / "media"
OUT = ROOT / "public" / "og"
CACHE = ROOT / ".og-fonts"

W, H = 1200, 630
LINEN = (0xF4, 0xF0, 0xEB)
INK = (0x1C, 0x1C, 0x1A)
COPPER = (0xB8, 0x73, 0x33)
INK_2 = (0x60, 0x60, 0x5E)

KICKER = {
    "cs": "KOUČINK POHYBU A PRAXE · PRAHA",
    "en": "MOVEMENT AND PRACTICE COACHING · PRAGUE",
}

HEADLINE = {
    "home": {"cs": "To, co učím, sám žiju.", "en": "I teach only what I live."},
    "praxe": {"cs": "Co je tahle praxe", "en": "What this practice is"},
    "pribeh": {"cs": "Příběh", "en": "The story"},
    "spoluprace": {"cs": "Spolupráce", "en": "Work with me"},
    "denik": {"cs": "Deník praxe", "en": "Practice log"},
    "soukromi": {"cs": "Soukromí", "en": "Privacy"},
}

SUB = {
    "praxe": {"cs": "Tři kotvy, jedna praxe.", "en": "Three anchors, one practice."},
    "pribeh": {
        "cs": "Příběh vysvětluje závazek. Nedokazuje nadřazenost.",
        "en": "The story explains the commitment. It does not prove superiority.",
    },
    "spoluprace": {
        "cs": "Pracuju s málo lidmi a zblízka.",
        "en": "I work with few people, closely.",
    },
    "denik": {
        "cs": "Praxe, jaká byla, včetně dní, kdy nefungovala.",
        "en": "The practice as it was, including the days it did not work.",
    },
    "soukromi": {
        "cs": "Žádné cookies. Žádná analytika.",
        "en": "No cookies. No analytics.",
    },
}


# The woff2 files the site ships are split per unicode subset, so no
# single one of them covers both ASCII and Czech diacritics. For drawing
# a card we need the whole face, so the full TTFs are fetched with
# --no-save into a scratch directory. They never enter package.json and
# they are never committed.
FACES = {
    "eb-garamond": ("eb-garamond", "400Regular", "EBGaramond_400Regular.ttf"),
    "cormorant": ("cormorant-garamond", "400Regular", "CormorantGaramond_400Regular.ttf"),
    "cormorant-light": ("cormorant-garamond", "300Light", "CormorantGaramond_300Light.ttf"),
    "dm-sans": ("dm-sans", "400Regular", "DMSans_400Regular.ttf"),
    "barlow": ("barlow-condensed", "500Medium", "BarlowCondensed_500Medium.ttf"),
}


def ensure_fonts():
    CACHE.mkdir(exist_ok=True)
    if (CACHE / "node_modules").exists():
        return
    (CACHE / "package.json").write_text('{"name":"og-fonts","private":true}')
    pkgs = sorted({"@expo-google-fonts/" + v[0] for v in FACES.values()})
    subprocess.run(
        ["npm", "install", "--no-save", "--no-audit", "--no-fund", *pkgs],
        cwd=CACHE, check=True, stdout=subprocess.DEVNULL,
    )


def ttf(key):
    pkg, folder, name = FACES[key]
    return str(CACHE / "node_modules" / "@expo-google-fonts" / pkg / folder / name)


def load(key, size):
    return ImageFont.truetype(ttf(key), size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(" "), [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def wordmark(draw, x, y, size, font):
    """t a nmay, with the copper bindu above the first a."""
    draw.text((x, y), "tanmay", font=font, fill=INK)
    # Position the bindu over the 'a', measured rather than guessed.
    ax = x + draw.textlength("t", font=font)
    aw = draw.textlength("a", font=font)
    r = max(2.0, size * 0.038)
    cx = ax + aw / 2
    cy = y + size * 0.16
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=COPPER)


def card(lang, headline, sub, portrait=False):
    im = Image.new("RGB", (W, H), LINEN)
    d = ImageDraw.Draw(im)

    display = "eb-garamond" if lang == "cs" else "cormorant"
    logo = "cormorant-light"
    meta = "barlow"
    body = "dm-sans"

    pad = 76
    text_w = 660 if portrait else 1020

    if portrait:
        src = MEDIA / "portrait-tanmay-960.webp"
        if src.exists():
            p = Image.open(src).convert("RGB")
            col_w, col_h = 400, H
            scale = max(col_w / p.width, col_h / p.height)
            p = p.resize((round(p.width * scale), round(p.height * scale)), Image.LANCZOS)
            top = min(round(p.height * 0.04), max(0, p.height - col_h))
            left = max(0, (p.width - col_w) // 2)
            p = p.crop((left, top, left + col_w, top + col_h))
            im.paste(p, (W - col_w, 0))

    f_logo = load(logo, 46)
    wordmark(d, pad, pad - 8, 46, f_logo)

    d.line([(pad, pad + 74), (pad + 54, pad + 74)], fill=COPPER, width=1)

    f_meta = load(meta, 21)
    d.text((pad, pad + 92), KICKER[lang], font=f_meta, fill=INK_2)

    size = 66 if len(headline) < 34 else 54
    f_h = load(display, size)
    lines = wrap(d, headline, f_h, text_w)
    while len(lines) > 3 and size > 38:
        size -= 6
        f_h = load(display, size)
        lines = wrap(d, headline, f_h, text_w)

    y = pad + 150
    for line in lines:
        d.text((pad, y), line, font=f_h, fill=INK)
        y += round(size * 1.16)

    if sub:
        f_s = load(body, 22)
        y += 14
        for line in wrap(d, sub, f_s, text_w)[:2]:
            d.text((pad, y), line, font=f_s, fill=INK_2)
            y += 32

    f_url = load(meta, 20)
    d.text((pad, H - pad - 6), "TANMAYPRACTICE.COM", font=f_url, fill=INK_2)
    return im


def main():
    ensure_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    site = (ROOT / "src" / "site.js").read_text(encoding="utf8")

    made = []
    for route, heads in HEADLINE.items():
        for lang in ("cs", "en"):
            im = card(lang, heads[lang], SUB.get(route, {}).get(lang), portrait=(route == "home"))
            f = OUT / f"{route}-{lang}.jpg"
            im.save(f, "JPEG", quality=80, optimize=True, progressive=True)
            made.append(f)

    # Journal entries, read out of the same table the site renders from.
    for m in re.finditer(
        r'id:\s*"(p\d)".*?title:\s*\{\s*cs:\s*"([^"]+)",\s*en:\s*"([^"]+)"\s*\}'
        r'.*?excerpt:\s*\{\s*cs:\s*"([^"]+)",\s*en:\s*"([^"]+)"',
        site,
        re.S,
    ):
        pid, tcs, ten, ecs, een = m.groups()
        for lang, title, ex in (("cs", tcs, ecs), ("en", ten, een)):
            im = card(lang, title, ex)
            f = OUT / f"post-{pid}-{lang}.jpg"
            im.save(f, "JPEG", quality=80, optimize=True, progressive=True)
            made.append(f)

    total = sum(f.stat().st_size for f in made)
    print(f"wrote {len(made)} og cards, {total / 1024:.0f} kB total")


if __name__ == "__main__":
    main()
