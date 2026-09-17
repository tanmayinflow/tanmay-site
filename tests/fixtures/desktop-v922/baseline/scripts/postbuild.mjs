/**
 * postbuild.mjs · runs as part of `npm run build`
 * ----------------------------------------------------------------------
 * Vite builds one HTML shell. This turns it into one real pre-rendered
 * file per public route, so that:
 *
 *   1. /praxe, /en/story, /denik/les-nehodnoti and every other address is
 *      a genuine URL served by Cloudflare static assets, not a hash;
 *   2. a social crawler that never runs JavaScript still reads the right
 *      title, description, canonical, hreflang and preview image;
 *   3. an unknown address gets a real 404 with a real page.
 *
 * It also writes robots.txt and sitemap.xml from the same route table,
 * so those can never drift from what the site actually serves.
 *
 * The route table is src/site.js. There is no second copy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, ROUTES, POSTS, LANGS, allPages, IG_URL } from "../src/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const shell = readFileSync(join(DIST, "index.html"), "utf8");

/* ---------------------------------------------------------------- fonts */
/* One request fewer, and no flash of a stylesheet that has not arrived. */
const fontCssPath = join(DIST, "fonts", "tanmay-fonts.css");
let fontStyle = '<link rel="stylesheet" href="/fonts/tanmay-fonts.css">';
if (existsSync(fontCssPath)) {
  fontStyle = "<style>" + readFileSync(fontCssPath, "utf8").replace(/\n/g, "") + "</style>";
}

/* The two faces that carry the first screen in each edition. */
const PRELOAD = {
  cs: ["/fonts/eb-garamond-400-normal.woff2", "/fonts/dm-sans-400-normal.woff2"],
  en: ["/fonts/cormorant-garamond-400-normal.woff2", "/fonts/dm-sans-400-normal.woff2"],
};

/* --------------------------------------------------------------- images */
const ogFor = (slug, lang) => {
  const f = `/og/${slug}-${lang}.jpg`;
  return existsSync(join(DIST, "og", `${slug}-${lang}.jpg`)) ? f : `/og/home-${lang}.jpg`;
};

/* ---------------------------------------------------------------- head  */
function head(page) {
  const { lang, path, title, description, alternates, ogSlug } = page;
  const url = ORIGIN + path;
  const og = ORIGIN + ogFor(ogSlug, lang);
  const out = [];
  out.push(`<meta name="tm-route" content="${page.routeId}:${lang}${page.postId ? ":" + page.postId : ""}">`);
  out.push(`<title>${esc(title)}</title>`);
  out.push(`<meta name="description" content="${esc(description)}">`);
  out.push(`<link rel="canonical" href="${esc(url)}">`);
  for (const l of LANGS) {
    out.push(`<link rel="alternate" hreflang="${l === "cs" ? "cs-CZ" : "en"}" href="${esc(ORIGIN + alternates[l])}">`);
  }
  out.push(`<link rel="alternate" hreflang="x-default" href="${esc(ORIGIN + alternates.cs)}">`);
  out.push(`<meta property="og:site_name" content="tanmay">`);
  out.push(`<meta property="og:type" content="${page.routeId === "post" ? "article" : "website"}">`);
  out.push(`<meta property="og:locale" content="${lang === "cs" ? "cs_CZ" : "en_US"}">`);
  out.push(`<meta property="og:locale:alternate" content="${lang === "cs" ? "en_US" : "cs_CZ"}">`);
  out.push(`<meta property="og:url" content="${esc(url)}">`);
  out.push(`<meta property="og:title" content="${esc(title)}">`);
  out.push(`<meta property="og:description" content="${esc(description)}">`);
  out.push(`<meta property="og:image" content="${esc(og)}">`);
  out.push(`<meta property="og:image:width" content="1200">`);
  out.push(`<meta property="og:image:height" content="630">`);
  out.push(`<meta property="og:image:alt" content="${esc(title)}">`);
  out.push(`<meta name="twitter:card" content="summary_large_image">`);
  out.push(`<meta name="twitter:title" content="${esc(title)}">`);
  out.push(`<meta name="twitter:description" content="${esc(description)}">`);
  out.push(`<meta name="twitter:image" content="${esc(og)}">`);
  for (const f of PRELOAD[lang]) {
    out.push(`<link rel="preload" as="font" type="font/woff2" href="${f}" crossorigin>`);
  }
  const ld = jsonLd(page);
  if (ld) out.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  return out.join("\n  ");
}

