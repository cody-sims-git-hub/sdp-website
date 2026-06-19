# Evals — Definition of Done & Pre-Deploy Checklist

How to verify work on this site is correct before claiming done or deploying.
Evidence before assertions: run the commands and read the output.

## Always-run gates

```
npm run typecheck     # react-router typegen + tsc — the only static gate
npm run build         # must succeed AND prerender every route
```

- **Build must prerender all routes.** After a clean build, confirm the count:
  `grep -c "Prerender (html)" <build log>` should equal the number of routes
  (currently **9**). Each new page must appear as
  `Prerender (html): /path -> build/client/path/index.html`.
- A new page that builds but isn't in `app/routes.ts` will NOT prerender and
  will 404 on direct navigation. Registering it is part of "done".

## New page / route checklist

- [ ] Route module created under `app/routes/` and registered in `app/routes.ts`.
- [ ] `meta` exports via `siteMeta(...)` (unique title + description + canonical).
- [ ] Appropriate JSON-LD added (see `.claude/seo-rules.md`).
- [ ] Added to `public/sitemap.xml` (loc + lastmod + priority).
- [ ] One `<h1>` (usually via `PageHeader`); section headings are `<h2>`.
- [ ] Internal links to/from related pages where it makes sense.
- [ ] Build shows it prerendering to its own HTML file.

## SEO verification (inspect build output, not just source)

JSON-LD and meta must be in the **prerendered HTML** (crawlers don't run JS):

```
# canonical present on a page
grep -o '<link rel="canonical"[^>]*>' build/client/<page>/index.html
# JSON-LD present + valid JSON (parse it, don't eyeball)
node -e 'const fs=require("fs");const h=fs.readFileSync("build/client/<page>/index.html","utf8");const m=h.match(/ld\+json">(.*?)<\/script>/s);JSON.parse(m[1]);console.log("ok")'
```

- Titles unique + keyword-forward, format `… | Sims Digital Partners`.
- Meta descriptions present, ~120–160 chars, business-voice on marketing pages.
- og-image is `/og-image.jpg` at exactly **1200×610** (matches declared dims).

## Responsiveness (mobile / tablet / laptop, portrait + landscape)

Tailwind breakpoints: `sm=640 md=768 lg=1024 xl=1280`. Check by class audit
(browser not reachable from this env — eyeball on the user's :5173 if needed):

- [ ] No horizontal overflow at 320px (oversized decorative elements live inside
      `overflow-hidden` containers).
- [ ] Multi-card grids give tablets ≥2 columns (`md:grid-cols-2`), not one giant
      card per row. Home "What we build" and `/services` should match.
- [ ] Header action buttons / pill rows wrap (`flex-wrap`), never squish.
- [ ] Nothing locked to viewport height — short landscape just scrolls.

## Accessibility

- [ ] One `<h1>` per page; logical `h2`/`h3` outline (no styled `<p>` standing in
      for a section heading).
- [ ] Images have meaningful `alt`; purely decorative elements are `aria-hidden`.
- [ ] External links use `target="_blank" rel="noreferrer"`.

## Voice & brand consistency (see brand.md)

- [ ] Marketing surfaces (home, services, contact) use **"we"**.
- [ ] About/Resume stay **first-person ("I")** — they're literally about Cody.
- [ ] Project/work ownership is attributed to **Cody Sims** personally.

## Before deploying (push to main)

- [ ] typecheck + build green; prerender count correct.
- [ ] Sitemap `lastmod` refreshed for changed pages.
- [ ] Intentional: pushing `main` rebuilds the LIVE site. Confirm with the user.
- [ ] After push: confirm the **Deploy to Hostinger** Action run succeeds
      (`gh run list --workflow=deploy.yml`).
- [ ] Post-deploy: spot-check live pages + validate structured data in Google's
      Rich Results Test.
