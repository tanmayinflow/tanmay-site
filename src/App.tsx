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
  saltoCutout: { src: "/media/material/salto-cutout.webp", w: 1385, h: 862 },
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
  filter:grayscale(1) saturate(0) contrast(1.12) brightness(1.04);
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
  filter:grayscale(1) contrast(1.06) brightness(.92);
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

/* ======================================================================
   NON-HOME VISUAL REBUILD · V2
   Locked Home stays untouched. Public secondary pages share only the
   Linen paper field, the Ashes / Ink mineral field, and one restrained
   Burnt Earth coda. The same eroded strata edge mediates every change.
   ====================================================================== */
.site-page{ --page-measure:40em; background:var(--linen); }
.site-linen{
  position:relative; background:var(--linen); color:var(--text);
  isolation:isolate; overflow:hidden;
}
.site-ink{
  position:relative; background-color:var(--forest); color:var(--on-dark);
  background-image:url("/media/surface-ink-cotton.webp");
  background-repeat:repeat; background-size:512px 512px;
  isolation:isolate; overflow:hidden;
}
.site-earth{
  position:relative; background-color:var(--earth); color:var(--on-earth);
  isolation:isolate; overflow:hidden;
}
.site-earth::before{
  content:""; position:absolute; inset:0; z-index:-1; pointer-events:none;
  background-image:url("/media/material/field-burnt-earth.webp");
  background-size:cover; background-position:center; opacity:.28; mix-blend-mode:soft-light;
}
.site-ink .h-display,.site-ink .h3{color:var(--on-dark)}
.site-ink .body-txt,.site-ink .editorial-row p,.site-ink .page-intro{color:var(--on-dark-2)}
.site-ink .label,.site-ink .num,.site-ink .eyebrow{color:var(--sand)}
.site-ink .go{color:var(--on-dark);border-color:var(--rule-dark)}
.site-ink .go:hover{border-color:var(--sand)}
.site-earth .h-display,.site-earth .h3{color:var(--on-earth)}
.site-earth .body-txt,.site-earth .page-intro{color:var(--on-earth-2)}
.site-earth .go{color:var(--on-earth);border-color:var(--rule-earth)}
.site-earth .go:hover{border-color:var(--sand)}

.material-edge{
  height:clamp(48px,6vw,84px); margin:0; width:100%; pointer-events:none;
  -webkit-mask-image:url("/media/material/edge-strata-wide-alpha.png");
  mask-image:url("/media/material/edge-strata-wide-alpha.png");
  -webkit-mask-size:100% 100%; mask-size:100% 100%;
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
}
.material-edge--linen{background:var(--linen)}
.material-edge--ink{background:var(--forest)}
.material-edge--earth{background:var(--earth)}
.material-edge--flip{transform:scaleY(-1)}

.page-hero{padding:clamp(52px,7vw,96px) 0 clamp(58px,7.6vw,104px)}
.page-hero-grid{display:grid;grid-template-columns:1fr;gap:clamp(30px,5vw,72px);align-items:center}
.page-hero .label{margin-bottom:clamp(16px,2.2vw,24px)}
.page-hero .h1{max-width:12em}
.page-hero .lead{margin-top:clamp(18px,2.5vw,28px);max-width:31em}
.page-hero .act{margin-top:clamp(26px,3vw,34px)}
.hero-dominant{font-family:var(--ff-display);font-size:clamp(1.5rem,3vw,2.2rem);line-height:1.22;max-width:18em;margin-top:18px}
.hero-scan{font-family:var(--ff-meta);text-transform:uppercase;letter-spacing:var(--track);font-size:12.5px;color:var(--text-2);margin-top:18px}
.page-hero-media{margin:0;max-width:520px;justify-self:center;width:100%;overflow:hidden}
.page-hero-media img{width:100%;aspect-ratio:4/5;object-fit:cover;filter:grayscale(1) contrast(1.04)}
.page-hero-media--movement img{aspect-ratio:5/6;object-position:50% 48%}
@media(min-width:900px){
  .page-hero-grid{grid-template-columns:minmax(0,1.02fr) minmax(340px,.78fr);gap:clamp(60px,8vw,120px)}
  .page-hero-media{justify-self:end}
}

.proof-row{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(34px,4vw,48px);border-top:1px solid var(--rule)}
.proof-item{padding:18px 0;border-bottom:1px solid var(--rule)}
.proof-item strong{display:block;font-family:var(--ff-meta);font-size:clamp(1.15rem,2.1vw,1.5rem);font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.proof-item span{display:block;margin-top:4px;font-size:13px;color:var(--text-2)}
@media(min-width:720px){.proof-row{grid-template-columns:repeat(3,1fr)}.proof-item{padding:18px 22px;border-right:1px solid var(--rule)}.proof-item:first-child{padding-left:0}.proof-item:last-child{border-right:0;padding-right:0}}

.page-section{padding:clamp(54px,7vw,92px) 0}
.page-section--tight{padding:clamp(42px,5.5vw,72px) 0}
.section-head{display:grid;grid-template-columns:1fr;gap:14px;margin-bottom:clamp(28px,4vw,46px)}
.section-head .page-intro{font-size:16.5px;line-height:1.8;max-width:42em;color:var(--text-2)}
@media(min-width:900px){.section-head--split{grid-template-columns:minmax(260px,.7fr) minmax(0,1.3fr);gap:clamp(48px,7vw,100px);align-items:start}.section-head--split .page-intro{justify-self:end}}

.editorial-list{display:grid;gap:0;border-top:1px solid var(--rule)}
.editorial-row{display:grid;grid-template-columns:3.4em 1fr;gap:14px 18px;padding:clamp(22px,3vw,32px) 0;border-bottom:1px solid var(--rule)}
.editorial-row .num{padding-top:5px;color:var(--text-3)}
.editorial-row h3{font-family:var(--ff-display);font-size:clamp(1.28rem,2.15vw,1.6rem);font-weight:400;line-height:1.22}
.editorial-row p{grid-column:2;font-size:15.75px;line-height:1.78;color:var(--text-2);max-width:38em}
.site-ink .editorial-list{border-color:var(--rule-dark)}
.site-ink .editorial-row{border-color:var(--rule-dark)}
@media(min-width:900px){.editorial-row{grid-template-columns:3.5em minmax(190px,.55fr) minmax(0,1fr);gap:20px 34px;align-items:start}.editorial-row p{grid-column:3;margin:0}}

.editorial-grid{display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--rule)}
.editorial-grid article{padding:clamp(24px,3vw,34px) 0;border-bottom:1px solid var(--rule)}
.editorial-grid .num{display:block;color:var(--text-3);margin-bottom:10px}
.editorial-grid h3{font-family:var(--ff-display);font-size:clamp(1.28rem,2.15vw,1.6rem);font-weight:400;line-height:1.22}
.editorial-grid p{margin-top:10px;font-size:15.75px;line-height:1.78;color:var(--text-2);max-width:34em}
@media(min-width:820px){.editorial-grid{grid-template-columns:1fr 1fr}.editorial-grid article:nth-child(odd){padding-right:clamp(28px,4vw,54px);border-right:1px solid var(--rule)}.editorial-grid article:nth-child(even){padding-left:clamp(28px,4vw,54px)}}

