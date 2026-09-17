/**
 * site.js · the public surface contract
 * ----------------------------------------------------------------------
 * One table that both the running app and the build read.
 *
 *   src/App.tsx          renders from it
 *   scripts/postbuild.mjs pre-renders one real HTML file per route from it,
 *                         and writes sitemap.xml and robots.txt from it
 *   tests/               asserts against it
 *
 * Plain JavaScript on purpose: Node runs it directly during the build,
 * so there is no second copy of the route map to drift.
 *
 * Language model: Czech lives at the root, English under /en/.
 * The path decides the language. A shared link always restores the
 * language it was shared in.
 */

export const ORIGIN = "https://tanmaypractice.com";

/** Client application. Never link publicly to app.tanmaypractice.com. */
export const CLIENT_APP_URL = "https://klient.tanmaypractice.com";

export const MAIL = "tanmay.in.flow@gmail.com";
export const IG_URL = "https://www.instagram.com/tanmayflow/";
/** Public WhatsApp contact, approved by Tanmay on 2026-08-24. */
export const WHATSAPP_URL = "https://wa.me/420774121475";

export const LANGS = ["cs", "en"];

/**
 * Journal entries. Titles, dates and excerpts are real authored text.
 * Nothing here is generated. Three real notes are three real notes.
 */
export const POSTS = [
  {
    id: "p1",
    date: "2026-06",
    slug: { cs: "sedel-jsem-hodinu-nic-se-nestalo", en: "i-sat-for-an-hour-nothing-happened" },
    title: { cs: "Seděl jsem hodinu. Nic se nestalo.", en: "I sat for an hour. Nothing happened." },
    tag: { cs: "Praxe", en: "Practice" },
    when: { cs: "červen 2026", en: "June 2026" },
    excerpt: {
      cs: "Ráno. Polštář, čaj, les za oknem ještě ve tmě. Sedl jsem si s tím, že dnes to bude hluboké. Nebylo.",
      en: "Morning. Cushion, tea, the forest outside still dark. I sat down expecting depth. There was none.",
    },
  },
  {
    id: "p2",
    date: "2026-05",
    slug: { cs: "co-me-dnes-ten-pohyb-stal", en: "what-the-movement-cost-me-today" },
    title: { cs: "Co mě dnes ten pohyb stál", en: "What the movement cost me today" },
    tag: { cs: "Tělo", en: "Body" },
    when: { cs: "květen 2026", en: "May 2026" },
    excerpt: {
      cs: "Stoj na rukou na padlém kmeni. Mokré dřevo, studené dlaně. Dvacet pokusů, tři vteřiny rovnováhy.",
      en: "A handstand on a fallen trunk. Wet wood, cold palms. Twenty attempts, three seconds of balance.",
    },
  },
  {
    id: "p3",
    date: "2026-04",
    slug: { cs: "les-nehodnoti", en: "the-forest-does-not-judge" },
    title: { cs: "Les nehodnotí", en: "The forest does not judge" },
    tag: { cs: "Divoká příroda", en: "Wild nature" },
    when: { cs: "duben 2026", en: "April 2026" },
    excerpt: {
      cs: "Vracím se na stejné místo už třetí rok. Stejný kopec, stejné buky, jiné světlo.",
      en: "I keep returning to the same place, third year now. Same hill, same beeches, different light.",
    },
  },
];

/**
 * Public routes. `nav` marks the deliberately short primary header navigation.
 * Titles and descriptions are written from the visible content of each
 * route, never from keywords.
 */
export const ROUTES = [
  {
    id: "home",
    nav: false,
    path: { cs: "/", en: "/en/" },
    label: { cs: "Domů", en: "Home" },
    title: {
      cs: "Osobní trenér v Praze | Kryštof Švec · Tanmay Practice",
      en: "tanmay · movement and practice coaching · Prague",
    },
    description: {
      cs: "Osobní trénink v Praze pro sílu, pohybovou jistotu a praxi, která drží. Individuálně, v menší skupině nebo online. Jednorázově i dlouhodobě.",
      en: "I help people rebuild a reliable relationship with the body and build a practice that holds in ordinary life. Personal work in Prague. Movement, meditation and direct contact with wild nature.",
    },
  },
  {
    id: "praxe",
    nav: true,
    num: "01",
    path: { cs: "/praxe", en: "/en/practice" },
    label: { cs: "Praxe", en: "The practice" },
    title: {
      cs: "Praxe | tanmay practice",
      en: "Practice | tanmay practice",
    },
    description: {
      cs: "Praxe, ke které se dá vracet. Tělo, praxe a divoká příroda, společná práce, reflexe a význam jména tanmay.",
      en: "A practice you can return to. Body, practice and wild nature, working together, reflection and the meaning of the name tanmay.",
    },
  },
  {
    id: "pribeh",
    nav: true,
    num: "02",
    path: { cs: "/pribeh", en: "/en/story" },
    label: { cs: "O mně", en: "The story" },
    title: { cs: "O mně | Kryštof Švec · tanmay practice", en: "About me | Kryštof Švec · tanmay practice" },
    description: {
      cs: "Kryštof Švec, osobní trenér v Praze. Deset let vlastní pohybové praxe, zkušenost s 150+ klienty a odborné zázemí v tréninku, józe a psychologii.",
      en: "Kryštof Švec, personal trainer in Prague. Ten years of personal movement practice, experience with 150+ clients, and professional grounding in training, yoga and psychology.",
    },
  },
  {
    id: "spoluprace",
    nav: true,
    num: "03",
    path: { cs: "/spoluprace", en: "/en/work-with-me" },
    label: { cs: "Spolupráce", en: "Work with me" },
    title: {
      cs: "Spolupráce | Trénink v Praze a online · tanmay practice",
      en: "Work with me | Training in Prague and online · tanmay practice",
    },
    description: {
      cs: "Jednorázový trénink nebo delší vedení individuálně, v menší skupině či online. Síla, dovednost, volnost v pohybu a praxe, která se dá držet.",
      en: "A single session or longer-term guidance one-to-one, in a small group or online. Strength, skill, freedom in movement and a practice you can sustain.",
    },
  },
  {
    id: "denik",
    public: false,
    nav: false,
    num: "04",
    path: { cs: "/denik", en: "/en/journal" },
    label: { cs: "Deník praxe", en: "Practice log" },
    /* Kratší popisek do navigace. Název místnosti zůstává celý. */
    navLabel: { cs: "Deník", en: "Practice log" },
    title: { cs: "Deník praxe · tanmay", en: "Practice log · tanmay" },
    description: {
      cs: "Praxe, jaká byla, včetně dní, kdy nefungovala. Zápisy o pohybu, sezení a návratech na stejná místa.",
      en: "The practice as it was, including the days it did not work. Notes on movement, sitting and returning to the same places.",
    },
  },
  {
    id: "soukromi",
    nav: false,
    path: { cs: "/soukromi", en: "/en/privacy" },
    label: { cs: "Soukromí", en: "Privacy" },
    title: { cs: "Soukromí | tanmay practice", en: "Privacy | tanmay practice" },
    description: {
      cs: "Jak tanmay practice nakládá s údaji při návštěvě webu, osobním kontaktu a přechodu do klientské aplikace.",
      en: "How tanmay practice handles data when you visit the site, make personal contact or move into the client application.",
    },
  },
];

