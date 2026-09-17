/** V9.13 final visual layer. Only approved artwork, hero proportions and requested Home refinements.
 * Photographic pixels, public copy, prices, reviews and route data are not altered here.
 * svh avoids browser-toolbar jumping; narrow screens stay content-driven, never text-clipped.
 */
const FINAL_VISUAL_CSS = String.raw`
:root{
 --hero-scene-v913:clamp(590px,calc(100svh - 88px),900px);
 --hero-art-phone-v913:clamp(350px,104vw,500px);
 --photo-radius-v913:10px;
 --enso-pigment:var(--linen);
 --enso-centre:var(--earth);
}
/* Original supplied wordmarks, transparent. No typeface approximation or recreated dot. */
.brand-wordmark.wm{display:inline-block;position:relative;vertical-align:middle;width:116px;max-width:100%;line-height:0;font-size:0;letter-spacing:0;white-space:normal}
.brand-wordmark img{display:block;width:100%;height:auto;aspect-ratio:934/292}
.brand-wordmark .brand-wordmark__linen{display:none}
:is(.site-ink,.band--dark,.home-dark-field,.site-earth) .brand-wordmark .brand-wordmark__ink{display:none}
:is(.site-ink,.band--dark,.home-dark-field,.site-earth) .brand-wordmark .brand-wordmark__linen{display:block}
.brand-fallback{font-family:var(--ff-logo);font-size:22px;line-height:1.1;letter-spacing:.05em}
.topbar .logo{min-height:36px}
.topbar .row{min-height:66px;padding-top:12px;padding-bottom:12px}
footer .brand-wordmark.wm{width:96px}

/* Home is the compositional reference. Shared viewport-bounded scene leaves a glimpse of the next chapter. */
@media(min-width:900px){
 .opening.has-portrait{height:calc(var(--hero-scene-v913) + var(--topbar-h));padding:var(--topbar-h) 0 0}
 .opening.has-portrait>.wrap{height:100%}
 .opening.has-portrait .grid{height:100%;align-items:center;display:flex}
 .opening.has-portrait .copy{width:min(35vw,420px);transform:translateY(-12px);padding:0 0 24px}
 .opening.has-portrait .portrait-stage{width:min(67vw,980px);height:100%;min-height:0;position:absolute;top:0;right:0;bottom:0;margin:0}
 .opening.has-portrait .portrait-cut{width:auto;height:calc(var(--hero-scene-v913) + 75px);max-width:calc(100% - 28px);object-fit:contain;object-position:right bottom;left:auto;right:12px;bottom:0;transform:none}
 .opening.has-portrait .h1{font-size:clamp(46px,4.8vw,68px)}
 .opening.has-portrait .body-txt{max-width:25em}

 [data-secondary-v8] .hero-unified{padding:0;position:relative;isolation:isolate}
 [data-secondary-v8] .collaboration-hero-v8{height:var(--hero-scene-v913);min-height:0;overflow:hidden}
 [data-secondary-v8] .collaboration-hero-v8>.wrap{height:100%;max-width:var(--maxw)}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-grid,
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-grid:has(>figure){height:100%;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(26px,4vw,64px);align-items:center}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-copy{padding:0 0 44px;max-width:465px;align-self:center}
 [data-secondary-v8] .collaboration-hero-v8 .h1{font-size:clamp(48px,5vw,72px);line-height:1.04}
 [data-secondary-v8] .collaboration-hero-v8 .hero-dominant{font-size:clamp(25px,2.25vw,34px);line-height:1.23;margin-top:20px;max-width:14em}
 [data-secondary-v8] .collaboration-hero-v8 .lead{font-size:clamp(18px,1.5vw,21px);line-height:1.6;max-width:28em;margin-top:22px}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout{height:calc(var(--hero-scene-v913) - 70px);width:100%;max-width:620px;padding:0;margin:0 0 54px;align-self:end;justify-self:end;line-height:0}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout img{height:100%;width:100%;object-fit:contain;object-position:right bottom}
 [data-collaboration-v99] .collaboration-earth-stage .v8-art--desktop{width:65%;height:125%;top:-19%;right:-1px;left:auto;bottom:auto}
 [data-collaboration-v99] .collaboration-needs-v99 .collaboration-linen-lip{height:clamp(42px,5.5vw,72px)}

 [data-secondary-v8] .practice-rock-v963{height:var(--hero-scene-v913);padding:0;overflow:hidden}
 [data-secondary-v8] .practice-rock-layout{height:100%;min-height:0;position:relative;display:block;max-width:1920px;margin:0 auto}
 [data-secondary-v8] .practice-rock-copy{position:relative;margin-left:57%;width:calc(43% - var(--gutter));max-width:520px;height:100%;display:flex;flex-direction:column;justify-content:center;padding:20px 0 74px;z-index:2}
 [data-secondary-v8] .practice-rock-copy .h1{font-size:clamp(43px,4.7vw,66px);line-height:1.08;max-width:11em}
 [data-secondary-v8] .practice-rock-copy .lead{font-size:clamp(17px,1.3vw,19px);line-height:1.75;margin-top:24px;max-width:29em}
 [data-secondary-v8] .practice-rock-copy .hero-dominant{font-size:clamp(24px,2.25vw,31px);line-height:1.3;margin-top:24px;max-width:17em}
 [data-secondary-v8] .practice-rock-photo{position:absolute;left:0;top:auto;bottom:0;width:min(56vw,calc(var(--hero-scene-v913) * .898));height:auto;aspect-ratio:810/902;max-width:none;margin:0;align-self:auto}
 [data-secondary-v8] .practice-rock-photo picture{width:100%;height:100%;display:block}
 [data-secondary-v8] .practice-rock-photo img{width:100%;height:auto;aspect-ratio:810/902;object-fit:contain}

 [data-secondary-v8] .about-hero-v912b .about-hero-scene{height:var(--hero-scene-v913);overflow:hidden}
 [data-secondary-v8] .about-hero-v912b .about-hero-scene>.wrap{height:100%}
 [data-secondary-v8] .about-hero-v912b .page-hero-grid{height:100%;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(26px,4vw,64px);align-items:center}
 [data-secondary-v8] .about-hero-v912b .about-hero-copy{padding:0 0 60px;max-width:455px;align-self:center}
 [data-secondary-v8] .about-hero-copy .h1{font-size:clamp(48px,5vw,72px)}
 [data-secondary-v8] .about-hero-copy .lead{font-size:clamp(18px,1.5vw,21px);line-height:1.65;margin-top:23px;max-width:26em}
 [data-secondary-v8] .about-hero-v912b .about-portrait-v912b{position:absolute;right:0;left:auto;top:30px;bottom:auto;width:min(49vw,660px);height:auto;max-width:none;margin:0;line-height:0}
 [data-secondary-v8] .about-hero-v912b .about-portrait-v912b img{display:block;width:100%;height:auto;max-width:none;object-fit:contain}
 [data-secondary-v8] .about-hero-v912b .about-hero-mineral-v912b{top:0;bottom:0;right:-4%;height:100%;width:84.5%;-webkit-mask-size:100% 100%;mask-size:100% 100%}
 [data-secondary-v8] .about-hero-proof-v912b .proof-row{padding-top:18px}
}
/* The approved Home-type incoming paper edge is an overlay, not a fade or a straight crop. */
[data-secondary-v8] .hero-end-v913,
[data-secondary-v8] .about-hero-foreground-v912b{display:block;position:absolute;z-index:4;left:0;right:0;bottom:-1px;width:100%;height:clamp(42px,5.5vw,72px);background-color:var(--sandstone);background-image:var(--tex-sand);background-repeat:repeat;background-size:768px 768px;pointer-events:none;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}

/* Content-first narrow layouts. Full bodies remain contained; only the already-approved About torso crop is retained. */
@media(max-width:899px){
 :root{--topbar-h:62px;--hero-copy-phone-v913:354px}
 .topbar .row{min-height:62px;padding-top:11px;padding-bottom:11px}
 .topbar .brand-wordmark.wm{width:106px}
 .opening.has-portrait{height:auto;padding:var(--topbar-h) 0 0;margin-top:calc(-1 * var(--topbar-h))}
 .opening.has-portrait .grid{display:flex;flex-direction:column;gap:0;height:auto;align-items:stretch}
 .opening.has-portrait .copy{width:100%;max-width:620px;min-height:var(--hero-copy-phone-v913);padding:30px 0 22px;transform:none;align-self:center}
 .opening.has-portrait .h1{font-size:clamp(39px,6.6vw,54px);max-width:13em;margin-top:15px}
 .opening.has-portrait .body-txt{max-width:33em;line-height:1.68;margin-top:16px}
 .opening.has-portrait .act{margin-top:19px}
 .opening.has-portrait .stance{margin-top:16px}
 .opening.has-portrait .portrait-stage{position:relative;inset:auto;width:calc(100% + 2 * var(--gutter));height:var(--hero-art-phone-v913);min-height:0;align-self:center;margin:0 calc(-1 * var(--gutter));}
 .opening.has-portrait .portrait-cut{height:calc(var(--hero-art-phone-v913) + 15px);width:auto;max-width:96vw;left:auto;right:4px;bottom:0;transform:none;object-fit:contain;object-position:bottom right}
 .opening.has-portrait .portrait-monolith{width:132%;height:116%;right:-21%;top:-4%;transform:rotate(1deg)}
 .opening.has-portrait .portrait-shoulder{display:none}
 .opening.has-portrait .body-txt{font-size:16px}

 [data-secondary-v8] .hero-unified{padding:0;position:relative}
 [data-secondary-v8] .collaboration-hero-v8{height:auto;overflow:hidden;padding-bottom:0}
 [data-secondary-v8] .collaboration-hero-v8 .page-hero-grid{display:flex;flex-direction:column;gap:0;align-items:stretch}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-copy{min-height:var(--hero-copy-phone-v913);width:100%;max-width:620px;margin:0 auto;padding:30px 0 24px;align-self:center}
 [data-secondary-v8] .collaboration-hero-v8 .label{margin-bottom:16px}
 [data-secondary-v8] .collaboration-hero-v8 .h1{font-size:clamp(41px,7vw,56px)}
 [data-secondary-v8] .collaboration-hero-v8 .hero-dominant{font-size:clamp(26px,4.5vw,31px);margin-top:16px}
 [data-secondary-v8] .collaboration-hero-v8 .lead{font-size:18px;line-height:1.6;margin-top:18px}
 [data-secondary-v8] .collaboration-hero-v8 .act{margin-top:22px}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout{width:100%;height:var(--hero-art-phone-v913);padding:0 0 50px;max-width:480px;line-height:0;align-self:center;margin:0;}
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout img{width:100%;height:100%;object-fit:contain;object-position:center bottom}
 [data-collaboration-v99] .collaboration-earth-stage .v8-art--mobile{display:block;top:auto;bottom:0;left:0;right:0;width:100%;height:calc(var(--hero-art-phone-v913) + 34px)}
 [data-collaboration-v99] .collaboration-earth-stage .v8-art--desktop{display:none}
 [data-collaboration-v99] .collaboration-linen-lip{height:48px}

 [data-secondary-v8] .practice-rock-v963{height:auto;overflow:hidden}
 [data-secondary-v8] .practice-rock-layout{height:auto;min-height:0;display:flex;flex-direction:column;align-items:stretch}
 [data-secondary-v8] .practice-rock-copy{width:100%;height:auto;min-height:var(--hero-copy-phone-v913);max-width:calc(620px + 2 * var(--gutter));margin:0 auto;padding:30px var(--gutter) 22px;display:flex;flex-direction:column;justify-content:center}
 [data-secondary-v8] .practice-rock-copy .label{margin-bottom:16px}
 [data-secondary-v8] .practice-rock-copy .h1{font-size:clamp(39px,6.6vw,54px);line-height:1.1;max-width:14em}
 [data-secondary-v8] .practice-rock-copy .lead{font-size:17px;line-height:1.68;margin-top:19px;max-width:34em}
 [data-secondary-v8] .practice-rock-copy .hero-dominant{font-size:clamp(25px,4.5vw,30px);margin-top:20px;max-width:22em}
 [data-secondary-v8] .practice-rock-photo{position:relative;inset:auto;width:calc(var(--hero-art-phone-v913) * .898);height:var(--hero-art-phone-v913);max-width:100%;aspect-ratio:810/902;align-self:flex-start;margin:0}
 [data-secondary-v8] .practice-rock-photo picture{display:block;width:100%;height:100%}
 [data-secondary-v8] .practice-rock-photo img{width:100%;height:100%;object-fit:contain;object-position:left bottom;aspect-ratio:810/902}

 [data-secondary-v8] .about-hero-v912b .about-hero-scene{height:auto;overflow:hidden}
 [data-secondary-v8] .about-hero-v912b .page-hero-grid{display:flex;flex-direction:column;gap:0;min-height:0}
 [data-secondary-v8] .about-hero-v912b .about-hero-copy{min-height:var(--hero-copy-phone-v913);padding:30px 0 24px;width:100%;max-width:620px;margin:0 auto;display:flex;flex-direction:column;justify-content:center}
 [data-secondary-v8] .about-hero-v912b .about-hero-copy .h1{font-size:clamp(41px,7vw,56px)}
 [data-secondary-v8] .about-hero-v912b .about-hero-copy .lead{font-size:18px;line-height:1.62;max-width:32em;margin-top:18px}
 [data-secondary-v8] .about-hero-v912b .about-hero-copy .act{margin-top:21px}
 [data-secondary-v8] .about-hero-v912b .about-portrait-v912b{position:relative;inset:auto;width:min(calc(100% + 2 * var(--gutter)),520px);height:var(--hero-art-phone-v913);margin:0 calc(-1 * var(--gutter)) 0 auto;align-self:flex-end;overflow:hidden}
 [data-secondary-v8] .about-hero-v912b .about-portrait-v912b img{display:block;width:100%;height:auto;aspect-ratio:1366/1814;object-fit:contain}
 [data-secondary-v8] .about-hero-v912b .about-hero-mineral-v912b{top:auto;bottom:0;right:0;width:100%;height:var(--hero-art-phone-v913)}
 [data-secondary-v8] .hero-end-v913,[data-secondary-v8] .about-hero-foreground-v912b{height:42px}
 [data-secondary-v8] .about-hero-proof-v912b .proof-row{padding-top:16px}
}
@media(max-width:380px){:root{--hero-copy-phone-v913:384px}.topbar .brand-wordmark.wm{width:93px}}

/* Diagram: real localized labels over the selected brush image, with separately recolourable pigment masks. */
.enso-anchors{position:relative;isolation:isolate;width:min(100%,450px);aspect-ratio:1;margin:0 auto;align-self:center;justify-self:center}
.enso-anchors__fallback{display:block;width:100%;height:100%;object-fit:contain}
.enso-anchors__strokes,.enso-anchors__centre{display:none;position:absolute;inset:0;pointer-events:none;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;mask-mode:alpha}
@supports ((mask-image:url("")) or (-webkit-mask-image:url(""))){
 .enso-anchors[data-masks="ready"] .enso-anchors__fallback{visibility:hidden}
 .enso-anchors[data-masks="ready"] .enso-anchors__strokes{display:block;background:var(--enso-pigment);-webkit-mask-image:url('/media/final-v9-13/anchors-strokes.png');mask-image:url('/media/final-v9-13/anchors-strokes.png')}
 .enso-anchors[data-masks="ready"] .enso-anchors__centre{display:block;background:var(--enso-centre);-webkit-mask-image:url('/media/final-v9-13/anchors-centre.png');mask-image:url('/media/final-v9-13/anchors-centre.png')}
}
.enso-anchors__label{position:absolute;width:27%;text-align:center;transform:translate(-50%,-50%);color:var(--on-dark);line-height:1.05}
.enso-anchors__label strong{font-family:var(--ff-display);font-size:clamp(21px,2.15vw,28px);font-weight:400;line-height:1.08;display:block}
.enso-anchors__label small{display:block;font-family:var(--ff-meta);font-size:11px;letter-spacing:.13em;line-height:1.4;text-transform:uppercase;margin-top:9px;color:var(--on-dark-2)}
.enso-anchors__label--body{left:50%;top:31.5%}
.enso-anchors__label--practice{left:29%;top:69%}
.enso-anchors__label--nature{left:70%;top:69%}
[data-secondary-v8] .practice-anchors-layout{gap:clamp(28px,5vw,70px);align-items:center}
@media(min-width:900px){[data-secondary-v8] .practice-anchors-layout{grid-template-columns:minmax(0,1.1fr) minmax(330px,.9fr)}}
@media(max-width:599px){.enso-anchors{width:min(100%,360px)}.enso-anchors__label strong{font-size:23px}.enso-anchors__label small{font-size:10px;letter-spacing:.10em;margin-top:7px}}
@media(max-width:359px){.enso-anchors__label strong{font-size:21px}}

/* Long branch: preserved rings, straps and entire needle tips. No white fills. */
[data-secondary-v8] .practice-work-layout{align-items:center}
[data-secondary-v8] .secondary-illustration--pine-rings{width:min(78vw,340px);margin:0 calc(-1 * var(--gutter)) 0 0;max-width:none;align-self:center;justify-self:end}
@media(min-width:900px){
 [data-secondary-v8] .practice-work-layout:has(>.secondary-illustration--pine-rings){grid-template-columns:minmax(0,1.12fr) minmax(280px,.88fr);gap:clamp(38px,4vw,64px);align-items:center}
 [data-secondary-v8] .secondary-illustration--pine-rings{width:min(560px,calc(100% + var(--branch-bleed)));margin:0 calc(-1 * var(--branch-bleed)) 0 0;align-self:center}
}
/* Enso-related visual weight is reserved for the diagram; tools remain spare line art. */
[data-secondary-v8] .process-with-equipment{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"heading" "steps" "art";row-gap:30px}
.process-v913-heading{grid-area:heading}
[data-secondary-v8] .process-with-equipment>.process-three{grid-area:steps}
[data-secondary-v8] .process-with-equipment>.process-equipment-v913{grid-area:art;width:min(100%,380px);max-width:none;align-self:center;justify-self:center;margin:4px 0 0}
[data-secondary-v8] .process-with-equipment .stance-line{margin-top:20px;max-width:25em}
@media(min-width:900px){
 [data-secondary-v8] .process-with-equipment{grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);grid-template-areas:"heading art" "steps art";column-gap:clamp(40px,5vw,72px);row-gap:32px;align-items:start}
 [data-secondary-v8] .process-with-equipment>.process-equipment-v913{width:100%;max-width:430px;align-self:center;justify-self:end;margin:20px 0 0}
 [data-secondary-v8] .process-with-equipment .process-three article{display:grid;grid-template-columns:30px minmax(0,1fr);column-gap:18px;row-gap:7px;padding:24px 0}
 [data-secondary-v8] .process-with-equipment .process-three article>.num{grid-row:1 / span 2;grid-column:1;padding-top:5px}
 [data-secondary-v8] .process-with-equipment .process-three h3{grid-column:2;margin:0}
 [data-secondary-v8] .process-with-equipment .process-three p{grid-column:2;margin:0}
}
.tanmay-calligraphy{display:block;width:min(100%,460px);line-height:0;max-width:100%;margin:4px auto 0}
.tanmay-calligraphy img{width:100%;height:auto;aspect-ratio:1572/469;object-fit:contain}
.meaning-grid .etymology{margin-top:26px}
@media(max-width:899px){.tanmay-calligraphy{width:min(100%,400px);margin:0 auto}.meaning-grid .etymology{text-align:center}}

/* Same requested corner treatment on both personal photographs. Preserve aspect ratio/crop and pixels. */
.home-about .figure,[data-secondary-v8] .about-nature-photo-v912c{border-radius:var(--photo-radius-v913)}
.home-about .figure{overflow:hidden}
.home-about .figure img{border-radius:inherit}
@media(max-width:599px){:root{--photo-radius-v913:8px}}

/* Shorter final Linen chapter, not a squeezed logo or a narrower viewport. */
.closing{padding-bottom:22px}
.closing>.strata{height:clamp(36px,3.3vw,48px);margin-bottom:0}
.closing>.wrap{padding-top:16px}
.closing .brand-wordmark.wm{width:220px}
.closing .mean{margin-top:8px;line-height:1.4}
.closing .stance{margin-top:13px;font-size:clamp(25px,2.5vw,32px);line-height:1.22}
@media(max-width:599px){.closing .brand-wordmark.wm{width:184px}.closing>.wrap{padding-top:15px}.closing{padding-bottom:20px}}
/* Collapse only the absent artwork column; keep all copy and existing fallback semantics. */
[data-secondary-v8] .practice-anchors-layout:not(:has(>.enso-anchors)){grid-template-columns:minmax(0,1fr)}
[data-secondary-v8] .process-with-equipment:not(:has(>.process-equipment-v913)){grid-template-columns:minmax(0,1fr);grid-template-areas:"heading" "steps"}
@media(prefers-reduced-motion:reduce){.enso-anchors,.tanmay-calligraphy{animation:none;transition:none}}
`;
export default FINAL_VISUAL_CSS;
