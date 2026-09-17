import PREVIOUS_REFINEMENT_CSS from "./visual-v9-20";

/** V9.21 contact refinement retained. Home mask movement was reverted at the owner’s request in V9.22.
 * Portrait pixels, scale, position, all copy, other pages and footer stay unchanged.
 */
const UPDATE_CSS = String.raw`
/* The dash was a decorative pseudo-element, not part of any sentence.
   Scope all spacing changes to this Home contact section, never the collaboration steps. */
.home-booking{padding-block:clamp(34px,4.2vw,60px)}
.home-booking .booking-inner{max-width:760px}
.home-booking .booking-kicker{display:block;margin-inline:auto}
.home-booking .booking-kicker::before{content:none;display:none}
.home-booking .booking-inner .h2{margin-top:18px}
.home-booking .booking-lead{margin-top:18px;max-width:42em}
.home-booking .booking-actions{margin-top:28px}
@media(max-width:620px){
 .home-booking{padding-block:30px}
 .home-booking .booking-inner .h2{margin-top:14px}
 .home-booking .booking-lead{margin-top:16px}
 .home-booking .booking-actions{margin-top:24px}
}
`;
export default PREVIOUS_REFINEMENT_CSS + UPDATE_CSS;
