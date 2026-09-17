import PREVIOUS_REFINEMENT_CSS from "./visual-v9-21";

/** V9.22: revert the whole-plane V9.21 Home mask movement.
 * Retain V9.20 placement and V9.21 compact booking section.
 * Only the lower masked edge retreats behind the unchanged sleeve. */
const UPDATE_CSS = String.raw`
@media(min-width:900px){
 .opening.has-portrait .portrait-monolith{
  -webkit-mask-image:url('/media/refine-v9-22/home-mask-sleeve-alpha.png');
  mask-image:url('/media/refine-v9-22/home-mask-sleeve-alpha.png');
 }
}
/* On wider screens the portrait has a fixed maximum width. Only the hidden
   tail needs extra clearance; the visible upper 74% stays exactly V9.20. */
@media(min-width:1600px), (min-width:1200px) and (min-aspect-ratio:37/20){
 .opening.has-portrait .portrait-monolith{
  -webkit-mask-image:url('/media/refine-v9-22/home-mask-sleeve-wide-alpha.png');
  mask-image:url('/media/refine-v9-22/home-mask-sleeve-wide-alpha.png');
 }
}
@media(min-width:2200px), (min-width:1200px) and (min-aspect-ratio:23/10){
 .opening.has-portrait .portrait-monolith{
  -webkit-mask-image:url('/media/refine-v9-22/home-mask-sleeve-ultrawide-alpha.png');
  mask-image:url('/media/refine-v9-22/home-mask-sleeve-ultrawide-alpha.png');
 }
}
@media(min-width:2800px), (min-width:1200px) and (min-aspect-ratio:3/1){
 .opening.has-portrait .portrait-monolith{
  -webkit-mask-image:url('/media/refine-v9-22/home-mask-sleeve-panoramic-alpha.png');
  mask-image:url('/media/refine-v9-22/home-mask-sleeve-panoramic-alpha.png');
 }
}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
