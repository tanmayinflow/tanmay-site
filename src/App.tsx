/**
 * tanmaypractice.com · veřejný web
 * ----------------------------------------------------------------------
 * Single-file React/Vite. Mapa adres, metadata a texty deníku jsou
 * v `src/site.js`, protože z nich čte i build.
 *
 * Autorita: Context/Brand/Canonical/ (Brand Book V2, Brand Strategy V2,
 * překladový glosář CZ, type spec V2, brand tokens V2).
 * Co smí být veřejné: PUBLIC-FACTS-LEDGER.md.
 *
 * Vizuální zásady, které tenhle soubor drží:
 *   - Hlavní plocha je Linen. Forest Night nejvýš jeden pás na místnost.
 *   - Jedno měděné gesto na kompozici. Copper nikdy nenese drobný text.
 *   - Žádné přechody, žádná záře, žádné vlnovky, žádné dekorativní křivky.
 *   - Jeden organický okraj na celém webu, a ten vychází ze skutečné masky.
 *   - Obraz je důkaz. Když soubor chybí, prvek zmizí. Nikdy nezůstane prázdný rám.
 *   - Každá místnost má jednu vizuální událost. Domů má dvě.
 * ----------------------------------------------------------------------
 */
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ROUTES,
  POSTS,
  MAIL,
  IG_URL,
  CLIENT_APP_URL,
  HASH_ALIASES,
  matchPath,
  otherLangPath,
  routePath,
  postPath,
} from "./site.js";

// ----------------------------------------------------------------------
// LANGUAGE · adresa rozhoduje. Čeština v kořeni, angličtina pod /en/.
// ----------------------------------------------------------------------
let LANG = "cs";

