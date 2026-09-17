/** Shared direct-document and SPA metadata; no visitor-facing copy is changed. */
import { ORIGIN, ROUTES, POSTS, IG_URL, allPages } from "./site.js";

export function pageMetadata(loc, pathname) {
  const lang = loc.lang === "en" ? "en" : "cs";
  const page = allPages().find(p => p.routeId === loc.routeId && p.lang === lang && (!loc.postId || p.postId === loc.postId));
  if (page) return page;
  return { routeId: "notfound", lang, path: pathname,
    title: lang === "en" ? "Page not found · tanmay" : "Stránka nenalezena · tanmay",
    description: lang === "en" ? "This page does not exist on tanmaypractice.com." : "Tahle stránka na tanmaypractice.com není.",
    alternates: { cs: "/", en: "/en/" }, ogSlug: "home" };
}

export function jsonLd(page) {
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
