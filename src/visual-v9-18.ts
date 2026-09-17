import PREVIOUS_REFINEMENT_CSS from "./visual-v9-17";

/** V9.18: editorial hierarchy and evidence-based education summary only.
 * No hero geometry, artwork, accent palette, pricing or testimonial changes.
 */
const UPDATE_CSS = String.raw`
/* Heading is its own row. The premise and explanation share a second row. */
[data-secondary-v8] .reflection-v918 .reflection-heading{
 margin:0 0 clamp(26px,3vw,38px);max-width:100%;font-size:clamp(36px,4.2vw,52px);line-height:1.08;
}
[data-secondary-v8] .reflection-v918 .reflection-columns-v918{
 display:grid;grid-template-columns:minmax(0,1fr);gap:20px;align-items:start;
}
[data-secondary-v8] .reflection-v918 .reflection-lead{
 margin:0;font-family:var(--ff-display);font-size:clamp(25px,2.3vw,30px);
 font-weight:400;line-height:1.38;color:var(--text);max-width:23em;
}
[data-secondary-v8] .reflection-v918 .reflection-body{
 margin:0;max-width:38em;font-size:16.5px;line-height:1.8;
}
@media(min-width:900px){
 [data-secondary-v8] .reflection-v918 .reflection-columns-v918{
  grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);column-gap:clamp(48px,6vw,86px);align-items:first baseline;
 }
}
/* One full-width divider, one sentence centred beneath it, never right-column aligned. */
[data-secondary-v8] .meaning-grid .meaning-closing{
 grid-column:1 / -1;justify-self:stretch;width:100%;max-width:none;margin:0;
 text-align:center;text-wrap:balance;padding-top:clamp(26px,3.4vw,40px);
}
/* Explicit grid rows put the two introductions beside their headings, not the eyebrow. */
[data-secondary-v8] .about-section-head-v918{row-gap:12px}
[data-secondary-v8] .about-section-head-v918 > .label{grid-column:1 / -1;margin:0}
[data-secondary-v8] .about-section-head-v918 > .h2{margin:0}
[data-secondary-v8] .about-section-head-v918 > .page-intro{margin:0;justify-self:stretch;max-width:none}
@media(min-width:900px){
 [data-secondary-v8] .about-section-head-v918 > .h2{grid-column:1;grid-row:2;align-self:first baseline}
 [data-secondary-v8] .about-section-head-v918 > .page-intro{grid-column:2;grid-row:2;align-self:first baseline}
}
/* Credential wording is not an endorsement colour. Both named qualifications have identical styling. */
[data-secondary-v8] .education-list .education-credential-value{color:var(--text);font-weight:400}
/* The broad label separates professional qualifications from courses and psychology studies. */
[data-secondary-v8] .about-proof-v918 .proof-item{min-width:0}
[data-secondary-v8] .about-proof-v918 .proof-item span{line-height:1.65}
[data-secondary-v8] .about-proof-v918 .proof-credentials{color:var(--text);font-weight:500}
[data-secondary-v8] .about-proof-v918 .proof-study{max-width:42em;margin-top:5px}
@media(min-width:720px){
 [data-secondary-v8] .about-proof-v918{grid-template-columns:minmax(0,.8fr) minmax(0,.6fr) minmax(0,1.8fr)}
}
@media(max-width:719px){
 [data-secondary-v8] .about-proof-v918{grid-template-columns:1fr 1fr}
 [data-secondary-v8] .about-proof-v918 .proof-item{padding:16px 0;border-right:0}
 [data-secondary-v8] .about-proof-v918 .proof-item:first-child{border-right:1px solid var(--rule);padding-right:18px}
 [data-secondary-v8] .about-proof-v918 .proof-item:nth-child(2){padding-left:18px}
 [data-secondary-v8] .about-proof-v918 .proof-item--education{grid-column:1 / -1}
}
@media(max-width:599px){
 [data-secondary-v8] .reflection-v918 .reflection-body{font-size:16px;line-height:1.78}
}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