.scan-line{font-family:var(--ff-meta);text-transform:uppercase;letter-spacing:.16em;font-size:clamp(.9rem,1.6vw,1.08rem);line-height:1.7;color:var(--text-3)}
.site-ink .scan-line{color:var(--sand)}
.stance-line{font-family:var(--ff-display);font-size:clamp(1.45rem,3vw,2.15rem);line-height:1.32;max-width:26em}

.process-three{display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--rule-dark);margin-top:clamp(30px,4vw,48px)}
.process-three article{padding:clamp(24px,3vw,34px) 0;border-bottom:1px solid var(--rule-dark)}
.process-three .num{color:var(--sand)}
.process-three h3{font-family:var(--ff-display);font-size:clamp(1.3rem,2.4vw,1.7rem);font-weight:400;margin-top:10px}
.process-three p{margin-top:10px;color:var(--on-dark-2);font-size:15.75px;line-height:1.78;max-width:34em}
@media(min-width:900px){.process-three{grid-template-columns:repeat(3,1fr)}.process-three article{padding:30px clamp(26px,3vw,44px);border-right:1px solid var(--rule-dark)}.process-three article:first-child{padding-left:0}.process-three article:last-child{border-right:0;padding-right:0}}

.between-grid{display:grid;grid-template-columns:1fr;gap:clamp(30px,5vw,70px);align-items:start}
.between-items{display:grid;gap:0;border-top:1px solid var(--rule-dark)}
.between-item{padding:20px 0;border-bottom:1px solid var(--rule-dark)}
.between-item h3{font-family:var(--ff-display);font-size:1.32rem;font-weight:400}
.between-item p{margin-top:7px;color:var(--on-dark-2);font-size:15.5px;line-height:1.75}
@media(min-width:900px){.between-grid{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}}

.trust-scan{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(30px,4vw,44px);border-top:1px solid var(--rule)}
.trust-stat{padding:20px 0;border-bottom:1px solid var(--rule)}
.trust-stat strong{display:block;font-family:var(--ff-meta);font-size:clamp(1.12rem,2vw,1.42rem);letter-spacing:.08em;text-transform:uppercase;font-weight:500}
.trust-stat span{display:block;margin-top:5px;color:var(--text-2);font-size:13px}
@media(min-width:760px){.trust-scan{grid-template-columns:repeat(3,1fr)}.trust-stat{padding:20px 24px;border-right:1px solid var(--rule)}.trust-stat:first-child{padding-left:0}.trust-stat:last-child{border-right:0;padding-right:0}}

.boundary{max-width:54em;border-left:3px solid var(--copper);padding-left:clamp(20px,3vw,32px)}
.boundary .stance-line{font-size:clamp(1.55rem,3vw,2.2rem)}
.boundary p{margin-top:16px;color:var(--text-2);font-size:16px;line-height:1.8;max-width:44em}

.faq-list{border-top:1px solid var(--rule)}
.faq-item{padding:clamp(22px,3vw,30px) 0;border-bottom:1px solid var(--rule)}
.faq-item h3{font-family:var(--ff-display);font-size:clamp(1.25rem,2vw,1.5rem);font-weight:400}
.faq-item p{margin-top:10px;color:var(--text-2);font-size:15.75px;line-height:1.78;max-width:42em}

.contact-coda{text-align:center;padding:clamp(58px,8vw,104px) 0}
.contact-coda .h2{font-size:clamp(2.4rem,6vw,4.2rem)}
.contact-coda .booking-actions{margin-top:clamp(28px,4vw,42px)}
.site-page .booking-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 14px}
.site-page .contact-action{min-height:52px;padding:12px 21px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--rule-2);border-radius:999px;font-family:var(--ff-meta);font-size:12.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;transition:border-color .25s ease,background-color .25s ease,color .25s ease}
.site-page .contact-action:hover{border-color:var(--copper)}
.site-page .contact-action--primary{background:var(--forest);color:var(--linen);border-color:var(--forest)}
@media(max-width:620px){.site-page .booking-actions{display:grid;grid-template-columns:1fr}.site-page .contact-action{width:100%}}
.site-earth .contact-action{border-color:rgba(244,240,235,.42);color:var(--on-earth)}
.site-earth .contact-action--primary{background:var(--linen);border-color:var(--linen);color:var(--forest)}

.story-return .section-head{margin-bottom:24px}
.story-beats{display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--rule-dark)}
.story-beat{padding:clamp(24px,3.2vw,36px) 0;border-bottom:1px solid var(--rule-dark)}
.story-beat .num{color:var(--sand)}
.story-beat h3{font-family:var(--ff-display);font-size:clamp(1.4rem,2.6vw,1.9rem);font-weight:400;margin-top:8px}
.story-beat p{margin-top:10px;color:var(--on-dark-2);font-size:15.8px;line-height:1.82}
@media(min-width:900px){.story-beats{grid-template-columns:.85fr 1.3fr .95fr}.story-beat{padding:32px clamp(26px,3vw,44px);border-right:1px solid var(--rule-dark)}.story-beat:first-child{padding-left:0}.story-beat:last-child{border-right:0;padding-right:0}}

.education-list{display:grid;grid-template-columns:1fr;border-top:1px solid var(--rule)}
.education-item{padding:20px 0;border-bottom:1px solid var(--rule)}
.education-item .label{margin-bottom:6px}
.education-item p{font-family:var(--ff-display);font-size:clamp(1.16rem,2vw,1.42rem);line-height:1.45}
@media(min-width:820px){.education-list{grid-template-columns:1fr 1fr}.education-item:nth-child(odd){padding-right:clamp(28px,4vw,54px);border-right:1px solid var(--rule)}.education-item:nth-child(even){padding-left:clamp(28px,4vw,54px)}}

.definition-pair{display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--rule)}
.definition-pair article{padding:clamp(24px,3vw,34px) 0;border-bottom:1px solid var(--rule)}
.definition-pair strong{font-family:var(--ff-meta);font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-3)}
.definition-pair p{font-family:var(--ff-display);font-size:clamp(1.25rem,2.3vw,1.6rem);line-height:1.45;margin-top:10px;max-width:27em}
@media(min-width:780px){.definition-pair{grid-template-columns:1fr 1fr}.definition-pair article:first-child{padding-right:clamp(30px,5vw,70px);border-right:1px solid var(--rule)}.definition-pair article:last-child{padding-left:clamp(30px,5vw,70px)}}

.practice-anchors .diagram circle.c{stroke:var(--text-3)}
.practice-anchors .diagram text{fill:var(--text-2)}
.practice-anchors .diagram text.p{fill:var(--earth)}
.anchor-light{border-top:1px solid var(--rule);padding:clamp(22px,3vw,30px) 0}
.anchor-light:first-child{border-top:0}
.anchor-light .meta{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}
.anchor-light .role{font-family:var(--ff-meta);text-transform:uppercase;letter-spacing:.16em;font-size:12px;color:var(--text-3)}
.anchor-light h3{font-family:var(--ff-display);font-size:clamp(1.4rem,2.5vw,1.8rem);font-weight:400}
.anchor-light p{margin-top:10px;color:var(--text-2);font-size:15.75px;line-height:1.78;max-width:40em}

