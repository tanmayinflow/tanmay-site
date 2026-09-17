/** V9.14 · Only the requested hero masks, paper joins, terrain, nav gutters and accent palette.
 * No copy changes, no portrait retouching, no re-generation of artwork or material surfaces.
 */
const REFINEMENT_CSS = String.raw`
:root{
 --accent-earth:#754437;
 --accent-earth-light:#C49383;
 --accent-text:var(--accent-earth);
 --accent-line:var(--accent-earth);
 --copper:var(--accent-text); /* Compatibility for older decorative selectors. No orange remains. */
 --nav-gutter:clamp(14px,1.65vw,28px);
 --terrain-stroke:1.6px;
 --hero-paper-height:clamp(36px,4vw,58px);
 --enso-centre:var(--accent-earth-light);
}
:is(.site-ink,.home-dark-field,.band--dark){
 --accent-text:var(--accent-earth-light);--accent-line:var(--accent-earth-light);--copper:var(--accent-text);
}
:is(.site-linen,.surf--sand,.closing,.topbar,.mmenu,.tmr-dialog){
 --accent-text:var(--accent-earth);--accent-line:var(--accent-earth);--copper:var(--accent-text);
}
.site-earth{--accent-text:var(--linen);--accent-line:var(--linen);--copper:var(--linen)}
/* Local contrast-aware colour, not orange terms scattered through prose. */
:is(.site-page,.home-dark-field) .num,
:is(.opening,.site-page,.home-dark-field) .label,
.site-page .anchor-light .role,
.site-page .scan-line,
.proof-row .num,.proof-item strong{color:var(--accent-text)}
[data-secondary-v8] :is(.site-linen,.site-ink) :is(.num,.scan-line){color:var(--accent-text)}
.copy-emphasis{font-weight:600}
p>.copy-emphasis:first-of-type{color:var(--accent-text)}
.site-earth p>.copy-emphasis:first-of-type{color:var(--linen)}
.home-dark-field .railed{border-left-color:var(--accent-line)}
[data-secondary-v8] .process-v8 .stance-line,.boundary{border-left-color:var(--accent-line)}
[data-secondary-v6] .story-beat:last-child .story-point{color:var(--accent-text)}
[data-secondary-v6] .secondary-loop-bindu,.diagram .b{fill:var(--accent-text)}
.training-prices .price-value{color:var(--accent-earth)}
.collaboration-faq details[open] summary{color:var(--accent-earth)}
.tmr{--tmr-link:var(--accent-earth-light)}
.tmr-quote-mark{color:var(--accent-earth-light)}
.tmr-read,.tmr-arrow:hover:not([aria-disabled="true"]){color:var(--tmr-link)}
.tmr-read:hover{color:var(--linen)}
.tmr button:focus-visible,.tmr-dialog button:focus-visible,:focus-visible{outline-color:var(--accent-text)}
.topnav a[aria-current="page"],.lang [aria-current="true"]{color:var(--accent-earth);border-bottom-color:var(--accent-earth)}
.go:hover,.centry:hover,.icon-link:hover,.mailto:hover{border-color:var(--accent-text)}
.site-ink .go:hover,.home-dark-field .go:hover{color:var(--accent-earth-light);border-color:var(--accent-earth-light)}
::selection{background:var(--accent-earth);color:var(--linen)}
/* Header alone is full bleed. Reading columns retain their approved max width. */
.topbar>.row.wrap{width:100%;max-width:none;margin-inline:0;padding-left:var(--nav-gutter);padding-right:var(--nav-gutter)}
.mmenu>.wrap{max-width:none;padding-inline:var(--nav-gutter)}
@media(max-width:380px){.topbar .brand-wordmark.wm{width:91px}.topbar .centry{padding-inline:7px}.topbar .row{column-gap:7px}}
/* Exactly the Home silhouette, at the Home vertical scale rather than a magnified thin edge crop. */
[data-secondary-v8] .hero-end-v913,
[data-secondary-v8] .about-hero-foreground-v912b,
[data-collaboration-v99] .collaboration-needs-v99 .collaboration-linen-lip{
 height:var(--hero-paper-height);
 -webkit-mask-image:url('/media/refine-v9-14/home-paper-top.png');mask-image:url('/media/refine-v9-14/home-paper-top.png');
 -webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
 background-color:var(--sandstone);background-image:var(--tex-sand);background-repeat:repeat;background-size:768px 768px;
 transform:none;
}
/* New supplied Collaboration mask. At bottom: .273 + .727 * .3125 = .500, centred on the viewport. */
@media(min-width:900px){
 [data-collaboration-v99] .collaboration-earth-stage .v8-art--desktop{
  display:block;width:72.7273%;height:100%;left:auto;right:0;top:0;bottom:0;
  -webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-position:right top;mask-position:right top;
 }
 [data-secondary-v8] .about-hero-v912b .about-hero-mineral-v912b{
  width:94%;height:100%;left:auto;right:-4%;top:0;bottom:0;
  -webkit-mask-size:100% 100%;mask-size:100% 100%;
 }
}
@media(max-width:899px){
 [data-collaboration-v99] .collaboration-earth-stage .v8-art--mobile{
  width:100%;height:calc(var(--hero-art-phone-v913) + 22px);top:auto;bottom:0;left:auto;right:0;
  -webkit-mask-size:100% 100%;mask-size:100% 100%;
 }
 [data-secondary-v8] .about-hero-v912b .about-hero-mineral-v912b{width:108%;right:0;left:auto}
}
/* Keep the complete toes above the flatter incoming paper. Move the whole photo,
   not its pixels or anatomy; scene dimensions and scale stay unchanged. */
@media(min-width:900px){[data-secondary-v8] .practice-rock-photo{bottom:30px}}
@media(max-width:899px){[data-secondary-v8] .practice-rock-photo{transform:translateY(-20px)}}
/* One unit and pigment for every decorative terrain stroke. Inline SVG prevents image-box stretching
   from changing optical weight. The existing curves are kept; only placement/angle changes. */
.terrain-art{display:block;max-width:none;color:var(--accent-line);pointer-events:none}
.terrain-art path{stroke-width:var(--terrain-stroke)}
.terrain-current.terrain-art{
 width:142vw;height:auto;aspect-ratio:1983/793;left:55%;top:calc(var(--hero-edge-h) + 20px);
 transform:translate(-50%,-50%) rotate(-12deg);opacity:1;filter:none;
}
.terrain-window{--terrain-body-h:225px}
@media(min-width:800px){.who{padding-top:clamp(185px,15vw,220px);padding-bottom:clamp(40px,4vw,60px)}}
@media(min-width:800px) and (max-width:1099px){
 .terrain-current.terrain-art{width:150vw;left:53%;top:calc(var(--hero-edge-h) + 7px);transform:translate(-50%,-50%) rotate(-12deg)}
 .terrain-window{--terrain-body-h:205px}
}
@media(max-width:799px){
 .terrain-current.terrain-art{width:170vw;left:50%;top:calc(var(--hero-edge-h) + 23px);transform:translate(-50%,-50%) rotate(-12deg)}
 .terrain-window{--terrain-body-h:140px}
 .who{padding-top:clamp(132px,29vw,164px)}
}
[data-secondary-v8] .process-v8 .v8-terrain{max-width:none;margin:26px 0 0;height:clamp(68px,7.5vw,112px);overflow:hidden}
[data-secondary-v8] .v8-terrain .terrain-art{width:100%;height:100%}
[data-secondary-v8] .process-v8{padding-bottom:clamp(22px,2.5vw,36px)}
[data-secondary-v8] .between-v8{padding-top:clamp(24px,3vw,42px)}
[data-secondary-v8] .reflection-v8 .v8-terrain{height:clamp(36px,4vw,60px);margin-top:18px}
@media(max-width:599px){[data-secondary-v8] .process-v8 .v8-terrain{margin-top:22px;height:68px}}
/* New supplied apparatus keeps its own aspect ratio and true alpha; no colour plate behind it. */
[data-secondary-v8] .process-with-equipment>.process-equipment-v913{max-width:440px}
@media(max-width:899px){[data-secondary-v8] .process-with-equipment>.process-equipment-v913{width:min(100%,370px)}}
`;
export default REFINEMENT_CSS;
