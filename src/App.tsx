/**
 * tanmaypractice.com · hlavní web
 * ----------------------------------------------------------------------
 * Single-file React/Vite. Stejný vzor jako klientská aplikace:
 * module-level LANG + L(cs, en), žádné externí knihovny.
 *
 * Autorita: Context/Brand/Canonical/ (Brand Book V2, Brand Strategy V2,
 * překladový glosář CZ, type spec V2, brand tokens V2).
 *
 * Vizuální zásady, které tenhle soubor drží:
 *   - Hlavní plocha je Linen. Forest Night jen ve dvou pásech na celém webu.
 *   - Jedno měděné gesto na kompozici. Copper nikdy nenese drobný text.
 *   - Žádné přechody, žádná záře, žádné vlnovky, žádné dekorativní křivky.
 *   - Jeden organický okraj na celém webu, a ten vychází ze skutečné masky.
 *   - Obraz je důkaz. Když soubor chybí, prvek zmizí. Nikdy nezůstane prázdný rám.
 * ----------------------------------------------------------------------
 */
import { useState, useEffect, useRef, useCallback } from "react";

// ----------------------------------------------------------------------
// LANGUAGE · CZ / EN
// ----------------------------------------------------------------------
let LANG = "cs";

const detectLang = () => {
  try {
    const saved = window.localStorage.getItem("tm-lang");
    if (saved === "cs" || saved === "en") return saved;
    const nav = (navigator.language || "cs").toLowerCase();
    return nav.startsWith("cs") || nav.startsWith("sk") ? "cs" : "en";
  } catch (e) {
    return "cs";
  }
};

