import PREVIOUS_REFINEMENT_CSS from "./visual-v9-15";

/** V9.16: only the four requested refinements. Keep V9.15 surfaces and terrain geometry. */
const UPDATE_CSS = String.raw`
:root{
 --accent-on-ink:#E29C54;
 --accent-copper-on-ink:#B87333;
}
/* The original saturated Copper returns to decorative strokes. Small text uses a brighter
   copper of the same family rather than the pale V9.15 beige. Linen's #743627 is untouched. */
:is(.site-ink,.home-dark-field,.band--dark){
 --accent-text:var(--accent-on-ink);
 --accent-line:var(--accent-copper-on-ink);
 --copper:var(--accent-copper-on-ink);
 --enso-centre:var(--accent-copper-on-ink);
}
:is(.site-ink,.home-dark-field,.band--dark) .tmr-quote-mark{color:var(--accent-copper-on-ink)}
:is(.site-ink,.home-dark-field,.band--dark) .story-point{color:var(--accent-copper-on-ink)}
:is(.site-ink,.home-dark-field,.band--dark) .meaning-path{color:var(--accent-on-ink)}
/* Portrait-only transformation. Keep the scene, text, mask and lower transition fixed.
   Bottom-centre origin keeps feet above the approved incoming Linen edge. */
@media(min-width:900px){
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout img{
  transform:translateX(16px) scale(1.035);transform-origin:50% 100%;
 }
}
@media(min-width:600px) and (max-width:899px){
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout img{
  transform:translateX(8px) scale(1.035);transform-origin:50% 100%;
 }
}
@media(max-width:599px){
 [data-secondary-v8] .collaboration-hero-v8 .collaboration-hero-cutout img{
  transform:translateX(4px) scale(1.03);transform-origin:50% 100%;
 }
}
/* A short sign-off with an attached organic underline. No full-section landscape stripe. */
[data-secondary-v8] .reflection-v8 .reflection-closing{line-height:1.35}
.reflection-statement{display:inline-block;width:fit-content;max-width:100%;vertical-align:top;white-space:normal}
.reflection-statement__text{white-space:normal}
.reflection-statement__underline{
 display:block;width:var(--reflection-text-width,100%);max-width:100%;
 height:clamp(7px,.7vw,10px);margin-top:2px;line-height:0;pointer-events:none;
}
.reflection-statement__underline .terrain-art{display:block;width:100%;height:100%;color:var(--accent-earth)}
.reflection-statement__underline .terrain-art path{stroke-width:1.6px}
/* Etymology is still a supporting caption, now comfortably readable below the artwork. */
.meaning-grid .etymology{
 font-size:14px;font-weight:500;line-height:1.9;letter-spacing:.09em;
 color:var(--linen);margin-top:24px;
}
.meaning-grid .etymology-term{font-weight:500;color:var(--accent-on-ink)}
@media(max-width:599px){.meaning-grid .etymology{font-size:13.5px;letter-spacing:.08em}}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
