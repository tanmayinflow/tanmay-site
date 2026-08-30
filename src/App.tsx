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
  WHATSAPP_URL,
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

/* Veřejná navigace je záměrně kratší než route mapa. Praxe zůstává
   dostupná z Home a jako přímá route, ale není další rozhodnutí v headeru. */
const PRIMARY_NAV_IDS = ["spoluprace", "pribeh", "praxe"];
const PRIMARY_NAV = PRIMARY_NAV_IDS
  .map((id) => ROUTES.find((r: any) => r.id === id))
  .filter(Boolean) as any[];

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
  aboutPrague: { base: "/media/about-prague", widths: [360, 480, 720], w: 1080, h: 1350 } as Pic,
  texCotton: "/media/surface-ink-cotton.webp",
  texMineral: "/media/material/surface-ink-mineral.webp",

  /* Material Landscape · kontrakty v MATERIAL-ASSET-MANIFEST.md.
     Každý soubor je volitelný. Chybějící soubor vrátí rovnou hranu,
     obdélníkovou fotografii a plnou barvu, nikdy prázdné místo. */
  strata: "/media/material/edge-strata.png",
  aperture: "/media/material/mask-aperture.png",
  texSandstone: "/media/material/surface-sandstone.webp",
  cutout: { src: "/media/material/handstand-cutout-bw.webp", w: 522, h: 1400 },
  earthField: "/media/material/field-earth.webp",
  terrainLine: "/media/material/line-copper-current.png",
  portraitCutout: { src: "/media/material/portrait-cutout.webp", w: 1153, h: 1364 },
  heroMonolithMask: "/media/material/hero-ink-monolith-mask.png",
  heroShoulderMask: "/media/material/hero-mineral-shoulder-mask.png",
  heroForegroundMask: "/media/material/hero-sandstone-foreground-mask.png",
  saltoCutout: { src: "/media/material/salto-cutout.webp", w: 1536, h: 1024 },
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

  --maxw:1240px;
  --measure:33em;
  --track:.18em;
  --gutter:clamp(18px,4.2vw,56px);
  --topbar-h:66px;
  --hero-edge-h:clamp(54px,7vw,96px);

  /* Obsah určuje výšku kapitoly. Žádné zdvojené viewportové mezery. */
  --sp-chapter:clamp(48px,5.2vw,76px);
  --sp-section:clamp(34px,4vw,56px);
  --sp-block:clamp(24px,3vw,40px);

  --tex-cotton:url("/media/surface-ink-cotton.webp");
  --tex-sand:url("/media/material/surface-sandstone.webp");
  --strata:url("/media/material/edge-strata.png");
  --strata-top:url("/media/material/edge-strata-top.png");
  --aperture:url("/media/material/mask-aperture.png");
  --tex-mineral:url("/media/material/surface-ink-mineral.webp");
  --hero-monolith-mask:url("/media/material/hero-ink-monolith-mask.png");
  --hero-shoulder-mask:url("/media/material/hero-mineral-shoulder-mask.png");
  --hero-foreground-mask:url("/media/material/hero-sandstone-foreground-mask.png");
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
.wrap{ max-width:var(--maxw); margin:0 auto; padding:0 var(--gutter) }
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
  height:clamp(46px,6.2vw,88px);
  margin-bottom:clamp(18px,2.8vw,34px);
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
/* Lišta je od prvního pixelu průsvitná. Na Home přes ni proto prochází
   šikmý Ink monolit, ale navigace zůstává čitelná. Scroll přidá jen
   jemnou hranu a stín, ne jinou barevnou plochu. */
.topbar{
  position:sticky; top:0; z-index:900;
  background-color:rgba(229,216,196,.76);
  background-image:none;
  border-bottom:1px solid rgba(28,28,26,.055);
  box-shadow:none;
  -webkit-backdrop-filter:blur(15px) saturate(.9);
  backdrop-filter:blur(15px) saturate(.9);
  transition:border-color .32s ease, background-color .32s ease, box-shadow .32s ease;
}
html[data-sand="on"] .topbar{ background-image:none }
.topbar[data-scrolled="1"]{
  border-bottom-color:rgba(28,28,26,.14);
  background-color:rgba(229,216,196,.82);
  box-shadow:0 10px 28px rgba(28,28,26,.07);
}
.topbar .row{
  display:grid; grid-template-columns:auto minmax(0,1fr); align-items:center;
  gap:clamp(18px,3vw,40px); padding-top:14px; padding-bottom:14px;
}
.topbar .logo{ font-size:22px; line-height:1; display:inline-flex; align-items:center; min-height:30px }
.topbar .navcluster{ display:flex; align-items:center; justify-content:flex-end; gap:clamp(14px,2.2vw,30px); min-width:0 }
.topnav{ display:flex; align-items:center; gap:clamp(13px,1.9vw,26px); margin-left:0 }
.topnav a{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12.5px; color:var(--text-2);
  padding:6px 0; border-bottom:1px solid transparent; transition:color .3s, border-color .3s;
}
.topnav a:hover{ color:var(--text) }
.topnav a[aria-current="page"]{ color:var(--text); border-bottom-color:var(--copper) }
.topbar .end{ display:flex; align-items:center; justify-content:flex-end; gap:clamp(9px,1.2vw,15px); margin-left:0 }
.lang{ display:flex; align-items:center; gap:6px; font-family:var(--ff-meta); font-size:12.5px; letter-spacing:.14em }
.lang a{ color:var(--text-3); padding:6px 2px; transition:color .3s }
.lang a:hover{ color:var(--text) }
.lang [aria-current="true"]{ color:var(--text); border-bottom:1px solid var(--copper) }
.lang .sep{ color:var(--text-3) }

/* Ikony jsou skutečné odkazy, ne dekorace. */
.icon-link{
  width:35px; height:35px; display:inline-grid; place-items:center; flex:0 0 auto;
  border:1px solid rgba(28,28,26,.24); border-radius:50%; color:var(--text-2);
  transition:border-color .3s ease, color .3s ease, transform .3s ease;
}
.icon-link:hover{ border-color:var(--copper); color:var(--text); transform:translateY(-1px) }
.icon-link svg{ width:17px; height:17px; display:block }
.icon-link--pending{ opacity:.48; cursor:default }
.icon-link--pending:hover{ border-color:rgba(28,28,26,.24); color:var(--text-2); transform:none }
.head-social{ width:32px; height:32px; border-color:transparent }
.head-social:hover{ border-color:rgba(28,28,26,.28) }

/* Vstup pro klienty · užitková akce, ne hlavní veřejné CTA. */
.centry{
  font-family:var(--ff-meta); font-weight:500; text-transform:uppercase;
  letter-spacing:var(--track); font-size:12px; color:var(--text-2);
  border:1px solid var(--rule-3); border-radius:4px; padding:7px 12px; white-space:nowrap;
  transition:border-color .3s ease, color .3s ease, background-color .3s ease;
}
.centry:hover{ border-color:var(--copper); color:var(--text); background:rgba(244,240,235,.16) }

/* Dvě čáry. Otevřený stav je přesný křížek. */
.burger{ display:none; width:34px; height:34px; padding:7px 0 7px 8px; position:relative }
.burger b{
  display:block; width:24px; height:1.5px; background:var(--text);
  margin:0; position:absolute; left:8px; top:50%; transform-origin:center;
  transition:transform .3s cubic-bezier(.2,.7,.2,1);
}
.burger b:first-child{ transform:translateY(-4px) }
.burger b:last-child{ transform:translateY(4px) }
.burger[aria-expanded="true"] b:first-child{ transform:translateY(0) rotate(45deg) }
.burger[aria-expanded="true"] b:last-child{ transform:translateY(0) rotate(-45deg) }
@media (max-width:900px){
  :root{ --topbar-h:62px }
  .topnav{ display:none }
  .burger{ display:block }
  .topbar .row{ gap:12px; padding-top:12px; padding-bottom:12px }
  .topbar .logo{ font-size:20px }
  .topbar .navcluster{ gap:10px }
  .topbar .end{ gap:9px }
}
@media (max-width:520px){
  .topbar .lang{ display:none }
  .head-social{ width:30px; height:30px }
}
@media (max-width:380px){
  .centry{ padding:7px 9px; letter-spacing:.07em; font-size:11px }
  .topbar .row{ gap:8px }
  .topbar .navcluster,.topbar .end{ gap:7px }
}

