import PREVIOUS_REFINEMENT_CSS from "./visual-v9-16";

/** V9.17: warm red-orange accents on Ashes only; Linen remains V9.16.
 * A real figcaption explains the existing central point without a fourth anchor. */
const UPDATE_CSS = String.raw`
:root{
 --accent-on-ink:#EF966B;
 --accent-copper-on-ink:#C87850;
}
/* Existing dark-theme selectors resolve the two pigments through these variables.
   Never override --accent-earth or the material textures. */
:is(.site-ink,.home-dark-field,.band--dark){
 --accent-text:var(--accent-on-ink);
 --accent-line:var(--accent-copper-on-ink);
 --copper:var(--accent-copper-on-ink);
 --enso-centre:var(--accent-copper-on-ink);
}
/* Keep the diagram's square coordinate plane separate from its caption.
   Both mask and raster paths, including failure states, use the same geometry. */
.enso-anchors{aspect-ratio:auto;container-type:inline-size}
.enso-anchors__drawing{position:relative;width:100%;aspect-ratio:1;isolation:isolate}
.enso-anchors__legend{
 display:flex;align-items:center;justify-content:center;gap:10px;
 width:100%;margin-top:-4.5cqw;color:var(--linen);font-family:var(--ff-body);
 font-size:14px;font-weight:400;line-height:1.5;letter-spacing:.015em;
}
.enso-anchors__legend-dot{
 display:block;flex:none;width:10px;width:2.3126cqw;aspect-ratio:1;
 border-radius:50%;background:var(--enso-centre);
}
.enso-anchors__legend-separator{display:block;width:12px;height:1px;background:currentColor;opacity:.65;flex:none}
@media(max-width:599px){.enso-anchors__legend{font-size:13px;gap:9px}}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
