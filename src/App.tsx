/**
 * tanmaypractice.com · hlavní web
 * --------------------------------------------------
 * Single-file React/Vite. Stejný vzor jako tanmay-web apka:
 * module-level LANG + L(cs, en), žádné externí knihovny.
 * Struktura po vzoru idoportal.com, vizuál dle brand identity v1.2.
 */
import { useState, useEffect } from "react";

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
  } catch (e) { return "cs"; }
};
const L = (cs: string, en: string) => (LANG === "cs" ? cs : en);

// ----------------------------------------------------------------------
// ROUTER · hash (#/pribeh …), zpět v prohlížeči funguje zdarma
// ----------------------------------------------------------------------
const PAGES = ["pribeh", "praxe", "spoluprace", "denik", "udalosti", "kontakt"];
const parseRoute = () => {
  try {
    const m = (window.location.hash || "").match(/^#\/([a-z]+)/);
    if (m && PAGES.indexOf(m[1]) !== -1) return m[1];
  } catch (e) {}
  return "home";
};

const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FONT_HAND = "'Caveat', cursive";

// ----------------------------------------------------------------------
// CSS
// ----------------------------------------------------------------------
const CSS = `
:root{
  --forest:#1C1C1A; --ink:#1A1612; --moss:#2E3D35; --sage:#7C8C6E;
  --sand:#C5B49A; --linen:#F4F0EB; --bone:#F5F2EE; --copper:#B87333;
  --taupe:#8C7B6E; --stone:#BFB0A3; --ivory:#F7F2E9;
  --ff-display:'Cormorant Garamond',Georgia,serif;
  --ff-logo:'Cormorant Garamond',Georgia,serif;
  --ff-body:'DM Sans',system-ui,sans-serif;
  --ff-tag:'Barlow Condensed',sans-serif;
  --ff-hand:'Caveat',cursive;
  --maxw:1180px;
}
/* CZ display · EB Garamond Regular 400 (brand rule §6)
   Cormorant háčky/čárky čtou v češtině jako šum. Logo zůstává Cormorant (--ff-logo). */
html[lang="cs"]{ --ff-display:'EB Garamond',Georgia,serif; }
html[lang="cs"] .h-display{ letter-spacing:normal; }
html[lang="cs"] .qa .q, html[lang="cs"] .vitem h3, html[lang="cs"] .card h3,
html[lang="cs"] .card .price, html[lang="cs"] .event h3, html[lang="cs"] .post-card h3,
html[lang="cs"] .reader h2{ font-weight:400; }
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
section[id]{scroll-margin-top:70px}
body{
  font-family:var(--ff-body); background:var(--linen); color:var(--forest);
  font-size:17px; line-height:1.7; -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
::selection{background:var(--copper);color:var(--linen)}
a{color:inherit;text-decoration:none}
body::after{
  content:""; position:fixed; inset:-50%; width:200%; height:200%;
  pointer-events:none; z-index:2000; opacity:.038;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---------- type ---------- */
.tag{font-family:var(--ff-tag); font-weight:500; text-transform:uppercase; letter-spacing:.32em; font-size:12px; color:var(--copper)}
.tag.sage{color:var(--sage)} .tag.stone{color:var(--stone)} .tag.taupe{color:var(--taupe)} .tag.sand{color:var(--sand)}
.tagline-u{display:inline-block; border-bottom:1px solid var(--copper); padding-bottom:5px}
.h-display{font-family:var(--ff-display); font-weight:400; line-height:1.08; color:var(--forest); letter-spacing:.01em}
.h-xl{font-size:clamp(2.6rem,6.5vw,4.6rem)}
.h-lg{font-size:clamp(2.1rem,4.6vw,3.4rem)}
.it{font-style:italic}
.copper{color:var(--copper)} .sagec{color:var(--sage)}
.lead{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.15rem,2.2vw,1.45rem); line-height:1.55; color:#4a443b}
.body-txt{font-size:16.5px; color:#3b362f; max-width:34em}
.muted{color:var(--taupe)}

/* ---------- layout ---------- */
.wrap{max-width:var(--maxw); margin:0 auto; padding:0 clamp(20px,5vw,56px)}
section{position:relative}
.sec-pad{padding:clamp(84px,11vw,150px) 0}

/* squiggle divider */
.squig{display:block; height:22px}
.squig.center{margin-left:auto;margin-right:auto}
.squig path{stroke:var(--copper); fill:none; stroke-width:1.6; stroke-linecap:round}
.squig.sage path{stroke:var(--sage)}
.squig.stone path{stroke:var(--stone)}

/* wave transitions */
.wave{display:block; width:100%; height:clamp(46px,8vw,110px); line-height:0}
.wave svg{width:100%; height:100%; display:block}
.wave.abs{position:absolute; bottom:-1px; left:0; right:0}
.wave-spacer{height:clamp(46px,8vw,110px)}

/* reveal */
.rv{opacity:0; transform:translateY(26px); transition:opacity .95s ease,transform .95s cubic-bezier(.2,.65,.25,1)}
.rv.on{opacity:1; transform:none}
.d1{transition-delay:.12s}.d2{transition-delay:.24s}.d3{transition-delay:.36s}.d4{transition-delay:.48s}

/* page transition · quiet fade-rise on route change */
@keyframes pageIn{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
main.page{animation:pageIn .6s cubic-bezier(.22,.61,.36,1) both}

/* bindu breathes · 6s cycle, barely there */
@keyframes breathe{0%,100%{transform:translateX(-50%) scale(1); opacity:.92}50%{transform:translateX(-50%) scale(1.22); opacity:1}}
.wm .a1 .bindu{animation:breathe 6s ease-in-out infinite}

@media (prefers-reduced-motion:reduce){
  .rv{opacity:1;transform:none;transition:none}
  .blob,.blob2{animation:none!important}
  main.page{animation:none}
  .wm .a1 .bindu{animation:none}
}

/* buttons */
.btn{
  display:inline-block; font-family:var(--ff-tag); font-weight:500; text-transform:uppercase;
  letter-spacing:.26em; font-size:13px; padding:15px 34px 14px; cursor:pointer; transition:all .35s ease;
  border-radius:100px 90px 100px 90px / 90px 100px 90px 100px;
  border:1px solid var(--copper); color:var(--copper); background:transparent;
}
.btn:hover{background:var(--copper); color:var(--linen)}
.btn.solid{background:var(--copper); color:var(--linen)}
.btn.solid:hover{background:transparent; color:var(--copper)}
.btn.onlight{border-color:var(--moss); color:var(--moss)}
.btn.onlight:hover{background:var(--moss); color:var(--linen)}

/* wordmark */
.wm{font-family:var(--ff-logo); font-weight:300; letter-spacing:.14em; position:relative; display:inline-block}
.wm .a1{position:relative}
.wm .a1 .bindu{position:absolute; left:50%; transform:translateX(-50%); top:-.38em; width:.14em; height:.14em; border-radius:50%; background:var(--copper)}

/* ---------- topbar (Ido: minimal, burger always) ---------- */
.topbar{
  position:fixed; top:0; left:0; right:0; z-index:960; padding:22px 0;
  transition:background .45s ease, box-shadow .45s ease, padding .45s ease;
}
.topbar .wrap{display:flex; align-items:center; gap:22px}
.topbar .logo{font-size:23px; color:var(--linen); transition:color .45s}
.topbar .right{margin-left:auto; display:flex; align-items:center; gap:22px}
.topbar .lang{font-family:var(--ff-tag); font-size:12.5px; letter-spacing:.18em; color:rgba(244,240,235,.55); white-space:nowrap}
.topbar .lang span{cursor:pointer; transition:color .3s}
.topbar .lang span.act{color:var(--copper)}
.topbar .lang span:hover{color:var(--copper)}
.topnav{display:flex; align-items:center; gap:clamp(16px,2.2vw,30px); margin-left:auto}
.topnav a{font-family:var(--ff-tag); font-weight:400; text-transform:uppercase; letter-spacing:.22em; font-size:12px; color:rgba(244,240,235,.72); transition:color .3s; position:relative; padding-top:8px}
.topnav a:hover{color:var(--linen)}
.topnav a.act{color:var(--copper)}
.topnav a.act::before{content:""; position:absolute; top:0; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--copper)}
.topbar.scrolled .topnav a{color:var(--taupe)}
.topbar.scrolled .topnav a:hover{color:var(--forest)}
.topbar.scrolled .topnav a.act{color:var(--copper)}
.topbar.on-light:not(.scrolled) .logo{color:var(--forest)}
.topbar.on-light:not(.scrolled) .lang{color:var(--taupe)}
.topbar.on-light:not(.scrolled) .topnav a{color:var(--taupe)}
.topbar.on-light:not(.scrolled) .topnav a:hover{color:var(--forest)}
.topbar.on-light:not(.scrolled) .topnav a.act{color:var(--copper)}
.topbar.on-light:not(.scrolled) .burger span{background:var(--forest)}
@media (max-width:940px){ .topnav{display:none} }
@media (min-width:941px){ .burger{display:none} .topbar .right{margin-left:0} }
.topbar .btn{padding:10px 22px 9px; font-size:12px}
.topbar.scrolled{background:rgba(244,240,235,.93); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); padding:13px 0; box-shadow:0 1px 0 rgba(88,72,52,.14)}
.topbar.scrolled .logo{color:var(--forest)}
.topbar.scrolled .lang{color:var(--taupe)}
.topbar.menu-open{background:transparent!important; box-shadow:none!important; backdrop-filter:none!important; -webkit-backdrop-filter:none!important}
.topbar.menu-open .logo{color:var(--linen)!important}
.burger{background:none; border:none; cursor:pointer; padding:8px 0 8px 8px}
.burger span{display:block; width:27px; height:1.6px; background:var(--linen); margin:6.5px 0; transition:all .4s ease}
.topbar.scrolled .burger span{background:var(--forest)}
.topbar.menu-open .burger span{background:var(--linen)!important}
.topbar.menu-open .burger span:nth-child(1){transform:translateY(8.1px) rotate(45deg)}
.topbar.menu-open .burger span:nth-child(2){opacity:0}
.topbar.menu-open .burger span:nth-child(3){transform:translateY(-8.1px) rotate(-45deg)}
@media (max-width:560px){ .topbar .btn{display:none} }

/* ---------- fullscreen menu (Ido style) ---------- */
.mmenu{
  position:fixed; inset:0; z-index:940; background:var(--forest);
  display:flex; flex-direction:column; justify-content:center; align-items:center;
  opacity:0; pointer-events:none; transition:opacity .5s ease; overflow-y:auto; padding:90px 20px 40px;
}
.mmenu.open{opacity:1; pointer-events:auto}
.mmenu .mlink{
  display:flex; align-items:baseline; gap:18px; padding:8px 0;
  font-family:var(--ff-display); font-size:clamp(1.55rem,4.6vh,2.3rem); color:var(--linen);
  transition:color .3s, transform .3s;
}
.mmenu .mlink:hover{color:var(--copper); transform:translateX(6px)}
.mmenu .mnum{font-family:var(--ff-tag); font-weight:400; font-size:12px; letter-spacing:.28em; color:var(--taupe)}
.mmenu .mlink.vstup{color:var(--copper)}
.mmenu .msoc{margin-top:5vh; display:flex; gap:26px}
.mmenu .msoc a{font-family:var(--ff-tag); letter-spacing:.24em; font-size:12px; text-transform:uppercase; color:var(--stone); transition:color .3s}
.mmenu .msoc a:hover{color:var(--copper)}
.mmenu .mtl{margin-top:3vh; font-family:var(--ff-tag); letter-spacing:.42em; font-size:11px; color:var(--taupe); text-transform:uppercase}

/* ---------- hero ---------- */
.hero{min-height:100svh; background:var(--forest); color:var(--linen); display:flex; flex-direction:column; position:relative; overflow:hidden}
.hero .inner{flex:1; display:flex; flex-direction:column; justify-content:center; text-align:center; position:relative; z-index:5; padding:120px 0 40px}
.blob,.blob2{position:absolute; pointer-events:none; filter:blur(70px); z-index:1}
.blob{
  width:56vw; height:56vw; max-width:760px; max-height:760px; left:-14vw; top:-8vw; opacity:.55;
  background:radial-gradient(circle at 40% 40%, #2E3D35 0%, transparent 68%);
  border-radius:42% 58% 61% 39% / 45% 40% 60% 55%;
  animation:breathe 11s ease-in-out infinite alternate;
}
.blob2{
  width:44vw; height:44vw; max-width:600px; max-height:600px; right:-12vw; bottom:-6vw; opacity:.32;
  background:radial-gradient(circle at 60% 55%, #B87333 0%, transparent 66%);
  border-radius:58% 42% 39% 61% / 40% 55% 45% 60%;
  animation:breathe 13s ease-in-out infinite alternate-reverse;
}
@keyframes breathe{
  0%{transform:scale(1) translate(0,0); border-radius:42% 58% 61% 39% / 45% 40% 60% 55%}
  50%{border-radius:55% 45% 48% 52% / 52% 58% 42% 48%}
  100%{transform:scale(1.12) translate(2%,3%); border-radius:38% 62% 55% 45% / 60% 42% 58% 40%}
}
.hero .kicker{font-family:var(--ff-tag); font-weight:400; letter-spacing:.5em; text-transform:uppercase; font-size:clamp(11px,1.6vw,14px); color:var(--sand)}
.hq-stage{position:relative; height:clamp(150px,26vw,240px); margin-top:clamp(28px,5vh,48px)}
.hq{
  position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; align-items:center;
  opacity:0; transition:opacity 1.4s ease; pointer-events:none;
}
.hq.act{opacity:1}
.hq .q{font-family:var(--ff-display); font-weight:400; font-size:clamp(2.4rem,7vw,4.8rem); line-height:1.1; color:var(--linen)}
.hq .s{font-family:var(--ff-display); font-style:italic; font-size:clamp(1.05rem,2.2vw,1.4rem); color:var(--sand); margin-top:16px}
.hq-dots{display:flex; gap:10px; justify-content:center; margin-top:8px}
.hq-dots span{width:6px; height:6px; border-radius:50%; background:rgba(191,176,163,.35); transition:background .4s; cursor:pointer}
.hq-dots span.act{background:var(--copper)}
.hero .sub{font-family:var(--ff-display); font-style:italic; font-size:clamp(1.02rem,1.9vw,1.25rem); color:var(--stone); margin-top:clamp(20px,3.5vh,34px); line-height:1.6}
.hero .cta{margin-top:clamp(30px,5vh,50px); display:flex; gap:18px; justify-content:center; flex-wrap:wrap}
.hero .scrolldn{position:relative; z-index:5; text-align:center; padding-bottom:26px; font-family:var(--ff-tag); letter-spacing:.3em; font-size:11px; color:var(--taupe); text-transform:uppercase}
.hero .scrolldn .line{width:1px; height:44px; background:linear-gradient(var(--copper),transparent); margin:10px auto 0; animation:drop 2.6s ease-in-out infinite}
@keyframes drop{0%,100%{opacity:.25}50%{opacity:1}}

/* ---------- letter (Tanmay) ---------- */
.letter{background:var(--linen)}
.letter .prose{max-width:640px; margin:0 auto}
.letter .prose p{font-size:17px; line-height:1.9; color:#33302a; margin-top:24px}
.letter .prose p:first-of-type{margin-top:clamp(40px,5vw,56px)}
.letter .head{text-align:center}
.interrupt{
  margin:clamp(48px,7vw,80px) auto; padding:clamp(40px,6vw,64px) clamp(24px,5vw,56px);
  background:var(--moss); color:var(--linen); text-align:center; position:relative; overflow:hidden;
  border-radius:32px 26px 34px 24px / 26px 34px 24px 32px;
}
.interrupt .iq{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.5rem,3.6vw,2.3rem); line-height:1.4; position:relative; z-index:2}
.interrupt .iq .hl{color:var(--sand)}
.interrupt::before{
  content:""; position:absolute; width:60%; height:160%; left:-18%; top:-30%;
  background:radial-gradient(circle at 40% 50%, rgba(184,115,51,.16) 0%, transparent 70%);
}
.letter .sig{font-family:var(--ff-hand); font-size:2.1rem; color:var(--moss); transform:rotate(-2deg); display:inline-block; margin-top:38px}
.letter .sigline{font-family:var(--ff-display); font-style:italic; color:var(--taupe); font-size:1.1rem; margin-top:6px}

/* ---------- praxe (culture) ---------- */
.praxe{background:var(--forest); color:var(--linen)}
.praxe .h-display{color:var(--linen)}
.praxe .bigline{font-family:var(--ff-display); font-weight:400; font-size:clamp(2rem,5vw,3.6rem); line-height:1.25; text-align:center}
.praxe .bigline .it{color:var(--sand)}
.qa{max-width:760px; margin:clamp(50px,7vw,80px) auto 0}
.qa .qaitem{padding:clamp(26px,3.4vw,38px) 0}
.qa .q{font-family:var(--ff-display); font-weight:500; font-size:clamp(1.35rem,2.6vw,1.8rem); color:var(--linen)}
.qa .q .qm{color:var(--copper)}
.qa .a{font-size:15.5px; color:var(--stone); margin-top:12px; line-height:1.8; max-width:38em}
.praxe .anchorline{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.05rem,2.1vw,1.3rem); line-height:1.7; color:var(--sand); text-align:center; max-width:30em; margin:clamp(44px,6vw,64px) auto 0}
.qa .qsep{height:20px}
.qa .qsep path{stroke:rgba(124,140,110,.45); stroke-width:1.3; fill:none; stroke-linecap:round}

/* values (beliefs · Ido style) */
.values{background:var(--linen)}
.vlist{max-width:820px; margin:clamp(44px,6vw,64px) auto 0}
.vitem{padding:clamp(30px,4vw,44px) 0; display:grid; grid-template-columns:64px 1fr; gap:clamp(18px,3vw,36px); align-items:baseline}
.vitem .vnum{font-family:var(--ff-display); font-size:1.6rem; color:var(--copper)}
.vitem h3{font-family:var(--ff-display); font-weight:500; font-size:clamp(1.5rem,3.2vw,2.1rem); line-height:1.2}
.vitem p{font-size:15.5px; color:#3b362f; margin-top:10px; line-height:1.8; max-width:36em}
.vsep{height:22px}
.vsep path{stroke:var(--stone); stroke-width:1.3; fill:none; stroke-linecap:round}

/* ---------- offer ---------- */
.offer{background:var(--linen)}
.cards{display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(20px,2.6vw,32px); margin-top:clamp(44px,6vw,66px)}
.card{
  background:var(--ivory); padding:clamp(28px,3vw,40px) clamp(24px,2.6vw,34px);
  border:1px solid rgba(88,72,52,.14);
  border-radius:22px 18px 24px 16px / 18px 24px 16px 22px;
  display:flex; flex-direction:column; transition:transform .45s ease, box-shadow .45s ease;
}
.card:hover{transform:translateY(-5px); box-shadow:0 18px 44px rgba(74,60,40,.12)}
.card .tag{font-size:11px}
.card h3{font-family:var(--ff-display); font-weight:500; font-size:1.6rem; margin-top:12px}
.card .where{font-family:var(--ff-display); font-style:italic; color:var(--taupe); margin-top:2px; font-size:1rem}
.card p{font-size:15px; color:#3b362f; margin-top:14px; line-height:1.75; flex:1}
.card .price{margin-top:22px; padding-top:18px; border-top:1px solid rgba(88,72,52,.16); font-family:var(--ff-display); font-size:1.25rem; color:var(--moss); font-weight:500}
.card .price small{display:block; font-family:var(--ff-body); font-size:12.5px; color:var(--taupe); font-weight:400; margin-top:4px}
.offer .transparent{margin-top:clamp(40px,5vw,56px); text-align:center; font-family:var(--ff-display); font-style:italic; font-size:1.1rem; color:var(--sage)}
.offer .cta-row{text-align:center; margin-top:30px}
.offer .cta-note{font-size:13.5px; color:var(--taupe); margin-top:14px}

/* ---------- app band ---------- */
.appband{background:var(--moss); color:var(--linen); overflow:hidden}
.appband .inner{display:grid; grid-template-columns:1.2fr .8fr; gap:clamp(36px,5vw,70px); align-items:center}
.appband h2{font-family:var(--ff-display); font-weight:400; font-size:clamp(1.9rem,4vw,2.9rem); line-height:1.2; color:var(--linen)}
.appband p{color:#cfd8c9; font-size:15.5px; margin-top:18px; max-width:32em}
.appband .note{font-size:13px; color:var(--sand); margin-top:14px; font-style:italic; font-family:var(--ff-display)}
.appband .mock{background:var(--forest); border:1px solid rgba(197,180,154,.25); border-radius:20px 16px 22px 14px / 16px 22px 14px 20px; padding:26px 26px 30px}
.appband .mock .mtitle{font-family:var(--ff-display); font-size:1.15rem; color:var(--linen); margin-bottom:8px}
.appband .mock .mrow{display:flex; align-items:center; gap:10px; padding:11px 0; border-bottom:1px solid rgba(124,140,110,.16)}
.appband .mock .mrow:last-child{border-bottom:none}
.appband .mock .dot{width:8px; height:8px; border-radius:50%; background:var(--copper); flex-shrink:0}
.appband .mock .dot.s{background:var(--sage)} .appband .mock .dot.n{background:var(--sand)}
.appband .mock span.mt{font-size:13.5px; color:var(--stone)}

/* ---------- kruh ---------- */
.kruh{background:var(--bone)}
.kruh .who{max-width:700px; margin:clamp(40px,5vw,56px) auto 0; text-align:center}
.kruh .who p{font-size:16.5px; line-height:1.85; color:#33302a; margin-top:20px}
.promise{
  max-width:760px; margin:clamp(48px,6vw,72px) auto 0; background:var(--forest); color:var(--linen);
  padding:clamp(36px,5vw,56px) clamp(26px,5vw,54px); text-align:center;
  border-radius:30px 24px 32px 22px / 24px 32px 22px 30px; position:relative; overflow:hidden;
}
.promise::before{content:""; position:absolute; width:70%; height:180%; right:-25%; top:-40%;
  background:radial-gradient(circle at 60% 50%, rgba(46,61,53,.9) 0%, transparent 70%);}
.promise .ptag{position:relative; z-index:2}
.promise .ptxt{font-family:var(--ff-display); font-style:italic; font-size:clamp(1.2rem,2.6vw,1.6rem); line-height:1.65; margin-top:18px; position:relative; z-index:2}
.kruh .knote{text-align:center; margin-top:clamp(36px,5vw,48px); font-family:var(--ff-display); font-style:italic; color:var(--sage); font-size:1.05rem}

/* ---------- kdy & kde ---------- */
.kdykde{background:var(--linen)}
.event{display:grid; grid-template-columns:150px 1fr auto; gap:clamp(20px,3vw,44px); align-items:center; padding:clamp(28px,3.4vw,40px) 0}
.ev-sep{height:20px}
.ev-sep path{stroke:var(--stone); stroke-width:1.2; fill:none; stroke-linecap:round}
.event .date{font-family:var(--ff-display); text-align:center}
.event .date .dm{font-size:2.1rem; font-weight:500; color:var(--moss); line-height:1.1}
.event .date .dy{font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.22em; font-size:11.5px; color:var(--taupe); margin-top:4px}
.event h3{font-family:var(--ff-display); font-weight:500; font-size:1.5rem}
.event .meta{font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.2em; font-size:11.5px; color:var(--sage); margin-top:6px}
.event p{font-size:15px; color:#3b362f; margin-top:10px; max-width:36em}
.event .status{font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.2em; font-size:11px; padding:8px 18px; border-radius:100px; white-space:nowrap}
.event .status.open{border:1px solid var(--copper); color:var(--copper)}
.event .status.soon{border:1px solid var(--stone); color:var(--taupe)}
.kde{margin-top:clamp(60px,8vw,100px); text-align:center}
.kde .mapline{width:min(760px,92%); margin:clamp(36px,5vw,52px) auto 0}
.kde .kdetxt{font-family:var(--ff-display); font-style:italic; font-size:clamp(1.15rem,2.4vw,1.5rem); color:#4a443b; margin-top:30px}
.kdykde .foot{text-align:center; margin-top:clamp(36px,5vw,50px); font-size:14.5px; color:var(--taupe)}
.kdykde .foot a{color:var(--copper); border-bottom:1px solid rgba(184,115,51,.4); padding-bottom:1px}

/* ---------- notes ---------- */
.notes{background:var(--bone)}
.notes .grid{display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(20px,2.6vw,32px); margin-top:clamp(44px,6vw,64px)}
.post-card{
  background:var(--ivory); border:1px solid rgba(88,72,52,.13); cursor:pointer;
  padding:clamp(26px,2.8vw,36px) clamp(22px,2.4vw,30px);
  border-radius:18px 24px 16px 22px / 24px 16px 22px 18px;
  transition:transform .45s ease, box-shadow .45s ease; display:flex; flex-direction:column; text-align:left;
}
.post-card:hover{transform:translateY(-5px); box-shadow:0 18px 44px rgba(74,60,40,.12)}
.post-card .pmeta{display:flex; justify-content:space-between; align-items:baseline}
.post-card .pdate{font-family:var(--ff-tag); letter-spacing:.18em; font-size:11px; color:var(--taupe); text-transform:uppercase}
.post-card h3{font-family:var(--ff-display); font-weight:500; font-size:1.45rem; margin-top:14px; line-height:1.25}
.post-card p{font-size:14.5px; color:#4a443b; margin-top:12px; line-height:1.7; flex:1}
.post-card .more{margin-top:20px; font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.24em; font-size:11.5px; color:var(--copper)}
.notes .subnote{text-align:center; margin-top:clamp(36px,5vw,48px); font-family:var(--ff-display); font-style:italic; color:var(--taupe); font-size:1.05rem}

/* reader */
.reader{position:fixed; inset:0; z-index:1100; background:var(--linen); overflow-y:auto; opacity:0; pointer-events:none; transition:opacity .4s ease}
.reader.open{opacity:1; pointer-events:auto}
.reader .rwrap{max-width:660px; margin:0 auto; padding:110px 24px 120px}
.reader .close{
  position:fixed; top:24px; right:28px; width:46px; height:46px; cursor:pointer;
  border:1px solid rgba(88,72,52,.3); border-radius:50%; background:var(--linen);
  font-family:var(--ff-display); font-size:20px; color:var(--forest);
  display:flex; align-items:center; justify-content:center; transition:all .3s;
}
.reader .close:hover{background:var(--copper); color:var(--linen); border-color:var(--copper)}
.reader .rdate{font-family:var(--ff-tag); letter-spacing:.24em; font-size:12px; color:var(--taupe); text-transform:uppercase}
.reader .rtag{font-family:var(--ff-tag); letter-spacing:.24em; font-size:12px; color:var(--copper); text-transform:uppercase}
.reader h2{font-family:var(--ff-display); font-weight:500; font-size:clamp(1.9rem,5vw,2.7rem); line-height:1.15; margin:18px 0 8px}
.reader .rbody p{font-size:16.5px; line-height:1.85; color:#33302a; margin-top:20px}
.reader .rbody p:first-of-type{margin-top:34px}
.reader .sig{font-family:var(--ff-hand); font-size:1.7rem; color:var(--moss); transform:rotate(-2deg); display:inline-block; margin-top:40px}

/* ---------- poetry ---------- */
.poetry{background:var(--ink); color:var(--linen); text-align:center}
.poetry .poem{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.3rem,2.8vw,1.85rem); line-height:1.85; color:var(--linen); max-width:24em; margin:clamp(44px,6vw,60px) auto 0}
.poetry .poem .dim{color:var(--sand)}
.poetry .ptitle{font-family:var(--ff-tag); letter-spacing:.3em; font-size:12px; color:var(--taupe); text-transform:uppercase; margin-top:clamp(40px,5vw,54px)}

/* ---------- contact ---------- */
.contact{background:var(--forest); color:var(--linen); text-align:center; clip-path:ellipse(140% 100% at 50% 100%)}
.contact h2{font-family:var(--ff-display); font-weight:400; font-size:clamp(2.1rem,5vw,3.4rem); color:var(--linen); line-height:1.15}
.contact .sub{font-family:var(--ff-display); font-style:italic; color:var(--stone); font-size:1.15rem; margin-top:18px}
.contact .mail{display:inline-block; font-family:var(--ff-display); font-size:clamp(1.25rem,3vw,1.8rem); color:var(--sand); margin-top:clamp(34px,5vw,46px); border-bottom:1px solid rgba(197,180,154,.4); padding-bottom:4px; transition:color .3s,border-color .3s}
.contact .mail:hover{color:var(--copper); border-color:var(--copper)}
.contact .socials{margin-top:34px; display:flex; gap:26px; justify-content:center; flex-wrap:wrap}
.contact .socials a{font-family:var(--ff-tag); letter-spacing:.24em; font-size:12.5px; text-transform:uppercase; color:var(--stone); transition:color .3s}
.contact .socials a:hover{color:var(--copper)}

/* ---------- page head · dark lintel above each room ---------- */
.pagehead{background:var(--forest); color:var(--linen); padding:clamp(108px,14vh,150px) 0 clamp(26px,4vw,44px)}
.pagehead .row{display:flex; align-items:baseline; justify-content:space-between; gap:18px; flex-wrap:wrap}
.pagehead .back{font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.26em; font-size:12px; color:var(--stone); transition:color .3s}
.pagehead .back:hover{color:var(--copper)}
.pagehead .tag{color:var(--sand)}

/* ---------- doors · home crossroads ---------- */
.doors{background:var(--linen); padding:clamp(70px,9vw,120px) 0 clamp(90px,12vw,160px)}
.doors .dgrid{display:grid; grid-template-columns:repeat(3,1fr); gap:0 clamp(28px,4vw,56px)}
.door{display:block; text-align:left; padding:clamp(26px,3.5vw,38px) 0 clamp(28px,4vw,42px); border-top:1px solid rgba(88,72,52,.22); position:relative}
.door .dnum{font-family:var(--ff-tag); font-weight:400; letter-spacing:.28em; font-size:11.5px; color:var(--taupe)}
.door h3{font-family:var(--ff-display); font-weight:400; font-size:clamp(1.5rem,2.6vw,1.95rem); line-height:1.15; margin-top:14px; color:var(--forest); transition:color .35s}
.door .dline{font-size:13.5px; color:var(--taupe); margin-top:10px; line-height:1.6}
.door .darr{display:inline-block; margin-top:18px; color:var(--copper); font-size:1.05rem; transition:transform .35s ease}
.door::after{content:""; position:absolute; top:-1px; left:0; width:0; height:1px; background:var(--copper); transition:width .5s ease}
.door:hover::after{width:44px}
.door:hover h3{color:var(--copper)}
.door:hover .darr{transform:translateX(8px)}

/* ---------- next door · quiet path onward ---------- */
.nextdoor{background:var(--ink); text-align:center; padding:clamp(64px,9vw,110px) 0}
.nextdoor .nline{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.15rem,2.4vw,1.55rem); color:var(--stone); line-height:1.6}
.nextdoor .ngo{display:inline-block; margin-top:22px; font-family:var(--ff-tag); text-transform:uppercase; letter-spacing:.28em; font-size:12.5px; color:var(--copper); transition:letter-spacing .4s ease}
.nextdoor .ngo:hover{letter-spacing:.36em}

/* ---------- closing · the name (brand book 12) ---------- */
.closing{background:var(--ink); text-align:center; padding:clamp(84px,11vw,150px) 0 clamp(56px,8vw,100px)}
.closing .cwm{margin-top:clamp(24px,3vw,36px)}
.closing .cwm .wm{font-size:clamp(46px,8vw,78px); color:var(--linen)}
.closing .cmean{font-family:var(--ff-display); font-style:italic; color:var(--sand); font-size:clamp(.95rem,1.8vw,1.1rem); margin-top:18px}
.closing .cpoem{font-family:var(--ff-display); font-style:italic; font-weight:400; font-size:clamp(1.1rem,2.3vw,1.45rem); line-height:1.8; color:var(--stone); max-width:26em; margin:clamp(30px,4vw,44px) auto 0}
.closing .cdiv{width:44px; height:1px; background:var(--copper); opacity:.7; margin:clamp(44px,6vw,64px) auto clamp(26px,4vw,38px)}
.closing .big{font-family:var(--ff-display); font-weight:400; font-size:clamp(2rem,6.5vw,4.2rem); color:var(--linen); line-height:1.15; margin-top:18px}
.closing .cecho{font-family:var(--ff-display); font-style:italic; color:var(--taupe); font-size:clamp(1rem,2vw,1.25rem); margin-top:14px}
.closing .mantra{font-family:var(--ff-tag); letter-spacing:.5em; font-size:clamp(10px,1.5vw,13px); color:var(--taupe); text-transform:uppercase; margin-top:clamp(36px,5vw,50px)}

/* ---------- footer ---------- */
footer{background:var(--ink); color:var(--stone); padding:0 0 44px}
footer .frow{display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; border-top:1px solid rgba(124,140,110,.16); padding-top:34px}
footer .wm{font-size:21px; color:var(--linen)}
footer .ftag{font-family:var(--ff-tag); letter-spacing:.3em; font-size:10.5px; text-transform:uppercase; color:var(--taupe)}
footer .fnote{font-size:12.5px; color:#6a625a; margin-top:26px; text-align:center; font-family:var(--ff-display); font-style:italic}

/* responsive */
@media (max-width:920px){
  .cards,.notes .grid{grid-template-columns:1fr; gap:40px}
  .doors .dgrid{grid-template-columns:1fr 1fr}
  .appband .inner{grid-template-columns:1fr}
  .event{grid-template-columns:1fr; gap:12px}
  .event .date{text-align:left; display:flex; gap:12px; align-items:baseline}
  .vitem{grid-template-columns:44px 1fr; gap:16px}
}
@media (max-width:600px){
  .doors .dgrid{grid-template-columns:1fr}
}
`;

// ----------------------------------------------------------------------
// SMALL PARTS
// ----------------------------------------------------------------------
const Wordmark = ({ size, color }: { size?: number; color?: string }) => (
  <span className="wm" style={{ fontSize: size, color }}>
    t<span className="a1">a<span className="bindu" /></span>nmay
  </span>
);

const Squig = ({ w = 220, variant = 0, cls = "" }: { w?: number; variant?: number; cls?: string }) => {
  const paths = [
    "M6,13 C40,5 72,18 108,11 C144,4 176,17 214,9",
    "M4,12 C22,6 40,17 58,11 C70,7 80,14 86,10",
    "M4,10 C20,16 38,5 56,12 C70,17 80,8 86,12",
    "M4,13 C24,7 36,16 52,10 C66,5 78,15 86,9",
  ];
  const vb = variant === 0 ? "0 0 220 22" : "0 0 90 22";
  return (
    <svg className={"squig " + cls} width={w} viewBox={vb} aria-hidden="true">
      <path d={paths[variant]} />
    </svg>
  );
};

/** Organická vlna mezi sekcemi — fill = barva NÁSLEDUJÍCÍ sekce. */
const Wave = ({ fill, variant = 0, abs = false }: { fill: string; variant?: number; abs?: boolean }) => {
  const paths = [
    "M0,58 C140,84 320,20 520,42 C710,63 850,92 1040,64 C1210,40 1330,58 1440,44 L1440,100 L0,100 Z",
    "M0,52 C160,20 340,88 540,60 C720,36 880,14 1060,48 C1220,78 1340,50 1440,62 L1440,100 L0,100 Z",
    "M0,60 C180,90 360,26 560,50 C740,72 900,90 1080,54 C1240,24 1350,60 1440,48 L1440,100 L0,100 Z",
    "M0,46 C170,76 350,30 540,52 C730,74 890,20 1080,44 C1250,66 1360,42 1440,54 L1440,100 L0,100 Z",
    "M0,50 C160,80 340,24 540,48 C720,70 900,88 1080,50 C1240,20 1360,56 1440,44 L1440,100 L0,100 Z",
  ];
  return (
    <div className={"wave" + (abs ? " abs" : "")} aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d={paths[variant]} fill={fill} />
      </svg>
    </div>
  );
};

const SectionTag = ({ num, cs, en, cls = "" }: { num: string; cs: string; en: string; cls?: string }) => (
  <div className={"tag tagline-u " + cls}>{num} · {L(cs, en)}</div>
);

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------
const QUOTES = [
  { cs: "Důvěřuj tělu.", en: "Trust the body.", scs: "Půda, která nelže.", sen: "The ground that does not lie." },
  { cs: "Drž svou praxi.", en: "Hold the practice.", scs: "Den za dnem. I když se nic neděje.", sen: "Day after day. Even when nothing happens." },
  { cs: "Naslouchej divočině.", en: "Listen to the wild.", scs: "Les je první zrcadlo.", sen: "The forest is the first mirror." },
];

const VALUES = [
  {
    cs: "Tělo je chrám. Ne produkt.", en: "The body is a temple. Not a product.",
    pcs: "Netrénuju tělo, aby dobře vypadalo na fotce. Starám se o něj jako o dům, ve kterém chci zestárnout.",
    pen: "I don't train the body to look good in a photo. I care for it like a house I want to grow old in.",
  },
  {
    cs: "Praktikuju víc, než učím.", en: "I practice more than I teach.",
    pcs: "Každý den, i když se nikdo nedívá. Učitel, který přestal praktikovat, nemá co předat.",
    pen: "Every day, even when no one is watching. A teacher who stopped practicing has nothing left to give.",
  },
  {
    cs: "Stín patří ke světlu.", en: "Shadow belongs with the light.",
    pcs: "Nejsem wellness. Dny, kdy to nejde, mají v praxi stejné místo jako dny, kdy to letí. Obojí je pravda těla.",
    pen: "This is not wellness. The days when nothing works have the same place in practice as the days when everything flies. Both are the body's truth.",
  },
  {
    cs: "Méně. Pomaleji. Hlouběji.", en: "Less. Slower. Deeper.",
    pcs: "Žádná optimalizace, žádný hustle. Praxe má konečné tempo — a to je vlastnost, ne chyba.",
    pen: "No optimization, no hustle. Practice has a finite pace — and that is a feature, not a flaw.",
  },
  {
    cs: "Nevěř mi.", en: "Don't trust me.",
    pcs: "Najdi to sám. Tvoje tělo nelže — jen jsi ho přestal poslouchat. Já jsem jen o pár kroků napřed na cestě, kterou jdeme všichni.",
    pen: "Find it yourself. Your body is not lying — you just stopped listening. I am only a few steps ahead on a path we all walk.",
  },
  {
    cs: "Divočina je první zrcadlo.", en: "The wild is the first mirror.",
    pcs: "Les nereaguje na to, kým se snažím být. Reaguje jen na to, co dělám. Co se naučíš tam, se začne odrážet všude jinde — doma, ve vztahu, ve městě.",
    pen: "The forest does not respond to who I am trying to be. It responds only to what I do. What you learn there begins to reflect everywhere else — at home, in relationships, in the city.",
  },
];

const QA = [
  {
    qcs: "Co je to praxe", qen: "What is the practice",
    acs: "Denní práce s tělem a myslí, držená pohromadě divočinou. Kalistenika a jóga jako brána. Meditace a psychologická práce jako propojení. Návraty na stejná místa v lese napříč ročními dobami. Tři kotvy, jedna cesta.",
    aen: "Daily work with body and mind, held together by the wild. Calisthenics and yoga as the gateway. Meditation and psychological work as the integrator. Returning to the same places in the forest across seasons. Three anchors, one path.",
  },
  {
    qcs: "Co praxe není", qen: "What the practice is not",
    acs: "Fitness. Wellness. Seberozvoj na výkon. Nebudeš tu sbírat certifikáty ani honit metriky. Žádné před a po — praxe je výsledek.",
    aen: "Fitness. Wellness. Self-development as performance. You will not collect certificates or chase metrics here. No before and after — the practice is the result.",
  },
  {
    qcs: "Jak začít", qen: "How to begin",
    acs: "Rozhovorem. Třicet minut, zdarma, bez závazku. Nebo přijď na událost — den v lese je nejpoctivější seznámení. A nebo prostě čti deník praxe a rozhodni se, až to bude zrát.",
    aen: "With a conversation. Thirty minutes, free, no strings. Or come to an event — a day in the forest is the most honest introduction. Or simply read the practice log and decide when it ripens.",
  },
];

const EVENTS = [
  {
    mcs: "Říjen", men: "Oct", y: "2026",
    tcs: "Den v lese · celodenní pohybová praxe", ten: "A day in the forest · full-day movement practice",
    metacs: "Brdy · sobota · max 8 lidí", metaen: "Brdy hills · Saturday · max 8 people",
    pcs: "Od rána do tmy venku. Pohyb mezi stromy, chůze, ticho, jídlo u ohně. Žádný výkon, žádné telefony. Jen tělo, les a pozornost.",
    pen: "Outside from morning until dark. Movement among the trees, walking, silence, food by the fire. No performance, no phones. Just the body, the forest, and attention.",
    open: true,
  },
  {
    mcs: "Únor", men: "Feb", y: "2027",
    tcs: "Zimní tichá praxe · tři dny", ten: "Winter silent practice · three days",
    metacs: "Šumava · čt–ne · max 6 lidí", metaen: "Šumava · Thu–Sun · max 6 people",
    pcs: "Tři dny mezi chalupou a zimním lesem. Ranní pohyb, sezení u kamen, dlouhé chůze sněhem. Zima učí, co žádné léto nenaučí.",
    pen: "Three days between a cottage and the winter forest. Morning movement, sitting by the stove, long walks through snow. Winter teaches what no summer can.",
    open: false,
  },
];

const POSTS = [
  {
    id: "p1",
    tagcs: "Praxe", tagen: "Practice", tagColor: "#B87333",
    datecs: "červen 2026", dateen: "June 2026",
    tcs: "Seděl jsem hodinu. Nic se nestalo.", ten: "I sat for an hour. Nothing happened.",
    excs: "Ráno. Polštář, čaj, les za oknem ještě ve tmě. Sedl jsem si s tím, že dnes to bude hluboké. Nebylo…",
    exen: "Morning. Cushion, tea, the forest outside still dark. I sat down expecting depth. There was none…",
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
    tagcs: "Tělo", tagen: "Body", tagColor: "#2E3D35",
    datecs: "květen 2026", dateen: "May 2026",
    tcs: "Co mě dnes ten pohyb stál", ten: "What the movement cost me today",
    excs: "Stoj na rukou na padlém kmeni. Mokré dřevo, studené dlaně. Dvacet pokusů, tři vteřiny rovnováhy…",
    exen: "A handstand on a fallen trunk. Wet wood, cold palms. Twenty attempts, three seconds of balance…",
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
    tagcs: "Divočina", tagen: "Wild", tagColor: "#7C8C6E",
    datecs: "duben 2026", dateen: "April 2026",
    tcs: "Les nehodnotí", ten: "The forest does not judge",
    excs: "Vracím se na stejné místo už třetí rok. Stejný kopec, stejné buky, jiné světlo…",
    exen: "I keep returning to the same place, third year now. Same hill, same beeches, different light…",
    body: {
      cs: [
        "Vracím se na stejné místo už třetí rok. Stejný kopec, stejné buky, jiné světlo.",
        "V zimě mě to místo učilo, co je nepohodlí. Na jaře, co je trpělivost. Dnes tam bylo ticho, které nehodnotí. Les nereaguje na to, kým se snažím být. Reaguje jen na to, co dělám. Proto je to první zrcadlo.",
        "Sedl jsem si k potoku a chvíli nedělal nic. Žádný obsah, žádný trénink. Jen pozornost.",
        "Cestou dolů jsem potkal srnce. Stáli jsme a dívali se na sebe, dokud to jemu nestačilo.",
        "Co se učím v lese, se pak děje i jinde. U stolu. Ve vztahu. V tramvaji.",
      ],
      en: [
        "I keep returning to the same place, third year now. Same hill, same beeches, different light.",
        "In winter the place taught me what discomfort is. In spring, what patience is. Today there was a silence that does not judge. The forest does not respond to who I am trying to be. It responds only to what I do. That is why it is the first mirror.",
        "I sat by the stream and did nothing for a while. No content, no training. Just attention.",
        "On the way down I met a roe deer. We stood looking at each other until he had had enough.",
        "What I learn in the forest starts happening elsewhere too. At the table. In a relationship. On the tram.",
      ],
    },
  },
];

const MENU = [
  { num: "01", cs: "Příběh", en: "The story", href: "#/pribeh", page: "pribeh",
    lcs: "Pád, sestup, návrat.", len: "The fall, the descent, the return." },
  { num: "02", cs: "Praxe", en: "The practice", href: "#/praxe", page: "praxe",
    lcs: "Tři kotvy, jedna cesta.", len: "Three anchors, one path." },
  { num: "03", cs: "Spolupráce", en: "Work with me", href: "#/spoluprace", page: "spoluprace",
    lcs: "Málo lidí, do hloubky.", len: "Few people, in depth." },
  { num: "04", cs: "Deník praxe", en: "Practice log", href: "#/denik", page: "denik",
    lcs: "Praxe, jaká byla.", len: "The practice as it was." },
  { num: "05", cs: "Kdy & kde", en: "When & where", href: "#/udalosti", page: "udalosti",
    lcs: "Základna Praha. Učebna les.", len: "Base: Prague. Classroom: the forest." },
  { num: "06", cs: "Kontakt", en: "Contact", href: "#/kontakt", page: "kontakt",
    lcs: "Začíná to rozhovorem.", len: "It begins with a conversation." },
];

const MAIL = "tanmay.in.flow@gmail.com";
const APP_URL = "https://klient.tanmaypractice.com";
const IG_URL = "https://www.instagram.com/tanmayflow/";

// ----------------------------------------------------------------------
// PAGES · shared parts
// ----------------------------------------------------------------------
/** Tmavý překlad nade dveřmi každé samostatné stránky. */
function PageHead({ item, waveFill = null, waveVariant = 0 }: any) {
  return (
    <div className="pagehead">
      <div className="wrap">
        <div className="row">
          <a className="back" href="#/">‹ {L("Domů", "Home")}</a>
          <div className="tag">{item.num} · {L(item.cs, item.en)}</div>
        </div>
      </div>
      {waveFill ? <Wave fill={waveFill} variant={waveVariant} /> : null}
    </div>
  );
}

/** Rozcestí na domovské stránce — šest dveří, čísla nesou pořadí menu. */
function Doors() {
  return (
    <section className="doors">
      <div className="wrap">
        <div className="dgrid">
          {MENU.map((m, i) => (
            <a key={m.num} className={"door rv" + (i % 3 ? " d" + (i % 3) : "")} href={m.href}>
              <div className="dnum">{m.num}</div>
              <h3>{L(m.cs, m.en)}</h3>
              <div className="dline">{L(m.lcs, m.len)}</div>
              <span className="darr" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
      <Wave fill="#1A1612" variant={3} />
    </section>
  );
}

/** Tichý pás na konci stránky — cesta dál. */
function NextDoor({ toHref, cs, en, gocs, goen }: any) {
  return (
    <div className="nextdoor">
      <div className="wrap">
        <div className="nline rv">{L(cs, en)}</div>
        <div className="rv d1">
          <a className="ngo" href={toHref}>{L(gocs, goen)} →</a>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SECTIONS
// ----------------------------------------------------------------------
function TopBar({ scrolled, menuOpen, onBurger, lang, onLang, page }: any) {
  return (
    <div className={"topbar" + (scrolled ? " scrolled" : "") + (menuOpen ? " menu-open" : "")}>
      <div className="wrap">
        <a href="#/" className="logo"><Wordmark /></a>
        <nav className="topnav" aria-label="main">
          {MENU.map((m) => (
            <a key={m.num} className={page === m.page ? "act" : ""} href={m.href}>{L(m.cs, m.en)}</a>
          ))}
        </nav>
        <div className="right">
          <span className="lang">
            <span className={lang === "cs" ? "act" : ""} onClick={() => onLang("cs")}>CZ</span>
            {" · "}
            <span className={lang === "en" ? "act" : ""} onClick={() => onLang("en")}>EN</span>
          </span>
          <a className="btn" href={APP_URL} target="_blank" rel="noopener noreferrer">{L("Vstup", "Sign in")}</a>
          <button className="burger" onClick={onBurger} aria-label="menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu({ open, onClose }: any) {
  return (
    <div className={"mmenu" + (open ? " open" : "")}>
      {MENU.map((m) => (
        <a key={m.num} className="mlink" href={m.href} onClick={onClose}>
          <span className="mnum">{m.num}</span>
          <span>{L(m.cs, m.en)}</span>
        </a>
      ))}
      <a className="mlink vstup" href={APP_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        <span className="mnum">→</span>
        <span>{L("Vstup do aplikace", "Sign in")}</span>
      </a>
      <div className="msoc">
        <a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href={"mailto:" + MAIL}>E-mail</a>
      </div>
      <div className="mtl">body · soul · wild nature</div>
    </div>
  );
}

function Hero() {
  const [qi, setQi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQi((i) => (i + 1) % QUOTES.length), 5200);
    return () => clearInterval(t);
  }, []);
  return (
    <header className="hero" id="top">
      <div className="blob" /><div className="blob2" />
      <div className="inner wrap">
        <div className="kicker rv">body · soul · wild nature</div>
        <div className="hq-stage rv d1">
          {QUOTES.map((q, i) => (
            <div key={i} className={"hq" + (i === qi ? " act" : "")}>
              <div className="q">{L(q.cs, q.en)}</div>
              <div className="s">{L(q.scs, q.sen)}</div>
            </div>
          ))}
        </div>
        <div className="hq-dots rv d2">
          {QUOTES.map((_, i) => (
            <span key={i} className={i === qi ? "act" : ""} onClick={() => setQi(i)} />
          ))}
        </div>
        <div className="sub rv d2">
          {L("Učím to, co žiju. Pohyb, meditace, divoká příroda. Praha.",
             "I teach what I live. Movement, meditation, wild nature. Prague.")}
        </div>
        <div className="cta rv d3">
          <a className="btn solid" href="#/spoluprace">{L("Spolupráce", "Work with me")}</a>
          <a className="btn" href="#/pribeh">{L("Můj příběh", "My story")}</a>
        </div>
      </div>
      <div className="scrolldn">
        {L("Dolů", "Scroll")}
        <div className="line" />
      </div>
      <Wave fill="#F4F0EB" variant={0} />
    </header>
  );
}

function Letter() {
  return (
    <section className="letter sec-pad" id="tanmay">
      <div className="wrap">
        <div className="head rv">
          <SectionTag num="01" cs="Tanmay" en="Tanmay" />
          <h2 className="h-display h-lg" style={{ marginTop: 24 }}>
            {L("Málem jsem zemřel. Vrátil jsem se.", "I almost died. I came back.")}<br />
            <span className="it copper">{L("Něco zůstalo.", "Something stayed.")}</span>
          </h2>
        </div>

        <div className="prose">
          <p className="rv">
            {L(
              "Jmenuji se Tanmay. To jméno jsem nedostal — vybral jsem si ho, když starý život skončil a začal jiný.",
              "My name is Tanmay. I was not given the name — I chose it when an old life ended and another began."
            )}
          </p>
          <p className="rv">
            {L(
              "Měl jsem všechno. Tělo, mysl, disciplínu, lásku, naplňující práci. Téměř smrtelná nehoda to vzala v jediném okamžiku. Kóma. Chybějící půlka lebky. Lékaři řekli, že už se nikdy nebudu hýbat.",
              "I had everything. Body, mind, discipline, love, fulfilling work. A near-fatal accident took all of it in one moment. A coma. Half a skull missing. The doctors said I would not move again."
            )}
          </p>
        </div>

        <div className="interrupt rv">
          <div className="iq">
            {L("Všechno, co si myslíš, že jsi,", "Everything you think you are")}<br />
            <span className="hl">{L("může zmizet v jediné vteřině.", "can be taken in a single second.")}</span>
          </div>
        </div>

        <div className="prose">
          <p className="rv">
            {L(
              "Následovaly dva roky stavění od nuly. Tělo, které nefungovalo. Pokřivená mysl. Rozpuštěná identita. Naučil jsem se, co většina nikdy nemusí: že všechno, čím si člověk myslí, že je, může být vzato v jediné vteřině. Ale za tím leží velká jistota.",
              "What followed were two years of rebuilding from nothing. A body that did not work. A mind distorted. Identity dissolved. I learned what most never have to: that everything a person thinks they are can be taken in a second. But beyond it lies a great certainty."
            )}
          </p>
          <p className="rv">
            {L(
              "Otázka už nezní, co od tohoto života chci. Ale co tento život žádá ode mě. Dnes stojím na rukou v lesích. Praktikuji denně — kalisteniku a jógu, meditaci, návraty do divočiny. To, co učím, je starší než já: jsem student tradice, ne její autor.",
              "The question is no longer what I want from this life. It is what this life is asking of me. Today I stand on my hands in forests. I practice daily — calisthenics and yoga, meditation, returns to the wild. What I teach is older than me: I am a student of a tradition, not its author."
            )}
          </p>
        </div>

        <div className="interrupt rv" style={{ background: "var(--forest)" }}>
          <div className="iq">
            {L("Tělo, které nefungovalo,", "The body that would not work")}<br />
            <span className="hl">{L("je dnes můj největší učitel.", "is my most authoritative teacher.")}</span>
          </div>
        </div>

        <div className="prose">
          <p className="rv">
            {L(
              "A proč učím? Potkávám lidi, kteří to myslí vážně. Dělají všechno správně — a přesto cítí, že něco podstatného chybí. To, co jim chybí, se nedá přečíst. Dá se to jen praktikovat.",
              "And why do I teach? I keep meeting committed, intelligent people doing everything right — who still feel something essential is missing. The thing they are missing cannot be read. It can only be practiced."
            )}
          </p>
          <div className="rv" style={{ textAlign: "center" }}>
            <span className="sig">Tanmay</span>
            <div className="sigline">{L("Nepíšu z vrcholu. Píšu z cesty.", "I do not write from the summit. I write from the path.")}</div>
          </div>
        </div>
      </div>
      <Wave fill="#1A1612" variant={1} abs />
      <div className="wave-spacer" />
    </section>
  );
}

function Praxe() {
  return (
    <section className="praxe sec-pad" id="praxe">
      <div className="wrap">
        <div className="rv" style={{ textAlign: "center" }}>
          <SectionTag num="02" cs="Praxe" en="The practice" cls="sand" />
        </div>
        <div className="bigline rv" style={{ marginTop: 34 }}>
          {L("Přítomnost není pocit.", "Presence is not a feeling.")}<br />
          <span className="it">{L("Vzniká, když tělo, praxe a divočina drží pohromadě.", "It arises when body, practice and the wild are held together.")}</span>
        </div>

        <div className="qa">
          {QA.map((item, i) => (
            <div key={i}>
              {i > 0 && (
                <svg className="qsep" width="100%" viewBox="0 0 800 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4,11 C120,4 260,17 400,10 C540,3 680,16 796,9" />
                </svg>
              )}
              <div className="qaitem rv">
                <div className="q">{L(item.qcs, item.qen)}<span className="qm">?</span></div>
                <div className="a">{L(item.acs, item.aen)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="anchorline rv">
          {L(
            "Tělo uzemňuje. Praxe propojuje. Divočina zrcadlí — a učí člověka nechat se zrcadlit všude jinde.",
            "Body grounds. Practice integrates. The wild reflects — and teaches a person to be reflected everywhere else."
          )}
        </div>
      </div>
      <Wave fill="#F4F0EB" variant={2} abs />
      <div className="wave-spacer" />
    </section>
  );
}

function Values() {
  return (
    <section className="values" style={{ paddingBottom: "clamp(84px,11vw,150px)" }}>
      <div className="wrap">
        <div className="rv" style={{ textAlign: "center" }}>
          <div className="tag sage">{L("Čemu věřím", "What I believe")}</div>
          <h2 className="h-display h-lg" style={{ marginTop: 20 }}>
            {L("Praxi dělá to,", "A practice is made")}<br />
            <span className="it sagec">{L("co odmítne.", "by what it refuses.")}</span>
          </h2>
        </div>
        <div className="vlist">
          {VALUES.map((v, i) => (
            <div key={i}>
              {i > 0 && (
                <svg className="vsep" width="100%" viewBox="0 0 820 22" preserveAspectRatio="none" aria-hidden="true">
                  <path d={i % 2 ? "M4,12 C140,5 300,18 410,11 C520,4 690,16 816,9" : "M4,10 C130,17 290,4 410,12 C530,19 700,6 816,13"} />
                </svg>
              )}
              <div className="vitem rv">
                <div className="vnum">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{L(v.cs, v.en)}</h3>
                  <p>{L(v.pcs, v.pen)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section className="offer" id="spoluprace" style={{ paddingBottom: "clamp(84px,11vw,150px)" }}>
      <div className="wrap">
        <div className="rv" style={{ maxWidth: 620 }}>
          <SectionTag num="03" cs="Spolupráce" en="Work with me" />
          <h2 className="h-display h-lg" style={{ marginTop: 22 }}>
            {L("Pracuji s málo lidmi.", "I work with few people.")}<br />
            <span className="it sagec">{L("Do hloubky.", "In depth.")}</span>
          </h2>
          <p className="body-txt" style={{ marginTop: 22 }}>
            {L(
              "Beru 8–15 klientů ročně. Ne proto, že bych nemohl víc — ale protože praxe, kterou vedu, potřebuje čas, pozornost a vztah. Méně, pomaleji, hlouběji.",
              "I take 8–15 clients a year. Not because I couldn't take more — but because the practice I guide needs time, attention and relationship. Less, slower, deeper."
            )}
          </p>
        </div>

        <div className="cards">
          <div className="card rv">
            <div className="tag">{L("Osobně · Praha", "In person · Prague")}</div>
            <h3>{L("Osobní praxe 1:1", "Personal practice 1:1")}</h3>
            <div className="where">{L("tělocvična · park · les", "gym · park · forest")}</div>
            <p>
              {L(
                "Pohyb, síla, pružnost, pozornost. Praxe stavěná na tvém těle a tvém životě, ne na šabloně. Venku, kdykoli to jde. Součástí je tvůj vlastní prostor v mé aplikaci — plán, progress, deník.",
                "Movement, strength, flexibility, attention. A practice built on your body and your life, not on a template. Outside whenever possible. Includes your own space in my app — plan, progress, journal."
              )}
            </p>
            <div className="price">
              {L("od 1 800 Kč / setkání", "from 1 800 CZK / session")}
              <small>{L("bloky po 12 týdnech · týdenní rytmus", "12-week blocks · weekly rhythm")}</small>
            </div>
          </div>

          <div className="card rv d1">
            <div className="tag">{L("Na dálku · Online", "Remote · Online")}</div>
            <h3>{L("Vedení na dálku", "Remote guidance")}</h3>
            <div className="where">{L("odkudkoli", "from anywhere")}</div>
            <p>
              {L(
                "Tréninkový plán, který žije. Videa tvé praxe, moje zpětná vazba, měsíční kalibrace na videohovoru. Všechno na jednom místě — ve tvé verzi aplikace.",
                "A training plan that lives. Videos of your practice, my feedback, monthly calibration on a call. Everything in one place — in your version of the app."
              )}
            </p>
            <div className="price">
              {L("od 4 500 Kč / měsíc", "from 4 500 CZK / month")}
              <small>{L("minimálně 3 měsíce", "3 months minimum")}</small>
            </div>
          </div>

          <div className="card rv d2">
            <div className="tag">{L("Skupinově · Venku", "In groups · Outside")}</div>
            <h3>{L("Praxe v divočině", "Practice in the wild")}</h3>
            <div className="where">{L("les · hory · oheň", "forest · mountains · fire")}</div>
            <p>
              {L(
                "Jednodenní i vícedenní návraty do lesa. Pohyb, chůze, ticho, oheň. Malé skupiny, žádný program na minutu přesně. Divočina vede, já držím prostor.",
                "One-day and multi-day returns to the forest. Movement, walking, silence, fire. Small groups, no minute-by-minute program. The wild leads, I hold the space."
              )}
            </p>
            <div className="price">
              {L("dle události", "per event")}
              <small>{L("viz Kdy & kde", "see When & where")}</small>
            </div>
          </div>
        </div>

        <div className="transparent rv">
          {L("Ceny jsou veřejné. Žádné „napiš mi pro detaily“.", "Prices are public. No “DM me for details”.")}
        </div>
        <div className="cta-row rv">
          <a className="btn solid" href={"mailto:" + MAIL + "?subject=" + L("Spoluprace", "Working together")}>
            {L("Napiš mi", "Write to me")}
          </a>
          <div className="cta-note">
            {L("Začínáme rozhovorem — 30 minut, zdarma, bez závazku.", "We start with a conversation — 30 minutes, free, no strings.")}
          </div>
        </div>
      </div>
    </section>
  );
}

function AppBand() {
  return (
    <section className="appband sec-pad">
      <div className="wrap inner">
        <div className="rv">
          <div className="tag sand">{L("Pro klienty", "For clients")}</div>
          <h2 style={{ marginTop: 18 }}>
            {L("Tvá praxe má", "Your practice has")}<br />
            {L("svůj vlastní prostor.", "a space of its own.")}
          </h2>
          <p>
            {L(
              "Každý klient dostává přístup do vlastní verze mé aplikace: tréninkový plán, progress, deník praxe, poznámky z našich setkání. Já pracuji ve stejném prostoru — vidíme totéž.",
              "Every client gets access to their own version of my app: training plan, progress, practice journal, notes from our sessions. I work in the same space — we see the same thing."
            )}
          </p>
          <div style={{ marginTop: 30 }}>
            <a className="btn" href={APP_URL} target="_blank" rel="noopener noreferrer">
              {L("Vstup pro klienty", "Client sign-in")}
            </a>
          </div>
          <div className="note">
            {L("Přístup dostaneš ode mě na začátku spolupráce.", "You receive access from me when we begin working together.")}
          </div>
        </div>
        <div className="mock rv d1">
          <div className="mtitle">klient.tanmaypractice.com</div>
          <div className="mrow"><span className="dot" /><span className="mt">{L("Tréninkový plán · týden 7 / 12", "Training plan · week 7 / 12")}</span></div>
          <div className="mrow"><span className="dot s" /><span className="mt">{L("Progress · stoj na rukou 22 s", "Progress · handstand 22 s")}</span></div>
          <div className="mrow"><span className="dot n" /><span className="mt">{L("Deník praxe · 4 zápisy tento týden", "Practice log · 4 entries this week")}</span></div>
          <div className="mrow"><span className="dot" /><span className="mt">{L("Poznámky ze setkání · středa", "Session notes · Wednesday")}</span></div>
        </div>
      </div>
    </section>
  );
}

function Kruh() {
  return (
    <section className="kruh sec-pad" id="kruh">
      <div className="wrap">
        <div className="rv" style={{ textAlign: "center" }}>
          <SectionTag num="04" cs="Kruh" en="The circle" />
          <h2 className="h-display h-lg" style={{ marginTop: 22 }}>
            {L("Kdo se tu schází", "Who gathers here")}
          </h2>
        </div>
        <div className="who rv">
          <p>
            {L(
              "Lidé, kteří to myslí vážně a mají za sebou roky práce na sobě. Trénují, čtou, meditují, byli v terapii. A přesto cítí, že něco podstatného chybí.",
              "Committed people with years of inner work behind them. They train, read, meditate, have been to therapy. And still they feel something essential is missing."
            )}
          </p>
          <p>
            {L(
              "Nehledají gurua. Hledají parťáka, který je o pár kroků napřed a žije to, co učí. Pokud se v tom poznáváš, jsi tu správně.",
              "They are not looking for a guru. They are looking for a peer a few steps ahead who lives what he teaches. If you recognize yourself in this, you are in the right place."
            )}
          </p>
        </div>
        <div className="promise rv">
          <div className="tag sand ptag">{L("Nepsaná smlouva", "The unspoken contract")}</div>
          <div className="ptxt">
            {L(
              "Nebudu ti lhát. Nebudu předstírat, že to mám vyřešené. Budu sdílet to, čím jsem skutečně prošel, a budu respektovat tvou inteligenci natolik, že se sám rozhodneš, co s tím uděláš.",
              "I will not lie to you. I will not pretend I have it figured out. I will share what I have actually walked through, and I will respect your intelligence enough to let you decide what to do with it."
            )}
          </div>
        </div>
        <div className="knote rv">
          {L("Kruh je malý záměrně. Slova klientů sem přibudou, až budou jejich — ne moje.",
             "The circle is small on purpose. Clients' words will appear here when they are theirs — not mine.")}
        </div>
      </div>
      <Wave fill="#1A1612" variant={3} abs />
      <div className="wave-spacer" />
    </section>
  );
}

function KdyKde() {
  return (
    <section className="kdykde" id="kdy" style={{ paddingBottom: "clamp(84px,11vw,150px)" }}>
      <div className="wrap">
        <div className="rv" style={{ textAlign: "center" }}>
          <SectionTag num="05" cs="Kdy & kde" en="When & where" />
          <h2 className="h-display h-lg" style={{ marginTop: 22 }}>
            {L("Kdy jdeme", "When we go")} <span className="it sagec">{L("ven.", "outside.")}</span>
          </h2>
        </div>

        <div style={{ marginTop: "clamp(40px,5vw,60px)" }}>
          {EVENTS.map((ev, i) => (
            <div key={i}>
              {i > 0 && (
                <svg className="squig ev-sep" width="100%" viewBox="0 0 800 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4,11 C120,4 260,17 400,10 C540,3 680,16 796,9" />
                </svg>
              )}
              <div className="event rv">
                <div className="date">
                  <div className="dm">{L(ev.mcs, ev.men)}</div>
                  <div className="dy">{ev.y}</div>
                </div>
                <div>
                  <h3>{L(ev.tcs, ev.ten)}</h3>
                  <div className="meta">{L(ev.metacs, ev.metaen)}</div>
                  <p>{L(ev.pcs, ev.pen)}</p>
                </div>
                <div className={"status " + (ev.open ? "open" : "soon")}>
                  {ev.open ? L("Otevřeno", "Open") : L("Připravuje se", "In preparation")}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="kde rv">
          <div className="tag sage">{L("Kde", "Where")}</div>
          <svg className="mapline" viewBox="0 0 760 150" aria-hidden="true">
            <path d="M10,108 C80,96 130,116 200,102 C270,88 320,60 380,74 C440,88 500,118 570,104 C640,90 700,110 750,98"
              fill="none" stroke="#8C7B6E" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="210" cy="100" r="5" fill="#B87333" />
            <text x="210" y="80" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontSize="13" letterSpacing="3" fill="#3b362f">PRAHA</text>
            <circle cx="380" cy="76" r="4" fill="#7C8C6E" />
            <text x="380" y="56" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontSize="12" letterSpacing="3" fill="#8C7B6E">BRDY</text>
            <circle cx="570" cy="106" r="4" fill="#7C8C6E" />
            <text x="570" y="134" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontSize="12" letterSpacing="3" fill="#8C7B6E">ŠUMAVA</text>
          </svg>
          <div className="kdetxt">
            {L("Základna: Praha. Učebna: les.", "The base: Prague. The classroom: the forest.")}
          </div>
        </div>

        <div className="foot rv">
          {L("Chceš vědět o další události dřív než ostatní? ", "Want to hear about the next event first? ")}
          <a href={"mailto:" + MAIL + "?subject=" + L("Udalosti", "Events")}>{L("Napiš mi", "Write to me")}</a>.
        </div>
      </div>
      <Wave fill="#1A1612" variant={4} abs />
      <div className="wave-spacer" />
    </section>
  );
}

function Notes({ onOpen }: any) {
  return (
    <section className="notes" id="zapisky" style={{ paddingBottom: "clamp(84px,11vw,150px)" }}>
      <div className="wrap">
        <div className="rv" style={{ textAlign: "center" }}>
          <SectionTag num="06" cs="Deník praxe" en="Practice log" />
          <h2 className="h-display h-lg" style={{ marginTop: 22 }}>
            {L("Píšu o tom,", "I write about")} <span className="it copper">{L("co žiju.", "what I live.")}</span>
          </h2>
          <p className="lead" style={{ maxWidth: "32em", margin: "20px auto 0" }}>
            {L(
              "Bez pointy na konci. Bez lekce. Praxe, jaká byla — včetně dní, kdy nefungovala.",
              "No point at the end. No lesson. The practice as it was — including the days it did not work."
            )}
          </p>
        </div>

        <div className="grid">
          {POSTS.map((p, i) => (
            <button key={p.id} className={"post-card rv" + (i ? " d" + i : "")} onClick={() => onOpen(p)}>
              <div className="pmeta">
                <span className="tag" style={{ fontSize: 10.5, color: p.tagColor }}>{L(p.tagcs, p.tagen)}</span>
                <span className="pdate">{L(p.datecs, p.dateen)}</span>
              </div>
              <h3>{L(p.tcs, p.ten)}</h3>
              <p>{L(p.excs, p.exen)}</p>
              <div className="more">{L("Číst dál →", "Read more →")}</div>
            </button>
          ))}
        </div>

        <div className="subnote rv">
          {L("Nový zápis jednou za dva až tři týdny. Rytmus, ne kalendář.",
             "A new note every two to three weeks. A rhythm, not a calendar.")}
        </div>
      </div>
      <Wave fill="#1A1612" variant={1} abs />
      <div className="wave-spacer" />
    </section>
  );
}

function Reader({ post, onClose }: any) {
  useEffect(() => {
    document.body.style.overflow = post ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [post]);
  return (
    <div className={"reader" + (post ? " open" : "")}>
      <button className="close" onClick={onClose} aria-label="close">×</button>
      {post && (
        <div className="rwrap">
          <span className="rtag" style={{ color: post.tagColor }}>{L(post.tagcs, post.tagen)}</span>
          {" · "}
          <span className="rdate">{L(post.datecs, post.dateen)}</span>
          <h2>{L(post.tcs, post.ten)}</h2>
          <div className="rbody">
            {(LANG === "cs" ? post.body.cs : post.body.en).map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <span className="sig">Tanmay</span>
        </div>
      )}
    </div>
  );
}

function Poetry() {
  return (
    <section className="poetry sec-pad" id="poezie">
      <div className="wrap">
        <div className="rv">
          <SectionTag num="07" cs="Poezie" en="Poetry" cls="stone" />
        </div>
        <div className="poem rv">
          {LANG === "cs" ? (
            <>
              Umřel jsem dřív, než jsem stihl žít.<br />
              Vrátil jsem se s prázdnýma rukama.<br /><br />
              <span className="dim">Teď nosím vodu, štípu dřevo,<br />
              stojím na rukou, když les mlčí.</span><br /><br />
              Tělo si pamatuje, co hlava zapomněla:<br />
              že být tady<br />
              je celá ta práce.
            </>
          ) : (
            <>
              I died before I had lived.<br />
              I came back with empty hands.<br /><br />
              <span className="dim">Now I carry water, split wood,<br />
              stand on my hands while the forest is silent.</span><br /><br />
              The body remembers what the mind forgot:<br />
              that being here<br />
              is the whole work.
            </>
          )}
        </div>
        <div className="ptitle rv">
          {L("— Něco zůstalo · z notesu", "— Something stayed · from the notebook")}
        </div>
        <div className="rv" style={{ textAlign: "center" }}>
          <Squig w={180} variant={0} cls="center" />
        </div>
      </div>
    </section>
  );
}

function Contact({ standalone = false }: any) {
  return (
    <section className="contact sec-pad" id="kontakt" style={standalone ? { clipPath: "none" } : undefined}>
      <div className="wrap">
        <div className="rv">
          <SectionTag num="08" cs="Kontakt" en="Contact" />
          <h2 style={{ marginTop: 26 }}>
            {L("Začíná to", "It begins with")} <span className="it" style={{ color: "var(--sand)" }}>{L("rozhovorem.", "a conversation.")}</span>
          </h2>
          <div className="sub">
            {L(
              "Napiš mi, co hledáš. Odpovídám osobně, obvykle do pár dní.",
              "Write to me about what you are looking for. I answer personally, usually within a few days."
            )}
          </div>
          <div>
            <a className="mail" href={"mailto:" + MAIL}>{MAIL}</a>
          </div>
          <div className="socials">
            <a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagram · @tanmayflow</a>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer">{L("Vstup pro klienty", "Client sign-in")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <div className="closing">
      <div className="wrap">
        <div className="tag sand rv">{L("Jméno", "The name")}</div>
        <div className="cwm rv d1"><Wordmark /></div>
        <div className="cmean rv d1">
          {L("sanskrt tan-maya · „stvořen z toho“", "Sanskrit tan-maya · “made of that”")}
        </div>
        <div className="cpoem rv d2">
          {L(
            "Stav úplného pohroužení. Když se rozpustí hranice mezi tím, kdo praktikuje, a praxí samotnou.",
            "The state of complete absorption — when the boundary between the one who practices and the practice dissolves."
          )}
        </div>
        <div className="cdiv rv" />
        <div className="tag rv">{L("Není to jméno · je to postoj", "Not a name · a stance")}</div>
        <div className="big rv d1">{L("Staň se tím, co praktikuješ.", "Become what you practice.")}</div>
        <div className="cecho rv d2">{L("Become what you practice.", "Staň se tím, co praktikuješ.")}</div>
        <div className="mantra rv d2">move · practice · listen</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="frow">
          <Wordmark />
          <span className="ftag">body · soul · wild nature</span>
          <span className="ftag">© {new Date().getFullYear()} tanmay · {L("Praha", "Prague")}</span>
        </div>
        <div className="fnote">
          {L("Žádné cookies. Žádná analytika. Jen text, tělo a les.",
             "No cookies. No analytics. Just text, body and forest.")}
        </div>
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const onHash = () => {
      setPage(parseRoute());
      setMenuOpen(false);
      setPost(null);
      window.scrollTo({ top: 0, behavior: "instant" as any });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setLang = (l: string) => {
    setLangState(l);
    try { window.localStorage.setItem("tm-lang", l); } catch (e) {}
  };

  useEffect(() => {
    document.title = "tanmay · body · soul · wild nature";
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setPost(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".rv:not(.on)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <TopBar
        scrolled={scrolled}
        menuOpen={menuOpen}
        onBurger={() => setMenuOpen((o) => !o)}
        lang={lang}
        onLang={setLang}
        page={page}
      />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="page" key={page}>
        {page === "home" && (<>
          <Hero />
          <Doors />
          <Closing />
        </>)}
        {page === "pribeh" && (<>
          <PageHead item={MENU[0]} waveFill="#F4F0EB" waveVariant={0} />
          <Letter />
          <Poetry />
          <NextDoor toHref="#/praxe"
            cs="Příběh je pozadí. Práce je praxe."
            en="The story is the background. The work is the practice."
            gocs="Dál · Praxe" goen="Next · The practice" />
        </>)}
        {page === "praxe" && (<>
          <PageHead item={MENU[1]} />
          <Praxe />
          <Values />
          <Wave fill="#1A1612" variant={2} />
          <NextDoor toHref="#/spoluprace"
            cs="Chceš praktikovat se mnou?"
            en="Want to practice with me?"
            gocs="Dál · Spolupráce" goen="Next · Work with me" />
        </>)}
        {page === "spoluprace" && (<>
          <PageHead item={MENU[2]} waveFill="#F4F0EB" waveVariant={4} />
          <Offer />
          <AppBand />
          <Kruh />
          <NextDoor toHref="#/denik"
            cs="Ještě nevíš? Čti deník praxe."
            en="Not sure yet? Read the practice log."
            gocs="Dál · Deník praxe" goen="Next · Practice log" />
        </>)}
        {page === "denik" && (<>
          <PageHead item={MENU[3]} waveFill="#F5F2EE" waveVariant={1} />
          <Notes onOpen={setPost} />
          <NextDoor toHref="#/udalosti"
            cs="Nejpoctivější seznámení je den v lese."
            en="The most honest introduction is a day in the forest."
            gocs="Dál · Kdy & kde" goen="Next · When & where" />
        </>)}
        {page === "udalosti" && (<>
          <PageHead item={MENU[4]} waveFill="#F4F0EB" waveVariant={2} />
          <KdyKde />
          <NextDoor toHref="#/kontakt"
            cs="Začíná to rozhovorem."
            en="It begins with a conversation."
            gocs="Dál · Kontakt" goen="Next · Contact" />
        </>)}
        {page === "kontakt" && (<>
          <PageHead item={MENU[5]} />
          <Contact standalone />
        </>)}
      </main>
      <Footer />
      <Reader post={post} onClose={() => setPost(null)} />
    </>
  );
}