/* ---------- menu ---------- */
.mmenu{ background-color:var(--sandstone); border-bottom:1px solid var(--rule-sand); background-repeat:repeat; background-size:384px 384px }
html[data-sand="on"] .mmenu{ background-image:var(--tex-sand) }
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
.opening{
  position:relative; overflow:hidden;
  padding:clamp(38px,4.8vw,66px) 0 clamp(54px,6vw,88px);
}
.opening .grid{ display:grid; grid-template-columns:1fr; gap:clamp(30px,4vw,52px); align-items:center }
.opening .copy{ position:relative; z-index:4; min-width:0 }
.opening .h1{ margin-top:clamp(18px,2.6vw,28px); max-width:10.6em }
.opening .body-txt{ margin-top:clamp(18px,2.2vw,24px) }
.opening .act{ margin-top:clamp(26px,3vw,34px); display:flex; flex-wrap:wrap; gap:16px 28px; align-items:baseline }
.opening .stance{ margin-top:clamp(22px,2.8vw,32px); font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12.5px; color:var(--text-sand-2) }
.opening.surf--sand .go{ color:var(--text-sand); border-bottom-color:var(--rule-sand) }
.opening.surf--sand .go:hover{ border-bottom-color:var(--earth) }

/* Hero · jedna skutečná postava, jeden šikmý Ink břeh a žádný rám.
   Na desktopu je obrazová kompozice absolutní a běží od horního rohu
   až k hraně další kapitoly. Lišta leží nad ní. Na mobilu vzniká vlastní
   skládaná kompozice, aby celé torso i paže zůstaly uvnitř displeje. */
.opening.has-portrait{
  margin-top:calc(-1 * var(--topbar-h));
  padding-top:calc(var(--topbar-h) + clamp(38px,4.8vw,66px));
  padding-bottom:0;
}
.opening.has-portrait .copy{ position:relative; z-index:5; align-self:center }
.portrait-stage{
  position:relative; isolation:isolate; justify-self:end; align-self:stretch;
  width:min(67vw,930px); min-height:clamp(820px,67vw,965px); height:100%;
  margin-right:calc(-1 * (max(0px, (100vw - var(--maxw)) / 2) + var(--gutter)));
}
.portrait-monolith,
.portrait-shoulder,
.portrait-foreground{
  position:absolute; pointer-events:none; background-repeat:repeat;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
  -webkit-mask-size:100% 100%; mask-size:100% 100%;
}
.portrait-monolith{
  z-index:0; right:-4%; top:-3%; width:116%; height:112%;
  background-color:var(--forest); background-image:var(--tex-mineral); background-size:520px 520px;
  -webkit-mask-image:var(--hero-monolith-mask); mask-image:var(--hero-monolith-mask);
  transform:rotate(1.25deg); transform-origin:64% 50%;
}
.portrait-shoulder{
  z-index:1; right:-4%; bottom:-2%; width:105%; height:94%;
  background-color:#302E2A; background-image:var(--tex-mineral); background-size:430px 430px;
  -webkit-mask-image:var(--hero-shoulder-mask); mask-image:var(--hero-shoulder-mask);
  transform:rotate(-.7deg); transform-origin:76% 78%; opacity:.78;
}
.portrait-cut{
  position:absolute; z-index:3; right:0; bottom:0; width:86%; max-width:none; height:auto;
  transform:rotate(.08deg); transform-origin:56% 88%;
  filter:saturate(.94) contrast(1.015);
}
/* Písková foreground mask už není ukončením portrétu. Spodní řez dělá
   až členitá Ink hrana následující kapitoly. */
.portrait-foreground{ display:none }