/** Sazba: nezlomitelná mezera po jednopísmenných předložkách a spojkách. */
const nbsp = (s: string) =>
  s.replace(/(^|[\s\u00A0(\u201E"])([ksvzouaiKSVZOUAI])[ \t]+/g, "$1$2\u00A0")
   .replace(/(^|[\s\u00A0(\u201E"])([ksvzouaiKSVZOUAI])[ \t]+/g, "$1$2\u00A0");

const L = (cs: string, en: string) => (LANG === "cs" ? nbsp(cs) : en);

// ----------------------------------------------------------------------
// ROUTER · skutečné cesty. Staré hash adresy se přepíšou na nové.
// ----------------------------------------------------------------------
type Loc = { routeId: string; lang: string; postId: string | null };

const HOME: Loc = { routeId: "home", lang: "cs", postId: null };

function readLocation(): Loc {
  try {
    /* Pre-rendered pages carry their own route, so the first paint is
       correct even before the router looks at the address. */
    const meta = document.querySelector('meta[name="tm-route"]');
    const hash = (window.location.hash || "").match(/^#\/([a-z]*)/);
    if (hash) {
      const target = HASH_ALIASES[hash[1]];
      if (target) {
        const lang = window.location.pathname.indexOf("/en/") === 0 ? "en" : "cs";
        return { routeId: target, lang, postId: null };
      }
    }
    const byPath = matchPath(window.location.pathname);
    if (byPath) return byPath;
    if (meta) {
      const v = (meta.getAttribute("content") || "").split(":");
      if (v[0] === "notfound") return { routeId: "notfound", lang: v[1] || "cs", postId: null };
    }
    return { routeId: "notfound", lang: window.location.pathname.indexOf("/en/") === 0 ? "en" : "cs", postId: null };
  } catch (e) {
    return HOME;
  }
}

function hrefFor(loc: Loc) {
  return loc.routeId === "post" ? postPath(loc.postId, loc.lang) : routePath(loc.routeId, loc.lang);
}

// ----------------------------------------------------------------------
// MEDIA · skutečné soubory a jejich odvozeniny.
// Kontrakt každého souboru je ve VISUAL-ASSET-PLAN.md.
// ----------------------------------------------------------------------
type Pic = { base: string; widths: number[]; w: number; h: number };

const MEDIA = {
  portrait: { base: "/media/portrait-tanmay", widths: [480, 720, 960, 1280], w: 3024, h: 3780 } as Pic,
  handstand: { base: "/media/practice-handstand-trunk", widths: [480, 720, 1080], w: 2160, h: 3024 } as Pic,
  pine: { base: "/media/practice-sitting-pine", widths: [360, 480, 720], w: 720, h: 900 } as Pic,
  texCotton: "/media/surface-ink-cotton.webp",

  /* Material Landscape · kontrakty v MATERIAL-ASSET-MANIFEST.md.
     Každý soubor je volitelný. Chybějící soubor vrátí rovnou hranu,
     obdélníkovou fotografii a plnou barvu, nikdy prázdné místo. */
  strata: "/media/material/edge-strata.png",
  aperture: "/media/material/mask-aperture.png",
  texSandstone: "/media/material/surface-sandstone.webp",
  cutout: { src: "/media/material/handstand-cutout-bw.webp", w: 522, h: 1400 },
  earthField: "/media/material/field-earth.webp",
  copperLine: "/media/material/line-copper.png",
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
  --text-3:rgba(28,28,26,.66);
  --rule:rgba(28,28,26,.15);
  --rule-2:rgba(28,28,26,.30);
  /* 3:1 proti Linen. Ohraničení užitkové akce musí být vidět. */
  --rule-3:rgba(28,28,26,.52);
  --on-dark:#F4F0EB;
  --on-dark-2:rgba(244,240,235,.80);
  --on-dark-3:rgba(244,240,235,.62);
  --rule-dark:rgba(244,240,235,.18);

  --ff-display:'Cormorant Garamond',Georgia,serif;
  --ff-logo:'Cormorant Garamond',Georgia,serif;
  --ff-body:'DM Sans',system-ui,sans-serif;
  --ff-meta:'Barlow Condensed','DM Sans',system-ui,sans-serif;

  /* Material Landscape · rozšíření webu, ne Brand Canonical.
     Burnt Earth smí nést širokou plochu; Copper zůstává přesný a vzácný. */
  --earth:#754437;
  --sandstone:#E5D8C4;
  --on-earth:#F4F0EB;
  --on-earth-2:rgba(244,240,235,.86);
  --rule-earth:rgba(244,240,235,.24);
  --text-sand:#1C1C1A;
  --text-sand-2:rgba(28,28,26,.78);
  --rule-sand:rgba(28,28,26,.16);

  --maxw:1180px;
  --measure:33em;
  --track:.18em;

  /* Rytmus stránky. Mezery reagují na obsah, ne na jeden obří viewport. */
  --sp-chapter:clamp(48px,6.5vw,88px);
  --sp-section:clamp(36px,5vw,64px);
  --sp-block:clamp(26px,3.4vw,44px);

  --tex-cotton:url("${MEDIA.texCotton}");
  --tex-sand:url("${MEDIA.texSandstone}");
  --strata:url("${MEDIA.strata}");
  --aperture:url("${MEDIA.aperture}");
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
::selection{background:var(--copper); color:var(--linen)}

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
.wrap.limit > *{ max-width:640px }
.wrap.limit--wide > *{ max-width:760px }
.sec{ padding:var(--sp-chapter) 0 }
.sec--tight{ padding:var(--sp-section) 0 }
/* Kapitola s hranou: pruh hrany nahrazuje horní polstrování. */
.sec--edged{ padding-top:0 }
.prose{ max-width:var(--measure) }
.prose p + p{ margin-top:1.15em }
.center{ text-align:center }

.band--dark{
  background-color:var(--forest);
  color:var(--on-dark);
  background-repeat:repeat;
  background-size:512px 512px;
}
html[data-surface="on"] .band--dark{ background-image:var(--tex-cotton) }
.band--dark .h-display{ color:var(--on-dark) }
.band--dark .body-txt{ color:var(--on-dark-2) }
.band--dark .label{ color:var(--sand) }
.band--dark .rule{ background:var(--rule-dark) }

/* ---------- material surfaces ---------- */
.surf--earth{
  background-color:var(--earth);
  color:var(--on-earth);
}
.surf--earth .h-display{ color:var(--on-earth) }
.surf--earth .body-txt{ color:var(--on-earth-2) }
.surf--earth .label{ color:var(--sand) }
.surf--earth .rule{ background:var(--rule-earth) }
.surf--earth .go{ color:var(--on-earth); border-color:var(--rule-earth) }
.surf--earth .go:hover{ border-color:var(--sand) }
.surf--earth :focus-visible{ outline-color:var(--sand) }

.surf--sand{
  background-color:var(--sandstone);
  color:var(--text-sand);
  background-repeat:repeat;
  background-size:384px 384px;
}
html[data-sand="on"] .surf--sand{ background-image:var(--tex-sand) }
.surf--sand .h-display{ color:var(--text-sand) }
.surf--sand .body-txt{ color:var(--text-sand-2) }
.surf--sand .label{ color:var(--text-sand-2) }
.surf--sand .rule{ background:var(--rule-sand) }
.surf--sand .deflist li,
.surf--sand .steps li{ border-top-color:var(--rule-sand) }
.surf--sand .deflist p,
.surf--sand .steps p{ color:var(--text-sand-2) }

/* ---------- strata edge ---------- */
/* Jedna geologická hrana mezi dvěma poli. Pruh nese barvu předchozí
   plochy a rozpouští se do plochy nové. Bez assetu se nevykreslí a
   hranice zůstane rovná. */
.strata{
  height:clamp(34px,5vw,72px);
  margin-bottom:clamp(14px,2.4vw,30px);
  -webkit-mask-image:var(--strata); mask-image:var(--strata);
  -webkit-mask-size:100% 100%; mask-size:100% 100%;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
  pointer-events:none;
}
/* Bez assetu se maska nenačte: Chromium pruh vykreslí plný, Firefox
   vůbec. Obojí je rovná hranice. Pruh má pevnou výšku vždy, takže
   pozdní načtení masky nikdy neposune layout. */
.strata--linen{ background:var(--linen) }
.strata--ink{ background:var(--forest) }
.strata--sand{ background:var(--sandstone) }

.rule{ height:1px; background:var(--rule); border:0 }

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
.h2{ font-size:clamp(1.7rem,3.3vw,2.4rem) }
.h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.28rem,2.2vw,1.62rem); line-height:1.2 }
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
.go--quiet{ font-size:12.5px; color:var(--text-2); border-bottom-color:var(--rule) }
.band--dark .go{ color:var(--on-dark); border-color:var(--rule-dark) }
.band--dark .go:hover{ border-color:var(--sand) }

.mailto{
  font-family:var(--ff-display); font-size:clamp(1.15rem,2.6vw,1.6rem);
  border-bottom:1px solid var(--rule-2); padding-bottom:3px;
  transition:border-color .3s ease; display:inline-block;
}
.mailto:hover{ border-color:var(--copper) }

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
  transition:border-color .3s ease, background-color .3s ease;
}
/* Při scrollu lišta lehce zprůhlední, aby obraz pod ní procházel
   záměrně, ne jako odříznutý. */
.topbar[data-scrolled="1"]{
  border-bottom-color:var(--rule);
  background:rgba(244,240,235,.90);
  -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
}
.topbar .row{ display:flex; align-items:center; gap:clamp(12px,2vw,26px); padding-top:14px; padding-bottom:14px }
.topbar .logo{ font-size:22px; line-height:1; display:inline-flex; align-items:center; min-height:30px }
.topnav{ display:flex; gap:clamp(13px,1.9vw,26px); margin-left:auto }
.topnav a{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12.5px; color:var(--text-2);
  padding:6px 0; border-bottom:1px solid transparent; transition:color .3s, border-color .3s;
}
.topnav a:hover{ color:var(--text) }
.topnav a[aria-current="page"]{ color:var(--text); border-bottom-color:var(--copper) }
.topbar .end{ display:flex; align-items:center; gap:clamp(10px,1.4vw,16px); margin-left:auto }
.topnav + .end{ margin-left:clamp(12px,2vw,26px) }
.lang{ display:flex; align-items:center; gap:6px; font-family:var(--ff-meta); font-size:12.5px; letter-spacing:.14em }
.lang a{ color:var(--text-3); padding:6px 2px; transition:color .3s }
.lang a:hover{ color:var(--text) }
.lang [aria-current="true"]{ color:var(--text); border-bottom:1px solid var(--copper) }
.lang .sep{ color:var(--text-3) }

/* Vstup pro klienty · užitková akce, ne hlavní veřejné CTA.
   Vlasová linka ji odliší od navigace, aniž by soutěžila s CTA. */
.centry{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12px; color:var(--text-2);
  border:1px solid var(--rule-3); padding:7px 12px; white-space:nowrap;
  transition:border-color .3s ease, color .3s ease;
}
.centry:hover{ border-color:var(--copper); color:var(--text) }

.burger{ display:none; padding:10px 0 10px 8px }
.burger b{ display:block; width:24px; height:1.5px; background:var(--text); margin:6px 0; transition:transform .3s ease, opacity .2s ease }
.burger[aria-expanded="true"] b:nth-child(1){ transform:translateY(7.5px) rotate(45deg) }
.burger[aria-expanded="true"] b:nth-child(2){ opacity:0 }
.burger[aria-expanded="true"] b:nth-child(3){ transform:translateY(-7.5px) rotate(-45deg) }
@media (max-width:900px){
  .topnav{ display:none }
  .topbar .lang{ display:none }
  .burger{ display:block }
}
@media (max-width:380px){
  .centry{ padding:7px 9px; letter-spacing:.08em }
}

/* ---------- menu ---------- */
.mmenu{ background:var(--linen); border-bottom:1px solid var(--rule) }
.mmenu[hidden]{ display:none }
.mmenu ul{ list-style:none; padding:4px 0 24px }
.mmenu li{ border-top:1px solid var(--rule) }
.mmenu li:first-child{ border-top:0 }
.mmenu a{ display:flex; align-items:baseline; gap:16px; padding:15px 0; font-family:var(--ff-display); font-size:1.4rem }
.mmenu .num{ min-width:2.2em }
.mmenu .extra{ display:flex; flex-wrap:wrap; gap:18px 22px; padding-top:18px; border-top:1px solid var(--rule); align-items:center }
.mmenu .extra a{ font-family:var(--ff-meta); font-size:12.5px; text-transform:uppercase; letter-spacing:var(--track); color:var(--text-2); padding:6px 0 }
.mmenu .extra .lang{ display:flex }

/* ---------- první obrazovka ---------- */
/* Hero je velkorysý, ale neprodukuje prázdnou druhou polovinu
   viewportu: spodní polstrování je malé a další kapitola začíná hned. */
.opening{ padding:clamp(28px,4.4vw,56px) 0 clamp(20px,3vw,40px) }
.opening .grid{ display:grid; grid-template-columns:1fr; gap:clamp(30px,4.5vw,52px); align-items:start }
.opening .h1{ margin-top:clamp(18px,2.8vw,28px); max-width:11em }
.opening .body-txt{ margin-top:clamp(18px,2.4vw,24px) }
.opening .act{ margin-top:clamp(26px,3.4vw,36px); display:flex; flex-wrap:wrap; gap:16px 28px; align-items:baseline }
.opening .stance{ margin-top:clamp(24px,3.2vw,34px); font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-3) }
@media (min-width:880px){
  .opening.has-portrait .grid{ grid-template-columns:1fr .72fr; gap:clamp(40px,5vw,72px) }
}

/* portrét · fotografie končí ve skutečném materiálu */
.portrait{ position:relative; justify-self:end; width:100%; max-width:440px }
@media (min-width:880px){ .opening.has-portrait .portrait{ margin-top:4px } }
/* tichý pás Burnt Earth za částí portrétu · plocha, ne dekorace */
.portrait::before{
  content:""; position:absolute; z-index:-1;
  top:14%; right:clamp(-30px,-2.2vw,-12px); bottom:-5%; left:58%;
  background:var(--earth);
}
.portrait img{
  width:100%; height:auto; object-fit:cover;
  aspect-ratio:4 / 5;
  object-position:50% 22%;
}
@media (max-width:879px){
  .portrait{ justify-self:stretch; max-width:none; order:-1 }
  .portrait::before{ top:24%; right:-14px; bottom:-4%; left:66% }
  .portrait img{ aspect-ratio:auto; height:clamp(250px,42svh,420px); object-position:50% 20% }
}

/* kamenná apertura · jedna maska pro fotografie, které ji unesou */
html[data-ap="on"] .ap img{
  -webkit-mask-image:var(--aperture); mask-image:var(--aperture);
  -webkit-mask-size:100% 100%; mask-size:100% 100%;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
}

/* ---------- hlavička místnosti ---------- */
.roomhead{ padding:clamp(30px,4.5vw,58px) 0 clamp(20px,2.6vw,32px) }
.roomhead + .sec{ padding-top:clamp(26px,3.6vw,46px) }
.roomhead + .sec--edged{ padding-top:0 }
.roomhead .back{ display:inline-block; padding:5px 0; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.roomhead .back:hover{ color:var(--text) }
.roomhead .h1{ margin-top:clamp(20px,2.8vw,30px) }
.roomhead .lead{ margin-top:clamp(16px,2.2vw,24px) }

/* ---------- kotvy ---------- */
.anchors{ display:grid; gap:0; margin-top:clamp(28px,3.6vw,42px) }
.anchor{ padding:clamp(24px,3.2vw,36px) 0; border-top:1px solid var(--rule-dark) }
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
.diagram{ display:block; width:min(272px,70vw); margin:clamp(32px,4.6vw,48px) auto 0 }
.diagram circle.c{ fill:none; stroke:var(--on-dark-3); stroke-width:1 }
.diagram .b{ fill:var(--copper) }
.diagram text{ font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:.10em; fill:var(--on-dark-2) }
.diagram text.p{ fill:var(--sand); letter-spacing:.16em }

/* ---------- seznam / definice ---------- */
.deflist{ list-style:none; margin-top:clamp(22px,2.8vw,32px) }
.deflist li{ padding:clamp(17px,2.2vw,24px) 0; border-top:1px solid var(--rule) }
.deflist li:first-child{ border-top:0; padding-top:0 }
.deflist h3{ font-family:var(--ff-display); font-weight:400; font-size:1.32rem; line-height:1.25 }
.deflist p{ font-size:15.5px; line-height:1.75; color:var(--text-2); margin-top:8px; max-width:36em }

/* ---------- kroky ---------- */
.steps{ list-style:none; counter-reset:s; margin-top:clamp(22px,2.8vw,32px) }
.steps li{ counter-increment:s; padding:clamp(16px,2.1vw,22px) 0; border-top:1px solid var(--rule); display:grid; grid-template-columns:2.6em 1fr; gap:clamp(10px,2vw,22px); align-items:baseline }
.steps li:first-child{ border-top:0 }
.steps li::before{
  content:counter(s,decimal-leading-zero);
  font-family:var(--ff-meta); letter-spacing:.16em; font-size:12.5px; color:var(--text-3);
}
.steps h3{ font-family:var(--ff-display); font-weight:400; font-size:1.22rem; line-height:1.25 }
.steps p{ font-size:15.5px; line-height:1.75; color:var(--text-2); margin-top:6px; max-width:34em }

/* ---------- příběh ---------- */
.beat{ padding:clamp(24px,3.4vw,40px) 0; border-top:1px solid var(--rule) }
.beat:first-of-type{ border-top:0 }
.beat .label{ color:var(--text-3) }
.beat .prose{ margin-top:14px }
.beat p{ font-size:16.5px; line-height:1.85; color:var(--text) }

/* ---------- události ---------- */
.events{ list-style:none; margin-top:clamp(22px,3vw,34px) }
.events li{ border-top:1px solid var(--rule); padding:clamp(20px,2.8vw,30px) 0 }
.events li:last-child{ border-bottom:1px solid var(--rule) }
.event{ display:grid; grid-template-columns:1fr; gap:10px }
.event .when{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.event .meta{ font-size:14px; color:var(--text-3); margin-top:4px }
.event p{ font-size:15.5px; color:var(--text-2); margin-top:10px; max-width:36em }
.event .state{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-2); display:inline-flex; align-items:center; gap:8px }
.event .state .bindu{ width:6px; height:6px }
@media (min-width:760px){
  .event{ grid-template-columns:13em 1fr 8.5em; gap:clamp(18px,3vw,36px); align-items:start }
  .event .state{ justify-self:end }
}

/* ---------- zápisy ---------- */
.posts{ list-style:none; margin-top:clamp(22px,3vw,34px) }
.posts li{ border-top:1px solid var(--rule) }
.posts li:last-child{ border-bottom:1px solid var(--rule) }
.post{ display:block; padding:clamp(22px,3vw,32px) 0 }
.post .top{ display:flex; gap:14px; align-items:baseline; flex-wrap:wrap }
.post h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.32rem,2.3vw,1.7rem); line-height:1.2; margin-top:10px; transition:color .3s ease }
.post p{ font-size:15.5px; color:var(--text-2); margin-top:10px; max-width:38em }
.post .more{ display:inline-block; margin-top:14px; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-2) }
.post:hover h3{ text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px }

/* ---------- článek ---------- */
.article{ max-width:640px; margin:0 auto; padding:clamp(24px,4vw,44px) 0 clamp(46px,7vw,80px) }
.article h1{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.9rem,4.6vw,2.7rem); line-height:1.15; margin-top:16px; text-wrap:balance }
.article .rbody p{ font-size:16.5px; line-height:1.9; margin-top:1.15em; color:var(--text) }
.article .rbody p:first-child{ margin-top:clamp(24px,3.6vw,34px) }
.article .after{ margin-top:clamp(40px,6vw,64px); border-top:1px solid var(--rule); padding-top:clamp(22px,3vw,30px); display:flex; flex-wrap:wrap; gap:16px 30px }

/* ---------- obraz jako důkaz ---------- */
.figure{ margin-top:var(--sp-block) }
.figure img{ width:100%; object-fit:cover }
.figure figcaption{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-3); margin-top:12px }
.surf--sand .figure figcaption{ color:var(--text-sand-2) }
/* Ne každý obraz končí ve stejném obdélníku. Poměr určuje předloha. */
.figure--tall{ max-width:560px }
.figure--tall img{ aspect-ratio:5 / 7 }
.figure--pine{ max-width:470px; margin-left:auto }
.figure--pine img{ aspect-ratio:4 / 5 }
@media (max-width:600px){
  .figure--tall, .figure--pine{ max-width:none; margin-left:0 }
}

/* ---------- kapitola Pro koho · Ink, výřez postavy, zemitá deska ---------- */
.who{ position:relative; overflow:hidden }
.who .grid{ display:grid; grid-template-columns:1fr; gap:clamp(26px,4vw,44px); align-items:end }
.who .prose{ position:relative; z-index:2 }
.cutwrap{ position:relative; z-index:1; justify-self:center; width:min(300px,68vw) }
.cutwrap .slab{
  position:absolute; z-index:0; left:-14%; right:-20%; top:16%; bottom:-8%;
  width:auto; height:auto; object-fit:cover; opacity:.96;
}
.cutwrap .cut{ position:relative; z-index:1; width:100%; height:auto }
.who .terrain{
  position:absolute; z-index:0; right:-4%; top:6%;
  width:min(52vw,680px); opacity:.20; pointer-events:none;
}
@media (min-width:880px){
  .who .grid{ grid-template-columns:1.15fr .85fr; gap:clamp(36px,5vw,72px) }
  .cutwrap{ justify-self:end; width:clamp(240px,24vw,330px); margin-top:calc(-1 * clamp(48px,9vw,120px)) }
}
@media (max-width:879px){
  .who .terrain{ display:none }
  .cutwrap{ margin-top:-32px }
}

/* ---------- pískovcová kapitola · editorial řádky ---------- */
.chapter{ display:grid; gap:0; margin-top:var(--sp-block) }
.chapter .row{
  display:grid; grid-template-columns:1fr; gap:10px clamp(22px,3.4vw,44px);
  padding:clamp(20px,2.8vw,30px) 0; border-top:1px solid var(--rule-sand);
}
.chapter .row:first-child{ border-top:0; padding-top:0 }
.chapter .row h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.3rem,2.3vw,1.66rem); line-height:1.2 }
.chapter .row p{ font-size:15.5px; line-height:1.75; color:var(--text-sand-2); max-width:36em }
.chapter .row .num{ padding-top:6px }
@media (min-width:820px){
  .chapter .row{ grid-template-columns:3.2em 15em 1fr; align-items:start }
  .chapter .row p{ margin-top:0 }
}

