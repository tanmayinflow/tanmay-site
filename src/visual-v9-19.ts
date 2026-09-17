import PREVIOUS_REFINEMENT_CSS from "./visual-v9-18";

/** V9.19: scoped editorial rhythm, moved (not duplicated) professional strip,
 * and the supplied three-arrow cycle. No pigment, portrait or hero-size changes. */
const UPDATE_CSS = String.raw`
/* Body chapters are content-driven, not viewport-height slides. */
[data-secondary-v8] .about-approach-section-v919{padding-bottom:clamp(32px,4.45vw,64px)}
[data-secondary-v8] .about-education-v919{padding-top:clamp(34px,4.17vw,60px);padding-bottom:clamp(40px,4.45vw,64px)}
/* The original hero exit stays on the same page coordinate; the summary follows it. */
[data-collaboration-v99] .collaboration-proof-v919{position:relative;z-index:2;padding:1px 0 0;overflow:visible}
[data-collaboration-v99] .collaboration-proof-v919 .collaboration-linen-lip{
 height:var(--hero-paper-height);
 -webkit-mask-image:url('/media/refine-v9-14/home-paper-top.png');mask-image:url('/media/refine-v9-14/home-paper-top.png');
 -webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
 background-color:var(--sandstone);background-image:var(--tex-sand);background-size:768px 768px;
 background-repeat:repeat;transform:none;
}
[data-collaboration-v99] .collaboration-proof-v919 .proof-row{margin-top:0;padding-top:18px}
[data-collaboration-v99] #zkusenost .section-head{margin-bottom:0}
[data-collaboration-v99] .collaboration-needs-v99{padding-top:clamp(38px,4vw,56px)}
/* A compact visual row immediately beneath the app paragraph, aligned toward the right-hand text. */
[data-secondary-v8] .between-v919 .between-visual-row-v919{
 display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:16px;margin-top:18px;min-width:0;
}
[data-secondary-v8] .between-v919 .between-visual-row-v919>.scan-line{margin:0;padding-top:7px;line-height:1.7}
[data-secondary-v8] .collaboration-cycle-v919{width:150px;max-width:100%;margin:0;line-height:0;justify-self:end}
[data-secondary-v8] .collaboration-cycle-v919 img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}
[data-secondary-v8] .between-visual-row-v919:not(:has(.collaboration-cycle-v919)){grid-template-columns:1fr}
@media(min-width:900px) and (max-width:1099px){
 [data-secondary-v8] .collaboration-cycle-v919{width:130px}
 [data-secondary-v8] .between-v919 .between-visual-row-v919{gap:12px}
 [data-secondary-v8] .between-v919 .between-visual-row-v919>.scan-line{font-size:13px;letter-spacing:.1em}
}
@media(max-width:899px){
 [data-secondary-v8] .between-v919 .between-grid{gap:28px}
 [data-secondary-v8] .between-v919 .between-visual-row-v919{max-width:460px;margin-left:auto;width:100%}
 [data-collaboration-v99] .collaboration-proof-v919 .proof-row{padding-top:12px}
}
@media(max-width:599px){
 [data-secondary-v8] .collaboration-cycle-v919{width:120px}
 [data-secondary-v8] .between-v919 .between-visual-row-v919{gap:12px;margin-top:16px}
 [data-secondary-v8] .between-v919 .between-visual-row-v919>.scan-line{font-size:13px;letter-spacing:.08em;max-width:12em}
}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