.practice-work-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(34px,6vw,80px);align-items:center}
.practice-work-cutout{max-width:280px;justify-self:center;align-self:center}
.practice-work-cutout img{display:block;width:100%;height:auto;filter:grayscale(1)}
@media(min-width:900px){.practice-work-layout{grid-template-columns:minmax(0,1.1fr) minmax(220px,.5fr)}.practice-work-cutout{justify-self:end}}
.reflection-block{max-width:62em}
.reflection-block .stance-line{font-size:clamp(1.65rem,3.6vw,2.55rem)}
.reflection-block .body-txt{margin-top:20px;max-width:43em}
.reflection-closing{margin-top:clamp(28px,4vw,44px);padding-top:24px;border-top:1px solid var(--rule);font-family:var(--ff-display);font-size:clamp(1.4rem,2.6vw,1.95rem);line-height:1.42}

.meaning-grid{display:grid;grid-template-columns:1fr;gap:clamp(38px,6vw,92px);align-items:start}
.meaning-mark{font-family:var(--ff-display);font-size:clamp(4.8rem,12vw,9rem);line-height:.9;color:var(--on-dark)}
.etymology{margin-top:24px;font-family:var(--ff-meta);text-transform:uppercase;letter-spacing:.12em;font-size:12px;line-height:2;color:var(--sand)}
.meaning-copy .h2{margin-top:14px}
.meaning-copy .body-txt{margin-top:18px}
.meaning-path{margin-top:28px;color:var(--sand);font-family:var(--ff-meta);text-transform:uppercase;letter-spacing:.18em;font-size:13px}
.meaning-closing{grid-column:1/-1;padding-top:clamp(28px,4vw,44px);border-top:1px solid var(--rule-dark);font-family:var(--ff-display);font-size:clamp(1.7rem,4vw,2.8rem);line-height:1.28;max-width:28em}
@media(min-width:900px){.meaning-grid{grid-template-columns:minmax(260px,.65fr) minmax(0,1.1fr)}}

.footer--linen{background:var(--linen);position:relative;isolation:isolate;overflow:hidden}
.footer--linen .frow{border-top-color:var(--rule)}
.footer--linen .flinks a,.footer--linen .fmeta{color:var(--text-2)}
.footer--linen .socials .icon-link{color:var(--text-2);border-color:rgba(28,28,26,.22)}

@media(max-width:520px){
  .page-hero{padding:38px 0 48px}
  .page-section{padding:44px 0}
  .page-section--tight{padding:34px 0}
  .editorial-row{grid-template-columns:2.6em 1fr}
  .contact-coda{padding:50px 0}
}

/* ======================================================================
   SECONDARY PAGE PHOTO PLACEMENT · V3
   Scope is deliberately narrow: Spolupráce hero + O mně hero.
   No grayscale filter. No new surface or colour family.
   ====================================================================== */
