# public/media

Committed derivatives. Cloudflare serves these files straight from the
repository, so they belong in Git. The masters do not: they live in the
workspace at `Work/website/Assets/Masters/`.

Everything here is written by `scripts/build-media.py`. Do not add,
rename or hand-edit a file. Run the script instead:

```
pip install pillow pillow-avif-plugin
npm run media -- --masters ../Assets/Masters
```

## What is here

```
portrait-tanmay-{480,720,960,1280}.{avif,webp}        home, opening
portrait-tanmay.jpg                                   fallback, 960
practice-handstand-trunk-{480,720,1080}.{avif,webp}   home, practice proof
practice-handstand-trunk.jpg                          fallback, 720
practice-sitting-pine-{360,480,720}.{avif,webp}       denik
practice-sitting-pine.jpg                             fallback, 480
edge-linen-torn.png                                   the one organic edge, alpha mask
surface-ink-cotton.webp                               material in the dark bands
manifest.json                                         what was built, checked by the tests
```

## Rules

1. Nothing is upscaled past its master. The script refuses.
2. Every derivative is stripped of EXIF. Phone stills carry GPS.
3. No file goes over 600 kB. A test fails if one does.
4. Exactly two generated assets, and both are material. A test fails if
   a third appears.
5. No placeholder or stand-in image, ever. An absent file is the correct
   state until the real one exists: the component removes itself and the
   page stays intentional.

Crops, aspect ratios, treatment, alt text and the generation prompts are
specified in `../../VISUAL-ASSET-PLAN.md` and
`../../IMAGE-GENERATION-BRIEF.md`.