/** Sazba: nezlomitelná mezera po jednopísmenných předložkách a spojkách. */
const nbsp = (s: string) =>
  s.replace(/(^|[\s\u00A0(„"])([ksvzouaiKSVZOUAI])[ \t]+/g, "$1$2\u00A0")
   .replace(/(^|[\s\u00A0(„"])([ksvzouaiKSVZOUAI])[ \t]+/g, "$1$2\u00A0");

const L = (cs: string, en: string) => (LANG === "cs" ? nbsp(cs) : en);

// ----------------------------------------------------------------------
// ROUTER · hash (#/praxe …)
// ----------------------------------------------------------------------
const PAGES = ["praxe", "pribeh", "spoluprace", "denik"];

/** Staré adresy zůstávají funkční. Web je živý, odkazy se nesmí rozbít. */
const ALIASES: Record<string, string> = {
  udalosti: "spoluprace",
  kontakt: "spoluprace",
  zapisky: "denik",
  poezie: "pribeh",
};

const parseRoute = () => {
  try {
    const m = (window.location.hash || "").match(/^#\/([a-z]+)/);
    if (m) {
      if (PAGES.indexOf(m[1]) !== -1) return m[1];
      if (ALIASES[m[1]]) return ALIASES[m[1]];
    }
  } catch (e) {}
  return "home";
};

// ----------------------------------------------------------------------
// MEDIA · skutečné soubory. Chybějící soubor prvek nezobrazí.
// Kontrakt každého souboru je ve VISUAL-ASSET-PLAN.md.
// ----------------------------------------------------------------------
const MEDIA = {
  portrait: "/media/portrait-tanmay.jpg",
  portraitWide: "/media/portrait-tanmay-wide.jpg",
  handstand: "/media/practice-handstand-trunk.jpg",
  sitting: "/media/practice-sitting-pine.jpg",
  forest: "/media/practice-walking-forest.jpg",
  matPoster: "/media/mat-unroll-poster.jpg",
  matVideo: "/media/mat-unroll.mp4",
  edgeMask: "/media/edge-linen-torn.png",
  texCotton: "/media/surface-forest-cotton.png",
};

// ----------------------------------------------------------------------
// CSS
// ----------------------------------------------------------------------
const CSS = `
:root{
  /* Brand V2 · schválené hodnoty */
  --forest:#1C1C1A;
  --linen:#F4F0EB;
  --copper:#B87333;
  --sage:#7C8C6E;
  --sand:#C5B49A;

  /* Tónová škála povrchu. Odvozená z Forest Night a Linen.
     Není to nová barva, je to produktová škála (type spec V2 §povrchy). */
  --text:#1C1C1A;
  --text-2:rgba(28,28,26,.74);
  --text-3:rgba(28,28,26,.70);
  --rule:rgba(28,28,26,.15);
  --rule-2:rgba(28,28,26,.30);
  --on-dark:#F4F0EB;
  --on-dark-2:rgba(244,240,235,.78);
  --on-dark-3:rgba(244,240,235,.55);
  --rule-dark:rgba(244,240,235,.18);

  --ff-display:'Cormorant Garamond',Georgia,serif;
  --ff-logo:'Cormorant Garamond',Georgia,serif;
  --ff-body:'DM Sans',system-ui,sans-serif;
  --ff-meta:'Barlow Condensed',sans-serif;

  --maxw:1120px;
  --measure:33em;
  --track:.18em;

  --edge:url("${MEDIA.edgeMask}");
  --tex-cotton:url("${MEDIA.texCotton}");
}

/* České vydání: EB Garamond nese diakritiku tiše. Logo zůstává Cormorant. */
html[lang="cs"]{ --ff-display:'EB Garamond',Georgia,serif; --track:.10em; }

*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth; -webkit-text-size-adjust:100%}
body{
  font-family:var(--ff-body);
  background:var(--linen);
  color:var(--text);
  font-size:17px;
  line-height:1.75;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
img,video{display:block; max-width:100%; height:auto}
a{color:inherit; text-decoration:none}
button{font:inherit; color:inherit; background:none; border:none; cursor:pointer}
::selection{background:var(--copper); color:var(--forest)}

/* fokus · viditelný všude, měděný, nikdy neodstraněný */
:focus-visible{ outline:2px solid var(--copper); outline-offset:3px; border-radius:2px }
.band--dark :focus-visible{ outline-color:var(--sand) }

.skip{
  position:absolute; left:-9999px; top:0; z-index:2000;
  background:var(--forest); color:var(--linen); padding:12px 20px;
  font-family:var(--ff-meta); letter-spacing:.14em; text-transform:uppercase; font-size:13px;
}
.skip:focus{ left:0 }

/* ---------- layout ---------- */
.wrap{ max-width:var(--maxw); margin:0 auto; padding:0 clamp(22px,5vw,56px) }
.wrap.limit, .wrap.limit--wide{ max-width:var(--maxw) }
.wrap.limit > *{ max-width:640px }
.wrap.limit--wide > *{ max-width:760px }
.sec{ padding:clamp(64px,9vw,120px) 0 }
.sec--tight{ padding:clamp(44px,6vw,76px) 0 }
.prose{ max-width:var(--measure) }
.prose p + p{ margin-top:1.15em }
.center{ text-align:center }

.band--dark{
  background-color:var(--forest);
  color:var(--on-dark);
  background-repeat:repeat;
  background-size:520px 520px;
}
html[data-surface="on"] .band--dark{ background-image:var(--tex-cotton) }
.band--dark .h-display{ color:var(--on-dark) }
.band--dark .body-txt{ color:var(--on-dark-2) }
.band--dark .label{ color:var(--sand) }
.band--dark .rule{ background:var(--rule-dark) }

.rule{ height:1px; background:var(--rule); border:0 }
.rule--copper{ width:40px; height:1px; background:var(--copper) }

/* ---------- type ---------- */
.label{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12.5px; line-height:1.4; color:var(--text-2);
}
.label--sand{ color:var(--sand) }
.num{
  font-family:var(--ff-meta); font-weight:400; letter-spacing:.16em;
  font-size:12.5px; color:var(--text-3);
}
.h-display{ font-family:var(--ff-display); font-weight:400; line-height:1.1; color:var(--text); text-wrap:balance }
.h1{ font-size:clamp(2.3rem,5.6vw,3.9rem) }
.h2{ font-size:clamp(1.75rem,3.4vw,2.5rem) }
.h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.3rem,2.3vw,1.7rem); line-height:1.2 }
.lead{
  font-family:var(--ff-display); font-weight:400;
  font-size:clamp(1.2rem,2.3vw,1.55rem); line-height:1.5; color:var(--text);
  max-width:26em; text-wrap:pretty;
}
.body-txt{ font-size:16.5px; line-height:1.8; color:var(--text-2); max-width:var(--measure) }
.small{ font-size:14.5px; line-height:1.7; color:var(--text-2) }
.quote{
  font-family:var(--ff-display); font-style:italic; font-weight:400;
  font-size:clamp(1.15rem,2.2vw,1.45rem); line-height:1.6; color:var(--text);
}

/* jediné měděné gesto na kompozici · nikdy nenese drobný text */
.bindu{ display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--copper) }

/* ---------- odkaz dál ---------- */
.go{
  display:inline-flex; align-items:baseline; gap:.6em;
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:13px; color:var(--text);
  padding-bottom:6px; border-bottom:1px solid var(--rule-2);
  transition:border-color .3s ease, color .3s ease;
}
.go:hover{ border-color:var(--copper) }
.go .arw{ transition:transform .3s ease; color:inherit }
.go:hover .arw{ transform:translateX(5px) }
.band--dark .go{ color:var(--on-dark); border-color:var(--rule-dark) }
.band--dark .go:hover{ border-color:var(--sand) }
.band--dark .go .arw{ color:inherit }

.mailto{
  font-family:var(--ff-display); font-size:clamp(1.15rem,2.6vw,1.6rem);
  border-bottom:1px solid var(--rule-2); padding-bottom:3px;
  transition:border-color .3s ease;
}
.mailto:hover{ border-color:var(--copper) }
.band--dark .mailto{ border-color:var(--rule-dark) }
.band--dark .mailto:hover{ border-color:var(--sand) }

/* ---------- wordmark ---------- */
.wm{ font-family:var(--ff-logo); font-weight:300; letter-spacing:.14em; position:relative; display:inline-block; white-space:nowrap }
.wm .a1{ position:relative }
.wm .a1 i{
  position:absolute; left:50%; transform:translateX(-50%); top:-.40em;
  width:.15em; height:.15em; border-radius:50%; background:var(--copper);
}

/* ---------- topbar ---------- */
.topbar{
  position:sticky; top:0; z-index:900;
  background:var(--linen);
  border-bottom:1px solid transparent;
  transition:border-color .3s ease;
}
.topbar[data-scrolled="1"]{ border-bottom-color:var(--rule) }
.topbar .row{ display:flex; align-items:center; gap:clamp(14px,2.4vw,30px); padding-top:16px; padding-bottom:16px }
.topbar .logo{ font-size:22px; line-height:1; display:inline-flex; align-items:center; min-height:26px }
.topnav{ display:flex; gap:clamp(14px,2.2vw,28px); margin-left:auto }
.topnav a{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12.5px; color:var(--text-2);
  padding:4px 0; border-bottom:1px solid transparent; transition:color .3s, border-color .3s;
}
.topnav a:hover{ color:var(--text) }
.topnav a[aria-current="page"]{ color:var(--text); border-bottom-color:var(--copper) }
.topbar .end{ display:flex; align-items:center; gap:14px; margin-left:auto }
.topnav + .end{ margin-left:clamp(14px,2.4vw,30px) }
.lang{ display:flex; align-items:center; gap:6px; font-family:var(--ff-meta); font-size:12.5px; letter-spacing:.14em }
.lang button{ color:var(--text-3); padding:4px 2px; transition:color .3s }
.lang button:hover{ color:var(--text) }
.lang button[aria-pressed="true"]{ color:var(--text); border-bottom:1px solid var(--copper) }
.lang .sep{ color:var(--text-3) }
.burger{ display:none; padding:10px 0 10px 10px }
.burger b{ display:block; width:24px; height:1.5px; background:var(--text); margin:6px 0; transition:transform .3s ease, opacity .2s ease }
.burger[aria-expanded="true"] b:nth-child(1){ transform:translateY(7.5px) rotate(45deg) }
.burger[aria-expanded="true"] b:nth-child(2){ opacity:0 }
.burger[aria-expanded="true"] b:nth-child(3){ transform:translateY(-7.5px) rotate(-45deg) }
@media (max-width:860px){
  .topnav{ display:none }
  .burger{ display:block }
}

/* ---------- menu ---------- */
.mmenu{ background:var(--linen); border-bottom:1px solid var(--rule) }
.mmenu[hidden]{ display:none }
.mmenu ul{ list-style:none; padding:8px 0 28px }
.mmenu li{ border-top:1px solid var(--rule) }
.mmenu li:first-child{ border-top:0 }
.mmenu a{ display:flex; align-items:baseline; gap:16px; padding:16px 0; font-family:var(--ff-display); font-size:1.45rem }
.mmenu .num{ min-width:2.2em }
.mmenu .extra{ display:flex; flex-wrap:wrap; gap:22px; padding-top:20px; border-top:1px solid var(--rule) }
.mmenu .extra a{ font-family:var(--ff-meta); font-size:12.5px; text-transform:uppercase; letter-spacing:var(--track); color:var(--text-2); padding:6px 0 }

/* ---------- první obrazovka ---------- */
.opening{ padding:clamp(36px,6vw,72px) 0 clamp(30px,4.5vw,56px) }
.opening .grid{ display:grid; grid-template-columns:1fr; gap:clamp(32px,5vw,56px); align-items:start }
.opening .kicker{ display:flex; align-items:center; gap:12px; flex-wrap:wrap }
.opening .h1{ margin-top:clamp(20px,3vw,30px); max-width:11em }
.opening .body-txt{ margin-top:clamp(20px,2.6vw,26px) }
.opening .act{ margin-top:clamp(28px,3.6vw,38px) }
.opening .stance{ margin-top:clamp(30px,4vw,40px); font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-3) }
@media (min-width:880px){
  .opening.has-portrait .grid{ grid-template-columns:1fr .74fr; gap:clamp(40px,5vw,72px) }
}

/* portrét · jeden organický okraj na celém webu */
.portrait{ position:relative; justify-self:end; width:100%; max-width:440px }
@media (min-width:880px){ .opening.has-portrait .portrait{ margin-top:6px } }
.portrait img{
  width:100%; height:auto; object-fit:cover;
  aspect-ratio:4 / 5;
  object-position:50% 28%;
  filter:none;
}
html[data-edge="on"] .portrait img{
  -webkit-mask-image:var(--edge); mask-image:var(--edge);
  -webkit-mask-size:100% 100%; mask-size:100% 100%;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
}
@media (max-width:879px){
  .portrait{ justify-self:stretch; max-width:none; order:-1 }
  .portrait img{ aspect-ratio:auto; height:clamp(230px,40svh,400px); object-position:50% 26% }
}

/* ---------- dveře ---------- */
.doorsec{ padding-top:clamp(30px,4vw,50px) }
.doors{ list-style:none }
.doors li{ border-top:1px solid var(--rule) }
.doors li:last-child{ border-bottom:1px solid var(--rule) }
.door{ display:grid; grid-template-columns:3.4em 1fr auto; gap:clamp(14px,2.4vw,28px); align-items:baseline; padding:clamp(22px,3vw,32px) 0 }
.door .h3{ transition:color .3s ease }
.door .dline{ font-size:14.5px; color:var(--text-2); margin-top:6px }
.door .arw{ color:var(--text-2); align-self:center; transition:transform .3s ease }
.door:hover .h3{ text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px }
.door:hover .arw{ transform:translateX(6px) }
.doors li:hover{ border-top-color:var(--copper) }
@media (max-width:560px){
  .door{ grid-template-columns:1fr auto; gap:10px 16px }
  .door .num{ grid-column:1 / -1 }
}

/* ---------- hlavička místnosti ---------- */
.roomhead{ padding:clamp(36px,5vw,64px) 0 clamp(24px,3vw,36px) }
.roomhead + .sec{ padding-top:clamp(30px,4vw,52px) }
.roomhead .back{ display:inline-block; padding:5px 0; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.roomhead .back:hover{ color:var(--text) }
.roomhead .h1{ margin-top:clamp(22px,3vw,32px) }
.roomhead .lead{ margin-top:clamp(18px,2.4vw,26px) }

/* ---------- kotvy ---------- */
.anchors{ display:grid; gap:0; margin-top:clamp(30px,4vw,44px) }
.anchor{ padding:clamp(26px,3.4vw,38px) 0; border-top:1px solid var(--rule-dark) }
.anchor:first-child{ border-top:0 }
.anchor .top{ display:flex; align-items:baseline; gap:14px; flex-wrap:wrap }
.anchor .role{ font-family:var(--ff-display); font-style:italic; color:var(--sand); font-size:1.1rem }
.anchor .fn{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--on-dark-3) }
.anchor p{ color:var(--on-dark-2); font-size:16px; margin-top:12px; max-width:34em }
.anchor .forms{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:.10em; font-size:12.5px; color:var(--on-dark-3); margin-top:14px }
@media (min-width:860px){
  .anchor{ display:grid; grid-template-columns:14em 1fr; gap:clamp(20px,3vw,40px); align-items:start }
  .anchor .top{ flex-direction:column; gap:6px }
  .anchor p{ margin-top:0 }
}

/* diagram tří kotev */
.diagram{ display:block; width:min(280px,72vw); margin:clamp(34px,5vw,50px) auto 0 }
.diagram circle.c{ fill:none; stroke:var(--on-dark-3); stroke-width:1 }
.diagram .b{ fill:var(--copper) }
.diagram text{ font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:.10em; fill:var(--on-dark-2) }
.diagram text.p{ fill:var(--sand); letter-spacing:.16em }

/* ---------- seznam / definice ---------- */
.deflist{ list-style:none; margin-top:clamp(24px,3vw,34px) }
.deflist li{ padding:clamp(18px,2.4vw,26px) 0; border-top:1px solid var(--rule) }
.deflist li:first-child{ border-top:0; padding-top:0 }
.deflist h3{ font-family:var(--ff-display); font-weight:400; font-size:1.35rem; line-height:1.25 }
.deflist p{ font-size:15.5px; line-height:1.75; color:var(--text-2); margin-top:8px; max-width:36em }

/* ---------- příběh ---------- */
.beat{ padding:clamp(28px,4vw,44px) 0; border-top:1px solid var(--rule) }
.beat:first-of-type{ border-top:0 }
.beat .label{ color:var(--text-3) }
.beat .prose{ margin-top:14px }
.beat p{ font-size:16.5px; line-height:1.85; color:var(--text) }

/* ---------- události ---------- */
.events{ list-style:none; margin-top:clamp(26px,3.4vw,38px) }
.events li{ border-top:1px solid var(--rule); padding:clamp(22px,3vw,32px) 0 }
.events li:last-child{ border-bottom:1px solid var(--rule) }
.event{ display:grid; grid-template-columns:1fr; gap:10px }
.event .when{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.event .meta{ font-size:14px; color:var(--text-3); margin-top:4px }
.event p{ font-size:15.5px; color:var(--text-2); margin-top:10px; max-width:36em }
.event .state{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-2); display:inline-flex; align-items:center; gap:8px }
.event .state .bindu{ width:6px; height:6px }
.event .state[data-open="0"] .bindu{ background:var(--sage) }
@media (min-width:760px){
  .event{ grid-template-columns:13em 1fr 9.5em; gap:clamp(18px,3vw,36px); align-items:start }
  .event .state{ justify-self:end }
}

/* ---------- zápisy ---------- */
.posts{ list-style:none; margin-top:clamp(26px,3.4vw,38px) }
.posts li{ border-top:1px solid var(--rule) }
.posts li:last-child{ border-bottom:1px solid var(--rule) }
.post{ display:block; width:100%; text-align:left; padding:clamp(24px,3.2vw,34px) 0 }
.post .top{ display:flex; gap:14px; align-items:baseline; flex-wrap:wrap }
.post h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.35rem,2.4vw,1.75rem); line-height:1.2; margin-top:10px; transition:color .3s ease }
.post p{ font-size:15.5px; color:var(--text-2); margin-top:10px; max-width:38em }
.post .more{ display:inline-block; margin-top:16px; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.post:hover h3{ text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px }

/* čtečka */
.reader{ position:fixed; inset:0; z-index:1100; background:var(--linen); overflow-y:auto; overscroll-behavior:contain }
.reader[hidden]{ display:none }
.reader .rwrap{ max-width:660px; margin:0 auto; padding:clamp(76px,12vw,112px) clamp(22px,5vw,32px) clamp(72px,10vw,110px) }
.reader .close{
  position:fixed; top:18px; right:clamp(18px,5vw,32px); width:44px; height:44px;
  border:1px solid var(--rule-2); border-radius:50%; background:var(--linen);
  font-family:var(--ff-display); font-size:20px; line-height:1;
  display:flex; align-items:center; justify-content:center; transition:border-color .3s, color .3s;
}
.reader .close:hover{ border-color:var(--copper); color:var(--text) }
.reader h2{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.8rem,4.6vw,2.5rem); line-height:1.15; margin:16px 0 0 }
.reader .rbody p{ font-size:16.5px; line-height:1.9; margin-top:1.1em }
.reader .rbody p:first-child{ margin-top:clamp(26px,4vw,36px) }

/* ---------- obraz jako důkaz ---------- */
.figure{ margin-top:clamp(34px,5vw,54px) }
.figure img, .figure video{ width:100%; aspect-ratio:16 / 9; object-fit:cover }
.figure figcaption{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-3); margin-top:12px }
.figure--portraitish img{ aspect-ratio:4 / 5 }
@media (max-width:600px){
  .figure img, .figure video{ aspect-ratio:4 / 3 }
}

/* ---------- závěr ---------- */
.closing{ text-align:center }
.closing .wm{ font-size:clamp(42px,8vw,68px) }
.closing .mean{ font-family:var(--ff-display); font-style:italic; color:var(--sand); font-size:1.05rem; margin-top:16px }
.closing .stance{ font-family:var(--ff-display); font-size:clamp(1.7rem,4.6vw,2.8rem); line-height:1.2; margin-top:clamp(34px,5vw,48px) }
.compass{ margin-top:clamp(40px,6vw,60px) }
.compass .lines{ font-family:var(--ff-display); font-size:clamp(1.2rem,2.6vw,1.6rem); line-height:1.7; color:var(--on-dark); margin-top:16px }

/* ---------- patička ---------- */
footer{ background:var(--linen); padding:clamp(40px,6vw,64px) 0 clamp(34px,5vw,52px) }
footer .frow{ display:flex; flex-wrap:wrap; gap:18px 30px; align-items:baseline; justify-content:space-between; border-top:1px solid var(--rule); padding-top:clamp(26px,4vw,36px) }
footer .wm{ font-size:20px }
footer .frow > a{ display:inline-flex; align-items:center; min-height:26px }
footer .fmeta{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-3) }
footer .flinks{ display:flex; flex-wrap:wrap; gap:20px }
footer .flinks a{ display:inline-block; padding:6px 0; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-2) }
footer .flinks a:hover{ color:var(--text) }
footer .fnote{ font-size:13px; color:var(--text-3); margin-top:22px; max-width:40em }

/* ---------- pohyb ---------- */
.rv{ opacity:0; transform:translateY(16px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.65,.25,1) }
.rv.on{ opacity:1; transform:none }
.d1{ transition-delay:.08s } .d2{ transition-delay:.16s } .d3{ transition-delay:.24s }

@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto }
  .rv{ opacity:1; transform:none; transition:none }
  *,*::before,*::after{ animation-duration:.001ms !important; transition-duration:.001ms !important }
}

/* ---------- tisk ---------- */
@media print{
  .topbar,.mmenu,.reader,.skip{ display:none !important }
  body{ background:#fff; color:#000 }
  .band--dark{ background:#fff !important; color:#000 !important }
}
`;

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------
const MAIL = "tanmay.in.flow@gmail.com";
const APP_URL = "https://klient.tanmaypractice.com";
const IG_URL = "https://www.instagram.com/tanmayflow/";

const ROOMS = [
  {
    num: "01", page: "praxe", href: "#/praxe",
    cs: "Praxe", en: "The practice",
    lcs: "Co to je a pro koho.", len: "What it is and who it is for.",
  },
  {
    num: "02", page: "pribeh", href: "#/pribeh",
    cs: "Příběh", en: "The story",
    lcs: "Pád, sestup, návrat.", len: "The fall, the descent, the return.",
  },
  {
    num: "03", page: "spoluprace", href: "#/spoluprace",
    cs: "Spolupráce", en: "Work with me",
    lcs: "Jak se dá pracovat spolu.", len: "How we can work together.",
  },
  {
    num: "04", page: "denik", href: "#/denik",
    cs: "Deník praxe", en: "Practice log",
    lcs: "Praxe, jaká byla.", len: "The practice as it was.",
  },
];

/** Tři kotvy · Brand Book V2, strana 06 až 09. Text je kanonický. */
const ANCHORS = [
  {
    ncs: "Tělo", nen: "Body",
    rcs: "Brána", ren: "The gateway",
    fcs: "Přímý kontakt", fen: "Direct contact",
    pcs: "Práce začíná přímým kontaktem. Vjem, síla, pohyblivost, dech, únava i zotavení nesou informaci. Skrze pohyb se člověk učí přesněji rozlišovat mezi kapacitou, strachem, vyhýbáním, vyčerpáním a skutečnou hranicí.",
    pen: "The work begins with direct contact. Sensation, strength, mobility, breath, fatigue and recovery all carry information. Through movement a person learns to distinguish more clearly between capacity, fear, avoidance, exhaustion and a genuine limit.",
    formscs: "Kalistenika · Jóga · Mobilita · Dech · Regenerace",
    formsen: "Calisthenics · Yoga · Mobility · Breath · Recovery",
  },
  {
    ncs: "Praxe", nen: "Practice",
    rcs: "Most", ren: "The bridge",
    fcs: "Kontinuita", fen: "Continuity",
    pcs: "Praxe spojuje to, čemu člověk rozumí, s tím, co dokáže žít. Není to dokonalá rutina. Je to schopnost pokračovat smysluplně, když se mění energie, okolnosti i potřeby.",
    pen: "Practice joins what a person understands with what they can actually live. It is not a perfect routine. It is the capacity to continue meaningfully when energy, circumstances and needs change.",
    formscs: "Trénink · Meditace · Reflexe · Zápis · Revize",
    formsen: "Training · Meditation · Reflection · Logging · Review",
  },
  {
    ncs: "Divoká příroda", nen: "Wild nature",
    rcs: "Zrcadlo", ren: "The mirror",
    fcs: "Hluboká reflexe", fen: "Deep reflection",
    pcs: "Divoká příroda se nám nepřizpůsobuje. Právě proto v ní můžeme vidět něco, co jinde snadno přehlédneme. To, co se tam člověk naučí, nezůstává v lese. Nese se to zpátky do tréninku, vztahů, práce i obyčejných rozhodnutí.",
    pen: "Wild nature does not adapt itself to us. That is why we can see something there that we may easily overlook elsewhere. What is learned there is not left in the forest. It is carried back into training, relationships, work and ordinary decisions.",
    formscs: "Chůze · Návraty na stejná místa · Pohyb venku · Samota · Praxe v terénu",
    formsen: "Walking · Returning to the same places · Outdoor movement · Solitude · Field practice",
  },
];

/**
 * NABÍDKA · úmyslně prázdné.
 *
 * Osobní práce se právě definuje v projektu Offers. Do jeho schválení
 * se na webu nezveřejňuje žádný rozsah, název ani cena. Až bude nabídka
 * schválená, doplní se sem položky a sekce se vykreslí beze změny layoutu.
 *
 * Tvar jedné položky:
 *   { kindcs, kinden, tcs, ten, pcs, pen, forcs, foren,
 *     inccs, incen, notcs, noten, lencs, lenen, pricecs, priceen,
 *     stepcs, stepen }
 *
 * Pravidlo Brand Strategy V2, strana 09: každá aktivní nabídka uvádí,
 * pro koho je, jaký problém řeší, co proces obsahuje, co neobsahuje,
 * dobu trvání, cenu, odborný rozsah a další krok.
 */
const OFFERS: any[] = [];

const EVENTS = [
  {
    wcs: "Říjen 2026", wen: "October 2026",
    tcs: "Den v lese", ten: "A day in the forest",
    metacs: "Brdy · sobota · nejvýš osm lidí", metaen: "Brdy hills · Saturday · eight people at most",
    pcs: "Od rána do tmy venku. Pohyb mezi stromy, chůze, ticho, jídlo u ohně. Žádný výkon, žádné telefony. Jen tělo, les a pozornost.",
    pen: "Outside from morning until dark. Movement among the trees, walking, silence, food by the fire. No performance, no phones. Just the body, the forest and attention.",
    open: true,
  },
  {
    wcs: "Únor 2027", wen: "February 2027",
    tcs: "Zimní tichá praxe", ten: "Winter silent practice",
    metacs: "Šumava · čtvrtek až neděle · nejvýš šest lidí", metaen: "Šumava · Thursday to Sunday · six people at most",
    pcs: "Tři dny mezi chalupou a zimním lesem. Ranní pohyb, sezení u kamen, dlouhé chůze sněhem. Zima učí, co žádné léto nenaučí.",
    pen: "Three days between a cottage and the winter forest. Morning movement, sitting by the stove, long walks through snow. Winter teaches what no summer can.",
    open: false,
  },
];

const POSTS = [
  {
    id: "p1",
    datecs: "červen 2026", dateen: "June 2026",
    tagcs: "Praxe", tagen: "Practice",
    tcs: "Seděl jsem hodinu. Nic se nestalo.", ten: "I sat for an hour. Nothing happened.",
    excs: "Ráno. Polštář, čaj, les za oknem ještě ve tmě. Sedl jsem si s tím, že dnes to bude hluboké. Nebylo.",
    exen: "Morning. Cushion, tea, the forest outside still dark. I sat down expecting depth. There was none.",
    body: {
      cs: [
        "Ráno. Polštář, čaj, les za oknem ještě ve tmě. Sedl jsem si s tím, že dnes to bude hluboké. Nebylo.",
        "Hodinu jsem poslouchal vlastní mysl, jak přepočítává týden. Nohy usnuly. Záda protestovala. Několikrát jsem otevřel oči a díval se, kolik zbývá.",
        "Dřív bych to nazval špatnou meditací. Dnes už vím, že si tím jen chráním představu o sobě. Praxe není výkon, který se povede nebo nepovede. Praxe je návrat. Tisíckrát odejít, tisíckrát se vrátit.",
        "Zítra si sednu znovu. Možná se zase nic nestane.",
        "To byla ta praxe.",
      ],
      en: [
        "Morning. Cushion, tea, the forest outside still dark. I sat down expecting depth. There was none.",
        "For an hour I listened to my own mind recalculating the week. My legs fell asleep. My back protested. Several times I opened my eyes to see how much was left.",
        "I used to call that a bad meditation. Now I know I was only protecting an image of myself. Practice is not a performance that succeeds or fails. Practice is return. Leaving a thousand times, coming back a thousand times.",
        "Tomorrow I will sit again. Maybe nothing will happen again.",
        "That was the practice.",
      ],
    },
  },
  {
    id: "p2",
    datecs: "květen 2026", dateen: "May 2026",
    tagcs: "Tělo", tagen: "Body",
    tcs: "Co mě dnes ten pohyb stál", ten: "What the movement cost me today",
    excs: "Stoj na rukou na padlém kmeni. Mokré dřevo, studené dlaně. Dvacet pokusů, tři vteřiny rovnováhy.",
    exen: "A handstand on a fallen trunk. Wet wood, cold palms. Twenty attempts, three seconds of balance.",
    body: {
      cs: [
        "Stoj na rukou na padlém kmeni. Mokré dřevo, studené dlaně. Dvacet pokusů, tři vteřiny rovnováhy.",
        "Po nehodě mi řekli, že se nebudu hýbat. Neříkám to, abych ohromil. Říkám to, protože každý pokus o rovnováhu je od té doby rozhovor, ne boj.",
        "Co mě to dnes stálo: kůži na dlaních, hodinu času, kus pýchy.",
        "Co mi to vrátilo: tři vteřiny, kdy nebylo nic jiného než dech, dřevo a tíha.",
        "Tělo není projekt. Tělo je místo, kde žiju. Starám se o něj jako o dům, ve kterém chci zestárnout.",
      ],
      en: [
        "A handstand on a fallen trunk. Wet wood, cold palms. Twenty attempts, three seconds of balance.",
        "After the accident they told me I would not move again. I don't say this to impress. I say it because every attempt at balance since then is a conversation, not a fight.",
        "What it cost me today: skin off my palms, an hour of time, a piece of pride.",
        "What it gave back: three seconds in which there was nothing but breath, wood and weight.",
        "The body is not a project. The body is where I live. I care for it like a house I want to grow old in.",
      ],
    },
  },
  {
    id: "p3",
    datecs: "duben 2026", dateen: "April 2026",
    tagcs: "Divoká příroda", tagen: "Wild nature",
    tcs: "Les nehodnotí", ten: "The forest does not judge",
    excs: "Vracím se na stejné místo už třetí rok. Stejný kopec, stejné buky, jiné světlo.",
    exen: "I keep returning to the same place, third year now. Same hill, same beeches, different light.",
    body: {
      cs: [
        "Vracím se na stejné místo už třetí rok. Stejný kopec, stejné buky, jiné světlo.",
        "V zimě mě to místo učilo, co je nepohodlí. Na jaře, co je trpělivost. Dnes tam bylo ticho, které nehodnotí. Les nereaguje na to, kým se snažím být. Reaguje jen na to, co dělám. Proto je to zrcadlo.",
        "Sedl jsem si k potoku a chvíli nedělal nic. Žádný obsah, žádný trénink. Jen pozornost.",
        "Cestou dolů jsem potkal srnce. Stáli jsme a dívali se na sebe, dokud to jemu nestačilo.",
        "Co se učím v lese, se pak děje i jinde. U stolu. Ve vztahu. V tramvaji.",
      ],
      en: [
        "I keep returning to the same place, third year now. Same hill, same beeches, different light.",
        "In winter the place taught me what discomfort is. In spring, what patience is. Today there was a silence that does not judge. The forest does not respond to who I am trying to be. It responds only to what I do. That is why it is a mirror.",
        "I sat by the stream and did nothing for a while. No content, no training. Just attention.",
        "On the way down I met a roe deer. We stood looking at each other until he had had enough.",
        "What I learn in the forest starts happening elsewhere too. At the table. In a relationship. On the tram.",
      ],
    },
  },
];

// ----------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------
/** Zjistí, jestli obrázek existuje. Chybějící soubor nikdy nenechá prázdný rám. */
function useAsset(url: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => { if (alive) setOk(true); };
    img.onerror = () => { if (alive) setOk(false); };
    img.src = url;
    return () => { alive = false; };
  }, [url]);
  return ok;
}

function useReveal(dep: any) {
  useEffect(() => {
    const els = Array.prototype.slice.call(document.querySelectorAll(".rv:not(.on)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el: any) => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el: any) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

// ----------------------------------------------------------------------
// SMALL PARTS
// ----------------------------------------------------------------------
const Wordmark = () => (
  <span className="wm">t<span className="a1">a<i /></span>nmay</span>
);

const Go = ({ href, cs, en, external = false }: any) => (
  <a
    className="go"
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {L(cs, en)}<span className="arw" aria-hidden="true">→</span>
  </a>
);

/** Tři tenké překrývající se kruhy, jedno měděné bindu, Přítomnost pod ním. */
const AnchorDiagram = () => (
  <svg className="diagram" viewBox="0 0 240 212" role="img"
    aria-label={L(
      "Tři překrývající se kruhy: tělo, praxe, divoká příroda. Ve společném středu přítomnost.",
      "Three overlapping circles: body, practice, wild nature. Presence in the shared centre."
    )}>
    <circle className="c" cx="84" cy="80" r="52" />
    <circle className="c" cx="156" cy="80" r="52" />
    <circle className="c" cx="120" cy="134" r="52" />
    <circle className="b" cx="120" cy="98" r="3.4" />
    <text x="84" y="20" textAnchor="middle">{L("TĚLO", "BODY")}</text>
    <text x="156" y="20" textAnchor="middle">{L("PRAXE", "PRACTICE")}</text>
    <text x="120" y="202" textAnchor="middle">{L("DIVOKÁ PŘÍRODA", "WILD NATURE")}</text>
    <text className="p" x="120" y="116" textAnchor="middle">{L("PŘÍTOMNOST", "PRESENCE")}</text>
  </svg>
);

/**
 * Fotografie jako důkaz. Když soubor chybí, nevykreslí se nic.
 * Nikdy nevzniká prázdný rám ani rozbitá ikona.
 */
function Evidence({ src, alt, caption, tall = false }: any) {
  const ok = useAsset(src);
  if (!ok) return null;
  return (
    <figure className={"figure rv" + (tall ? " figure--portraitish" : "")}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * Krátký tichý záběr. Přehraje se jednou, když se dostane do obrazu,
 * a zůstane stát na posledním snímku. Bez zvuku, bez smyčky, bez scrubbování.
 * Když chybí plakátový snímek, nevykreslí se nic. Když uživatel omezuje pohyb,
 * zůstane statický snímek.
 */
function QuietClip({ poster, src, alt, caption }: any) {
  const ok = useAsset(poster);
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduced(mq.matches);
      const on = () => setReduced(mq.matches);
      mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
      return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
    } catch (e) { setReduced(false); }
  }, []);

  useEffect(() => {
    if (!ok || reduced || !ref.current) return;
    const el = ref.current;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [ok, reduced]);

  if (!ok) return null;

  return (
    <figure className="figure rv">
      {reduced ? (
        <img src={poster} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <video
          ref={ref}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function RoomHead({ room, titleCs, titleEn, leadCs, leadEn }: any) {
  return (
    <div className="roomhead">
      <div className="wrap">
        <a className="back" href="#/">‹ {L("Domů", "Home")}</a>
        <p className="num" style={{ marginTop: 18 }}>
          {room.num} · {L(room.cs, room.en)}
        </p>
        <h1 className="h-display h1 rv">{L(titleCs, titleEn)}</h1>
        {leadCs ? <p className="lead rv d1">{L(leadCs, leadEn)}</p> : null}
      </div>
    </div>
  );
}

function NextRoom({ href, cs, en, gocs, goen }: any) {
  return (
    <section className="sec--tight" aria-label={L("Pokračovat", "Continue")}>
      <div className="wrap">
        <hr className="rule" />
        <div style={{ paddingTop: "clamp(26px,4vw,38px)" }}>
          <p className="quote rv">{L(cs, en)}</p>
          <p className="rv d1" style={{ marginTop: 22 }}>
            <Go href={href} cs={gocs} en={goen} />
          </p>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// CHROME
// ----------------------------------------------------------------------
function TopBar({ page, lang, onLang, menuOpen, onMenu }: any) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="topbar" data-scrolled={scrolled ? "1" : "0"}>
      <div className="wrap row">
        <a href="#/" className="logo" aria-label="tanmay"><Wordmark /></a>
        <nav className="topnav" aria-label={L("Hlavní navigace", "Main navigation")}>
          {ROOMS.map((r) => (
            <a key={r.num} href={r.href} aria-current={page === r.page ? "page" : undefined}>
              {L(r.cs, r.en)}
            </a>
          ))}
        </nav>
        <div className="end">
          <div className="lang" role="group" aria-label={L("Jazyk", "Language")}>
            <button type="button" aria-pressed={lang === "cs"} onClick={() => onLang("cs")}>CZ</button>
            <span className="sep" aria-hidden="true">·</span>
            <button type="button" aria-pressed={lang === "en"} onClick={() => onLang("en")}>EN</button>
          </div>
          <button
            type="button"
            className="burger"
            aria-expanded={menuOpen}
            aria-controls="tm-menu"
            aria-label={menuOpen ? L("Zavřít menu", "Close menu") : L("Otevřít menu", "Open menu")}
            onClick={onMenu}
          >
            <b /><b /><b />
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu({ open, onClose, page }: any) {
  return (
    <div className="mmenu" id="tm-menu" hidden={!open}>
      <div className="wrap">
        <ul>
          {ROOMS.map((r) => (
            <li key={r.num}>
              <a href={r.href} onClick={onClose} aria-current={page === r.page ? "page" : undefined}>
                <span className="num">{r.num}</span>
                <span>{L(r.cs, r.en)}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="extra">
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}>
            {L("Vstup pro klienty", "Client sign-in")}
          </a>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}>Instagram</a>
          <a href={"mailto:" + MAIL} onClick={onClose}>{L("E-mail", "Email")}</a>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HOME
// ----------------------------------------------------------------------
function Opening() {
  const hasPortrait = useAsset(MEDIA.portrait);
  return (
    <header className={"opening" + (hasPortrait ? " has-portrait" : "")}>
      <div className="wrap grid">
        <div>
          <p className="kicker label rv">
            {L("Koučink pohybu a praxe · Praha", "Movement and practice coaching · Prague")}
          </p>
          <h1 className="h-display h1 rv d1">
            {L("To, co učím, sám žiju.", "I teach only what I live.")}
          </h1>
          <p className="body-txt rv d2">
            {L(
              "Pomáhám lidem obnovit spolehlivý vztah k tělu a postavit praxi, která drží i v běžném životě. Skrze pohyb, meditaci a přímý kontakt s divokou přírodou.",
              "I help people rebuild a reliable relationship with the body and build a practice that holds in ordinary life. Through movement, meditation and direct contact with wild nature."
            )}
          </p>
          <p className="act rv d3">
            <Go href="#/praxe" cs="Co tahle práce je" en="What this work is" />
          </p>
          <p className="stance rv d3">
            {L("tělo · praxe · divoká příroda", "body · practice · wild nature")}
          </p>
        </div>
        {hasPortrait ? (
          <div className="portrait rv d1">
            <img
              src={MEDIA.portrait}
              alt={L(
                "Tanmay, portrét zblízka, přirozené světlo.",
                "Tanmay, a close portrait in natural light."
              )}
              width={920}
              height={1150}
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Doors() {
  return (
    <nav className="sec doorsec" aria-label={L("Místnosti", "Rooms")}>
      <div className="wrap">
        <ul className="doors">
          {ROOMS.map((r, i) => (
            <li key={r.num}>
              <a className={"door rv" + (i ? " d" + Math.min(i, 3) : "")} href={r.href}>
                <span className="num">{r.num}</span>
                <span>
                  <span className="h3">{L(r.cs, r.en)}</span>
                  <span className="dline" style={{ display: "block" }}>{L(r.lcs, r.len)}</span>
                </span>
                <span className="arw" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Closing() {
  return (
    <section className="band--dark sec closing" aria-label={L("Jméno a směr", "The name and the compass")}>
      <div className="wrap">
        <p className="label label--sand rv">{L("Jméno", "The name")}</p>
        <p className="rv d1" style={{ marginTop: 18 }}><Wordmark /></p>
        <p className="mean rv d1">
          {L("sanskrt tanmaya · „utkán z toho“", "Sanskrit tanmaya · “made of that”")}
        </p>
        <p className="stance h-display rv d2">
          {L("Staň se tím, co praktikuješ.", "Become what you practice.")}
        </p>

        <div className="compass rv d2">
          <p className="label label--sand">{L("Směr", "North Star")}</p>
          <p className="lines">
            {L("Důvěřuj tělu.", "Trust the body.")}<br />
            {L("Drž svou praxi.", "Hold the practice.")}<br />
            {L("Naslouchej divočině.", "Listen to the wild.")}
          </p>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// ROOM 01 · PRAXE
// ----------------------------------------------------------------------
function RoomPraxe() {
  return (
    <>
      <RoomHead
        room={ROOMS[0]}
        titleCs="Co je tahle praxe"
        titleEn="What this practice is"
        leadCs="Denní práce s tělem a myslí, držená pohromadě vztahem k divoké přírodě. Tři kotvy, jedna praxe."
        leadEn="Daily work with body and mind, held together by a relationship with wild nature. Three anchors, one practice."
      />

      <section className="band--dark sec" aria-label={L("Tři kotvy", "Three anchors")}>
        <div className="wrap">
          <p className="label label--sand rv">{L("Tři kotvy", "Three anchors")}</p>
          <div className="anchors">
            {ANCHORS.map((a, i) => (
              <div className="anchor rv" key={i}>
                <div className="top">
                  <span className="h3" style={{ color: "var(--on-dark)" }}>{L(a.ncs, a.nen)}</span>
                  <span className="role">{L(a.rcs, a.ren)}</span>
                  <span className="fn">{L(a.fcs, a.fen)}</span>
                </div>
                <div>
                  <p>{L(a.pcs, a.pen)}</p>
                  <p className="forms">{L(a.formscs, a.formsen)}</p>
                </div>
              </div>
            ))}
          </div>

          <AnchorDiagram />

          <p className="quote rv" style={{ color: "var(--on-dark)", maxWidth: "26em", margin: "clamp(30px,4vw,44px) auto 0", textAlign: "center" }}>
            {L(
              "Přítomnost není čtvrtá kotva. Je to to, co vzniká, když se ty tři drží pohromadě.",
              "Presence is not a fourth anchor. It is what emerges when the three are held together."
            )}
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <QuietClip
            poster={MEDIA.matPoster}
            src={MEDIA.matVideo}
            alt={L(
              "Rozbalení podložky na začátku praxe.",
              "Unrolling the mat at the start of practice."
            )}
            caption={L("Ráno · začátek praxe", "Morning · the start of practice")}
          />

          <div style={{ marginTop: "clamp(40px,6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Pro koho to je", "Who this is for")}</h2>
            <div className="prose rv d1" style={{ marginTop: 22 }}>
              <p className="body-txt">
                {L(
                  "Práce je hlavně pro lidi, kteří umějí vytrvat v tom, pro co se rozhodnou, ale přesto cítí odstup mezi tím, čemu rozumějí, a tím, jak skutečně žijí.",
                  "The work is especially for people who know how to commit, yet still feel a distance between what they understand and how they live."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "Můžou mít za sebou roky pohybu, meditace, terapie nebo osobního rozvoje. Nehledají další identitu, kterou by předváděli. Chtějí praxi, která bude spolehlivější, tělesnější a víc jejich. Nehledají gurua. Hledají parťáka, který je o pár kroků napřed a žije to, co učí.",
                  "They may have years of movement, meditation, therapy or personal work behind them. They are not looking for another identity to perform. They want a practice that is more reliable, more physical and more their own. They are not looking for a guru. They are looking for a peer a few steps ahead who lives what he teaches."
                )}
              </p>
            </div>
          </div>

          <Evidence
            src={MEDIA.handstand}
            alt={L(
              "Stoj na rukou na padlém kmeni v lese.",
              "A handstand on a fallen trunk in the forest."
            )}
            caption={L("Brdy · pohybová praxe venku", "Brdy hills · movement practice outdoors")}
          />

          <div style={{ marginTop: "clamp(44px,6vw,72px)" }}>
            <h2 className="h-display h2 rv">{L("Co to není", "What it is not")}</h2>
            <ul className="deflist rv d1">
              <li>
                <h3>{L("Není to fitness zaměřené na vzhled", "It is not appearance-driven fitness")}</h3>
                <p>{L(
                  "Fyzická kapacita má význam. Tělo se ale neredukuje na obraz, který se má vypilovat. Je to živý zdroj informací.",
                  "Physical capacity matters. But the body is not reduced to an image to be perfected. It is a living source of information."
                )}</p>
              </li>
              <li>
                <h3>{L("Není to wellness", "It is not wellness")}</h3>
                <p>{L(
                  "Tření, únava, žal, nejistota a omezení k té práci patří. Dny, kdy praxe nefungovala, mají stejné místo jako dny, kdy šla sama.",
                  "Friction, fatigue, grief, uncertainty and limitation belong to the work. The days when the practice did not work have the same place as the days when it went by itself."
                )}</p>
              </li>
              <li>
                <h3>{L("Není to terapie", "It is not therapy")}</h3>
                <p>{L(
                  "Koučink není psychoterapie, diagnóza ani lékařská léčba. Pohybová praxe nenahrazuje klinickou péči. Když práce překročí rozsah, odpovědným krokem je doporučit vhodného odborníka.",
                  "Coaching is not psychotherapy, diagnosis or medical treatment. Movement practice does not replace clinical care. When the work moves beyond scope, the responsible action is referral."
                )}</p>
              </li>
              <li>
                <h3>{L("Není to sbírka metod", "It is not a collection of methods")}</h3>
                <p>{L(
                  "Cílem není další dokonalá rutina ani další nespojená technika. Je to praxe, která se umí přizpůsobit, aniž by zmizela.",
                  "The aim is not another perfect routine or another disconnected technique. It is a practice that can adapt without disappearing."
                )}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <NextRoom
        href="#/pribeh"
        cs="Odkud se to vzalo, vysvětluje závazek. Nedokazuje nadřazenost."
        en="Where this came from explains the commitment. It does not prove superiority."
        gocs="Dál · Příběh"
        goen="Next · The story"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// ROOM 02 · PŘÍBĚH
// ----------------------------------------------------------------------
function RoomPribeh() {
  return (
    <>
      <RoomHead
        room={ROOMS[1]}
        titleCs="Příběh"
        titleEn="The story"
        leadCs="Příběh vysvětluje závazek. Nedokazuje nadřazenost."
        leadEn="The story explains the commitment. It does not prove superiority."
      />

      <section className="sec">
        <div className="wrap limit--wide">
          <div className="beat rv">
            <p className="label">{L("01 · Pád", "01 · The fall")}</p>
            <div className="prose">
              <p>{L(
                "Postavil jsem si život na fyzické kapacitě, disciplíně, lásce a smysluplné práci. Téměř smrtelná nehoda a kóma ten život v jediném okamžiku přerušily.",
                "I had built a life around physical capacity, discipline, love and meaningful work. A near fatal accident and coma interrupted that life in a moment."
              )}</p>
            </div>
          </div>

          <div className="beat rv">
            <p className="label">{L("02 · Sestup", "02 · The descent")}</p>
            <div className="prose">
              <p>{L(
                "Dva roky návratu k úplným základům. Tělo nefungovalo jako dřív. Mysl se po úrazu změnila. Věci, na kterých stála představa o tom, kdo jsem, najednou nebyly samozřejmé.",
                "Two years of returning to the most basic things. My body no longer worked as it had. The injury changed how my mind worked. The things my sense of who I was had rested on could no longer be taken for granted."
              )}</p>
              <p>{L(
                "Poznal jsem, jak snadno může člověk přijít o to, čím se celý život definuje. A že když ty jistoty zmizí, musí znovu zjistit, o co se v sobě může opravdu opřít.",
                "I learned how easily a person can lose what they have used to define themselves. And that when those certainties disappear, they have to discover again what they can truly rely on within themselves."
              )}</p>
            </div>
          </div>

          <div className="beat rv">
            <p className="label">{L("03 · Návrat", "03 · The return")}</p>
            <div className="prose">
              <p>{L(
                "Dnes nestojím na druhé straně příběhu jako někdo, kdo má vyhráno. Pořád praktikuju. Tělo, které kdysi přestalo být samozřejmostí, se stalo mým nejpřesnějším učitelem.",
                "Today I do not stand on the other side of the story as someone who has won. I still practice. The body I could no longer take for granted has become my most precise teacher."
              )}</p>
              <p>{L(
                "To, co mě málem připravilo o život, mi nedalo odpovědi ani právo říkat druhým, jak mají žít. Dalo mi důvod brát tuhle práci vážně a předávat jen to, co sám skutečně žiju.",
                "What almost took my life did not give me answers or the right to tell others how to live. It gave me a reason to take this work seriously and to pass on only what I actually live."
              )}</p>
            </div>
          </div>

          <p className="quote rv" style={{ marginTop: "clamp(30px,4vw,44px)" }}>
            {L(
              "Nehoda vysvětluje závazek. Není to doklad kvalifikace.",
              "The accident explains the commitment. It is not a credential."
            )}
          </p>
        </div>
      </section>

      <section className="sec--tight">
        <div className="wrap limit--wide">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(30px,4vw,44px)" }}>
            <h2 className="h-display h2 rv">{L("Kořeny", "Roots")}</h2>
            <div className="prose rv d1" style={{ marginTop: 20 }}>
              <p className="body-txt">
                {L(
                  "Tahle práce nezačala u mě. Formovali ji učitelé, tradice, pohybové disciplíny, kontemplativní praxe a práce s divokou přírodou. Zdroje pojmenovávám přesně a přímý výcvik odlišuji od studia a vlivů.",
                  "This work did not begin with me. It has been shaped by teachers, traditions, movement disciplines, contemplative practice and work with wild nature. I name sources precisely and distinguish direct training from study and influence."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "Zůstávám žákem. Nesu odpovědnost za to, co předávám.",
                  "I remain a student. I am responsible for what I pass on."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band--dark sec" aria-label={L("Z notesu", "From the notebook")}>
        <div className="wrap center">
          <p className="label label--sand rv">{L("Z notesu", "From the notebook")}</p>
          <p className="quote rv d1" style={{ color: "var(--on-dark)", marginTop: 24, lineHeight: 1.9 }}>
            {LANG === "cs" ? (
              <>
                Umřel jsem dřív, než jsem stihl žít.<br />
                Vrátil jsem se s prázdnýma rukama.<br /><br />
                <span style={{ color: "var(--sand)" }}>
                  Teď nosím vodu, štípu dřevo,<br />
                  stojím na rukou, když les mlčí.
                </span><br /><br />
                Tělo si pamatuje, co hlava zapomněla:<br />
                že být tady<br />
                je celá ta práce.
              </>
            ) : (
              <>
                I died before I had lived.<br />
                I came back with empty hands.<br /><br />
                <span style={{ color: "var(--sand)" }}>
                  Now I carry water, split wood,<br />
                  stand on my hands while the forest is silent.
                </span><br /><br />
                The body remembers what the mind forgot:<br />
                that being here<br />
                is the whole work.
              </>
            )}
          </p>
        </div>
      </section>

      <NextRoom
        href="#/spoluprace"
        cs="Jestli tě zajímá, jak se dá pracovat spolu."
        en="If you want to know how we could work together."
        gocs="Dál · Spolupráce"
        goen="Next · Work with me"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// ROOM 03 · SPOLUPRÁCE
// ----------------------------------------------------------------------
/**
 * SLOT PRO SCHVÁLENOU NABÍDKU.
 * Dokud je OFFERS prázdné, vykreslí se jedna pravdivá věta o stavu.
 * Až projekt Offers schválí nabídku, doplní se položky do OFFERS
 * a tahle sekce je vykreslí bez zásahu do layoutu.
 */
function OfferSlot() {
  if (!OFFERS.length) {
    return (
      <div className="rv d1" style={{ marginTop: 22 }}>
        <p className="body-txt">
          {L(
            "Osobní práci v Praze právě přestavuju. Až bude otevřená, najdeš tady rozsah, průběh, dobu trvání, cenu i další krok. Bez „napiš mi pro detaily“.",
            "I am currently rebuilding the personal work in Prague. When it opens, you will find here the scope, the process, the duration, the price and the next step. No “message me for details”."
          )}
        </p>
        <p className="body-txt" style={{ marginTop: "1.15em" }}>
          {L(
            "Do té doby je nejpoctivější seznámení den v lese.",
            "Until then, the most honest introduction is a day in the forest."
          )}
        </p>
      </div>
    );
  }
  return (
    <ul className="deflist rv d1">
      {OFFERS.map((o: any, i: number) => (
        <li key={i}>
          <p className="label">{L(o.kindcs, o.kinden)}</p>
          <h3 style={{ marginTop: 8 }}>{L(o.tcs, o.ten)}</h3>
          <p>{L(o.pcs, o.pen)}</p>
        </li>
      ))}
    </ul>
  );
}

function RoomSpoluprace() {
  return (
    <>
      <RoomHead
        room={ROOMS[2]}
        titleCs="Spolupráce"
        titleEn="Work with me"
        leadCs="Pracuju s málo lidmi a zblízka. Vedení, ne závislost."
        leadEn="I work with few people, closely. Guidance, not dependence."
      />

      <section className="sec">
        <div className="wrap">
          <div className="prose">
            <h2 className="h-display h2 rv">{L("Osobní práce", "Personal work")}</h2>
            <OfferSlot />
          </div>

          <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
            <h2 className="h-display h2 rv">{L("Praxe v terénu", "Field practice")}</h2>
            <p className="body-txt rv d1" style={{ marginTop: 18 }}>
              {L(
                "Malé lekce venku a celé dny v lese. Základna je Praha, učebna je les.",
                "Small sessions outdoors and whole days in the forest. The base is Prague, the classroom is the forest."
              )}
            </p>
            <ul className="events">
              {EVENTS.map((ev, i) => (
                <li key={i} className="rv">
                  <div className="event">
                    <div>
                      <p className="when">{L(ev.wcs, ev.wen)}</p>
                      <p className="meta">{L(ev.metacs, ev.metaen)}</p>
                    </div>
                    <div>
                      <h3 className="h3">{L(ev.tcs, ev.ten)}</h3>
                      <p>{L(ev.pcs, ev.pen)}</p>
                    </div>
                    <p className="state" data-open={ev.open ? "1" : "0"}>
                      <span className="bindu" aria-hidden="true" />
                      {ev.open ? L("Otevřeno", "Open") : L("Připravuje se", "In preparation")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Evidence
            src={MEDIA.forest}
            alt={L(
              "Chůze lesem, pozdní odpolední světlo.",
              "Walking through the forest in late afternoon light."
            )}
            caption={L("Návraty na stejná místa", "Returning to the same places")}
          />

          <div style={{ marginTop: "clamp(48px,7vw,80px)" }}>
            <h2 className="h-display h2 rv">{L("Tanmay Practice", "Tanmay Practice")}</h2>
            <div className="prose rv d1" style={{ marginTop: 18 }}>
              <p className="body-txt">
                {L(
                  "Klienti mají vlastní prostor v aplikaci: strukturu praxe, zápis, reflexi a úpravu mezi setkáními. Aplikace drží strukturu. Koučink drží kontext. Rozhodování zůstává tvoje.",
                  "Clients have their own space in the app: the structure of the practice, logging, reflection and adjustment between sessions. The app holds the structure. The coaching holds the context. The decisions stay yours."
                )}
              </p>
              <p className="body-txt" style={{ marginTop: "1.15em" }}>
                {L(
                  "Přístup dostaneš ode mě na začátku spolupráce.",
                  "You receive access from me when we begin working together."
                )}
              </p>
            </div>
            <p className="rv d2" style={{ marginTop: 24 }}>
              <Go href={APP_URL} cs="Vstup pro klienty" en="Client sign-in" external />
            </p>
          </div>
        </div>
      </section>

      <section className="band--dark sec" aria-label={L("Úmluva", "The contract")}>
        <div className="wrap limit--wide">
          <p className="label label--sand rv">{L("Úmluva", "The contract")}</p>
          <p className="quote rv d1" style={{ color: "var(--on-dark)", marginTop: 22, lineHeight: 1.75 }}>
            {L("Nebudu předstírat, že v tom mám jasno.", "I will not pretend I have it figured out.")}<br />
            {L("Budu sdílet to, čím jsem opravdu prošel.", "I will share what I have actually walked through.")}<br />
            {L("Pojmenuju, co vím a co nevím.", "I will name what I know and what I do not.")}<br />
            {L("Budu ctít tvůj rozum natolik, abych nechal rozhodnutí na tobě.", "I will respect your intelligence enough to let you decide what to do with it.")}
          </p>
          <hr className="rule" style={{ margin: "clamp(30px,4vw,44px) 0" }} />
          <p className="label label--sand rv d1">{L("Hranice", "The boundary")}</p>
          <p className="body-txt rv d2" style={{ color: "var(--on-dark-2)", marginTop: 14 }}>
            {L(
              "Koučink není psychoterapie, diagnóza ani lékařská léčba. Pohybová praxe nenahrazuje klinickou péči. Když práce překročí rozsah, odpovědným krokem je doporučit vhodného odborníka.",
              "Coaching is not psychotherapy, diagnosis or medical treatment. Movement practice does not replace clinical care. When the work moves beyond scope, the responsible action is referral."
            )}
          </p>
          <p className="body-txt rv d2" style={{ color: "var(--on-dark-2)", marginTop: "1.15em" }}>
            {L(
              "Ohlasy klientů sem přibudou, až budou jejich, ne moje.",
              "Clients' words will appear here when they are theirs, not mine."
            )}
          </p>
        </div>
      </section>

      <section className="sec" id="kontakt">
        <div className="wrap">
          <h2 className="h-display h2 rv">{L("Začíná to rozhovorem", "It begins with a conversation")}</h2>
          <p className="body-txt rv d1" style={{ marginTop: 18 }}>
            {L(
              "Napiš mi, co hledáš a kde jsi teď. Odpovídám osobně, obvykle do pár dní.",
              "Write to me about what you are looking for and where you are now. I answer personally, usually within a few days."
            )}
          </p>
          <p className="rv d2" style={{ marginTop: 28 }}>
            <a className="mailto" href={"mailto:" + MAIL}>{MAIL}</a>
          </p>
        </div>
      </section>

      <NextRoom
        href="#/denik"
        cs="Ještě nevíš? Deník praxe je nejbližší tomu, jaká ta práce doopravdy je."
        en="Not sure yet? The practice log is the closest thing to what this work is actually like."
        gocs="Dál · Deník praxe"
        goen="Next · Practice log"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// ROOM 04 · DENÍK
// ----------------------------------------------------------------------
function RoomDenik({ onOpen }: any) {
  return (
    <>
      <RoomHead
        room={ROOMS[3]}
        titleCs="Deník praxe"
        titleEn="Practice log"
        leadCs="Bez pointy na konci. Praxe, jaká byla, včetně dní, kdy nefungovala."
        leadEn="No point at the end. The practice as it was, including the days it did not work."
      />

      <section className="sec">
        <div className="wrap">
          <ul className="posts">
            {POSTS.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={"post rv" + (i ? " d" + Math.min(i, 3) : "")}
                  onClick={() => onOpen(p)}
                >
                  <span className="top">
                    <span className="num">{L(p.datecs, p.dateen)}</span>
                    <span className="num">{L(p.tagcs, p.tagen)}</span>
                  </span>
                  <h3>{L(p.tcs, p.ten)}</h3>
                  <p>{L(p.excs, p.exen)}</p>
                  <span className="more">{L("Číst dál →", "Read more →")}</span>
                </button>
              </li>
            ))}
          </ul>

          <Evidence
            src={MEDIA.sitting}
            alt={L(
              "Sezení pod borovicí při západu slunce.",
              "Sitting under a pine tree at sunset."
            )}
            caption={L("Podvečer · sezení venku", "Early evening · sitting outdoors")}
          />

          <p className="small rv" style={{ marginTop: "clamp(34px,5vw,48px)" }}>
            {L(
              "Nový zápis jednou za dva až tři týdny. Rytmus, ne kalendář.",
              "A new note every two to three weeks. A rhythm, not a calendar."
            )}
          </p>
        </div>
      </section>

      <NextRoom
        href="#/spoluprace"
        cs="Jestli to sedí, začíná to rozhovorem."
        en="If this fits, it begins with a conversation."
        gocs="Dál · Spolupráce"
        goen="Next · Work with me"
      />
    </>
  );
}

function Reader({ post, onClose }: any) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevFocus = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (post) {
      prevFocus.current = document.activeElement;
      document.body.style.overflow = "hidden";
      window.setTimeout(() => closeRef.current && closeRef.current.focus(), 30);
    } else {
      document.body.style.overflow = "";
      if (prevFocus.current && prevFocus.current.focus) prevFocus.current.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [post]);

  const onKey = useCallback((e: any) => {
    if (!post) return;
    if (e.key === "Escape") { onClose(); return; }
    if (e.key !== "Tab" || !boxRef.current) return;
    const f = boxRef.current.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [post, onClose]);

  return (
    <div
      className="reader"
      hidden={!post}
      role="dialog"
      aria-modal="true"
      aria-label={post ? L(post.tcs, post.ten) : undefined}
      onKeyDown={onKey}
      ref={boxRef}
    >
      <button
        type="button"
        className="close"
        onClick={onClose}
        ref={closeRef}
        aria-label={L("Zavřít", "Close")}
      >
        ×
      </button>
      {post && (
        <article className="rwrap">
          <p className="num">
            {L(post.datecs, post.dateen)} · {L(post.tagcs, post.tagen)}
          </p>
          <h2>{L(post.tcs, post.ten)}</h2>
          <div className="rbody">
            {(LANG === "cs" ? post.body.cs : post.body.en).map((para: string, i: number) => (
              <p key={i}>{LANG === "cs" ? nbsp(para) : para}</p>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// FOOTER
// ----------------------------------------------------------------------
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="frow">
          <a href="#/" aria-label="tanmay"><Wordmark /></a>
          <div className="flinks">
            <a href={"mailto:" + MAIL}>{MAIL}</a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">
              {L("Vstup pro klienty", "Client sign-in")}
            </a>
          </div>
          <span className="fmeta">
            © {new Date().getFullYear()} tanmay · {L("Praha", "Prague")}
          </span>
        </div>
        <p className="fnote">
          {L(
            "Žádné cookies. Žádná analytika. Jen text, tělo a les.",
            "No cookies. No analytics. Just text, body and forest."
          )}
        </p>
      </div>
    </footer>
  );
}

// ----------------------------------------------------------------------
// APP
// ----------------------------------------------------------------------
export default function App() {
  const [lang, setLangState] = useState(detectLang());
  LANG = lang;

  const [page, setPage] = useState(parseRoute());
  const [menuOpen, setMenuOpen] = useState(false);
  const [post, setPost] = useState<any>(null);

  useReveal(page + lang);

  useEffect(() => {
    const onHash = () => {
      setPage(parseRoute());
      setMenuOpen(false);
      setPost(null);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setLang = (l: string) => {
    setLangState(l);
    try { window.localStorage.setItem("tm-lang", l); } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "cs"
      ? "tanmay · koučink pohybu a praxe · Praha"
      : "tanmay · movement and practice coaching · Prague";
    const d = document.querySelector('meta[name="description"]');
    if (d) {
      d.setAttribute("content", lang === "cs"
        ? "Koučink pohybu a praxe. Pomáhám lidem obnovit spolehlivý vztah k tělu a postavit praxi, která drží i v běžném životě. Praha a divoká příroda."
        : "Movement and practice coaching. I help people rebuild a reliable relationship with the body and build a practice that holds in ordinary life. Prague and wild nature.");
    }
  }, [lang]);

  /** Volitelné povrchy. Když soubor chybí, plocha zůstane plná barva. */
  const hasEdge = useAsset(MEDIA.edgeMask);
  const hasCotton = useAsset(MEDIA.texCotton);
  useEffect(() => {
    document.documentElement.setAttribute("data-edge", hasEdge ? "on" : "off");
  }, [hasEdge]);
  useEffect(() => {
    document.documentElement.setAttribute("data-surface", hasCotton ? "on" : "off");
  }, [hasCotton]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="skip" href="#main">{L("Přejít na obsah", "Skip to content")}</a>

      <TopBar
        page={page}
        lang={lang}
        onLang={setLang}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((o) => !o)}
      />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} page={page} />

      <main id="main" key={page + lang}>
        {page === "home" && (<><Opening /><Doors /><Closing /></>)}
        {page === "praxe" && <RoomPraxe />}
        {page === "pribeh" && <RoomPribeh />}
        {page === "spoluprace" && <RoomSpoluprace />}
        {page === "denik" && <RoomDenik onOpen={setPost} />}
      </main>

      <Footer />
      <Reader post={post} onClose={() => setPost(null)} />
    </>
  );
}
