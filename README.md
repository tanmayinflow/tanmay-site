# tanmay-site · tanmaypractice.com

Hlavní web. Single-file React/Vite — stejný vzor jako apka (`tanmay-web`):
všechno v `src/App.tsx`, žádné externí knihovny kromě Reactu.

## Struktura
- `src/App.tsx` — celý web (CSS + data + komponenty). Jediný soubor, který kdy budeš upravovat.
- `src/main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.json` — scaffold, netřeba sahat.
- `wrangler.jsonc` — Cloudflare (assets z `./dist`).

## Nasazení (stejně jako apka)
1. Nové GitHub repo `tanmay-site`, nahraj všechny soubory (bez `node_modules`, `dist`).
2. Cloudflare dashboard → Workers & Pages → Create → připoj repo.
   - Build command: `npm run build`
   - Output/assets: `dist`
3. Custom domain: `tanmaypractice.com` (doména už je u Cloudflare Registrar).
4. Hotovo — každý commit = auto-deploy do ~1 min.

## Co upravit v App.tsx (vše nahoře v sekci DATA)
- `MAIL` — kontaktní e-mail
- ceny v komponentě `Offer` (1 800 Kč / 4 500 Kč jsou návrh)
- `EVENTS` — reálné události a termíny
- `POSTS` — zápisky (3 ukázkové v tvém hlase)
- `VALUES`, `QA`, báseň v `Poetry` — dolaď podle sebe

## Klienti
„Vstup" vede na `app.tanmaypractice.com`. Přístup klientům dáš přidáním
jejich e-mailu do Cloudflare Zero Trust Access policy u apky.

## Lokální vývoj
```
npm install
npm run dev
```