/* obraz smí přesáhnout textový measure · pravý přesah na desktopu */
.bleed-r{ margin-left:auto }
@media (min-width:1024px){
  .bleed-r{ margin-right:calc(-1 * clamp(0px,4.5vw,64px)) }
}

/* svislá zemitá linka u procesního bloku */
.railed{ border-left:3px solid var(--earth); padding-left:clamp(18px,2.6vw,30px) }

/* kompaktní pětikrokový rytmus vedle textu o spolupráci */
.collab{ display:grid; grid-template-columns:1fr; gap:clamp(24px,3.4vw,44px); align-items:start }
.minirail{ list-style:none; counter-reset:mr; max-width:19em; margin-top:22px }
.minirail li{
  counter-increment:mr;
  display:flex; align-items:baseline; gap:14px;
  padding:12px 0; border-top:1px solid var(--rule);
  font-family:var(--ff-display); font-size:clamp(1.1rem,1.8vw,1.3rem); line-height:1.3;
}
.minirail li:first-child{ border-top:0 }
.minirail li::before{
  content:counter(mr,decimal-leading-zero);
  font-family:var(--ff-meta); letter-spacing:.16em; font-size:12px; color:var(--text-3);
}
@media (min-width:880px){
  .collab{ grid-template-columns:1.2fr .8fr; gap:clamp(40px,6vw,88px) }
  .minirail{ justify-self:end; width:100%; margin-top:10px }
}

/* ---------- proužek pro klienty · ohraničený pískovec ---------- */
.strip{
  background:var(--sandstone);
  border-top:1px solid var(--rule-sand); border-bottom:1px solid var(--rule-sand);
  padding:clamp(26px,3.6vw,40px) 0; margin-top:var(--sp-chapter);
}
html[data-sand="on"] .strip{ background-image:var(--tex-sand); background-size:384px 384px }
.strip p{ color:var(--text-sand-2) }
.strip .in{ display:grid; gap:14px }
.strip h2{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.35rem,2.5vw,1.75rem); line-height:1.2 }
.strip p{ font-size:15.5px; color:var(--text-2); max-width:34em }
@media (min-width:820px){
  .strip .in{ grid-template-columns:1fr auto; align-items:center; gap:30px }
  .strip .act{ justify-self:end }
}

/* ---------- rozcestí ---------- */
.teasers{ display:grid; gap:0; margin-top:clamp(30px,4vw,44px) }
.teaser{ display:block; padding:clamp(22px,3vw,30px) 0; border-top:1px solid var(--rule) }
.teaser:last-child{ border-bottom:1px solid var(--rule) }
.teaser h3{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.3rem,2.3vw,1.6rem); line-height:1.2; margin-top:8px }
.teaser p{ font-size:15.5px; color:var(--text-2); margin-top:8px; max-width:36em }
.teaser:hover h3{ text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px }
@media (min-width:820px){
  .teasers{ grid-template-columns:1fr 1fr; gap:0 clamp(30px,5vw,64px) }
  .teaser:last-child{ border-bottom:0 }
  .teaser{ border-bottom:1px solid var(--rule) }
}

/* ---------- závěr ---------- */
.closing{ text-align:center }
.closing .wm{ font-size:clamp(42px,8vw,66px) }
.closing .mean{ font-family:var(--ff-display); font-style:italic; color:var(--sand); font-size:1.05rem; margin-top:16px }
.closing .stance{ font-family:var(--ff-display); font-size:clamp(1.7rem,4.4vw,2.7rem); line-height:1.2; margin-top:clamp(30px,4.4vw,44px) }
.compass{ margin-top:clamp(36px,5.4vw,56px) }
.compass .lines{ font-family:var(--ff-display); font-size:clamp(1.2rem,2.6vw,1.6rem); line-height:1.7; color:var(--on-dark); margin-top:16px }

/* ---------- právo ---------- */
.legal h2{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.3rem,2.4vw,1.6rem); margin-top:clamp(34px,4.4vw,46px) }
.legal h2:first-of-type{ margin-top:clamp(24px,3vw,32px) }
.legal p{ font-size:16px; line-height:1.8; color:var(--text-2); max-width:34em; margin-top:12px }

/* ---------- 404 ---------- */
.nf{ padding:clamp(60px,12vw,140px) 0 clamp(50px,9vw,110px) }
.nf .h1{ max-width:12em }
.nf .body-txt{ margin-top:20px }
.nf .act{ margin-top:32px; display:flex; flex-wrap:wrap; gap:16px 28px }

/* ---------- patička ---------- */
footer{ background:var(--linen); padding:clamp(36px,5.4vw,60px) 0 clamp(32px,4.6vw,50px) }
footer .frow{ display:flex; flex-wrap:wrap; gap:18px 30px; align-items:baseline; justify-content:space-between; border-top:1px solid var(--rule); padding-top:clamp(24px,3.6vw,34px) }
footer .wm{ font-size:20px }
footer .frow > a{ display:inline-flex; align-items:center; min-height:26px }
footer .fmeta{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-3) }
footer .flinks{ display:flex; flex-wrap:wrap; gap:8px 20px }
footer .flinks a{ display:inline-block; padding:6px 0; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-2) }
footer .flinks a:hover{ color:var(--text) }
footer .fnote{ font-size:13px; color:var(--text-3); margin-top:20px; max-width:44em }

/* ---------- pohyb ---------- */
.rv{ opacity:0; transform:translateY(14px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.65,.25,1) }
.rv.on{ opacity:1; transform:none }
.d1{ transition-delay:.08s } .d2{ transition-delay:.16s } .d3{ transition-delay:.24s }

@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto }
  .rv{ opacity:1; transform:none; transition:none }
  *,*::before,*::after{ animation-duration:.001ms !important; transition-duration:.001ms !important }
}