.collaboration-hero-grid{align-items:end}
.collaboration-hero-copy{padding-bottom:clamp(8px,1.8vw,24px)}
.collaboration-hero-cutout{
  margin:0;
  width:100%;
  max-width:500px;
  justify-self:center;
  align-self:end;
}
.collaboration-hero-cutout img{
  display:block;
  width:100%;
  height:auto;
  object-fit:contain;
}
.about-hero-photo{
  margin:0;
  width:100%;
  max-width:560px;
  justify-self:center;
  overflow:hidden;
}
.about-hero-photo img{
  display:block;
  width:100%;
  height:auto;
  aspect-ratio:2048/1655;
  object-fit:cover;
  object-position:center center;
}
@media(min-width:900px){
  .collaboration-hero-cutout{justify-self:end;max-width:520px}
  .about-hero-photo{justify-self:end}
}
@media(max-width:899px){
  .collaboration-hero-cutout{max-width:420px;margin-top:4px}
  .about-hero-photo{max-width:620px}
}

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
          pic={MEDIA.pine}
          alt={L(
            "Tanmay sedí venku u borovice během vlastní praxe.",
            "Tanmay sitting outside by a pine tree during his own practice."
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
// 01 · PRAXE · V2
// ----------------------------------------------------------------------
function PagePraxe({ lang }: any) {
  const anchors = [
    ["01", "Brána", "Tělo", "Tělo je první místo, kde se praxe stává skutečnou. Ukazuje, co je dnes možné, jakou máš kapacitu a jak na práci reaguješ.", "Gateway", "Body", "The body is the first place where practice becomes real. It shows what is possible today, how much capacity you have and how you respond to the work."],
    ["02", "Most", "Praxe", "Praxe propojuje záměr s opakováním a jednotlivé tréninky s běžným životem. Dává jednotlivým krokům návaznost.", "Bridge", "Practice", "Practice connects intention with repetition, and individual training sessions with ordinary life. It gives each step continuity."],
    ["03", "Zrcadlo", "Divoká příroda", "Divoká příroda není kulisa. Počasí, terén a rytmus dne se nepřizpůsobí tvému plánu a vracejí tě k tomu, co je právě před tebou.", "Mirror", "Wild nature", "Wild nature is not a backdrop. Weather, terrain and the rhythm of the day do not adapt to your plan, and return you to what is actually in front of you."],
  ];
  const session = [
    ["01", "Dovednost a technika", "Stojku, shyb, práci na kruzích nebo jiný pohyb rozdělíme na části, se kterými se dá skutečně pracovat. Začínáme u varianty, kterou dokážeš provést čistě.", "Skill and technique", "We break a handstand, pull-up, ring work or another movement into parts that can actually be trained. We begin with a variation you can perform cleanly."],
    ["02", "Síla pro konkrétní cíl", "Budujeme sílu v rozsahu a intenzitě, které daný cíl potřebuje. Vlastní váha, kruhy, činky a další pomůcky jsou prostředky, ne cíl.", "Strength for a specific goal", "We build strength through the range and intensity the goal requires. Bodyweight, rings, weights and other tools are means, not the goal."],
    ["03", "Rozsah a kontrola", "Pracujeme tam, kde pohyb ztrácí jistotu, rozsah nebo kontrolu. Nejde o co největší rozsah, ale o ten, který dokážeš skutečně ovládat.", "Range and control", "We work where movement loses confidence, range or control. The aim is not the greatest possible range, but the range you can genuinely control."],
    ["04", "Dech a pozornost", "Nejsou odděleným rituálem. Pomáhají vnímat napětí, úsilí, únavu a chvíli, kdy má smysl přidat nebo ubrat.", "Breath and attention", "They are not a separate ritual. They help you notice tension, effort, fatigue and the moment when it makes sense to add or take away."],
  ];
  return <div className="site-page">
    <header className="site-linen page-hero">
      <div className="wrap page-hero-grid">
        <div>
          <p className="label rv">{L("Praxe","Practice")}</p>
          <h1 className="h-display h1 rv d1">{L("Praxe, ke které se dá vracet.","A practice you can return to.")}</h1>
          <p className="lead rv d2">{L("Nejde o dokonalou rutinu ani plán, který funguje jen v dobrých dnech. Praxe dává pohybu směr, ale umí měnit podobu podle toho, co je právě možné.","It is not a perfect routine or a plan that only works on good days. Practice gives movement direction while changing shape according to what is actually possible.")}</p>
          <p className="hero-dominant rv d3">{L("Forma se mění. Směr zůstává.","The form changes. The direction remains.")}</p>
        </div>
        <Evidence pic={MEDIA.handstand} alt={L("Kryštof Švec při stoji na rukou na padlém kmeni.","Kryštof Švec in a handstand on a fallen tree trunk.")} sizes="(min-width:900px) 500px, calc(100vw - 36px)" variant="tall" />
      </div>
    </header>

    <section className="site-linen page-section--tight">
      <div className="wrap">
        <div className="section-head section-head--split">
          <h2 className="h-display h2 rv">{L("Co tady znamená praxe","What practice means here")}</h2>
          <div className="page-intro rv d1"><p>{L("Trénink je konkrétní práce v konkrétním čase. Praxe je to, co jednotlivé tréninky propojuje: záměr, opakování, záznam a schopnost upravit další krok.","Training is specific work at a specific time. Practice is what connects individual sessions: intention, repetition, a record, and the ability to adjust the next step.")}</p><p style={{marginTop:"1em"}}>{L("Nejde o to splnit všechno za každou cenu. Jde o to umět se k praxi vrátit, když se změní čas, energie nebo podmínky.","The aim is not to complete everything at any cost. It is to know how to return to practice when time, energy or conditions change.")}</p></div>
        </div>
        <div className="definition-pair rv d1">
          <article><strong>{L("Trénink","Training")}</strong><p>{L("konkrétní práce v konkrétním čase","specific work at a specific time")}</p></article>
          <article><strong>{L("Praxe","Practice")}</strong><p>{L("to, co jednotlivé tréninky propojuje","what connects individual training sessions")}</p></article>
        </div>
      </div>
    </section>

    <section className="site-linen page-section practice-anchors" aria-labelledby="p-anchors">
      <div className="wrap">
        <div className="section-head section-head--split">
          <div><p className="label rv">{L("Tři kotvy","Three anchors")}</p><h2 id="p-anchors" className="h-display h2 rv d1" style={{marginTop:12}}>{L("Tělo, praxe a divoká příroda","Body, practice and wild nature")}</h2></div>
          <p className="page-intro rv d1">{L("Nejsou to tři oddělené oblasti. Tělo ukazuje, co se skutečně děje, praxe tomu dává směr a divoká příroda připomíná, že ne všechno lze řídit.","They are not three separate areas. The body shows what is actually happening, practice gives it direction, and wild nature reminds us that not everything can be controlled.")}</p>
        </div>
        <div>
          {anchors.map((a:any)=><article className="anchor-light rv" key={a[0]}><div className="meta"><span className="num">{a[0]}</span><span className="role">{L(a[1],a[4])}</span><h3>{L(a[2],a[5])}</h3></div><p>{L(a[3],a[6])}</p></article>)}
        </div>
        <AnchorDiagram />
        <p className="stance-line rv" style={{margin:"clamp(28px,4vw,44px) auto 0",textAlign:"center"}}>{L("Přítomnost není čtvrtá kotva. Vzniká, když se ty tři drží pohromadě.","Presence is not a fourth anchor. It emerges when the three are held together.")}</p>
      </div>
    </section>

    <section className="site-linen page-section">
      <div className="wrap practice-work-layout">
        <div>
          <div className="section-head"><div><p className="label rv">{L("Společná práce","Working together")}</p><h2 className="h-display h2 rv d1" style={{marginTop:12}}>{L("Co může setkání obsahovat","What a session may include")}</h2></div><p className="page-intro rv d1">{L("Většinu času se hýbeme. Ne všechno ale patří do každého setkání. Vybíráme jen to, co slouží tomu, na čem právě pracujeme.","Most of the time we move. Not everything belongs in every session. We choose only what serves the work in front of us.")}</p></div>
          <p className="scan-line rv">{L("DOVEDNOST · SÍLA · ROZSAH · POZORNOST","SKILL · STRENGTH · RANGE · ATTENTION")}</p>
          <div className="editorial-list" style={{marginTop:22}}>{session.map((x:any)=><article className="editorial-row rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div>
        </div>
        <figure className="practice-work-cutout rv d1"><picture><source type="image/avif" srcSet={MEDIA.handstand.widths.map((w:number)=>`${MEDIA.handstand.base}-${w}.avif ${w}w`).join(", ")} sizes="(min-width:980px) 420px, calc(100vw - 44px)" /><source type="image/webp" srcSet={MEDIA.handstand.widths.map((w:number)=>`${MEDIA.handstand.base}-${w}.webp ${w}w`).join(", ")} sizes="(min-width:980px) 420px, calc(100vw - 44px)" /><img src={MEDIA.handstand.base + ".jpg"} width={MEDIA.handstand.w} height={MEDIA.handstand.h} sizes="(min-width:980px) 420px, calc(100vw - 44px)" loading="lazy" decoding="async" alt={L("Stoj na rukou na padlém kmeni v lese, obě dlaně na mechu.","A handstand on a fallen trunk in the forest, both palms on the moss.")} /></picture></figure>
      </div>
    </section>

    <section className="site-linen page-section--tight">
      <div className="wrap reflection-block">
        <h2 className="h-display h2 rv">{L("Reflexe","Reflection")}</h2>
        <p className="stance-line rv d1" style={{marginTop:18}}>{L("Ne všechno, co se projeví v tréninku, vzniká v tréninku.","Not everything that shows up in training begins in training.")}</p>
        <p className="body-txt rv d2">{L("Spánek, práce, vztahy, stres i důvod, proč člověk trénuje, se promítají do toho, co tělo unese a jak se k praxi vrací. Reflexe pomáhá tyto souvislosti vidět a podle nich zvolit další krok.","Sleep, work, relationships, stress and the reason a person trains all affect what the body can carry and how they return to practice. Reflection helps make those connections visible and choose the next step accordingly.")}</p>
        <p className="reflection-closing rv d2">{L("Praxe nezačíná v jiném těle ani v jiném životě.\nZačíná v tomhle.","Practice does not begin in another body or another life.\nIt begins in this one.")}</p>
      </div>
    </section>

    <section className="site-ink page-section">
      <div className="material-edge material-edge--linen" aria-hidden="true" />
      <div className="wrap meaning-grid">
        <div className="rv"><div className="meaning-mark">तन्मय</div><div className="etymology">tad · {L("„to“","“that”")}<br/>+ -maya · {L("„z toho utvořený, tím prostoupený“","“made of that, permeated by that”")}<br/>→ tanmaya</div></div>
        <div className="meaning-copy"><p className="label rv">{L("Význam jména","The meaning of the name")}</p><h2 className="h-display h2 rv d1">{L("Nejde jen o praxi, kterou děláš.","It is not only about the practice you do.")}</h2><p className="body-txt rv d1">{L("Tanmay vychází ze sanskrtského tad, „to“, a přípony -maya, „z toho utvořený“ nebo „tím prostoupený“. Označuje stav, kdy je člověk v něčem zcela pohroužený, až se to stává součástí toho, kým je.","Tanmay comes from the Sanskrit tad, “that”, and the suffix -maya, “made of that” or “permeated by that”. It describes a state of being so fully absorbed in something that it becomes part of who you are.")}</p><p className="body-txt rv d2">{L("V tradici, ze které osobně čerpám, se cesta nehledá mimo tělo ani mimo podmínky života. Tělo není jen nástroj praxe. Je součástí cesty samotné. To, co se objeví, nemusí stát mimo ni. Může se stát jejím materiálem.","In the tradition I personally draw from, the path is not sought outside the body or outside the conditions of life. The body is not only a tool of practice. It is part of the path itself. What appears does not have to stand outside it. It can become its material.")}</p><p className="body-txt rv d2">{L("Je mi blízký obraz šípu, který po zásahu nezůstává vedle cíle, ale splyne s ním. To, čemu dáváš tělo, pozornost a čas, začne postupně utvářet, jak se hýbeš, vnímáš a žiješ. Proto tanmay practice není jen soubor tréninků, ale cesta od poznání k vlastní zkušenosti a od společného setkání k praxi, kterou dokážeš držet sám.","I am drawn to the image of an arrow that, once it strikes, does not remain beside the target but becomes one with it. What you give your body, attention and time to gradually shapes how you move, perceive and live. That is why tanmay practice is not just a collection of training sessions, but a path from understanding to lived experience and from shared sessions to a practice you can hold yourself.")}</p><p className="meaning-path rv d3">{L("poznat → praktikovat → žít","understand → practise → live")}</p></div>
        <p className="meaning-closing rv d2">{L("Nejde jen o praxi, kterou děláš. Jde o praxi, která utváří tebe.","It is not only about the practice you do. It is about the practice that shapes you.")}</p>
      </div>
    </section>

    <section className="site-earth contact-coda"><div className="material-edge material-edge--ink" aria-hidden="true"/><div className="wrap"><h2 className="h-display h2 rv">{L("Praxe začíná konkrétním krokem.","Practice begins with a concrete step.")}</h2><p className="body-txt rv d1" style={{margin:"18px auto 0"}}>{L("Může jít o jedno setkání nebo delší vedení, osobně v Praze nebo online.","It can be one session or longer-term guidance, in person in Prague or online.")}</p><p className="rv d2" style={{marginTop:28}}><Go href={routePath("spoluprace",lang)} cs="Možnosti spolupráce" en="Ways to work together" /></p></div></section>
  </div>;
}

// ----------------------------------------------------------------------

// 02 · O MNĚ · V2
// ----------------------------------------------------------------------
function PagePribeh({ lang }: any) {
  const roots=[
    ["01","Parkour a kalistenika","Parkour mě naučil hledat cestu. Kalistenika trpělivě stavět sílu a dovednost od základů.","Parkour and calisthenics","Parkour taught me to find a way through. Calisthenics taught me to build strength and skill patiently from the foundations."],
    ["02","Jóga a meditace","Naučily mě pracovat s rovnováhou, dechem a pozorností. Vnímat, kdy tělo potřebuje úsilí a kdy prostor.","Yoga and meditation","They taught me to work with balance, breath and attention, and to notice when the body needs effort and when it needs space."],
    ["03","Divoká příroda","Vrací mě k tomu, co se nedá urychlit ani plně kontrolovat. Tělo i praxe mají svůj rytmus a reagují na skutečné podmínky.","Wild nature","It returns me to what cannot be hurried or fully controlled. The body and practice have their own rhythm and respond to real conditions."],
  ];
  const approach=[
    ["01","Výkon není celý obraz","Zajímá mě nejen to, co člověk zvládne, ale také za jakých podmínek, s jakým úsilím a jak na to tělo reaguje.","Performance is not the whole picture","I care not only about what a person can do, but under what conditions, with how much effort, and how the body responds."],
    ["02","Plán musí potkat skutečný den","Plán nevnímám jako neměnný předpis. Má dávat směr a zároveň reagovat na to, co se skutečně děje.","A plan has to meet the real day","I do not see a plan as a fixed prescription. It should give direction while responding to what is actually happening."],
    ["03","Praxe má být vlastní","Nechci, aby člověk jen plnil moje pokyny. Chci, aby rozuměl svému tréninku a dokázal svou praxi držet sám.","Practice should become your own","I do not want someone to simply follow my instructions. I want them to understand their training and be able to hold their practice themselves."],
  ];
  return <div className="site-page">
    <header className="site-linen page-hero">
      <div className="wrap">
        <div className="page-hero-grid">
          <div><p className="label rv">{L("O mně","About me")}</p><h1 className="h-display h1 rv d1">Kryštof Švec</h1><p className="lead rv d2">{L("Jsem osobní trenér v Praze. Síla, kalistenika a schopnost dobře ovládat vlastní tělo tvoří základ mé práce. Nejvíc mě ale zajímá, jak z jednotlivých tréninků vzniká praxe, kterou člověk dokáže držet sám.","I am a personal trainer in Prague. Strength, calisthenics and the ability to control your own body form the foundation of my work. What interests me most, though, is how individual training sessions become a practice a person can sustain on their own.")}</p><p className="act rv d3"><Go href={routePath("spoluprace",lang)} cs="Možnosti spolupráce" en="Ways to work together" /></p></div>
          <figure className="about-hero-photo rv d1">
            <img src="/media/site/about-portrait-sunset.jpg" width={2048} height={1655} sizes="(min-width:900px) 420px, calc(100vw - 44px)" loading="eager" decoding="async" fetchPriority="high" alt={L("Kryštof Švec, barevný portrét v teplém večerním světle.","Kryštof Švec, colour portrait in warm evening light.")} />
          </figure>
        </div>
        <div className="proof-row rv"><div className="proof-item"><strong>{L("10 LET","10 YEARS")}</strong><span>{L("vlastní pohybové praxe","of personal movement practice")}</span></div><div className="proof-item"><strong>200+</strong><span>{L("klientů","clients")}</span></div><div className="proof-item"><strong>{L("PROFESNÍ KVALIFIKACE","PROFESSIONAL QUALIFICATION")}</strong><span>{L("Osobní trenér ve fitness","Personal Trainer in Fitness")}</span></div></div>
      </div>
    </header>

    <section className="site-linen page-section"><div className="wrap"><div className="section-head section-head--split"><div><p className="label rv">{L("Kořeny","Roots")}</p><h2 className="h-display h2 rv d1" style={{marginTop:12}}>{L("Co mě formovalo","What shaped me")}</h2></div><p className="page-intro rv d1">{L("Moje práce nevychází z jedné metody. Vznikala mezi pohybem, pozorností a časem stráveným venku.","My work does not come from a single method. It formed between movement, attention and time spent outdoors.")}</p></div><div className="editorial-list">{roots.map((x:any)=><article className="editorial-row rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div></div></section>

    <section className="site-ink page-section story-return"><div className="material-edge material-edge--linen" aria-hidden="true"/><div className="wrap"><div className="section-head"><p className="label rv">{L("Pád · sestup · návrat","Fall · descent · return")}</p><h2 className="h-display h2 rv d1">{L("Když tělo i život přestaly být samozřejmostí","When body and life stopped being something I could take for granted")}</h2><p className="page-intro rv d1">{L("Návrat neznamenal pokračovat tam, kde jsem skončil. Znamenal znovu se učit, co tělo unese, čemu můžu věřit a o co se dá opřít, když výkon ani jistota nejsou k dispozici.","Returning did not mean continuing where I had left off. It meant learning again what my body could carry, what I could trust, and what remained to lean on when performance and certainty were gone.")}</p></div><div className="story-beats"><article className="story-beat rv"><span className="num">01</span><h3>{L("Pád","The fall")}</h3><p>{L("Pohyb, fyzická kapacita a disciplína byly dlouho tím, o co jsem se opíral. Těžká nehoda a následné kóma ten život během jediného okamžiku přerušily.","Movement, physical capacity and discipline were what I relied on for a long time. A serious accident and the coma that followed interrupted that life in a single moment.")}</p></article><article className="story-beat rv d1"><span className="num">02</span><h3>{L("Sestup","The descent")}</h3><p>{L("Návrat trval dva roky. Po nehodě jsem ztratil kontrolu nad vlastním tělem, rok strávil na vozíku a dlouhé měsíce se zotavoval po operacích. Změnilo se nejen to, co tělo dokázalo, ale i to, jak jsem vnímal sám sebe. Učil jsem se znovu rozpoznat, co je možné, co už je příliš a co zůstává, když výkon zmizí.","The return took two years. After the accident I lost control of my own body, spent a year in a wheelchair and long months recovering from operations. What changed was not only what my body could do, but also how I saw myself. I had to learn again what was possible, what was too much, and what remained when performance disappeared.")}</p></article><article className="story-beat rv d2"><span className="num">03</span><h3>{L("Návrat","The return")}</h3><p>{L("Nevrátil jsem se do stejného těla ani ke stejnému pohledu na trénink. Začal jsem víc vnímat kapacitu, podmínky a malé kroky, které se dají skutečně opakovat. Tělo se z nástroje výkonu stalo učitelem.","I did not return to the same body or the same view of training. I became more attentive to capacity, conditions and small steps that can actually be repeated. The body changed from a tool of performance into a teacher.")}</p></article></div><p className="stance-line rv" style={{marginTop:"clamp(30px,4vw,48px)"}}>{L("Nehoda není moje kvalifikace. Vysvětluje, proč tuhle práci beru vážně.","The accident is not my qualification. It explains why I take this work seriously.")}</p></div></section>

    <section className="site-linen page-section"><div className="material-edge material-edge--ink" aria-hidden="true"/><div className="wrap"><h2 className="h-display h2 rv">{L("Co si z toho nesu do praxe","What I carry from it into my work")}</h2><div className="editorial-list" style={{marginTop:30}}>{approach.map((x:any)=><article className="editorial-row rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div></div></section>

    <section className="site-linen page-section"><div className="wrap"><div className="section-head section-head--split"><div><p className="label rv">{L("Odborné zázemí","Professional background")}</p><h2 className="h-display h2 rv d1" style={{marginTop:12}}>{L("Vlastní zkušenost je důležitá. Sama ale nestačí.","Personal experience matters. On its own, it is not enough.")}</h2></div><p className="page-intro rv d1">{L("Proto svou práci opírám také o profesní kvalifikaci a další vzdělání v tréninku, józe a psychologii.","That is why I also ground my work in professional qualifications and further education in training, yoga and psychology.")}</p></div><div className="education-list rv"><div className="education-item"><p className="label">{L("Profesní kvalifikace","Professional qualification")}</p><p>{L("Osobní trenér ve fitness","Personal Trainer in Fitness")}</p></div><div className="education-item"><p className="label">{L("Pohyb a trénink","Movement and training")}</p><p>{L("Kondiční a funkční trénink · zdravotní tělesná výchova · rehabilitační trénink","Conditioning and functional training · health-oriented physical education · rehabilitation training")}</p></div><div className="education-item"><p className="label">{L("Jóga","Yoga")}</p><p>{L("Instruktor jógy","Yoga instructor")}</p></div><div className="education-item"><p className="label">{L("Studium","Study")}</p><p>{L("Psychologie · Univerzita Palackého · 2019 až 2024","Psychology · Palacký University · 2019 to 2024")}</p></div></div><p className="small rv" style={{marginTop:24}}>{L("Rehabilitační trénink je součást mého vzdělání. Nenahrazuje fyzioterapii ani zdravotní rehabilitaci.","Rehabilitation training is part of my education. It does not replace physiotherapy or medical rehabilitation.")}</p></div></section>

    <section className="site-earth contact-coda"><div className="wrap"><h2 className="h-display h2 rv">{L("Co nabízím dnes","What I offer today")}</h2><p className="body-txt rv d1" style={{margin:"18px auto 0"}}>{L("Pracuji individuálně i s menšími skupinami, osobně v Praze nebo online. Může jít o jedno setkání nebo delší vedení.","I work one-to-one and with small groups, in person in Prague or online. It can be one session or longer-term guidance.")}</p><p className="rv d2" style={{marginTop:28}}><Go href={routePath("spoluprace",lang)} cs="Možnosti spolupráce" en="Ways to work together" /></p></div></section>
  </div>;
}

// ----------------------------------------------------------------------

// 03 · SPOLUPRÁCE · V2
// ----------------------------------------------------------------------
function PageSpoluprace({ lang }: any) {
  const formats=[
    ["01","Osobní trénink","Pracujeme přesně s tím, co chceš rozvíjet. Podle cíle může jít o samostatný trénink nebo delší vedení.","Personal training","We work precisely with what you want to develop. Depending on the goal, it can be a single session or longer-term guidance."],
    ["02","Trénink v menší skupině","Společný trénink pro lidi, kteří chtějí pracovat podobným směrem. Každý má vlastní úroveň, skupina společný rytmus.","Small-group training","Shared training for people who want to work in a similar direction. Everyone has their own level, while the group shares a rhythm."],
    ["03","Online vedení","Máš jasný plán, pravidelnou zpětnou vazbu a úpravy podle skutečného průběhu. Praxe probíhá tam, kde jsi.","Online guidance","You have a clear plan, regular feedback and adjustments based on what actually happens. The practice takes place where you are."],
  ];
  const needs=[
    ["01","Síla a kondice","Chceš zesílit, zlepšit výdrž nebo zvládat fyzickou zátěž s větší rezervou.","Strength and conditioning","You want to get stronger, improve endurance or handle physical demands with more reserve."],
    ["02","Konkrétní dovednost","Chceš zvládnout shyb, stojku, práci na kruzích nebo jiný pohyb, na kterém ti záleží.","A specific skill","You want to learn a pull-up, handstand, ring work or another movement that matters to you."],
    ["03","Větší volnost v pohybu","Některé pohyby bolí, některým se vyhýbáš nebo nevíš, co si v nich můžeš dovolit.","More freedom in movement","Some movements hurt, some you avoid, or you are unsure what you can safely ask of yourself in them."],
    ["04","Pravidelnost a vlastní praxe","Začínáš, vracíš se po pauze nebo nechceš znovu ztratit směr. Hledáš způsob, který se dá skutečně držet.","Consistency and your own practice","You are starting, returning after a break, or do not want to lose direction again. You are looking for an approach you can genuinely sustain."],
  ];
  const process=[
    ["01","Napiš mi","Stačí pár vět o tom, co chceš rozvíjet a jakou spolupráci hledáš. Odpovím osobně a domluvíme první setkání.","Write to me","A few lines about what you want to develop and the kind of work you are looking for are enough. I will reply personally and we will arrange the first session."],
    ["02","První setkání","Krátce si ujasníme cíl a potom se většinu času hýbeme. Podíváme se na pohyby, které jsou pro tebe důležité, a podle potřeby použijeme několik jednoduchých testů.","First session","We briefly clarify the goal and then spend most of the time moving. We look at the movements that matter to you and use a few simple tests if they help."],
    ["03","Kde jsi a co dál","Jedno setkání může stát samo o sobě. Odneseš si jasnější obraz o tom, co už funguje, co má prioritu a jak pokračovat. Pokud navážeme, domluvíme rytmus, plán a průběžnou úpravu.","Where you are and what comes next","One session can stand on its own. You leave with a clearer picture of what already works, what has priority and how to continue. If we carry on, we agree the rhythm, plan and ongoing adjustments."],
  ];
  const whatsappText=encodeURIComponent(L("Ahoj Kryštofe, mám zájem o spolupráci.\n\nCo chci rozvíjet:\n\nJakou spolupráci hledám:\n\nKdy mám obvykle čas:","Hi Kryštof, I am interested in working together.\n\nWhat I want to develop:\n\nWhat kind of collaboration I am looking for:\n\nWhen I am usually available:"));
  const mailSubject=encodeURIComponent(L("Zájem o spolupráci","Working together"));
  const mailBody=encodeURIComponent(L("Ahoj Kryštofe,\n\nmám zájem o spolupráci.\n\nCo chci rozvíjet:\n\nJakou spolupráci hledám:\n\nKdy mám obvykle čas:","Hi Kryštof,\n\nI am interested in working together.\n\nWhat I want to develop:\n\nWhat kind of collaboration I am looking for:\n\nWhen I am usually available:"));
  return <div className="site-page">
    <header className="site-linen page-hero">
      <div className="wrap">
        <div className="page-hero-grid collaboration-hero-grid">
          <div className="collaboration-hero-copy">
            <p className="label rv">{L("Spolupráce","Work with me")}</p>
            <h1 className="h-display h1 rv d1">{L("Spolupráce","Work with me")}</h1>
            <p className="hero-dominant rv d1">{L("Jedno setkání nebo delší vedení.","One session or longer-term guidance.")}</p>
            <p className="lead rv d2">{L("Individuálně, v menší skupině, osobně v Praze nebo online. Zvolíme formu podle toho, co chceš rozvíjet a co se dá skutečně držet.","One-to-one, in a small group, in person in Prague or online. We choose the format according to what you want to develop and what you can realistically sustain.")}</p>
            <p className="act rv d3"><Go href="#kontakt" cs="Napiš mi" en="Write to me" /></p>
          </div>
          <figure className="collaboration-hero-cutout rv d1">
            <img src="/media/site/collaboration-hero-cutout.png" width={1086} height={1448} sizes="(min-width:900px) 430px, calc(100vw - 44px)" loading="eager" decoding="async" fetchPriority="high" alt={L("Kryštof Švec sedící na lavičce vedle paraletek.","Kryštof Švec seated on a bench beside parallettes.")} />
          </figure>
        </div>
      </div>
    </header>

    <section className="site-linen page-section"><div className="wrap"><h2 className="h-display h2 rv">{L("Možnosti spolupráce","Ways to work together")}</h2><div className="editorial-list" style={{marginTop:30}}>{formats.map((x:any)=><article className="editorial-row rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div></div></section>

    <section className="site-linen page-section"><div className="wrap"><div className="section-head section-head--split"><h2 className="h-display h2 rv">{L("S čím můžeš přijít","What you can come with")}</h2><p className="page-intro rv d1">{L("Nemusíš přesně vědět, co potřebuješ. Stačí vědět, co chceš zvládnout, co tě omezuje nebo kde ztrácíš směr.","You do not need to know exactly what you need. It is enough to know what you want to be able to do, what limits you, or where you are losing direction.")}</p></div><div className="editorial-grid">{needs.map((x:any)=><article className="rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div></div></section>

    <section className="site-ink page-section"><div className="material-edge material-edge--linen" aria-hidden="true"/><div className="wrap"><h2 className="h-display h2 rv">{L("Jak to probíhá","How it works")}</h2><div className="process-three">{process.map((x:any)=><article className="rv" key={x[0]}><span className="num">{x[0]}</span><h3>{L(x[1],x[3])}</h3><p>{L(x[2],x[4])}</p></article>)}</div><p className="stance-line rv" style={{marginTop:"clamp(30px,4vw,48px)"}}>{L("Jedno setkání může stát samo o sobě.","One session can stand on its own.")}</p></div></section>

    <section className="site-ink page-section--tight"><div className="wrap between-grid"><div><p className="label rv">{L("Mezi setkáními","Between sessions")}</p><h2 className="h-display h2 rv d1" style={{marginTop:12}}>{L("Plán, záznam, úprava.","Plan, record, adjust.")}</h2><p className="body-txt rv d1" style={{marginTop:18}}>{L("Při delší spolupráci máš v klientské aplikaci svůj plán, termíny, záznamy a zpětnou vazbu na jednom místě.","In longer-term work, your plan, sessions, records and feedback live together in the client app.")}</p><p className="scan-line rv d2" style={{marginTop:24}}>{L("PLÁN · ZÁZNAM · ÚPRAVA","PLAN · RECORD · ADJUST")}</p></div><div className="between-items"><div className="between-item rv"><h3>{L("Jasný plán","A clear plan")}</h3><p>{L("Víš, co má teď prioritu a čeho se držet.","You know what matters now and what to keep hold of.")}</p></div><div className="between-item rv d1"><h3>{L("Skutečný záznam","A real record")}</h3><p>{L("Zapisuješ, co jsi opravdu udělal a jak na to tělo reagovalo.","You record what you actually did and how your body responded.")}</p></div><div className="between-item rv d2"><h3>{L("Průběžná úprava","Ongoing adjustment")}</h3><p>{L("Další krok vychází ze skutečného průběhu, ne z toho, jak měl týden vypadat.","The next step comes from what actually happened, not from how the week was supposed to look.")}</p></div></div></div></section>

    <section className="site-linen page-section"><div className="material-edge material-edge--ink" aria-hidden="true"/><div className="wrap"><div className="section-head section-head--split"><h2 className="h-display h2 rv">{L("Zkušenost a vzdělání","Experience and education")}</h2><p className="page-intro rv d1">{L("Vycházím z deseti let vlastní pohybové praxe a zkušeností s více než 200 klienty. Jsem držitelem profesní kvalifikace Osobní trenér ve fitness a instruktorem jógy. Další vzdělání mám v kondičním a funkčním tréninku, zdravotní tělesné výchově a rehabilitačním tréninku.","My work draws on ten years of personal movement practice and experience with more than 200 clients. I hold the professional qualification Personal Trainer in Fitness and I am a yoga instructor. I also have further education in conditioning and functional training, health-oriented physical education and rehabilitation training.")}</p></div><div className="trust-scan rv"><div className="trust-stat"><strong>{L("10 LET","10 YEARS")}</strong><span>{L("vlastní pohybové praxe","of personal movement practice")}</span></div><div className="trust-stat"><strong>200+</strong><span>{L("klientů","clients")}</span></div><div className="trust-stat"><strong>{L("PROFESNÍ KVALIFIKACE","PROFESSIONAL QUALIFICATION")}</strong><span>{L("Osobní trenér ve fitness","Personal Trainer in Fitness")}</span></div></div></div></section>

    <section className="site-linen page-section--tight"><div className="wrap"><div className="boundary rv"><h3 className="h3">{L("Kde jsou hranice","Where the boundaries are")}</h3><p className="stance-line">{L("Moje práce je trenérská.","My work is training.")}</p><p>{L("Akutní zranění, nevysvětlená nebo zhoršující se bolest patří nejdřív k lékaři nebo fyzioterapeutovi. Když je jasné, v jakém rozsahu se můžeš bezpečně hýbat, můžeme z toho vycházet.","Acute injury, unexplained pain or pain that is getting worse belongs first with a doctor or physiotherapist. Once it is clear what range of movement is safe for you, we can work from there.")}</p></div></div></section>

    <section className="site-linen page-section"><div className="wrap"><h2 className="h-display h2 rv">{L("Časté otázky","Common questions")}</h2><div className="faq-list" style={{marginTop:28}}><div className="faq-item rv"><h3>{L("Potřebuji zkušenost?","Do I need experience?")}</h3><p>{L("Ne. První setkání slouží i k tomu, abychom zjistili, kde právě jsi a co má smysl jako první.","No. The first session also helps us see where you are now and what makes sense as a first step.")}</p></div><div className="faq-item rv"><h3>{L("Kde probíhají osobní tréninky?","Where do in-person sessions take place?")}</h3><p>{L("V Praze, uvnitř nebo venku podle toho, na čem pracujeme. Konkrétní místo domluvíme před prvním setkáním.","In Prague, indoors or outdoors depending on what we are working on. We agree the exact place before the first session.")}</p></div><div className="faq-item rv"><h3>{L("Jak často se budeme vídat?","How often will we meet?")}</h3><p>{L("Frekvence není předem daná. U delší spolupráce ji nastavíme podle cíle, tvého týdne a toho, co budeš dělat mezi setkáními.","The frequency is not fixed in advance. In longer-term work we set it according to the goal, your week and what you will do between sessions.")}</p></div></div></div></section>

    <section className="site-earth contact-coda" id="kontakt"><div className="material-edge material-edge--linen" aria-hidden="true"/><div className="wrap"><h2 className="h-display h2 rv">{L("Napiš mi.","Write to me.")}</h2><div className="booking-actions rv d1"><a className="contact-action contact-action--primary" href={"https://wa.me/420774121475?text="+whatsappText} target="_blank" rel="noopener noreferrer">{L("Napsat na WhatsApp","Message on WhatsApp")}</a><a className="contact-action" href={"mailto:"+MAIL+"?subject="+mailSubject+"&body="+mailBody}>{L("Napsat e-mail","Send an email")}</a></div></div></section>
  </div>;
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
  return <div className="site-page">
    <header className="site-linen page-hero"><div className="wrap"><p className="label rv">{L("Soukromí","Privacy")}</p><h1 className="h-display h1 rv d1">{L("Soukromí","Privacy")}</h1><p className="lead rv d2">{L("Tento web je postavený tak, aby o návštěvnících sbíral co nejméně údajů. Tady najdeš stručně a přesně, co se děje při návštěvě webu, když mi napíšeš a při přechodu do klientské aplikace.","This site is built to collect as little visitor data as possible. Here is a concise account of what happens when you visit the site, contact me, or move into the client application.")}</p></div></header>
    <section className="site-linen page-section--tight legal"><div className="wrap limit">
      <h2>{L("Kdo za web odpovídá","Who is responsible for the site")}</h2><p>{L("Správcem osobních údajů je Kryštof Švec. Kontaktovat mě můžeš na e-mailu ","The data controller is Kryštof Švec. You can contact me at ")}<a href={"mailto:"+MAIL}>{MAIL}</a>{L(".",".")}</p>
      <h2>{L("Při návštěvě webu","When you visit the site")}</h2><p>{L("Na webu nepoužívám reklamní ani analytické cookies. Pro bezpečný provoz a doručení obsahu mohou poskytovatelé hostingu a zabezpečení zpracovat základní technické údaje, například IP adresu, čas požadavku a typ prohlížeče. Tyto údaje nepoužívám k reklamě ani k vytváření profilu návštěvníka.","I do not use advertising or analytics cookies on this site. Hosting and security providers may process basic technical data, such as IP address, request time and browser type, to deliver and secure the site. I do not use this data for advertising or visitor profiling.")}</p>
      <h2>{L("Návštěvnost a výkon webu","Site traffic and performance")}</h2><p>{L("Pro základní měření návštěvnosti a výkonu webu používám Cloudflare Web Analytics. Nástroj nepoužívá pro analytiku cookies ani místní úložiště prohlížeče a nevytváří individuální profily návštěvníků. Poskytuje mi souhrnné údaje, například počet návštěv, navštívené stránky, zdroje návštěvnosti, typ zařízení a rychlost webu.","I use Cloudflare Web Analytics for basic traffic and performance measurement. It does not use analytics cookies or browser local storage and does not create individual visitor profiles. It provides aggregate information such as visits, viewed pages, traffic sources, device type and site speed.")}</p>
      <h2>{L("Když mi napíšeš","When you contact me")}</h2><p>{L("Kontaktní údaje a zprávu, které mi pošleš, používám k odpovědi, domluvě prvního setkání a případné přípravě spolupráce. Pokud spolupráce nevznikne, nenechávám si je déle, než je potřeba k uzavření komunikace. Pokud začne, řídí se další zpracování průběhem spolupráce a zákonnými povinnostmi.","I use the contact details and message you send to reply, arrange a first session and, if relevant, prepare our work together. If we do not begin working together, I do not keep them longer than needed to close the conversation. If we do, further processing follows the course of our work and legal obligations.")}</p>
      <h2>{L("Externí služby","External services")}</h2><p>{L("Odkazy na WhatsApp, Instagram a další externí služby vedou mimo tento web. Když je otevřeš, platí jejich vlastní pravidla zpracování údajů.","Links to WhatsApp, Instagram and other external services lead away from this site. When you open them, their own data-processing rules apply.")}</p>
      <h2>{L("Klientská aplikace","Client application")}</h2><p>{L("Klientská aplikace běží na samostatné adrese klient.tanmaypractice.com a používají ji lidé, se kterými už pracuji. Veřejný web do ní nepřenáší údaje automaticky.","The client application runs at a separate address, klient.tanmaypractice.com, and is used by people I already work with. The public website does not automatically transfer data into it.")}</p>
      <h2>{L("Tvoje práva","Your rights")}</h2><p>{L("Můžeš se zeptat, jaké údaje o tobě zpracovávám, a podle okolností požádat o jejich opravu, výmaz, omezení zpracování nebo přenos a vznést námitku. Napiš mi na ","You can ask what personal data I process about you and, depending on the circumstances, request correction, deletion, restriction, portability or object to processing. Write to me at ")}<a href={"mailto:"+MAIL}>{MAIL}</a>.</p>
      <p className="small" style={{marginTop:32}}>{L("Poslední aktualizace: září 2026","Last updated: September 2026")}</p>
    </div></section>
  </div>;
}

// ----------------------------------------------------------------------

// 404
// ----------------------------------------------------------------------
function PageNotFound({ lang }: any) {
  return <section className="site-linen nf"><div className="wrap"><p className="label rv">404</p><h1 className="h-display h1 rv d1" style={{marginTop:16}}>{L("Tahle stránka tady není.","This page is not here.")}</h1><p className="body-txt rv d2">{L("Buď se adresa změnila, nebo se do ní vloudil překlep. Odsud se dostaneš dál.","Either the address changed or a typo slipped in. You can continue from here.")}</p><p className="act rv d2"><Go href={routePath("home",lang)} cs="Domů" en="Home"/><Go href={routePath("spoluprace",lang)} cs="Spolupráce" en="Work with me" quiet/><Go href={routePath("pribeh",lang)} cs="O mně" en="About me" quiet/><Go href={routePath("praxe",lang)} cs="Praxe" en="Practice" quiet/></p></div></section>;
}

// ----------------------------------------------------------------------

// FOOTER
// ----------------------------------------------------------------------
function Footer({ lang, variant = "linen" }: any) {
  return (
    <footer className={variant === "sand" ? "footer--sand" : "footer--linen"}>
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
  const hasSand = useAsset(MEDIA.texSandstone, r === "home");
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

      <Footer lang={lang} variant={loc.routeId === "home" ? "sand" : "linen"} />
    </>
  );
}