/**
 * Structured data covers only what is visible on the page and verified.
 * No Offer, no price, no Review, no AggregateRating, no LocalBusiness
 * address, no openingHours, no credential, no Event.
 */
function jsonLd(page) {
  const { lang, path, routeId } = page;
  const url = ORIGIN + path;
  const person = {
    "@type": "Person",
    name: "Kryštof Švec",
    url: ORIGIN + (lang === "cs" ? "/" : "/en/"),
    sameAs: [IG_URL],
  };
  if (routeId === "home") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: "tanmay practice",
          url: ORIGIN + "/",
          inLanguage: lang === "cs" ? "cs-CZ" : "en",
        },
        { ...person, image: ORIGIN + "/media/home-v9-1/portrait-home-1153.webp" },
      ],
    };
  }
  if (routeId === "pribeh") {
    return { "@context": "https://schema.org", ...person, mainEntityOfPage: url };
  }
  if (routeId === "post") {
    const post = POSTS.find((p) => p.id === page.postId);
    const denik = ROUTES.find((r) => r.id === "denik");
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: post.title[lang],
          description: post.excerpt[lang],
          datePublished: post.date,
          inLanguage: lang === "cs" ? "cs-CZ" : "en",
          author: person,
          mainEntityOfPage: url,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem", position: 1,
              name: lang === "cs" ? "Deník praxe" : "Practice log",
              item: ORIGIN + denik.path[lang],
            },
            { "@type": "ListItem", position: 2, name: post.title[lang], item: url },
          ],
        },
      ],
    };
  }
  return null;
}

/* ---------------------------------------------------------------- write */
function render(page) {
  let html = shell;
  html = html.replace(
    /<!-- TM:HEAD:START -->[\s\S]*?<!-- TM:HEAD:END -->/,
    "<!-- TM:HEAD:START -->\n  " + head(page) + "\n  <!-- TM:HEAD:END -->"
  );
  html = html.replace('<link rel="stylesheet" href="/fonts/tanmay-fonts.css">', fontStyle);
  html = html.replace('<html lang="cs">', `<html lang="${page.lang}">`);
  if (page.lang === "en") {
    html = html.replace(
      /<noscript>[\s\S]*?<\/noscript>/,
      `<noscript>
    <div style="max-width:640px;margin:12vh auto;padding:0 24px;font-family:Georgia,serif;color:#1C1C1A">
      <p style="font-size:1.4rem;line-height:1.5">Tanmay · movement and practice coaching · Prague</p>
      <p style="margin-top:16px;line-height:1.7">This site needs JavaScript. Write to me at
        <a href="mailto:tanmay.in.flow@gmail.com" style="color:#B87333">tanmay.in.flow@gmail.com</a>.</p>
    </div>
  </noscript>`
    );
  }
  /* Internal notes are for the repository, not for the visitor. Strip
     every HTML comment from the shipped page. */
  html = html.replace(/<!--[\s\S]*?-->/g, "").replace(/\n\s*\n\s*\n+/g, "\n\n");
  return html;
}

// M00: restore only the approved public scope; do not activate the legacy journal.
const pages = allPages().filter(p => ["home", "praxe", "pribeh", "spoluprace", "soukromi"].includes(p.routeId));
let written = 0;
for (const page of pages) {
  const rel = page.path === "/" ? "index.html" : page.path.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
  const file = join(DIST, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
  written++;
}

/* Cloudflare `not_found_handling: 404-page` serves this with status 404. */
writeFileSync(
  join(DIST, "404.html"),
  render({
    routeId: "notfound",
    lang: "cs",
    path: "/404",
    title: "Stránka nenalezena · tanmay",
    description: "Tahle stránka na tanmaypractice.com není.",
    alternates: { cs: "/", en: "/en/" },
    ogSlug: "home",
  })
);

/* ------------------------------------------------------------- discovery */
const SITEMAP_NS =
  'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
  'xmlns:xhtml="http://www.w3.org/1999/xhtml"';

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${SITEMAP_NS}>\n` +
  pages
    .map((p) => {
      const alts = LANGS.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l === "cs" ? "cs-CZ" : "en"}" href="${esc(ORIGIN + p.alternates[l])}"/>`
      ).join("\n");
      return `  <url>\n    <loc>${esc(ORIGIN + p.path)}</loc>\n${alts}\n  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
);

console.log(`postbuild: ${written} routes, 404.html, sitemap.xml, robots.txt`);