@media (min-width:800px){
  .opening.has-portrait{
    height:clamp(820px,71.6vw,1030px);
    padding:var(--topbar-h) 0 0;
  }
  .opening.has-portrait .grid{
    display:flex; align-items:center; height:100%;
  }
  .opening.has-portrait .copy{
    width:min(34vw,400px); padding-bottom:0;
    transform:translateY(-34px);
  }
  .opening.has-portrait .body-txt{ max-width:22em }
  .portrait-stage{
    position:absolute; top:0; bottom:0; right:0;
    width:min(68vw,980px); height:100%; min-height:0; margin:0;
  }
}
@media (min-width:1100px){
  .portrait-cut{ width:82%; }
}
@media (min-width:800px) and (max-width:1099px){
  .opening.has-portrait{ height:clamp(700px,88vw,760px) }
  .opening.has-portrait .copy{ width:40%; transform:translateY(-48px); }
  .portrait-stage{ width:61vw }
  .portrait-monolith{ right:-6%; width:132%; height:112%; transform:rotate(1deg) }
  .portrait-shoulder{ right:-6%; width:108%; height:93%; transform:rotate(-.55deg) }
  .portrait-cut{ right:-2%; width:102%; transform:rotate(.05deg) }
}
@media (max-width:799px){
  .opening.has-portrait{
    padding-top:calc(var(--topbar-h) + clamp(34px,7vw,46px));
  }
  .opening.has-portrait .grid{ gap:0 }
  .opening.has-portrait .copy{ padding-bottom:clamp(28px,8vw,48px) }
  .portrait-stage{
    justify-self:center; width:calc(100% + var(--gutter) + var(--gutter));
    min-height:clamp(440px,118vw,500px); height:auto;
    margin-left:calc(-1 * var(--gutter)); margin-right:calc(-1 * var(--gutter));
  }
  .portrait-monolith{ width:145%; height:110%; right:-26%; top:-3%; transform:rotate(.7deg) }
  .portrait-shoulder{ width:118%; height:91%; right:-18%; bottom:-2%; transform:rotate(-.4deg) }
  .portrait-cut{
    width:min(94%,420px); right:auto; left:50%; bottom:0;
    transform:translateX(-50%) rotate(.04deg);
  }
}
@media (max-width:520px){
  /* Compact phone rhythm. Remove empty vertical air, not content. */
  :root{
    --sp-chapter:36px;
    --sp-section:28px;
    --sp-block:20px;
  }

  /* Shorter opening: the portrait rises behind the mineral edge. The real
     transparent source is scaled so both arms remain inside the phone. */
  .opening.has-portrait .copy{ padding-bottom:8px }
  .opening .h1{ margin-top:14px }
  .opening .body-txt{ margin-top:14px; line-height:1.72 }
  .opening .act{ margin-top:20px }
  .opening .stance{ margin-top:15px }
  .portrait-stage{
    min-height:260px;
    margin-top:120px;
  }
  .portrait-cut{
    width:min(86vw,336px);
    bottom:55px;
  }

  /* Exactly the same approved monolith used at 834/1440. */
  .portrait-monolith{
    width:230%; height:280%;
    right:-72%; top:-78%;
    transform:rotate(32deg);
    transform-origin:50% 50%;
    -webkit-mask-image:var(--hero-monolith-mask);
    mask-image:var(--hero-monolith-mask);
    -webkit-mask-size:100% 100%; mask-size:100% 100%;
    -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
  }
  .portrait-shoulder{ display:none }

  /* Tighten mobile chapters only where there was redundant empty space. */
  .who{ padding-top:145px; padding-bottom:26px }
  .who .grid{ gap:12px }
  .who .body-txt{ line-height:1.68 }
  .cutwrap{ margin-top:0; width:min(228px,58.5vw) }

  .home-work{ padding-top:26px; padding-bottom:26px }
  .work-grid{ gap:16px; margin-top:15px }
  .chapter .row{ padding:13px 0; gap:6px 18px }
  .chapter .row p{ font-size:15px; line-height:1.64 }
  .work-grid .work-action{ margin-top:15px }
  .salto-field{ min-height:162px; margin-top:-10px }

  .home-collab{ padding-top:26px; padding-bottom:26px }
  .home-collab .collab{ gap:14px }
  .home-collab .body-txt{ line-height:1.66 }
  .home-collab .prose p + p{ margin-top:.85em }
  .home-collab .minirail{ margin-top:4px }
  .minirail li{ padding:6px 0 }

  .strip{ padding:15px 0 }
  .strip .in{ gap:8px }
  .strip p{ line-height:1.62 }

  .home-teasers{
    --coda-window-h:172px;
    padding-top:30px;
    padding-bottom:140px;
  }
  .teasers{ margin-top:20px }
  .teaser{ padding:16px 0 }
  .teaser p{ line-height:1.62 }

  .closing{ padding-bottom:20px }
  .closing > .wrap{ padding-top:22px }
  .closing .stance{ margin-top:16px }
  .compass{ margin-top:14px }
  footer{ padding-bottom:14px }
  footer .frow{ padding-top:12px }
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
.who{
  position:relative; overflow:visible;
  /* Jen členitá Ink hrana smí překrýt hero; Copper proud začíná až uvnitř této kapitoly. */
  clip-path:inset(-250px 0 0 0);
  padding-top:clamp(82px,8vw,118px);
}
/* Hrana patří už další Ink kapitole a fyzicky překryje spodní část
   portrétu. Otočená alpha maska vytváří členitý horní okraj Ink pole. */
.who .strata--hero{
  position:absolute; z-index:3; left:0; width:100%;
  top:calc(-1 * var(--hero-edge-h) + 2px); height:var(--hero-edge-h);
  margin:0; background:var(--forest); transform:scaleY(-1); transform-origin:center;
}
.who .grid{ position:relative; z-index:5; display:grid; grid-template-columns:1fr; gap:clamp(28px,4vw,48px); align-items:center }
.who .prose{ position:relative; z-index:2 }
.cutwrap{ position:relative; z-index:2; justify-self:center; width:min(300px,72vw) }
.cutwrap .slab{
  position:absolute; z-index:0; left:-14%; right:-20%; top:16%; bottom:-8%;
  width:auto; height:auto; object-fit:cover; opacity:.96;
}
.cutwrap .cut{ position:relative; z-index:1; width:100%; height:auto }

/* Jeden velký Copper proud patří výhradně do druhé, Ink kapitoly.
   Celá tříliniová struktura včetně hlavního křížení zůstává viditelná.
   Proud je otočený proti směru hodinových ručiček: vlevo vstupuje níž,
   směrem doprava stoupá a konce pokračují za viewport. Vertikální kotva
   záměrně odhaluje všechny tři původní levé vstupy assetu; nic se nedokresluje.
   Geologická maska současně skryje vše, co by jinak vystoupilo do Sandstone hero. */
.terrain-window{
  --terrain-body-h:285px;
  position:absolute; z-index:4; pointer-events:none; overflow:hidden;
  width:100vw; height:calc(var(--hero-edge-h) + var(--terrain-body-h));
  left:50%; top:calc(-1 * var(--hero-edge-h) + 2px); transform:translateX(-50%);
  /* The top of the window follows the exact alpha silhouette of the Ink edge.
     A second opaque mask layer continues below it, so Copper can reach the
     geological boundary without ever appearing on the Sandstone hero. */
  -webkit-mask-image:var(--strata-top),linear-gradient(#000 0 0);
  mask-image:var(--strata-top),linear-gradient(#000 0 0);
  -webkit-mask-repeat:no-repeat,no-repeat; mask-repeat:no-repeat,no-repeat;
  -webkit-mask-size:100% var(--hero-edge-h),100% calc(100% - var(--hero-edge-h) + 2px);
  mask-size:100% var(--hero-edge-h),100% calc(100% - var(--hero-edge-h) + 2px);
  -webkit-mask-position:0 0,0 calc(var(--hero-edge-h) - 2px);
  mask-position:0 0,0 calc(var(--hero-edge-h) - 2px);
  -webkit-mask-composite:source-over; mask-composite:add;
}
.terrain-current{
  position:absolute; display:block; max-width:none; width:142vw; height:auto;
  left:55%; top:calc(var(--hero-edge-h) + 90px);
  transform:translate(-50%,-56%) rotate(-20.5deg);
  transform-origin:center; opacity:.96;
  filter:drop-shadow(0 0 .45px var(--copper));
}
@media (min-width:800px) and (max-width:1099px){
  .terrain-window{ --terrain-body-h:250px }
  .terrain-current{
    width:170vw; left:54%; top:calc(var(--hero-edge-h) + 95px);
    transform:translate(-50%,-57%) rotate(-20.5deg);
  }
}
@media (min-width:800px){
  .who .grid{ grid-template-columns:minmax(0,1.08fr) minmax(250px,.92fr); gap:clamp(44px,6vw,88px) }
  /* Původní záporný margin tahal chodidla do Sand. Nula posune celou
     postavu dolů, ale zachová vztah k textu a Burnt Earth desce. */
  .cutwrap{ justify-self:end; width:clamp(245px,23vw,325px); margin-top:clamp(8px,1.7vw,24px) }
}
@media (min-width:800px) and (max-width:1099px){
  /* Na tabletu stojka začínala příliš blízko proudu. Vlastní odsazení
     zachovává mezi liniemi a chodidly čitelný prázdný prostor. */
  .cutwrap{ margin-top:108px }
}
@media (max-width:799px){
  .who{ clip-path:inset(-185px 0 0 0); padding-top:clamp(220px,58vw,248px) }
  .terrain-window{ --terrain-body-h:225px }
  .terrain-current{
    width:210vw; left:52%; top:calc(var(--hero-edge-h) + 85px);
    transform:translate(-50%,-56%) rotate(-20.5deg);
    opacity:.96; filter:drop-shadow(0 0 .55px var(--copper));
  }
  .cutwrap{ margin-top:clamp(24px,7vw,48px) }
}

/* ---------- Home · souvislé Ink pole mezi pískovým začátkem a koncem ---------- */
.home-dark-field{
  background-color:var(--forest); color:var(--on-dark);
  background-repeat:repeat; background-size:512px 512px;
}
html[data-surface="on"] .home-dark-field{ background-image:var(--tex-cotton) }
.home-dark-field .h-display{ color:var(--on-dark) }
.home-dark-field .body-txt{ color:var(--on-dark-2) }
.home-dark-field .label{ color:var(--sand) }
.home-dark-field .num{ color:var(--on-dark-3) }
.home-dark-field .go{ color:var(--on-dark); border-bottom-color:var(--rule-dark) }
.home-dark-field .go:hover{ border-bottom-color:var(--sand) }
.home-dark-field .chapter .row{ border-top-color:var(--rule-dark) }
.home-dark-field .chapter .row p{ color:var(--on-dark-2) }
.home-dark-field .minirail li{ border-top-color:var(--rule-dark) }
.home-dark-field .minirail li::before{ color:var(--on-dark-3) }
.home-dark-field .teaser{ border-color:var(--rule-dark) }
.home-dark-field .teaser p{ color:var(--on-dark-2) }
.home-dark-field .railed{ border-left-color:var(--earth) }

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

/* Home: text a skutečná fotografie tvoří jeden blok, ne dva vzdálené ostrovy. */
.home-work{ overflow-x:clip }
.work-grid{ display:grid; grid-template-columns:1fr; gap:clamp(30px,5vw,54px); align-items:start; margin-top:var(--sp-block) }
.work-grid .chapter{ margin-top:0 }
.work-grid .figure{ margin-top:0; max-width:540px; width:100%; justify-self:center }
.work-grid .work-action{ margin-top:clamp(24px,3vw,32px) }
@media (min-width:980px){
  .work-grid{ grid-template-columns:minmax(0,1.08fr) minmax(340px,.72fr); gap:clamp(52px,7vw,96px) }
  .work-grid .figure{ max-width:none; justify-self:end }
  .work-grid .figure img{ aspect-ratio:5 / 7 }
}

/* Skutečný výřez salta nahrazuje spodní lesní fotografii. Je bez popisku,
   přímo na Ink poli a ve stejné černobílé obrazové řeči jako stojka výše.
   Figuru držíme jako menší pohybový akcent, ne jako druhý dominantní hero. */
.salto-field{
  position:relative; isolation:isolate; margin:0; min-height:clamp(220px,27vw,360px);
  width:min(100%,480px); justify-self:end; display:flex;
  justify-content:center; align-items:center; overflow:visible;
}
.salto-field img{
  position:relative; z-index:1; width:100%; max-width:none; height:auto;
  transform:translateX(2%) rotate(-1.5deg); transform-origin:58% 55%;
  filter:none;
}
@media (min-width:980px){
  .salto-field{ width:min(100%,420px); min-height:300px; margin-right:0 }
  .salto-field img{ width:100% }
}
@media (max-width:979px){
  .salto-field{ width:min(72vw,470px); min-height:clamp(220px,43vw,320px); justify-self:center }
  .salto-field img{ width:100%; transform:rotate(-1.15deg) }
}
@media (max-width:520px){
  .salto-field{ min-height:210px; width:min(72vw,290px); margin:0 auto }
  .salto-field img{ width:100%; transform:rotate(-.7deg) }
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
@media (min-width:820px){
  .collab{ grid-template-columns:1.2fr .8fr; gap:clamp(40px,6vw,88px) }
  .minirail{ justify-self:end; width:100%; margin-top:10px }
}

/* ---------- zkušenosti ze spolupráce · dočasný návrhový obsah ---------- */
.home-reviews{
  border-top:1px solid var(--rule-dark); border-bottom:1px solid var(--rule-dark);
}
.review-head{
  display:flex; justify-content:space-between; align-items:flex-end;
  gap:18px clamp(28px,4vw,58px);
}
.review-head .h2{ max-width:12em }
.review-demo-note{
  max-width:34em; color:var(--on-dark-3); font-size:12px; line-height:1.55;
  font-family:var(--ff-meta); letter-spacing:.08em; text-transform:uppercase;
}
.review-grid{
  display:grid; grid-template-columns:1fr; gap:clamp(22px,3.8vw,46px);
  margin-top:clamp(28px,4vw,46px); align-items:stretch;
}
.video-review,.text-review{ min-width:0 }
.text-review{ display:flex; flex-direction:column }
.video-shell{
  position:relative; isolation:isolate; overflow:hidden; aspect-ratio:16 / 9;
  background:#11110f; border:1px solid var(--rule-dark); border-radius:3px;
}
.video-shell video{
  width:100%; height:100%; object-fit:cover; background:#11110f;
}

.review-demo-chip{
  position:absolute; z-index:3; top:14px; left:14px; pointer-events:none;
  padding:7px 10px; border:1px solid rgba(244,240,235,.28); border-radius:999px;
  background:rgba(28,28,26,.72); backdrop-filter:blur(7px);
  color:var(--on-dark-2); font-family:var(--ff-meta); font-size:10.5px;
  line-height:1; letter-spacing:.13em; text-transform:uppercase;
}
.video-shell::after{
  content:""; position:absolute; z-index:2; inset:0; pointer-events:none;
  box-shadow:inset 0 -90px 110px rgba(0,0,0,.15);
}
.video-caption{
  display:grid; grid-template-columns:minmax(0,1fr) auto; gap:18px;
  align-items:end; padding-top:16px;
}
.video-caption h3{
  font-family:var(--ff-display); font-size:clamp(1.25rem,2.2vw,1.58rem);
  font-weight:400; line-height:1.25;
}
.video-caption p{ color:var(--on-dark-2); font-size:14px; line-height:1.6; margin-top:5px }
.video-caption .num{ color:var(--sand) }
.carousel-nav{ display:flex; align-items:center; gap:8px; flex:0 0 auto }
.carousel-btn{
  width:42px; height:42px; display:inline-grid; place-items:center;
  border:1px solid var(--rule-dark); border-radius:50%; color:var(--on-dark);
  transition:border-color .25s ease,background-color .25s ease,transform .25s ease;
}
.carousel-btn:hover{ border-color:var(--sand); background:rgba(244,240,235,.05) }
.carousel-btn:active{ transform:scale(.96) }
.carousel-btn span{ font-size:20px; line-height:1; transform:translateY(-1px) }
.carousel-dots{ display:flex; gap:7px; margin-top:14px }
.carousel-dot{
  width:24px; height:18px; position:relative;
}
.carousel-dot::before{
  content:""; position:absolute; left:0; right:0; top:8px; height:1px;
  background:rgba(244,240,235,.26); transition:background-color .25s ease;
}
.carousel-dot[aria-current="true"]::before{ background:var(--sand) }
.text-review-card{
  min-height:100%; border:1px solid var(--rule-dark); border-radius:3px;
  background:rgba(12,12,11,.30); padding:clamp(24px,3.4vw,38px);
  display:flex; flex-direction:column;
}
.text-review-card .quote-mark{
  font-family:var(--ff-display); font-size:3.1rem; line-height:.75; color:var(--earth);
}
.text-review-card blockquote{
  font-family:var(--ff-display); font-size:clamp(1.28rem,2.15vw,1.62rem);
  line-height:1.48; margin-top:clamp(22px,3vw,34px); color:var(--on-dark);
}
.text-review-person{
  margin-top:auto; padding-top:clamp(26px,3.2vw,38px); border-top:1px solid var(--rule-dark);
}
.text-review-person strong{ display:block; font-size:15px; color:var(--on-dark) }
.text-review-person span{
  display:block; margin-top:4px; color:var(--sand); font-family:var(--ff-meta);
  font-size:12px; letter-spacing:.12em; text-transform:uppercase;
}
.text-review-foot{
  display:flex; align-items:center; justify-content:space-between; gap:16px; margin-top:16px;
}
.text-review-count{ color:var(--on-dark-3); font-family:var(--ff-meta); font-size:12px; letter-spacing:.12em }
@media (min-width:900px){
  .review-grid{ grid-template-columns:minmax(0,1.48fr) minmax(300px,.72fr) }
}
@media (max-width:720px){
  .review-head{ display:block }
  .review-demo-note{ margin-top:14px }
  .video-caption{ grid-template-columns:1fr; align-items:start }
  .video-caption .carousel-nav{ justify-self:start }
}
@media (max-width:520px){
  .home-reviews{ padding-top:30px; padding-bottom:30px }
  .review-grid{ gap:24px; margin-top:24px }
  .video-shell{ aspect-ratio:16 / 10 }
  .video-caption{ padding-top:12px; gap:12px }
  .carousel-btn{ width:40px; height:40px }
  .text-review-card{ min-height:330px; padding:24px 20px }
  .text-review-card blockquote{ font-size:1.25rem; margin-top:20px }
}

/* ---------- krátce o mně ---------- */
.home-about{ border-bottom:1px solid var(--rule-dark) }
.about-short-grid{
  display:grid; grid-template-columns:1fr; gap:clamp(28px,5vw,68px); align-items:center;
}
.about-short-copy{ max-width:42em }
.about-short-copy .body-txt{ max-width:36em; margin-top:clamp(18px,2.6vw,26px) }
.about-short-copy .act{ margin-top:clamp(22px,3vw,30px) }
.home-about .figure{
  margin:0; width:min(100%,410px); justify-self:center; overflow:hidden;
  border:1px solid var(--rule-dark); background:#11110f;
}
.home-about .figure img{
  aspect-ratio:4 / 5; object-position:50% 45%;
  filter:saturate(.94) contrast(1.02) brightness(.96);
}
@media (min-width:860px){
  .about-short-grid{ grid-template-columns:minmax(0,1.08fr) minmax(300px,.72fr); gap:clamp(58px,8vw,118px) }
  .home-about .figure{ justify-self:end }
}
@media (max-width:520px){
  .home-about{ padding-top:32px; padding-bottom:32px }
  .about-short-grid{ gap:24px }
  .about-short-copy .body-txt{ line-height:1.68; margin-top:16px }
  .about-short-copy .act{ margin-top:18px }
  .home-about .figure{ width:min(100%,330px) }
}

/* ---------- rezervace · jeden jasný první krok ---------- */
.home-booking{
  text-align:center; border-bottom:1px solid var(--rule-dark);
  padding:clamp(52px,6.8vw,92px) 0;
}
.booking-inner{ max-width:850px; margin:0 auto }
.booking-kicker{
  display:inline-flex; align-items:center; gap:14px; color:var(--sand);
}
.booking-kicker::before{ content:""; width:42px; height:1px; background:var(--rule-dark) }
.booking-inner .h2{ margin-top:clamp(22px,3vw,32px); font-size:clamp(2rem,4.6vw,3.5rem) }
.booking-lead{
  max-width:49em; margin:clamp(18px,2.6vw,28px) auto 0;
  color:var(--on-dark-2); font-size:clamp(1rem,1.6vw,1.15rem); line-height:1.7;
}
.booking-actions{
  display:flex; flex-wrap:wrap; justify-content:center; gap:12px 14px;
  margin-top:clamp(30px,4vw,44px);
}
.contact-action{
  min-height:54px; padding:13px 22px; display:inline-flex; align-items:center; justify-content:center; gap:11px;
  border:1px solid var(--rule-dark); border-radius:999px; color:var(--on-dark);
  font-family:var(--ff-meta); font-size:13px; font-weight:500; letter-spacing:.12em; text-transform:uppercase;
  transition:background-color .25s ease,border-color .25s ease,color .25s ease,transform .25s ease;
}
.contact-action svg{ width:20px; height:20px; flex:0 0 auto }
.contact-action:hover{ border-color:var(--sand); background:rgba(244,240,235,.05) }
.contact-action:active{ transform:translateY(1px) }
.contact-action--primary{
  background:var(--linen); color:var(--forest); border-color:var(--linen); padding-left:28px; padding-right:28px;
}
.contact-action--primary:hover{ background:var(--sandstone); color:var(--forest); border-color:var(--sandstone) }
@media (max-width:620px){
  .home-booking{ padding:40px 0 }
  .booking-actions{ display:grid; grid-template-columns:1fr; margin-top:28px }
  .contact-action{ width:100% }
}

/* ---------- proužek pro klienty · uvnitř souvislého Ink pole ---------- */
.strip{
  background:transparent; color:var(--on-dark);
  border-top:1px solid var(--rule-dark); border-bottom:1px solid var(--rule-dark);
  padding:clamp(30px,3.8vw,46px) 0; margin-top:0;
}
.strip .in{ display:grid; gap:14px }
.strip h2{ font-family:var(--ff-display); font-weight:400; font-size:clamp(1.35rem,2.5vw,1.75rem); line-height:1.2 }
.strip p{ font-size:15.5px; color:var(--on-dark-2); max-width:34em }
.strip .centry{ color:var(--on-dark); border-color:rgba(244,240,235,.46) }
.strip .centry:hover{ border-color:var(--sand); color:var(--on-dark) }
@media (min-width:820px){
  .strip .in{ grid-template-columns:1fr auto; align-items:center; gap:30px }
  .strip .act{ justify-self:end }
}

/* ---------- rozcestí ---------- */
/* Poslední Ink kapitola nese druhý Copper proud pouze v protilehlém,
   pravém dolním rohu. Používá tentýž schválený asset, tentýž úhel a nyní
   také stejné responzivní měřítko jako hlavní proud pod hero. Tloušťka
   všech tří linek je proto v obou kompozicích vizuálně shodná.

   Ink opticky pokračuje ještě přes geologickou hranu uvnitř následující
   Sandstone kapitoly. Copper okno končí až na skutečné členité hraně,
   ne na pravoúhlém konci sekce. Závěrečný proud je ukotvený v pravém
   dolním rohu: jednotlivé linie vstupují přes spodní hranu a opouštějí
   kompozici přes pravý bok, místo aby plavaly uprostřed Ink pole. */
.home-teasers{
  --coda-edge-h:clamp(46px,6.2vw,88px);
  --coda-window-h:clamp(330px,26vw,420px);
  position:relative; z-index:2; isolation:isolate; overflow:visible;
  padding-bottom:clamp(220px,17.36vw,280px);
}
.home-teasers > .wrap{ position:relative; z-index:2 }
.terrain-final-window{
  position:absolute; z-index:1; pointer-events:none; overflow:hidden;
  left:0; right:0; bottom:calc(-1 * var(--coda-edge-h));
  height:calc(var(--coda-window-h) + var(--coda-edge-h));
  /* Plný obdélník kryje Ink kapitolu. Spodní část používá tutéž alpha
     hranu jako závěrečný přechod, takže Copper nikdy neleze na Sandstone. */
  -webkit-mask-image:linear-gradient(#000 0 0),var(--strata);
  mask-image:linear-gradient(#000 0 0),var(--strata);
  -webkit-mask-repeat:no-repeat,no-repeat; mask-repeat:no-repeat,no-repeat;
  -webkit-mask-size:100% calc(100% - var(--coda-edge-h) + 1px),100% var(--coda-edge-h);
  mask-size:100% calc(100% - var(--coda-edge-h) + 1px),100% var(--coda-edge-h);
  -webkit-mask-position:0 0,0 100%; mask-position:0 0,0 100%;
  -webkit-mask-composite:source-over; mask-composite:add;
}
.terrain-final{
  position:absolute; display:block; max-width:none; width:142vw; height:auto;
  right:-32vw; bottom:calc(-25vw + var(--coda-edge-h));
  transform:rotate(-20.5deg); transform-origin:64% 50%;
  opacity:.96; filter:drop-shadow(0 0 .45px var(--copper));
}
@media (min-width:800px) and (max-width:1099px){
  .home-teasers{
    --coda-window-h:clamp(250px,33.5vw,300px);
    padding-bottom:clamp(200px,26.4vw,235px);
  }
  .terrain-final{
    width:170vw; right:-36vw;
    bottom:calc(-30vw + var(--coda-edge-h));
  }
}
@media (max-width:799px){
  .home-teasers{
    --coda-window-h:clamp(190px,51vw,220px);
    padding-bottom:clamp(168px,45vw,200px);
  }
  .terrain-final{
    width:210vw; right:-68vw;
    bottom:calc(-32vw + var(--coda-edge-h));
    transform:rotate(-20.5deg); opacity:.96;
    filter:drop-shadow(0 0 .55px var(--copper));
  }
}
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
.closing{ position:relative; z-index:1; text-align:center; padding:0 0 clamp(30px,3.4vw,46px) }
.closing > .wrap{ padding-top:clamp(32px,3.8vw,54px) }
.closing .wm{ font-size:clamp(38px,6.2vw,58px) }
.closing .mean{ font-family:var(--ff-display); font-style:italic; color:var(--sand); font-size:1rem; margin-top:10px }
.closing .stance{ font-family:var(--ff-display); font-size:clamp(1.55rem,3.6vw,2.35rem); line-height:1.2; margin-top:clamp(20px,2.6vw,30px) }
.compass{ margin-top:clamp(20px,2.8vw,30px) }
.compass .lines{ font-family:var(--ff-display); font-size:clamp(1.08rem,2.2vw,1.42rem); line-height:1.55; color:var(--on-dark); margin-top:10px }

.surf--sand.closing .mean{ color:var(--earth) }
.surf--sand.closing .stance{ color:var(--text-sand) }
.surf--sand.closing .compass .label{ color:var(--text-sand-2) }
.surf--sand.closing .compass .lines{ color:var(--text-sand) }

footer.footer--sand{
  background-color:var(--sandstone); color:var(--text-sand);
  background-repeat:repeat; background-size:384px 384px; padding-top:0;
}
html[data-sand="on"] footer.footer--sand{ background-image:var(--tex-sand) }
footer.footer--sand .frow{ border-top-color:var(--rule-sand) }
footer.footer--sand .flinks a{ color:var(--text-sand-2) }
footer.footer--sand .fmeta{ color:var(--text-sand-2) }

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
footer{ background:var(--linen); padding:0 0 clamp(22px,2.8vw,34px) }
footer .frow{
  display:flex; flex-wrap:wrap; gap:14px clamp(18px,3vw,34px); align-items:center;
  justify-content:space-between; border-top:1px solid var(--rule); padding-top:clamp(18px,2.4vw,26px);
}
footer .wm{ font-size:20px }
footer .frow > a{ display:inline-flex; align-items:center; min-height:26px }
footer .fmeta{ font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-3) }
footer .flinks{ display:flex; flex-wrap:wrap; align-items:center; gap:8px 20px }
footer .flinks a{ display:inline-block; padding:6px 0; font-family:var(--ff-meta); text-transform:uppercase; letter-spacing:var(--track); font-size:12px; color:var(--text-2) }
footer .flinks a:hover{ color:var(--text) }
footer .socials{ display:flex; align-items:center; gap:9px }
footer .socials .icon-link{ color:var(--text-sand-2); border-color:rgba(28,28,26,.22) }
footer .socials .icon-link:hover{ color:var(--text-sand); border-color:var(--earth) }
@media (max-width:720px){
  footer .frow{ justify-content:flex-start }
  footer .fmeta{ width:100%; order:4 }
  footer .socials{ margin-left:auto }
}

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


/**
 * Dočasný návrhový obsah pro ověření referenčního modulu.
 * Vše je na stránce viditelně označené jako ukázka a před publikací musí
 * být nahrazené skutečnými ohlasy s výslovným souhlasem jejich autorů.
 */
const VIDEO_REFERENCES = [
  {
    id: "klara",
    src: "/media/demo/review-demo-01.mp4",
    poster: "/media/demo/review-demo-01-poster.webp",
    nameCs: "Klára", nameEn: "Klara",
    kindCs: "Osobní vedení · Praha", kindEn: "In-person coaching · Prague",
    titleCs: "Konečně mám praxi, která se nerozpadne po jednom náročném týdnu.",
    titleEn: "I finally have a practice that does not collapse after one difficult week.",
  },
  {
    id: "michal",
    src: "/media/demo/review-demo-02.mp4",
    poster: "/media/demo/review-demo-02-poster.webp",
    nameCs: "Michal", nameEn: "Michal",
    kindCs: "Osobní vedení · Praha", kindEn: "In-person coaching · Prague",
    titleCs: "Přestal jsem střídat plány a začal chápat, proč dělám právě tohle.",
    titleEn: "I stopped switching plans and began to understand why I was doing this work.",
  },
  {
    id: "anna",
    src: "/media/demo/review-demo-03.mp4",
    poster: "/media/demo/review-demo-03-poster.webp",
    nameCs: "Anna", nameEn: "Anna",
    kindCs: "Dlouhodobá spolupráce", kindEn: "Long-term coaching",
    titleCs: "Trénink mě znovu baví, protože v něm není tlak pořád něco dokazovat.",
    titleEn: "I enjoy training again because it no longer feels like I have to prove something all the time.",
  },
];

const TEXT_REFERENCES = [
  {
    nameCs: "Eliška", nameEn: "Eliska",
    kindCs: "Osobní práce · Praha", kindEn: "In-person work · Prague",
    quoteCs: "Tanmay mi nepřidal další povinnosti. Pomohl mi vybrat, co je teď důležité, a postavit týden, který opravdu zvládnu.",
    quoteEn: "Tanmay did not add more obligations. He helped me choose what matters now and build a week I can actually sustain.",
  },
  {
    nameCs: "Pavel", nameEn: "Pavel",
    kindCs: "Dlouhodobá spolupráce", kindEn: "Long-term coaching",
    quoteCs: "Největší změna nebyl nový cvik, ale jistota, že dokážu plán upravit, aniž bych ho celý zahodil.",
    quoteEn: "The biggest change was not a new exercise, but knowing I could adjust the plan without throwing it away.",
  },
  {
    nameCs: "Tereza", nameEn: "Tereza",
    kindCs: "Osobní práce · Praha", kindEn: "In-person work · Prague",
    quoteCs: "Na setkáních je hodně pohybu, ale nikdy nejde jen o výkon. Vždycky odcházím s jasným dalším krokem.",
    quoteEn: "There is a lot of movement in the sessions, but it is never only about performance. I always leave with a clear next step.",
  },
  {
    nameCs: "Jan", nameEn: "Jan",
    kindCs: "Pohybová praxe", kindEn: "Movement practice",
    quoteCs: "Po dlouhé době mám pocit, že síla a pohyblivost nejsou dva oddělené cíle. Jedno podporuje druhé.",
    quoteEn: "For the first time in a long while, strength and mobility no longer feel like separate goals. Each supports the other.",
  },
];

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

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3.3" y="3.3" width="17.4" height="17.4" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.5" cy="6.6" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.2" />
    <path d="m4.4 7 7.6 6 7.6-6" />
  </svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.2 11.7a8.1 8.1 0 0 1-11.9 7.1L4 20l1.2-4.1a8.1 8.1 0 1 1 15-4.2Z" />
    <path d="M9.1 8.3c.2-.5.5-.5.8-.5h.4c.2 0 .4.1.5.4l.8 1.9c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.4 0 .6.5.9 1.3 1.7 2.2 2.2.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.6 0 .5-.3 1.4-.8 1.8-.5.4-1.2.7-2.1.5-1.2-.2-2.8-.8-4.5-2.3-1.4-1.3-2.4-2.9-2.6-4.1-.2-.9.1-1.6.4-2.1.4-.5.9-.8 1.4-.8Z" />
  </svg>
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

function SaltoField() {
  const [gone, setGone] = useState(false);
  if (gone) return null;
  return (
    <figure className="salto-field rv d1">
      <img
        src={MEDIA.saltoCutout.src}
        alt={L(
          "Tanmay zachycený ve vzduchu během salta, černobílý výřez celé postavy bez pozadí.",
          "Tanmay caught in the air during a flip, a black-and-white full-figure cutout without a background."
        )}
        width={MEDIA.saltoCutout.w}
        height={MEDIA.saltoCutout.h}
        sizes="(min-width:980px) 420px, (min-width:600px) 470px, 290px"
        loading="lazy"
        decoding="async"
        onError={() => setGone(true)}
      />
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
                "V klientské aplikaci máš na jednom místě svůj plán, termíny, záznamy a zdroje k praxi. Přístup je součástí spolupráce.",
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
        <div className="navcluster">
          <nav className="topnav" aria-label={L("Hlavní navigace", "Main navigation")}>
            {PRIMARY_NAV.map((r: any) => (
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
            <a className="icon-link head-social" href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <ClientEntry />
            <button
              type="button"
              className="burger"
              aria-expanded={menuOpen}
              aria-controls="tm-menu"
              aria-label={menuOpen ? L("Zavřít menu", "Close menu") : L("Otevřít menu", "Open menu")}
              onClick={onMenu}
            >
              <b /><b />
            </button>
          </div>
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
          {PRIMARY_NAV.map((r: any) => (
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
  return (
    <header className={"opening surf--sand" + (noPortrait ? "" : " has-portrait")}>
      <div className="wrap grid">
        <div className="copy">
          <p className="kicker label rv">{L("Osobní trénink a pohybová praxe · Praha", "Movement and practice coaching · Prague")}</p>
          <h1 className="h-display h1 rv d1">
            {L("To, co učím, sám žiju.", "I teach only what I live.")}
          </h1>
          <p className="body-txt rv d2">
            {L(
              "Pomáhám lidem budovat sílu, pohybovou jistotu a praxi, která drží i v běžném životě. Osobní trénink propojuju s plánem a průběžnou úpravou podle toho, co se skutečně děje.",
              "I help people rebuild a reliable relationship with the body and build a practice that holds in ordinary life. Through movement, meditation and direct contact with wild nature."
            )}
          </p>
          <p className="act rv d3">
            <Go href={routePath("spoluprace", lang)} cs="Jak spolupracovat" en="How we can work together" />
          </p>
          <p className="stance rv d3">
            {L("tělo · praxe · divoká příroda", "body · practice · wild nature")}
          </p>
        </div>
        {noPortrait ? null : (
          <div className="portrait-stage rv d1">
            <div className="portrait-monolith" aria-hidden="true" />
            <div className="portrait-shoulder" aria-hidden="true" />
            <img
              className="portrait-cut"
              src={MEDIA.portraitCutout.src}
              alt={L(
                "Tanmay, portrét zblízka v přirozeném světle.",
                "Tanmay, a close portrait in natural light."
              )}
              width={MEDIA.portraitCutout.w}
              height={MEDIA.portraitCutout.h}
              sizes="(min-width:1160px) 805px, (min-width:800px) 520px, calc(100vw - 24px)"
              decoding="sync"
              onError={() => setNoPortrait(true)}
              {...({ fetchPriority: "high" } as any)}
            />
            <div className="portrait-foreground" aria-hidden="true" />
          </div>
        )}
      </div>
    </header>
  );
}

const TerrainCurrent = () => (
  <div className="terrain-window" aria-hidden="true">
    <img
      className="terrain-current"
      src={MEDIA.terrainLine}
      alt=""
      width={1983}
      height={793}
      sizes="(min-width:1100px) 142vw, (min-width:800px) 170vw, 210vw"
      loading="eager"
    />
  </div>
);

/**
 * Pro koho to je · Ink Cotton, černobílý výřez skutečného stoje na rukou.
 * Postava zůstává celá v Ink poli pod Copper proudem. Výřez je na celém
 * webu jen jednou, tady.
 */
function HomeAudience() {
  const [noCut, setNoCut] = useState(false);
  return (
    <section className="sec sec--edged who" aria-labelledby="h-audience">
      <div className="strata strata--ink strata--hero" aria-hidden="true" />
      <TerrainCurrent />
      <div className="wrap grid">
        <div className="prose">
          <h2 className="h-display h2 rv" id="h-audience">
            {L("Pro koho to je", "Who this is for")}
          </h2>
          <div className="rv d1" style={{ marginTop: 18 }}>
            <p className="body-txt">
              {L(
                "Nechceš pokaždé začínat znovu. Hledáš trénink s jasným směrem, který počítá i s týdny, kdy nejde všechno podle plánu.",
                "You know how to commit to what you decide. And still there is a distance between what you understand and how you actually live."
              )}
            </p>
            <p className="body-txt" style={{ marginTop: "1.15em" }}>
              {L(
                "Nejde ti o univerzální plán ani nahodilé lekce. Chceš vědět, co má teď smysl, proč to děláš a jak podle reality upravit další krok.",
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
    <section className="sec home-work" aria-labelledby="h-work">
      <div className="wrap">
        <h2 className="h-display h2 rv" id="h-work">
          {L("Jak spolu pracujeme", "What actually happens in the work")}
        </h2>

        <div className="work-grid">
          <div>
            <div className="chapter rv d1">
              <div className="row">
                <span className="num">01</span>
                <h3>{L("Síla, kterou umíš použít", "What we train")}</h3>
                <p>{L(
                  "Trénujeme sílu, kontrolu, mobilitu a pohybovou jistotu. Základ tvoří vlastní váha a kalistenika. Kruhy, činky a další pomůcky zapojujeme jen tam, kde pomáhají konkrétnímu cíli.",
                  "The spine of the work is bodyweight training and calisthenics. Movement skill, strength through full range, control, progression from a simpler variant to a harder one. Rings, weights and apparatus where they move a specific goal. Parkour and yoga are the background it draws on."
                )}</p>
              </div>
              <div className="row">
                <span className="num">02</span>
                <h3>{L("Co má teď smysl", "How it is held")}</h3>
                <p>{L(
                  "Každé setkání má pokračování. Společně určíme, co má teď prioritu, kolik práce unese tvůj týden a čeho se držet, když podmínky nejsou ideální.",
                  "A session is mostly movement. What shows up in it becomes the plan for the period that follows: what to train, how much your week can carry, and what to hold on to in a worse week. The practice between sessions is the actual product, not homework."
                )}</p>
              </div>
              <div className="row">
                <span className="num">03</span>
                <h3>{L("Plán podle reality", "What changes between sessions")}</h3>
                <p>{L(
                  "V klientské aplikaci máš svůj plán, termíny a záznamy na jednom místě. Podle toho, co jsi skutečně udělal a jak na to tělo reagovalo, upravujeme objem, náročnost i další krok. Plán se přizpůsobuje realitě, ne naopak.",
                  "You record what actually happened, not what was supposed to. The plan is adjusted from that. Reflection and logging are not a ritual. They are the tools that decide what happens next time."
                )}</p>
              </div>
            </div>

            <p className="work-action rv d2">
              <Go href={routePath("praxe", lang)} cs="Více o praxi" en="The whole practice" />
            </p>
          </div>
          <SaltoField />
        </div>
      </div>
    </section>
  );
}

function HomeCollab({ lang }: any) {
  return (
    <section className="sec home-collab" aria-labelledby="h-collab">
      <div className="wrap">
        <h2 className="h-display h2 rv" id="h-collab">
          {L("Od setkání k vlastní praxi", "How we can work together")}
        </h2>
        <div className="prose railed rv d1" style={{ marginTop: 22 }}>
          <p className="body-txt">
            {L(
              "Pracuji individuálně i s menšími skupinami, jednorázově i dlouhodobě, osobně v Praze nebo online.",
              "The personal work is one to one, in Prague. We meet regularly, between sessions you run your own practice, and we adjust it together according to what actually happened."
            )}
          </p>
          <p className="body-txt">
            {L(
              "Pracujeme tak, abys rozuměl svému tréninku a dokázal svou praxi držet sám.",
              "I work with few people, closely. Guidance, not dependence. The aim is that one day you run the practice yourself."
            )}
          </p>
        </div>
        <p className="rv d2" style={{ marginTop: "clamp(26px,3.4vw,34px)" }}>
          <Go href={routePath("spoluprace", lang)} cs="Možnosti spolupráce" en="How it runs and how to start" />
        </p>
      </div>
    </section>
  );
}


function HomeReferences() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const moveVideo = useCallback((delta: number) => {
    videoRef.current?.pause();
    setVideoIndex((i) => (i + delta + VIDEO_REFERENCES.length) % VIDEO_REFERENCES.length);
  }, []);
  const moveText = useCallback((delta: number) => {
    setTextIndex((i) => (i + delta + TEXT_REFERENCES.length) % TEXT_REFERENCES.length);
  }, []);

  const video = VIDEO_REFERENCES[videoIndex];
  const text = TEXT_REFERENCES[textIndex];

  return (
    <section className="sec home-reviews" aria-labelledby="h-reviews">
      <div className="wrap">
        <div className="review-head">
          <div>
            <p className="label rv">{L("Reference", "Experiences")}</p>
            <h2 className="h-display h2 rv d1" id="h-reviews" style={{ marginTop: 14 }}>
              {L("Co říkají klienti", "What people say about the work")}
            </h2>
          </div>
          <p className="review-demo-note rv d1">
            {L(
              "Ukázkový obsah pro návrh. Před zveřejněním bude nahrazen skutečnými referencemi a videi se souhlasem jejich autorů.",
              "Sample content for design review. Before publication it will be replaced with real references and videos used with their authors’ consent."
            )}
          </p>
        </div>

        <div className="review-grid">
          <div className="video-review rv d1">
            <div className="video-shell">
              <span className="review-demo-chip">{L("Fiktivní ukázka", "Fictional sample")}</span>
              <video
                ref={(node) => { videoRef.current = node; }}
                key={video.src}
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
                width={1280}
                height={720}
                aria-label={L(`Ukázková video reference: ${video.nameCs}`, `Sample video reference: ${video.nameEn}`)}
              >
                <source src={video.src} type="video/mp4" />
                {L("Prohlížeč nepodporuje přehrávání videa.", "Your browser does not support video playback.")}
              </video>
            </div>
            <div className="video-caption" aria-live="polite">
              <div>
                <p className="num">{String(videoIndex + 1).padStart(2, "0")} / {String(VIDEO_REFERENCES.length).padStart(2, "0")}</p>
                <h3 style={{ marginTop: 6 }}>{L(video.titleCs, video.titleEn)}</h3>
                <p>{L(video.nameCs, video.nameEn)} · {L(video.kindCs, video.kindEn)}</p>
                <div className="carousel-dots" aria-label={L("Vybrat video", "Select video")}> 
                  {VIDEO_REFERENCES.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className="carousel-dot"
                      aria-current={i === videoIndex ? "true" : undefined}
                      aria-label={L(`Zobrazit video ${i + 1}`, `Show video ${i + 1}`)}
                      onClick={() => { videoRef.current?.pause(); setVideoIndex(i); }}
                    />
                  ))}
                </div>
              </div>
              <div className="carousel-nav" aria-label={L("Přepínání video referencí", "Video reference navigation")}> 
                <button type="button" className="carousel-btn" onClick={() => moveVideo(-1)} aria-label={L("Předchozí video", "Previous video")}><span aria-hidden="true">←</span></button>
                <button type="button" className="carousel-btn" onClick={() => moveVideo(1)} aria-label={L("Další video", "Next video")}><span aria-hidden="true">→</span></button>
              </div>
            </div>
          </div>

          <div className="text-review rv d2">
            <article className="text-review-card" aria-live="polite">
              <p className="quote-mark" aria-hidden="true">“</p>
              <blockquote>{L(text.quoteCs, text.quoteEn)}</blockquote>
              <div className="text-review-person">
                <strong>{L(text.nameCs, text.nameEn)}</strong>
                <span>{L(text.kindCs, text.kindEn)}</span>
              </div>
            </article>
            <div className="text-review-foot">
              <span className="text-review-count">{String(textIndex + 1).padStart(2, "0")} / {String(TEXT_REFERENCES.length).padStart(2, "0")}</span>
              <div className="carousel-nav" aria-label={L("Přepínání textových referencí", "Written reference navigation")}> 
                <button type="button" className="carousel-btn" onClick={() => moveText(-1)} aria-label={L("Předchozí reference", "Previous reference")}><span aria-hidden="true">←</span></button>
                <button type="button" className="carousel-btn" onClick={() => moveText(1)} aria-label={L("Další reference", "Next reference")}><span aria-hidden="true">→</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeAbout({ lang }: any) {
  return (
    <section className="sec home-about" aria-labelledby="h-about-short">
      <div className="wrap about-short-grid">
        <div className="about-short-copy">
          <p className="label rv">{L("Kryštof Švec", "About me, briefly")}</p>
          <h2 className="h-display h2 rv d1" id="h-about-short" style={{ marginTop: 14 }}>
            {L(
              "Vlastní praxe. Zkušenost s lidmi. Odborné vzdělání.",
              "I do not teach something separate from my own life."
            )}
          </h2>
          <p className="body-txt rv d2">
            {L(
              "Moje práce vyrostla z deseti let vlastní pohybové praxe a zkušeností s více než 200 klienty. Rok jsem působil jako vedoucí studia a hlavní trenér. Jsem držitelem profesní kvalifikace Osobní trenér ve fitness a instruktorem jógy. Další odborné vzdělání mám v oblasti kondičního a funkčního tréninku, zdravotní tělesné výchovy a rehabilitačního tréninku. V letech 2019 až 2024 jsem studoval psychologii na Univerzitě Palackého.",
              "Movement, yoga and training have shaped most of my adult life. I studied psychology, completed coaching education, and a long return from serious injury changed how I see performance, recovery and discipline. Today I bring those worlds together into a simple practice that has to work outside training as much as within it."
            )}
          </p>
          <p className="act rv d3">
            <Go href={routePath("pribeh", lang)} cs="Více o mně" en="My story" />
          </p>
        </div>
        <Evidence
          pic={MEDIA.aboutPrague}
          alt={L(
            "Kryštof Švec na vyhlídce v Praze s Pražským hradem v pozadí.",
            "Kryštof Švec at a Prague viewpoint with Prague Castle in the background."
          )}
          sizes="(min-width:860px) 390px, (min-width:521px) 430px, calc(100vw - 36px)"
          variant="pine"
        />
      </div>
    </section>
  );
}

function HomeBooking() {
  const whatsappText = encodeURIComponent(L(
    "Ahoj Kryštofe, mám zájem o spolupráci.\n\nCo chci rozvíjet:\n\nJakou spolupráci hledám:\n\nKdy mám obvykle čas:",
    "Hi Tanmay, I would like to ask about coaching. I am working on: … I want to train: … I am usually available: …"
  ));
  const mailSubject = encodeURIComponent(L("Zájem o spolupráci", "Coaching enquiry"));
  const mailBody = encodeURIComponent(L(
    "Ahoj Kryštofe,\n\nmám zájem o spolupráci.\n\nCo chci rozvíjet:\n\nJakou spolupráci hledám:\n\nKdy mám obvykle čas:",
    "Hi Tanmay,\n\nI would like to ask about coaching.\n\nWhat I am working on:\nWhere I want to train:\nWhen I am usually available:\n\n"
  ));
  return (
    <section className="home-booking" id="rezervace" aria-labelledby="h-booking">
      <div className="wrap">
        <div className="booking-inner">
          <p className="booking-kicker label rv">{L("První krok", "Booking")}</p>
          <h2 className="h-display h2 rv d1" id="h-booking">
            {L("Napiš mi.", "Let’s begin simply.")}
          </h2>
          <p className="booking-lead rv d2">
            {L(
              "Stačí mi pár vět o tom, co chceš rozvíjet, jakou spolupráci hledáš a kdy máš obvykle čas. Ozvu se a domluvíme první krok.",
              "Write me a few lines about what you are working through, where you would like to work and what you expect from coaching. I will reply and we will see whether it makes sense."
            )}
          </p>
          <div className="booking-actions rv d3">
            <a className="contact-action contact-action--primary" href={WHATSAPP_URL + "?text=" + whatsappText} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp />{L("Napsat na WhatsApp", "Message on WhatsApp")}
            </a>
            <a className="contact-action" href={"mailto:" + MAIL + "?subject=" + mailSubject + "&body=" + mailBody}>
              <IconMail />{L("Napsat e-mail", "Send an email")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="surf--sand sec sec--edged closing">
      <div className="strata strata--ink" aria-hidden="true" />
      <div className="wrap">
        <p className="rv closing-wordmark"><Wordmark /></p>
        <p className="mean rv d1">
          {L("tanmaya · „tím prostoupený“", "Sanskrit tanmaya · “made of that”")}
        </p>
        <p className="stance h-display rv d2">
          {L("Staň se tím, co praktikuješ.", "Become what you practice.")}
        </p>
      </div>
    </section>
  );
}

function PageHome({ lang }: any) {
  return (
    <>
      <Opening lang={lang} />
      <div className="home-dark-field">
        <HomeAudience />
        <HomeWork lang={lang} />
        <HomeCollab lang={lang} />
        <HomeReferences />
        <HomeAbout lang={lang} />
        <HomeBooking />
        <ClientStrip lang={lang} />
      </div>
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
    <footer className="footer--sand">
      <div className="wrap">
        <div className="frow">
          <a href={routePath("home", lang)} aria-label="tanmay"><Wordmark /></a>
          <div className="flinks">
            <a href={CLIENT_APP_URL} target="_blank" rel="noopener noreferrer">
              {L("Vstup pro klienty", "Client login")}
            </a>
            <a href={routePath("soukromi", lang)}>{L("Soukromí", "Privacy")}</a>
          </div>
          <div className="socials" aria-label={L("Kontakt", "Contact")}>
            <a className="icon-link" href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a className="icon-link" href={"mailto:" + MAIL} aria-label={L("E-mail", "Email")}>
              <IconMail />
            </a>
            <a
              className="icon-link"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={L("Napsat přes WhatsApp", "Message on WhatsApp")}
            >
              <IconWhatsApp />
            </a>
          </div>
          <span className="fmeta">
            © {new Date().getFullYear()} Kryštof Švec · Tanmay Practice
          </span>
        </div>
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