/** Journal index route, used to build the article paths. */
const DENIK = ROUTES.find((r) => r.id === "denik");

/** One entry per article, in both editions. */
export const POST_ROUTES = DENIK.public === false ? [] : POSTS.flatMap((p) =>
  LANGS.map((lang) => ({
    id: "post:" + p.id,
    postId: p.id,
    lang,
    path: DENIK.path[lang] + "/" + p.slug[lang],
    title: p.title[lang] + " · " + (lang === "cs" ? "Deník praxe" : "Practice log") + " · tanmay",
    description: p.excerpt[lang],
    ogSlug: "post-" + p.id,
  }))
);

/** Every real URL the site answers on, for the sitemap and the tests. */
export function allPages() {
  const out = [];
  for (const r of ROUTES) {
    if (r.public === false) continue;
    for (const lang of LANGS) {
      out.push({
        routeId: r.id,
        lang,
        path: r.path[lang],
        title: r.title[lang],
        description: r.description[lang],
        alternates: Object.fromEntries(LANGS.map((l) => [l, r.path[l]])),
        ogSlug: r.id,
      });
    }
  }
  for (const p of POST_ROUTES) {
    const post = POSTS.find((x) => x.id === p.postId);
    out.push({
      routeId: "post",
      postId: p.postId,
      lang: p.lang,
      path: p.path,
      title: p.title,
      description: p.description,
      alternates: Object.fromEntries(
        LANGS.map((l) => [l, DENIK.path[l] + "/" + post.slug[l]])
      ),
      ogSlug: p.ogSlug,
      published: post.date,
    });
  }
  return out;
}

/**
 * Old hash routes, kept alive because the site is already public and
 * shared links must not break. The app rewrites them to the clean path
 * on load; `public/_redirects` handles the old bare paths server side.
 */
export const HASH_ALIASES = {
  "": "home",
  praxe: "praxe",
  pribeh: "pribeh",
  spoluprace: "spoluprace",
  udalosti: "spoluprace",
  kontakt: "spoluprace",
  poezie: "pribeh",
};

/** Resolve a pathname to { routeId, lang, postId }. Null when unknown. */
export function matchPath(pathname) {
  let p = pathname.replace(/\/+$/, "");
  if (p === "") p = "/";
  if (p === "/en") p = "/en/";
  for (const r of ROUTES) {
    if (r.public === false) continue;
    for (const lang of LANGS) {
      if (r.path[lang].replace(/\/+$/, "") === p.replace(/\/+$/, "")) {
        return { routeId: r.id, lang, postId: null };
      }
      if (r.path[lang] === p) return { routeId: r.id, lang, postId: null };
    }
  }
  for (const pr of POST_ROUTES) {
    if (pr.path === p) return { routeId: "post", lang: pr.lang, postId: pr.postId };
  }
  return null;
}

/** The counterpart URL in the other language, for the toggle and hreflang. */
export function otherLangPath(routeId, lang, postId) {
  const other = lang === "cs" ? "en" : "cs";
  if (routeId === "post") {
    const post = POSTS.find((p) => p.id === postId);
    return DENIK.path[other] + "/" + post.slug[other];
  }
  const r = ROUTES.find((x) => x.id === routeId);
  return r ? r.path[other] : ROUTES[0].path[other];
}

export function routePath(routeId, lang) {
  const r = ROUTES.find((x) => x.id === routeId);
  return r ? r.path[lang] : ROUTES[0].path[lang];
}

export function postPath(postId, lang) {
  const post = POSTS.find((p) => p.id === postId);
  return DENIK.path[lang] + "/" + post.slug[lang];
}
