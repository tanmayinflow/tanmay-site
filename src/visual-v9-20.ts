import PREVIOUS_REFINEMENT_CSS from "./visual-v9-19";

/** V9.20: owner-requested Home mask, explicit credential emphasis, edge-aligned footer.
 * All photographs, body-copy palette, terrain strokes and other hero scenes are preserved. */
const UPDATE_CSS = String.raw`
/* These are qualifications, not colour accents; all carry the same light, firm weight. */
.home-dark-field .home-credentials-v920 .copy-emphasis,
.home-dark-field .home-credentials-v920 > .copy-emphasis:first-of-type{color:var(--linen);font-weight:700}
/* One clear onward path from the practical workflow to the approach. */
[data-secondary-v8] .collaboration-practice-link-v920{display:flex;justify-content:flex-end;margin-top:18px}
[data-secondary-v8] .collaboration-practice-link-v920 .go{min-height:40px;display:inline-flex;align-items:center}
/* The same original eroded contour, sheared into a diagonal alpha plane.
   Texture is not skewed: it stays on the original untransformed material layer. */
@media(min-width:900px){
 .opening.has-portrait .portrait-monolith{
  width:100vw;height:100%;inset:0 0 0 auto;transform:none;
  -webkit-mask-image:url('/media/refine-v9-20/home-diagonal-alpha.png');mask-image:url('/media/refine-v9-20/home-diagonal-alpha.png');
  -webkit-mask-size:100% 100%;mask-size:100% 100%;
 }
 .opening.has-portrait .portrait-shoulder{display:none}
 .opening.has-portrait .portrait-cut{transform:scale(1.02);transform-origin:right bottom}
}
@media(max-width:899px){
 .opening.has-portrait .portrait-monolith{
  width:140%;height:116%;right:0;left:auto;top:-4%;bottom:auto;transform:none;
  -webkit-mask-image:url('/media/refine-v9-20/home-diagonal-mobile-alpha.png');mask-image:url('/media/refine-v9-20/home-diagonal-mobile-alpha.png');
  -webkit-mask-size:100% 100%;mask-size:100% 100%;
 }
 .opening.has-portrait .portrait-cut{transform:scale(1.02);transform-origin:right bottom}
}
/* Full-bleed footer has equal side columns, so social icons stay at the viewport centre,
   independent of the differing widths of the brand links and copyright. */
footer.footer-v920>.wrap{max-width:none;width:100%;margin-inline:0;padding-inline:var(--nav-gutter)}
footer.footer-v920 .frow{
 display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:16px 24px;
 align-items:center;justify-content:initial;
}
footer.footer-v920 .footer-start-v920{display:flex;gap:18px;align-items:center;min-width:0;justify-self:start}
footer.footer-v920 .footer-brand-v920{display:inline-flex;align-items:center;flex:0 0 auto;min-height:40px}
footer.footer-v920 .flinks{gap:8px 16px;flex-wrap:nowrap;min-width:0}
footer.footer-v920 .flinks a{min-height:40px;display:inline-flex;align-items:center;white-space:nowrap}
footer.footer-v920 .socials{justify-self:center;margin:0;gap:9px}
footer.footer-v920 .fmeta{justify-self:end;text-align:right;line-height:1.6;width:auto;order:initial;max-width:100%}
@media(min-width:600px) and (max-width:979px){
 footer.footer-v920 .frow{column-gap:16px}
 footer.footer-v920 .footer-start-v920{flex-wrap:wrap;gap:0 12px}
 footer.footer-v920 .flinks{flex-wrap:wrap;gap:0 12px}
 footer.footer-v920 .fmeta{max-width:24em;font-size:11px}
}
@media(max-width:599px){
 footer.footer-v920 .frow{grid-template-columns:minmax(0,1fr);gap:10px}
 footer.footer-v920 .footer-start-v920{width:100%;gap:10px;flex-wrap:wrap}
 footer.footer-v920 .flinks{gap:0 14px}
 footer.footer-v920 .brand-wordmark.wm{width:86px}
 footer.footer-v920 .socials{justify-self:center}
 footer.footer-v920 .fmeta{justify-self:end;font-size:10.5px}
}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