/* ---------- tisk ---------- */
@media print{
  .topbar,.mmenu,.skip{ display:none !important }
  body{ background:#fff; color:#000 }
  .band--dark{ background:#fff !important; color:#000 !important }
}
`;

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

/** Tři kotvy · Brand Book V2, strany 07 až 09. Text je kanonický. */
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
 * Obchodní rámec osobní práce existuje a je Tanmayem schválený, ale
 * projekt Offers ho zatím neuvolnil ke zveřejnění: chybí pět rozhodnutí
 * (délka setkání, místo v Praze, storno, první krok, počet klientů) a
 * osm bodů právního ověření. Do té doby se na webu nezveřejňuje žádná
 * cena, žádný název balíčku ani počet setkání.
 *
 * Až Offers nabídku uvolní, doplní se sem položky a `OfferSlot` je
 * vykreslí beze změny layoutu. Podrobnosti v PUBLIC-FACTS-LEDGER.md.
 *
 * Tvar jedné položky:
 *   { kindcs, kinden, tcs, ten, pcs, pen, forcs, foren,
 *     inccs, incen, notcs, noten, lencs, lenen, pricecs, priceen,
 *     stepcs, stepen }
 */
const OFFERS: any[] = [];

/**
 * Události.
 *
 * „Den v lese“, říjen 2026, je veřejně ohlášená událost. Jako veřejně
 * uvedenou ji potvrzuje i Work/offers/OFFER.md §14. Zůstává a má
 * konkrétní další krok, aby stav „otevřeno“ znamenal něco, co jde udělat.
 *
 * Únorová „Zimní tichá praxe“ 2027 se z veřejného webu odebrala. Nikde
 * jinde ve workspace není doložená, byla osmnáct měsíců dopředu a její
 * stav „připravuje se“ je z pohledu návštěvníka „coming soon“. Znění
 * zůstalo v PUBLIC-FACTS-LEDGER.md; až ji Tanmay potvrdí, vrátí se sem
 * jako další položka a sekce ji vykreslí beze změny layoutu.
 */
const EVENTS = [
  {
    wcs: "Říjen 2026", wen: "October 2026",
    tcs: "Den v lese", ten: "A day in the forest",
    metacs: "Brdy · sobota · nejvýš osm lidí", metaen: "Brdy hills · Saturday · eight people at most",
    pcs: "Od rána do tmy venku. Pohyb mezi stromy, chůze, ticho, jídlo u ohně. Žádný výkon, žádné telefony. Jen tělo, les a pozornost.",
    pen: "Outside from morning until dark. Movement among the trees, walking, silence, food by the fire. No performance, no phones. Just the body, the forest and attention.",
  },
];

/** Skutečné autorské zápisy. Nic z toho není vygenerované. */
const BODIES: Record<string, { cs: string[]; en: string[] }> = {
  p1: {
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
  p2: {
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
  p3: {
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
};

// ----------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------
/**
 * Zjistí, jestli materiálový soubor existuje. Chybějící soubor nic
 * nerozbije. `enabled` je tam proto, aby se maska ani textura nestahovaly
 * na místnostech, kde je stránka nepoužije.
 */
function useAsset(url: string, enabled = true) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!enabled) { setOk(false); return; }
    let alive = true;
    const img = new Image();
    img.onload = () => { if (alive) setOk(true); };
    img.onerror = () => { if (alive) setOk(false); };
    img.src = url;
    return () => { alive = false; };
  }, [url, enabled]);
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

const Go = ({ href, cs, en, external = false, quiet = false }: any) => (
  <a
    className={"go" + (quiet ? " go--quiet" : "")}
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {L(cs, en)}<span className="arw" aria-hidden="true">→</span>
  </a>
);

/** Vstup pro klienty. Jedna komponenta, jedna adresa, čtyři místa. */
const ClientEntry = ({ className = "centry" }: any) => (
  <a className={className} href={CLIENT_APP_URL} target="_blank" rel="noopener noreferrer">
    {L("Vstup pro klienty", "Client login")}
  </a>
);

/**
 * Fotografie jako důkaz.
 *
 * Odvozeniny se vybírají přes srcset, takže se stahuje jen ta správná
 * šířka. Když soubor chybí, `onError` prvek odstraní. Nikdy nevznikne
 * prázdný rám ani rozbitá ikona a nic se nestahuje dvakrát.
 */
function Evidence({ pic, alt, caption, sizes, variant = "tall", eager = false, ap = false, bleed = false }: any) {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  const set = (ext: string) =>
    pic.widths.map((w: number) => `${pic.base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <figure className={
      "figure figure--" + variant + (ap ? " ap" : "") + (bleed ? " bleed-r" : "") + (eager ? "" : " rv")
    }>
      <picture>
        <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
        <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
        <img
          src={pic.base + ".jpg"}
          alt={alt}
          width={pic.w}
          height={pic.h}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          onError={() => setGone(true)}
          {...(eager ? ({ fetchPriority: "high" } as any) : {})}
        />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

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

function RoomHead({ routeId, lang, titleCs, titleEn, leadCs, leadEn }: any) {
  const r = ROUTES.find((x: any) => x.id === routeId);
  return (
    <div className="roomhead">
      <div className="wrap">
        <a className="back" href={routePath("home", lang)}>‹ {L("Domů", "Home")}</a>
        <p className="num" style={{ marginTop: 18 }}>
          {r.num} · {L(r.label.cs, r.label.en)}
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
        <div style={{ paddingTop: "clamp(24px,3.6vw,34px)" }}>
          <p className="quote rv">{L(cs, en)}</p>
          <p className="rv d1" style={{ marginTop: 20 }}>
            <Go href={href} cs={gocs} en={goen} />
          </p>
        </div>
      </div>
    </section>
  );
}

/** Tichý proužek pro lidi, kteří už klienti jsou. Nikdy hlavní CTA. */
function ClientStrip({ lang }: any) {
  return (
    <section className="strip" aria-label={L("Pro klienty", "For clients")}>
      <div className="wrap">
        <div className="in">
          <div>
            <h2 className="rv">{L("Už se mnou pracuješ?", "Already working with me?")}</h2>
            <p className="rv d1" style={{ marginTop: 10 }}>
              {L(
                "Plán, termíny, zápisy a zdroje k praxi máš na jednom místě. Přístup dostaneš ode mě na začátku spolupráce.",
                "Your plan, sessions, notes and practice sources are in one place. You receive access from me when we begin working together."
              )}
            </p>
          </div>
          <p className="act rv d1">
            <ClientEntry />
          </p>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// CHROME
// ----------------------------------------------------------------------
function TopBar({ loc, menuOpen, onMenu }: any) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  const other = otherLangPath(loc.routeId, loc.lang, loc.postId);
  return (
    <div className="topbar" data-scrolled={scrolled ? "1" : "0"}>
      <div className="wrap row">
        <a href={routePath("home", loc.lang)} className="logo" aria-label="tanmay"><Wordmark /></a>
        <nav className="topnav" aria-label={L("Hlavní navigace", "Main navigation")}>
          {ROUTES.filter((r: any) => r.nav).map((r: any) => (
            <a
              key={r.id}
              href={r.path[loc.lang]}
              aria-current={loc.routeId === r.id ? "page" : undefined}
            >
              {L((r.navLabel || r.label).cs, (r.navLabel || r.label).en)}
            </a>
          ))}
        </nav>
        <div className="end">
          <div className="lang" aria-label={L("Jazyk", "Language")}>
            {loc.lang === "cs"
              ? <span aria-current="true">CZ</span>
              : <a href={other} hrefLang="cs">CZ</a>}
            <span className="sep" aria-hidden="true">·</span>
            {loc.lang === "en"
              ? <span aria-current="true">EN</span>
              : <a href={other} hrefLang="en">EN</a>}
          </div>
          <ClientEntry />
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

function Menu({ open, onClose, loc }: any) {
  const other = otherLangPath(loc.routeId, loc.lang, loc.postId);
  return (
    <div className="mmenu" id="tm-menu" hidden={!open}>
      <div className="wrap">
        <ul>
          {ROUTES.filter((r: any) => r.nav).map((r: any) => (
            <li key={r.id}>
              <a
                href={r.path[loc.lang]}
                onClick={onClose}
                aria-current={loc.routeId === r.id ? "page" : undefined}
              >
                <span className="num">{r.num}</span>
                <span>{L(r.label.cs, r.label.en)}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="extra">
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}>Instagram</a>
          <a href={"mailto:" + MAIL} onClick={onClose}>{L("E-mail", "Email")}</a>
          <span className="lang">
            {loc.lang === "cs"
              ? <span aria-current="true">CZ</span>
              : <a href={other} hrefLang="cs">CZ</a>}
            <span className="sep" aria-hidden="true">·</span>
            {loc.lang === "en"
              ? <span aria-current="true">EN</span>
              : <a href={other} hrefLang="en">EN</a>}
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// HOME
// ----------------------------------------------------------------------
function Opening({ lang }: any) {
  const [noPortrait, setNoPortrait] = useState(false);
  const p = MEDIA.portrait;
  const set = (ext: string) => p.widths.map((w) => `${p.base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <header className={"opening" + (noPortrait ? "" : " has-portrait")}>
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
            <Go href={routePath("spoluprace", lang)} cs="Jak se dá pracovat spolu" en="How we can work together" />
            <Go href={routePath("praxe", lang)} cs="Co tahle práce je" en="What this work is" quiet />
          </p>
          <p className="stance rv d3">
            {L("tělo · praxe · divoká příroda", "body · practice · wild nature")}
          </p>
        </div>
        {noPortrait ? null : (
          <div className="portrait ap rv d1">
            <picture>
              <source type="image/avif" srcSet={set("avif")} sizes="(min-width:880px) 430px, 100vw" />
              <source type="image/webp" srcSet={set("webp")} sizes="(min-width:880px) 430px, 100vw" />
              <img
                src={p.base + ".jpg"}
                alt={L(
                  "Tanmay, portrét zblízka, přirozené světlo, skála za zády.",
                  "Tanmay, a close portrait in natural light, rock face behind him."
                )}
                width={p.w}
                height={p.h}
                sizes="(min-width:880px) 430px, 100vw"
                decoding="sync"
                onError={() => setNoPortrait(true)}
                {...({ fetchPriority: "high" } as any)}
              />
            </picture>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Pro koho to je · Ink Cotton, černobílý výřez skutečného stoje na rukou.
 * Postava přemosťuje hranu: chodidla stoupají přes stratovou hranu do
 * Linen nad sekcí. Výřez je na celém webu jen jednou, tady.
 */
function HomeAudience() {
  const [noCut, setNoCut] = useState(false);
  return (
    <section className="band--dark sec sec--edged who" aria-labelledby="h-audience">
      <div className="strata strata--linen" aria-hidden="true" />
      {noCut ? null : (
        <img
          className="terrain"
          src={MEDIA.copperLine}
          alt=""
          aria-hidden="true"
          width={1800}
          height={272}
          loading="lazy"
          decoding="async"
          onError={() => {}}
        />
      )}
      <div className="wrap grid">
        <div className="prose">
          <h2 className="h-display h2 rv" id="h-audience">
            {L("Pro koho to je", "Who this is for")}
          </h2>
          <div className="rv d1" style={{ marginTop: 18 }}>
            <p className="body-txt">
              {L(
                "Umíš vytrvat v tom, pro co se rozhodneš. Přesto je mezi tím, čemu rozumíš, a tím, jak doopravdy žiješ, kus vzdálenosti.",
                "You know how to commit to what you decide. And still there is a distance between what you understand and how you actually live."
              )}
            </p>
            <p className="body-txt" style={{ marginTop: "1.15em" }}>
              {L(
                "Nehledáš další identitu, kterou bys předváděl. Nehledáš gurua. Chceš praxi, která bude spolehlivější, tělesnější a víc tvoje.",
                "You are not looking for another identity to perform. You are not looking for a guru. You want a practice that is more reliable, more physical and more your own."
              )}
            </p>
          </div>
        </div>
        {noCut ? null : (
          <div className="cutwrap rv d1">
            <img
              className="slab"
              src={MEDIA.earthField}
              alt=""
              aria-hidden="true"
              width={684}
              height={1100}
              loading="lazy"
              decoding="async"
              onError={(e: any) => { e.currentTarget.style.display = "none"; }}
            />
            <img
              className="cut"
              src={MEDIA.cutout.src}
              alt={L(
                "Stoj na rukou, černobílá fotografie celé postavy.",
                "A handstand, black-and-white photograph of the whole figure."
              )}
              width={MEDIA.cutout.w}
              height={MEDIA.cutout.h}
              loading="lazy"
              decoding="async"
              onError={() => setNoCut(true)}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function HomeWork({ lang }: any) {
  return (
    <section className="surf--sand sec sec--edged" aria-labelledby="h-work">
      <div className="strata strata--ink" aria-hidden="true" />
      <div className="wrap">
        <h2 className="h-display h2 rv" id="h-work">
          {L("Co se v té práci děje", "What actually happens in the work")}
        </h2>
        <div className="chapter rv d1">
          <div className="row">
            <span className="num">01</span>
            <h3>{L("Co trénujeme", "What we train")}</h3>
            <p>{L(
              "Páteří je trénink s vlastní vahou a kalistenika. Pohybová dovednost, síla v celém rozsahu pohybu, kontrola, postup od jednodušší varianty ke složitější. Kruhy, činky a nářadí tam, kde posunou konkrétní cíl. Parkour a jóga jsou zázemí, ze kterého se čerpá.",
              "The spine of the work is bodyweight training and calisthenics. Movement skill, strength through full range, control, progression from a simpler variant to a harder one. Rings, weights and apparatus where they move a specific goal. Parkour and yoga are the background it draws on."
            )}</p>
          </div>
          <div className="row">
            <span className="num">02</span>
            <h3>{L("Jak se to drží", "How it is held")}</h3>
            <p>{L(
              "Setkání je z většiny pohyb. Z toho, co se v něm ukáže, vznikne plán na další období: co trénovat, kolik toho unese tvůj týden a čeho se v horším týdnu držet. Praxe mezi setkáními je vlastní produkt, ne domácí úkol.",
              "A session is mostly movement. What shows up in it becomes the plan for the period that follows: what to train, how much your week can carry, and what to hold on to in a worse week. The practice between sessions is the actual product, not homework."
            )}</p>
          </div>
          <div className="row">
            <span className="num">03</span>
            <h3>{L("Co se mění mezi setkáními", "What changes between sessions")}</h3>
            <p>{L(
              "Zapisuješ, co se skutečně dělo, ne co mělo. Podle toho se plán upraví. Reflexe a zápis nejsou rituál. Jsou to nástroje, které rozhodují o tom, co se bude dělat příště.",
              "You record what actually happened, not what was supposed to. The plan is adjusted from that. Reflection and logging are not a ritual. They are the tools that decide what happens next time."
            )}</p>
          </div>
        </div>

        <Evidence
          pic={MEDIA.handstand}
          variant="tall"
          ap
          bleed
          sizes="(min-width:760px) 560px, calc(100vw - 44px)"
          alt={L(
            "Stoj na rukou na padlém kmeni v lese, obě dlaně na mechu.",
            "A handstand on a fallen trunk in the forest, both palms on the moss."
          )}
          caption={L("Praxe venku · jarní les · padlý kmen", "Practice outdoors · spring forest · a fallen trunk")}
        />

        <p className="rv d2" style={{ marginTop: "clamp(26px,3.4vw,34px)" }}>
          <Go href={routePath("praxe", lang)} cs="Celá praxe" en="The whole practice" />
        </p>
      </div>
    </section>
  );
}

function HomeCollab({ lang }: any) {
  return (
    <section className="sec" aria-labelledby="h-collab">
      <div className="wrap">
        <h2 className="h-display h2 rv" id="h-collab">
          {L("Jak se dá pracovat spolu", "How we can work together")}
        </h2>
        <div className="collab">
        <div className="prose railed rv d1" style={{ marginTop: 22 }}>
          <p className="body-txt">
            {L(
              "Osobní práce probíhá jeden na jednoho v Praze. Scházíme se pravidelně, mezi setkáními vedeš svoji praxi sám a spolu ji upravujeme podle toho, co se doopravdy stalo.",
              "The personal work is one to one, in Prague. We meet regularly, between sessions you run your own practice, and we adjust it together according to what actually happened."
            )}
          </p>
          <p className="body-txt">
            {L(
              "Pracuju s málo lidmi a zblízka. Vedení, ne závislost. Cílem je, aby sis praxi jednou vedl sám.",
              "I work with few people, closely. Guidance, not dependence. The aim is that one day you run the practice yourself."
            )}
          </p>
        </div>
        <ol className="minirail rv d2" aria-label={L("Průběh spolupráce", "How the collaboration runs")}>
          <li>{L("První rozhovor", "First conversation")}</li>
          <li>{L("Vstupní setkání", "First session")}</li>
          <li>{L("Směr a plán", "Direction and plan")}</li>
          <li>{L("Praxe a zápis", "Practice and record")}</li>
          <li>{L("Revize", "Review")}</li>
        </ol>
        </div>
        <p className="rv d2" style={{ marginTop: "clamp(26px,3.4vw,34px)" }}>
          <Go href={routePath("spoluprace", lang)} cs="Jak to probíhá a jak začít" en="How it runs and how to start" />
        </p>
      </div>
    </section>
  );
}

function HomeTeasers({ lang }: any) {
  const latest = POSTS[0];
  return (
    <section className="sec" aria-labelledby="h-more">
      <div className="wrap">
        <h2 className="h-display h2 rv" id="h-more">{L("Odkud to vyrostlo", "Where this grew from")}</h2>
        <div className="teasers">
          <a className="teaser rv" href={routePath("pribeh", lang)}>
            <span className="num">02 · {L("Příběh", "The story")}</span>
            <h3>{L("Pád, sestup, návrat", "The fall, the descent, the return")}</h3>
            <p>{L(
              "Kdo jsem teď, odkud tahle práce vyrostla a co na ní změnila nehoda. Příběh vysvětluje závazek. Nedokazuje nadřazenost.",
              "Who I am now, where this work grew from and what the accident changed about it. The story explains the commitment. It does not prove superiority."
            )}</p>
          </a>
          <a className="teaser rv d1" href={routePath("denik", lang)}>
            <span className="num">04 · {L("Deník praxe", "Practice log")}</span>
            <h3>{L(latest.title.cs, latest.title.en)}</h3>
            <p>{L(latest.excerpt.cs, latest.excerpt.en)}</p>
          </a>
        </div>
      </div>
    </section>
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

function PageHome({ lang }: any) {
  return (
    <>
      <Opening lang={lang} />
      <HomeAudience />
      <HomeWork lang={lang} />
      <HomeCollab lang={lang} />
      <ClientStrip lang={lang} />
      <HomeTeasers lang={lang} />
      <Closing />
    </>
  );
}

// ----------------------------------------------------------------------
// 01 · PRAXE
// ----------------------------------------------------------------------
function PagePraxe({ lang }: any) {
  return (
    <>
      <RoomHead
        routeId="praxe"
        lang={lang}
        titleCs="Co je tahle praxe"
        titleEn="What this practice is"
        leadCs="Denní práce s tělem a myslí, držená pohromadě vztahem k divoké přírodě. Tři kotvy, jedna praxe."
        leadEn="Daily work with body and mind, held together by a relationship with wild nature. Three anchors, one practice."
      />

      <section className="sec--tight">
        <div className="wrap">
          <div className="prose rv">
            <p className="body-txt">
              {L(
                "Praxe tady neznamená program, kterým se projde. Znamená vztah k něčemu, k čemu se dá vracet, když se změní energie, okolnosti i chuť. Forma se mění. Vztah zůstává.",
                "Practice here does not mean a programme you get through. It means a relationship with something you can return to when energy, circumstances and appetite change. The form changes. The relationship stays."
              )}
            </p>
            <p className="body-txt">
              {L(
                "Cílem není další dokonalá rutina. Je to praxe, která se umí přizpůsobit, aniž by zmizela.",
                "The aim is not another perfect routine. It is a practice that can adapt without disappearing."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="band--dark sec" aria-labelledby="h-anchors">
        <div className="wrap">
          <p className="label label--sand rv" id="h-anchors">{L("Tři kotvy", "Three anchors")}</p>
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

          <p className="quote rv" style={{ color: "var(--on-dark)", maxWidth: "26em", margin: "clamp(28px,3.6vw,42px) auto 0", textAlign: "center" }}>
            {L(
              "Přítomnost není čtvrtá kotva. Je to to, co vzniká, když se ty tři drží pohromadě.",
              "Presence is not a fourth anchor. It is what emerges when the three are held together."
            )}
          </p>
        </div>
      </section>

      <section className="surf--sand sec sec--edged">
        <div className="strata strata--ink" aria-hidden="true" />
        <div className="wrap">
          <h2 className="h-display h2 rv">{L("Co může setkání obsahovat", "What a session can contain")}</h2>
          <p className="body-txt rv d1" style={{ marginTop: 16 }}>
            {L(
              "Ne všechno naráz a ne všechno pro každého. Skladba se řídí tím, na čem zrovna pracujeme.",
              "Not all of it at once and not all of it for everyone. What is in it follows what we are working on."
            )}
          </p>
          <ul className="deflist rv d1">
            <li>
              <h3>{L("Technická práce na konkrétním pohybu", "Technical work on a specific movement")}</h3>
              <p>{L(
                "Dva nebo tři pohyby, na kterých se dá poznat rozdíl. Postup od varianty, kterou zvládneš čistě, k té další.",
                "Two or three movements where a difference is actually visible. Progression from the variant you can do cleanly to the next one."
              )}</p>
            </li>
            <li>
              <h3>{L("Síla a rozsah", "Strength and range")}</h3>
              <p>{L(
                "Síla v celém rozsahu pohybu, ne jen v tom pohodlném kusu. Kvalita pohybu se počítá stejně jako množství.",
                "Strength through the whole range, not only the comfortable part of it. The quality of the movement counts as much as the amount."
              )}</p>
            </li>
            <li>
              <h3>{L("Dech a pozornost", "Breath and attention")}</h3>
              <p>{L(
                "Tam, kde mají skutečnou roli: v obtížné pozici, v zotavení, v tom, jak poznáš rozdíl mezi únavou a hranicí.",
                "Where they have a real role: in a hard position, in recovery, in how you tell the difference between fatigue and a limit."
              )}</p>
            </li>
            <li>
              <h3>{L("Zápis na konci", "A note at the end")}</h3>
              <p>{L(
                "Co se stalo, co šlo, co ne. Pár řádků. Z nich se skládá úprava praxe na další období.",
                "What happened, what worked, what did not. A few lines. The next adjustment to the practice is built from them."
              )}</p>
            </li>
          </ul>

          <Evidence
            pic={MEDIA.handstand}
            variant="tall"
            ap
            bleed
            sizes="(min-width:760px) 560px, calc(100vw - 44px)"
            alt={L(
              "Stoj na rukou na padlém kmeni v lese, obě dlaně na mechu.",
              "A handstand on a fallen trunk in the forest, both palms on the moss."
            )}
            caption={L("Takhle to venku vypadá doopravdy", "This is what it actually looks like outdoors")}
          />
        </div>
      </section>

      <section className="sec--tight">
        <div className="wrap">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(30px,4vw,44px)" }}>
            <h2 className="h-display h2 rv">{L("Jak se ze směru stane praxe", "How a direction becomes a practice")}</h2>
            <ol className="steps rv d1">
              <li>
                <div>
                  <h3>{L("Domluvíme směr", "We agree a direction")}</h3>
                  <p>{L(
                    "Dvě nebo tři konkrétní věci, na kterých bude poznat, jestli se něco hnulo. Ne seznam přání.",
                    "Two or three concrete things that will show whether anything moved. Not a wish list."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Vznikne plán", "A plan comes out of it")}</h3>
                  <p>{L(
                    "Co trénovat, jak často a co dělat v týdnu, který se nepovede. Plán, který existuje jen v dobrých dnech, není praxe.",
                    "What to train, how often, and what to do in a week that falls apart. A plan that only exists on good days is not a practice."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Plán potká skutečný den", "The plan meets a real day")}</h3>
                  <p>{L(
                    "Nemoc, práce, cesta, špatný spánek. Praxe se zkrátí, ne zruší. Umět ji zkrátit je dovednost, která se trénuje.",
                    "Illness, work, travel, bad sleep. The practice gets shorter, not cancelled. Knowing how to shorten it is a skill you train."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Zápis ukáže, co se dělo", "The record shows what happened")}</h3>
                  <p>{L(
                    "Bez zápisu si obě strany pamatují jen dojem. Se zápisem se dá rozhodovat podle důkazu, ne podle nálady.",
                    "Without a record both sides only remember an impression. With one, decisions come from evidence rather than mood."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Praxe se upraví", "The practice is adjusted")}</h3>
                  <p>{L(
                    "Přidá se, ubere se, něco se vymění. Tohle je ta vlastní práce. Setkání ji jen otevírá a zavírá.",
                    "Something is added, something removed, something swapped. This is the actual work. The session only opens and closes it."
                  )}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
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
      </section>

      <NextRoom
        href={routePath("pribeh", lang)}
        cs="Odkud se to vzalo, vysvětluje závazek. Nedokazuje nadřazenost."
        en="Where this came from explains the commitment. It does not prove superiority."
        gocs="Dál · Příběh"
        goen="Next · The story"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// 02 · PŘÍBĚH
// ----------------------------------------------------------------------
function PagePribeh({ lang }: any) {
  return (
    <>
      <RoomHead
        routeId="pribeh"
        lang={lang}
        titleCs="Příběh"
        titleEn="The story"
        leadCs="Příběh vysvětluje závazek. Nedokazuje nadřazenost."
        leadEn="The story explains the commitment. It does not prove superiority."
      />

      <section className="sec--tight">
        <div className="wrap limit--wide">
          <div className="prose rv">
            <p className="body-txt">
              {L(
                "Jmenuju se Tanmay a učím koučink pohybu a praxe. Pracuju s lidmi v Praze, jeden na jednoho, a vedle toho vedu dny venku. Praktikuju denně: pohyb, meditace a návraty na stejná místa v lese.",
                "My name is Tanmay and I coach movement and practice. I work with people in Prague, one to one, and alongside that I lead days outdoors. I practice daily: movement, meditation and returning to the same places in the forest."
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
      </section>

      <section className="sec--tight">
        <div className="wrap limit--wide">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(28px,3.6vw,40px)" }}>
            <h2 className="h-display h2 rv">{L("Kořeny", "Roots")}</h2>
            <div className="prose rv d1" style={{ marginTop: 18 }}>
              <p className="body-txt">
                {L(
                  "Tahle práce nezačala u mě. Formovali ji učitelé, tradice, pohybové disciplíny, kontemplativní praxe a práce s divokou přírodou. Zdroje pojmenovávám přesně a přímý výcvik odlišuji od studia a vlivů.",
                  "This work did not begin with me. It has been shaped by teachers, traditions, movement disciplines, contemplative practice and work with wild nature. I name sources precisely and distinguish direct training from study and influence."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "Pohybově vyrůstám z parkouru, kalisteniky a jógy. Vedle toho jde meditace a psychologická práce.",
                  "In movement I come out of parkour, calisthenics and yoga. Alongside that runs meditation and psychological work."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec--tight">
        <div className="wrap limit--wide">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(28px,3.6vw,40px)" }}>
            <h2 className="h-display h2 rv">{L("Co doopravdy umím", "What I can actually do")}</h2>
            <div className="prose rv d1" style={{ marginTop: 18 }}>
              <p className="body-txt">
                {L(
                  "Jsem trenér a lektor jógy. Přímo jsem pracoval s více než třemi sty klienty a zhruba rok jsem dělal hlavního trenéra a vedoucího studia. Těžištěm je trénink s vlastní vahou a kalistenika.",
                  "I am a trainer and a yoga instructor. I have worked directly with more than three hundred clients and spent roughly a year as head trainer and studio manager. The centre of the work is bodyweight training and calisthenics."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "Aktuálně si dodělávám další odborné trenérské vzdělání zaměřené na rehabilitační, kondiční a fitness trénink. Až bude hotové, napíšu sem jeho přesný název. Do té doby žádný nemám.",
                  "I am currently completing further professional trainer education focused on rehabilitative, conditioning and fitness training. When it is finished I will put its exact name here. Until then I do not have one."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "To zaměření neznamená, že poskytuju rehabilitaci. Rehabilitace, diagnostika a léčba zůstávají mimo můj rozsah a patří fyzioterapeutovi nebo lékaři.",
                  "That focus does not mean I provide rehabilitation. Rehabilitation, diagnosis and treatment stay outside my scope and belong to a physiotherapist or a doctor."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap limit--wide">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(28px,3.6vw,40px)" }}>
            <h2 className="h-display h2 rv">{L("Co se stalo", "What happened")}</h2>
            <div style={{ marginTop: "clamp(18px,2.4vw,26px)" }}>
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
            </div>

            <p className="quote rv" style={{ marginTop: "clamp(26px,3.4vw,40px)" }}>
              {L(
                "Nehoda vysvětluje závazek. Není to doklad kvalifikace.",
                "The accident explains the commitment. It is not a credential."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="band--dark sec" aria-label={L("Z notesu", "From the notebook")}>
        <div className="wrap center">
          <p className="label label--sand rv">{L("Z notesu", "From the notebook")}</p>
          <p className="quote rv d1" style={{ color: "var(--on-dark)", marginTop: 24, lineHeight: 1.9 }}>
            {lang === "cs" ? (
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
        href={routePath("spoluprace", lang)}
        cs="Jestli tě zajímá, jak se dá pracovat spolu."
        en="If you want to know how we could work together."
        gocs="Dál · Spolupráce"
        goen="Next · Work with me"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// 03 · SPOLUPRÁCE
// ----------------------------------------------------------------------
/**
 * SLOT PRO SCHVÁLENOU NABÍDKU.
 *
 * Dokud je OFFERS prázdné, vykreslí se úplný a pravdivý popis toho, co
 * osobní práce je a jak začíná. Není to placeholder a neslibuje se v něm
 * nic, co ještě není rozhodnuté.
 */
function OfferSlot() {
  if (!OFFERS.length) {
    return (
      <div className="prose rv d1" style={{ marginTop: 18 }}>
        <p className="body-txt">
          {L(
            "Osobní práce je jeden na jednoho v Praze. Scházíme se pravidelně a mezi setkáními vedeš svoji praxi sám. Setkání je z většiny pohyb: technická práce na dvou nebo třech konkrétních pohybech, síla v celém rozsahu, a na konci zápis toho, co se stalo.",
            "The personal work is one to one, in Prague. We meet regularly and between sessions you run your own practice. A session is mostly movement: technical work on two or three specific movements, strength through the whole range, and a note at the end of what happened."
          )}
        </p>
        <p className="body-txt">
          {L(
            "Mezi setkáními máš plán a strukturu praxe na jednom místě, zapisuješ, co se doopravdy dělo, a podle toho se to upravuje. Běžně jsme v kontaktu.",
            "Between sessions you have the plan and the structure of the practice in one place, you record what actually happened, and it is adjusted from that. We are normally in contact."
          )}
        </p>
        <p className="body-txt">
          {L(
            "Rytmus a rozsah domluvíme na začátku podle toho, na čem chceš pracovat a co unese tvůj týden.",
            "We agree the rhythm and the scope at the start, according to what you want to work on and what your week can carry."
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

function PageSpoluprace({ lang }: any) {
  return (
    <>
      <RoomHead
        routeId="spoluprace"
        lang={lang}
        titleCs="Spolupráce"
        titleEn="Work with me"
        leadCs="Pracuju s málo lidmi a zblízka. Vedení, ne závislost."
        leadEn="I work with few people, closely. Guidance, not dependence."
      />

      <section className="surf--earth sec sec--edged" aria-label={L("Pro koho", "For whom")}>
        <div className="strata strata--linen" aria-hidden="true" />
        <div className="wrap">
          <div className="prose rv">
            <p className="body-txt">
              {L(
                "Tahle práce je pro lidi, kteří umí vytrvat, ale jejichž praxe se rozpadá do kousků nebo mizí, když přijde tlak. Chceš silnější a lépe pochopené tělo a vedení, které ti nevezme rozhodování z rukou.",
                "This work is for people who know how to persist, but whose practice falls into fragments or disappears when pressure arrives. You want a stronger and better understood body, and guidance that does not take the decisions out of your hands."
              )}
            </p>
            <p className="body-txt">
              {L(
                "Není pro rychlou proměnu vzhledu, pro pasivní inspiraci bez praxe, pro duchovní jistotu ani pro nikoho, kdo hledá diagnózu nebo léčbu.",
                "It is not for a fast change of appearance, for passive inspiration without practice, for spiritual certainty, or for anyone looking for a diagnosis or treatment."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h-display h2 rv">{L("Osobní práce", "Personal work")}</h2>
          <OfferSlot />

          <div style={{ marginTop: "clamp(40px,5.6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Kde", "Where")}</h2>
            <p className="body-txt rv d1" style={{ marginTop: 16 }}>
              {L(
                "Praha. Trénuje se uvnitř i venku podle toho, na čem pracujeme a jaké je počasí. Konkrétní místo domluvíme na začátku. Dny v terénu se dějí mimo město.",
                "Prague. We train indoors and outdoors depending on what we are working on and what the weather is doing. We agree the exact place at the start. Days in the field happen outside the city."
              )}
            </p>
          </div>

          <div className="procwrap" style={{ marginTop: "clamp(40px,5.6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Jak to probíhá", "How it runs")}</h2>
            <ol className="steps railed rv d1">
              <li>
                <div>
                  <h3>{L("První rozhovor", "First conversation")}</h3>
                  <p>{L(
                    "Napíšeš mi, co hledáš a kde jsi teď. Odpovím osobně. Když to nedává smysl, řeknu to.",
                    "You write to me about what you are looking for and where you are now. I answer personally. If it does not make sense, I say so."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Vstupní setkání", "First session")}</h3>
                  <p>{L(
                    "Projdeme, jak se hýbeš, co tvoje tělo aktuálně unese a co bys chtěl zvládnout. Většinu času se hýbeme.",
                    "We go through how you move, what your body can currently carry and what you would like to be able to do. Most of the time we are moving."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Směr a plán", "Direction and plan")}</h3>
                  <p>{L(
                    "Dvě nebo tři konkrétní věci a praxe, která se do tvého týdne opravdu vejde.",
                    "Two or three concrete things, and a practice that genuinely fits into your week."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Praxe a zápis", "Practice and record")}</h3>
                  <p>{L(
                    "Scházíme se pravidelně. Mezi setkáními praktikuješ a zapisuješ, co se doopravdy dělo.",
                    "We meet regularly. Between sessions you practice and record what actually happened."
                  )}</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>{L("Revize", "Review")}</h3>
                  <p>{L(
                    "Po čase se podíváme, co se změnilo a co ne, a praxi podle toho upravíme. Cílem je, aby sis ji jednou vedl sám.",
                    "After a while we look at what changed and what did not, and adjust the practice from that. The aim is that one day you run it yourself."
                  )}</p>
                </div>
              </li>
            </ol>
          </div>

          <div style={{ marginTop: "clamp(40px,5.6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Praxe v terénu", "Field practice")}</h2>
            <p className="body-txt rv d1" style={{ marginTop: 16 }}>
              {L(
                "Celé dny venku, mimo osobní spolupráci. Základna je Praha, učebna je les.",
                "Whole days outdoors, separate from the personal work. The base is Prague, the classroom is the forest."
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
                      <p style={{ marginTop: 14 }}>
                        <Go href={"mailto:" + MAIL} cs="Napsat mi o místo" en="Write to me about a place" quiet />
                      </p>
                    </div>
                    <p className="state">
                      <span className="bindu" aria-hidden="true" />
                      {L("Otevřeno", "Open")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "clamp(40px,5.6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Tanmay Practice", "Tanmay Practice")}</h2>
            <div className="prose rv d1" style={{ marginTop: 16 }}>
              <p className="body-txt">
                {L(
                  "Klienti mají vlastní prostor v aplikaci: strukturu praxe, zápis, reflexi a úpravu mezi setkáními. Aplikace drží strukturu. Koučink drží kontext. Rozhodování zůstává tvoje.",
                  "Clients have their own space in the app: the structure of the practice, logging, reflection and adjustment between sessions. The app holds the structure. The coaching holds the context. The decisions stay yours."
                )}
              </p>
              <p className="body-txt">
                {L(
                  "Není to podmínka. Když ti nesedne, základ je napsaný plán. Přístup dostaneš ode mě na začátku spolupráce.",
                  "It is not a requirement. If it does not suit you, the written plan is the base. You receive access from me when we begin working together."
                )}
              </p>
            </div>
            <p className="rv d2" style={{ marginTop: 22 }}>
              <ClientEntry />
            </p>
          </div>

          <div style={{ marginTop: "clamp(40px,5.6vw,64px)" }}>
            <h2 className="h-display h2 rv">{L("Zkušenost", "Experience")}</h2>
            <p className="body-txt rv d1" style={{ marginTop: 16 }}>
              {L(
                "Jsem trenér a lektor jógy. Přímo jsem pracoval s více než třemi sty klienty a zhruba rok jsem dělal hlavního trenéra a vedoucího studia.",
                "I am a trainer and a yoga instructor. I have worked directly with more than three hundred clients and spent roughly a year as head trainer and studio manager."
              )}
            </p>
            <p className="rv d2" style={{ marginTop: 20 }}>
              <Go href={routePath("pribeh", lang)} cs="Celý příběh" en="The whole story" quiet />
            </p>
          </div>
        </div>
      </section>

      <section className="band--dark sec" aria-label={L("Úmluva a hranice", "The contract and the boundary")}>
        <div className="wrap limit--wide">
          <p className="label label--sand rv">{L("Úmluva", "The contract")}</p>
          <p className="quote rv d1" style={{ color: "var(--on-dark)", marginTop: 20, lineHeight: 1.75 }}>
            {L("Nebudu předstírat, že v tom mám jasno.", "I will not pretend I have it figured out.")}<br />
            {L("Budu sdílet to, čím jsem opravdu prošel.", "I will share what I have actually walked through.")}<br />
            {L("Pojmenuju, co vím a co nevím.", "I will name what I know and what I do not.")}<br />
            {L("Budu ctít tvůj rozum natolik, abych nechal rozhodnutí na tobě.", "I will respect your intelligence enough to let you decide what to do with it.")}
          </p>
          <hr className="rule" style={{ margin: "clamp(28px,3.6vw,42px) 0" }} />
          <p className="label label--sand rv d1">{L("Hranice", "The boundary")}</p>
          <p className="body-txt rv d2" style={{ color: "var(--on-dark-2)", marginTop: 14 }}>
            {L(
              "Koučink není psychoterapie, diagnóza ani lékařská léčba. Pohybová praxe nenahrazuje klinickou péči. Neposkytuju rehabilitaci, nedělám diagnostiku a nepíšu výživové plány. Když se práce dostane mimo tenhle rozsah, odpovědným krokem je doporučit vhodného odborníka.",
              "Coaching is not psychotherapy, diagnosis or medical treatment. Movement practice does not replace clinical care. I do not provide rehabilitation, I do not diagnose and I do not write nutrition plans. When the work moves beyond that scope, the responsible action is referral."
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

      <section className="sec">
        <div className="wrap">
          <h2 className="h-display h2 rv">{L("Časté otázky", "Common questions")}</h2>
          <ul className="deflist rv d1">
            <li>
              <h3>{L("Potřebuju zkušenost?", "Do I need experience?")}</h3>
              <p>{L(
                "Ne. Potřebuješ ochotu praktikovat mezi setkáními. Věk, profese ani současná forma nejsou vstupenka.",
                "No. You need a willingness to practice between sessions. Age, profession and current shape are not the ticket."
              )}</p>
            </li>
            <li>
              <h3>{L("Kde trénujeme?", "Where do we train?")}</h3>
              <p>{L(
                "V Praze, uvnitř i venku. Místo domluvíme podle toho, na čem pracujeme.",
                "In Prague, indoors and outdoors. We agree the place according to what we are working on."
              )}</p>
            </li>
            <li>
              <h3>{L("Co se děje mezi setkáními?", "What happens between sessions?")}</h3>
              <p>{L(
                "Praktikuješ podle plánu a zapisuješ, co se doopravdy dělo. Z toho se skládá úprava na další období. Běžně jsme v kontaktu.",
                "You practice from the plan and record what actually happened. The next adjustment is built from that. We are normally in contact."
              )}</p>
            </li>
            <li>
              <h3>{L("Je aplikace povinná?", "Is the app required?")}</h3>
              <p>{L(
                "Není. Drží plán a zápisy na jednom místě a většině lidí to pomůže. Když ti nesedne, pracujeme z napsaného plánu.",
                "No. It keeps the plan and the records in one place and most people find that helps. If it does not suit you, we work from the written plan."
              )}</p>
            </li>
            <li>
              <h3>{L("Co když mám za sebou zranění?", "What if I have an injury behind me?")}</h3>
              <p>{L(
                "Akutní nebo neošetřené zranění patří k lékaři nebo fyzioterapeutovi, ne ke mně. Když už máš od odborníka jasno, co můžeš, dá se od toho postavit praxe.",
                "An acute or untreated injury belongs with a doctor or a physiotherapist, not with me. If a professional has already told you what you can do, a practice can be built from there."
              )}</p>
            </li>
            <li>
              <h3>{L("Jak začneme?", "How do we start?")}</h3>
              <p>{L(
                "Napiš mi. Odpovídám osobně, obvykle do pár dní.",
                "Write to me. I answer personally, usually within a few days."
              )}</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="sec--tight" id="kontakt">
        <div className="wrap">
          <hr className="rule" />
          <div style={{ paddingTop: "clamp(30px,4vw,44px)" }}>
            <h2 className="h-display h2 rv">{L("Začíná to rozhovorem", "It begins with a conversation")}</h2>
            <p className="body-txt rv d1" style={{ marginTop: 16 }}>
              {L(
                "Napiš mi, co hledáš a kde jsi teď. Odpovídám osobně, obvykle do pár dní.",
                "Write to me about what you are looking for and where you are now. I answer personally, usually within a few days."
              )}
            </p>
            <p className="rv d2" style={{ marginTop: 26 }}>
              <a className="mailto" href={"mailto:" + MAIL}>{MAIL}</a>
            </p>
          </div>
        </div>
      </section>

      <NextRoom
        href={routePath("denik", lang)}
        cs="Ještě nevíš? Deník praxe je nejbližší tomu, jaká ta práce doopravdy je."
        en="Not sure yet? The practice log is the closest thing to what this work is actually like."
        gocs="Dál · Deník praxe"
        goen="Next · Practice log"
      />
    </>
  );
}

// ----------------------------------------------------------------------
// 04 · DENÍK
// ----------------------------------------------------------------------
function PageDenik({ lang }: any) {
  return (
    <>
      <RoomHead
        routeId="denik"
        lang={lang}
        titleCs="Deník praxe"
        titleEn="Practice log"
        leadCs="Bez pointy na konci. Praxe, jaká byla, včetně dní, kdy nefungovala."
        leadEn="No point at the end. The practice as it was, including the days it did not work."
      />

      <section className="sec--tight">
        <div className="wrap">
          <ul className="posts">
            {POSTS.map((p, i) => (
              <li key={p.id}>
                <a className={"post rv" + (i ? " d" + Math.min(i, 3) : "")} href={postPath(p.id, lang)}>
                  <span className="top">
                    <span className="num">{L(p.when.cs, p.when.en)}</span>
                    <span className="num">{L(p.tag.cs, p.tag.en)}</span>
                  </span>
                  <h3>{L(p.title.cs, p.title.en)}</h3>
                  <p>{L(p.excerpt.cs, p.excerpt.en)}</p>
                  <span className="more">{L("Číst dál →", "Read more →")}</span>
                </a>
              </li>
            ))}
          </ul>

          <Evidence
            pic={MEDIA.pine}
            variant="pine"
            ap
            sizes="(min-width:600px) 470px, calc(100vw - 44px)"
            alt={L(
              "Sezení na lavici pod borovicí, zády ke kameře, nízké odpolední slunce nad polem.",
              "Sitting on a bench under a pine, back to the camera, low afternoon sun over a field."
            )}
            caption={L("Podvečer · sezení venku", "Early evening · sitting outdoors")}
          />

          <p className="small rv" style={{ marginTop: "clamp(30px,4.4vw,44px)" }}>
            {L(
              "Nový zápis jednou za dva až tři týdny. Rytmus, ne kalendář.",
              "A new note every two to three weeks. A rhythm, not a calendar."
            )}
          </p>
        </div>
      </section>

      <NextRoom
        href={routePath("spoluprace", lang)}
        cs="Jestli to sedí, začíná to rozhovorem."
        en="If this fits, it begins with a conversation."
        gocs="Dál · Spolupráce"
        goen="Next · Work with me"
      />
    </>
  );
}

function PagePost({ lang, postId }: any) {
  const post = POSTS.find((p) => p.id === postId);
  if (!post) return <PageNotFound lang={lang} />;
  const body = BODIES[post.id][lang === "cs" ? "cs" : "en"];
  return (
    <article className="wrap">
      <div className="article">
        <a className="back num" href={routePath("denik", lang)} style={{ display: "inline-block", padding: "5px 0" }}>
          ‹ {L("Deník praxe", "Practice log")}
        </a>
        <p className="num" style={{ marginTop: 20 }}>
          {L(post.when.cs, post.when.en)} · {L(post.tag.cs, post.tag.en)}
        </p>
        <h1>{L(post.title.cs, post.title.en)}</h1>
        <div className="rbody">
          {body.map((para: string, i: number) => (
            <p key={i}>{lang === "cs" ? nbsp(para) : para}</p>
          ))}
        </div>
        <div className="after">
          <Go href={routePath("denik", lang)} cs="Všechny zápisy" en="All the notes" quiet />
          <Go href={routePath("spoluprace", lang)} cs="Spolupráce" en="Work with me" quiet />
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------------
// SOUKROMÍ
// ----------------------------------------------------------------------
function PagePrivacy({ lang }: any) {
  return (
    <>
      <div className="roomhead">
        <div className="wrap">
          <a className="back" href={routePath("home", lang)}>‹ {L("Domů", "Home")}</a>
          <h1 className="h-display h1 rv" style={{ marginTop: 22 }}>{L("Soukromí", "Privacy")}</h1>
          <p className="lead rv d1">
            {L("Tenhle web o tobě nesbírá nic.", "This site collects nothing about you.")}
          </p>
        </div>
      </div>

      <section className="sec--tight legal">
        <div className="wrap limit">
          <h2>{L("Žádné cookies, žádná analytika", "No cookies, no analytics")}</h2>
          <p>{L(
            "Web ti do prohlížeče nic neukládá a nesleduje, co na něm děláš. Není tady žádný analytický nástroj, žádný měřicí pixel a žádná reklamní síť. Proto tady taky není žádná cookie lišta. Nemá co odsouhlasit.",
            "The site stores nothing in your browser and does not track what you do on it. There is no analytics tool, no tracking pixel and no advertising network. That is also why there is no cookie banner. There is nothing to consent to."
          )}</p>

          <h2>{L("Žádné třetí strany", "No third parties")}</h2>
          <p>{L(
            "Písma, obrázky i kód se stahují z tanmaypractice.com. Prohlížeč se při načtení stránky nespojí s žádným cizím serverem.",
            "Fonts, images and code are served from tanmaypractice.com. Loading a page does not connect your browser to any outside server."
          )}</p>
          <p>{L(
            "Odkazy na Instagram a na klientskou aplikaci vedou pryč z webu. To jsou samostatné služby a platí na nich jejich vlastní pravidla.",
            "The links to Instagram and to the client application lead away from this site. Those are separate services with their own rules."
          )}</p>

          <h2>{L("Když mi napíšeš", "If you write to me")}</h2>
          <p>{L(
            "E-mail přijde do mojí schránky. Čtu ho jenom já a odpovídám na něj osobně. Nedávám ho nikam dál a nepoužívám ho k ničemu jinému než k odpovědi a k naší případné další domluvě.",
            "The e-mail arrives in my mailbox. I am the only one who reads it and I answer it personally. I do not pass it on and I do not use it for anything other than replying and whatever we then arrange."
          )}</p>

          <h2>{L("Klientská aplikace", "The client application")}</h2>
          <p>{L(
            "Klientská aplikace běží na samostatné adrese klient.tanmaypractice.com a je jenom pro lidi, se kterými už pracuju. S tímhle veřejným webem nesdílí žádná data.",
            "The client application runs at its own address, klient.tanmaypractice.com, and is only for people I already work with. It shares no data with this public site."
          )}</p>

          <h2>{L("Otázky", "Questions")}</h2>
          <p>
            {L("Napiš mi na ", "Write to me at ")}
            <a href={"mailto:" + MAIL} style={{ borderBottom: "1px solid var(--rule-2)" }}>{MAIL}</a>.
          </p>
        </div>
      </section>
    </>
  );
}

// ----------------------------------------------------------------------
// 404
// ----------------------------------------------------------------------
function PageNotFound({ lang }: any) {
  return (
    <section className="nf">
      <div className="wrap">
        <p className="label rv">404</p>
        <h1 className="h-display h1 rv d1" style={{ marginTop: 16 }}>
          {L("Tahle stránka tady není.", "This page is not here.")}
        </h1>
        <p className="body-txt rv d2">
          {L(
            "Buď se adresa změnila, nebo se do ní vloudil překlep. Odsud se dostaneš dál.",
            "Either the address changed or a typo slipped into it. You can get on from here."
          )}
        </p>
        <p className="act rv d2">
          <Go href={routePath("home", lang)} cs="Domů" en="Home" />
          <Go href={routePath("praxe", lang)} cs="Praxe" en="The practice" quiet />
          <Go href={routePath("spoluprace", lang)} cs="Spolupráce" en="Work with me" quiet />
          <Go href={routePath("denik", lang)} cs="Deník praxe" en="Practice log" quiet />
        </p>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// FOOTER
// ----------------------------------------------------------------------
function Footer({ lang }: any) {
  return (
    <footer>
      <div className="wrap">
        <div className="frow">
          <a href={routePath("home", lang)} aria-label="tanmay"><Wordmark /></a>
          <div className="flinks">
            <a href={"mailto:" + MAIL}>{MAIL}</a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={CLIENT_APP_URL} target="_blank" rel="noopener noreferrer">
              {L("Vstup pro klienty", "Client login")}
            </a>
            <a href={routePath("soukromi", lang)}>{L("Soukromí", "Privacy")}</a>
          </div>
          <span className="fmeta">
            © {new Date().getFullYear()} tanmay · {L("Praha", "Prague")}
          </span>
        </div>
        <p className="fnote">
          {L(
            "Žádné cookies. Žádná analytika. Žádné třetí strany. Jen text, tělo a les.",
            "No cookies. No analytics. No third parties. Just text, body and forest."
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
  const [loc, setLoc] = useState<Loc>(() => readLocation());
  const [menuOpen, setMenuOpen] = useState(false);
  const firstPaint = useRef(true);

  LANG = loc.lang;
  useReveal(loc.routeId + loc.lang + (loc.postId || ""));

  /* Staré hash adresy zůstávají funkční. Přepíšou se na čistou cestu,
     aniž by se stránka znovu načetla, takže sdílený odkaz nikdy nespadne. */
  useEffect(() => {
    if (!window.location.hash) return;
    const m = (window.location.hash || "").match(/^#\/([a-z]*)/);
    if (!m) return;
    const target = HASH_ALIASES[m[1]];
    if (!target) return;
    const path = routePath(target, loc.lang);
    window.history.replaceState({}, "", path);
    setLoc({ routeId: target, lang: loc.lang, postId: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Vnitřní odkazy chodí přes History API. Nový panel, prostřední tlačítko
     a modifikátory se nechávají prohlížeči. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== "A") el = el.parentElement;
      if (!el) return;
      const a = el as HTMLAnchorElement;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) !== "/" ) return;
      const next = matchPath(href);
      if (!next) return;
      e.preventDefault();
      if (href === window.location.pathname) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      window.history.pushState({}, "", href);
      setLoc(next);
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const onPop = () => {
      setLoc(readLocation());
      setMenuOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* Metadata. Předrenderovaná stránka je má správně už při prvním
     vykreslení, tohle je pro přechody uvnitř aplikace. */
  useEffect(() => {
    if (firstPaint.current) { firstPaint.current = false; return; }
    const route = ROUTES.find((r: any) => r.id === loc.routeId);
    let title: string;
    let desc: string;
    if (loc.routeId === "post") {
      const p = POSTS.find((x) => x.id === loc.postId);
      const room = loc.lang === "cs" ? "Deník praxe" : "Practice log";
      title = p.title[loc.lang] + " · " + room + " · tanmay";
      desc = p.excerpt[loc.lang];
    } else if (route) {
      title = route.title[loc.lang];
      desc = route.description[loc.lang];
    } else {
      title = loc.lang === "cs" ? "Stránka nenalezena · tanmay" : "Page not found · tanmay";
      desc = loc.lang === "cs"
        ? "Tahle stránka na tanmaypractice.com není."
        : "This page does not exist on tanmaypractice.com.";
    }
    document.documentElement.lang = loc.lang;
    document.title = title;
    const set = (sel: string, attr: string, value: string) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', "content", desc);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", desc);
    set('meta[property="og:url"]', "content", "https://tanmaypractice.com" + window.location.pathname);
    set('link[rel="canonical"]', "href", "https://tanmaypractice.com" + window.location.pathname);
  }, [loc]);

  /**
   * Volitelné povrchy a masky. Když soubor chybí, plocha zůstane plná
   * barva, hranice rovná a fotografie obdélníková. Stahuje se jen to,
   * co daná místnost skutečně použije.
   */
  const r = loc.routeId;
  const hasCotton = useAsset(
    MEDIA.texCotton,
    ["home", "praxe", "pribeh", "spoluprace"].indexOf(r) !== -1
  );
  const hasSand = useAsset(MEDIA.texSandstone, ["home", "praxe"].indexOf(r) !== -1);
  const hasAperture = useAsset(
    MEDIA.aperture,
    ["home", "praxe", "denik"].indexOf(r) !== -1
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-surface", hasCotton ? "on" : "off");
  }, [hasCotton]);
  useEffect(() => {
    document.documentElement.setAttribute("data-sand", hasSand ? "on" : "off");
  }, [hasSand]);
  useEffect(() => {
    document.documentElement.setAttribute("data-ap", hasAperture ? "on" : "off");
  }, [hasAperture]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const lang = loc.lang;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="skip" href="#main">{L("Přejít na obsah", "Skip to content")}</a>

      <TopBar loc={loc} menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} loc={loc} />

      <main id="main" key={loc.routeId + lang + (loc.postId || "")}>
        {loc.routeId === "home" && <PageHome lang={lang} />}
        {loc.routeId === "praxe" && <PagePraxe lang={lang} />}
        {loc.routeId === "pribeh" && <PagePribeh lang={lang} />}
        {loc.routeId === "spoluprace" && <PageSpoluprace lang={lang} />}
        {loc.routeId === "denik" && <PageDenik lang={lang} />}
        {loc.routeId === "post" && <PagePost lang={lang} postId={loc.postId} />}
        {loc.routeId === "soukromi" && <PagePrivacy lang={lang} />}
        {loc.routeId === "notfound" && <PageNotFound lang={lang} />}
      </main>

      <Footer lang={lang} />
    </>
  );
}
