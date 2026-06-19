# SEO Rules

The SEO conventions this site follows. Keep new work consistent with these.

## Foundation: everything must be in the prerendered HTML

The site is fully static (SSG). Crawlers and social scrapers do **not** run JS,
so all SEO signals must be emitted at build time into `build/client/**/*.html`.
In practice this means via each route's `meta` export — never injected at runtime.
Always verify by inspecting the built HTML, not the source.

## Titles

- Format: **`<Keyword-forward phrase> | Sims Digital Partners`** (pipe separator).
- Lead with keywords/intent, not the brand. Keep ≲ 60 chars.
- Unique per page. Examples in use:
  - Home: `Websites, Automation & AI Solutions | Sims Digital Partners`
  - Services: `Business Websites, Automation & AI Services | Sims Digital Partners`
  - Service pages: a dedicated `metaTitle` field in `app/lib/services.ts`
    (e.g. `Custom Software & Web App Development | Sims Digital Partners`).
  - About: `About — Cody Sims, Founder | Sims Digital Partners`
  - Resume: `Cody Sims Resume | Sims Digital Partners`

## Meta descriptions

- ~120–160 chars, written in **business "we"/benefit voice** on marketing pages.
- Unique per page. Service pages use the `metaDescription` field in `services.ts`.
- About/Resume descriptions stay personal (they're about Cody).

## Canonical + social

- `siteMeta({title, description, path})` is the single source for meta. It emits:
  `<title>`, `<meta name="description">`, **`<link rel="canonical">`**, and the
  full Open Graph + Twitter Card set (shared `/og-image.jpg`, 1200×610).
- Always pass an accurate `path`; canonical + `og:url` derive from it.
- Add canonical/OG by routing all meta through `siteMeta` — don't hand-roll tags.

## Structured data (JSON-LD)

Builders live in `app/lib/structured-data.ts`; inject via
`{ "script:ld+json": builder() }` appended to a route's `meta` array
(spread `...siteMeta(...)` first). Schema per page type:

| Page | Schema |
|------|--------|
| Home | `Organization` + `WebSite` |
| `/services` | `ItemList` + `BreadcrumbList` |
| `/services/<slug>` | `Service` (provider → org) + `BreadcrumbList` |
| About / Resume | `Person` (Cody Sims) |
| Contact | `ContactPage` + `BreadcrumbList` |

- One canonical `Organization` node (`@id: …/#organization`) is referenced by
  other pages (`provider`, `about`, `worksFor`). Reuse the `@id`; don't redefine.
- `sameAs` = GitHub + LinkedIn. Keep org `email`, `logo`, `founder` accurate.
- New service pages get `Service` JSON-LD automatically via `serviceJsonLd()`.

## Headings

- Exactly one `<h1>` per page (inner pages get it from `PageHeader`).
- Section labels must be real `<h2>`/`<h3>` — not styled `<p>`. (The About page's
  local `Eyebrow` renders `<h2>` for this reason.)

## Sitemap

- `public/sitemap.xml` is **hand-maintained**. When adding a page, add a `<url>`
  (loc + `lastmod` + `priority`). Home `1.0`, services index `0.9`, detail pages
  `0.7`, About/Resume `0.8`, Contact `0.6`.
- Refresh `lastmod` (ISO `YYYY-MM-DD`) for pages whose content changed, at deploy.
- Referenced by `public/robots.txt`.

## Internal linking

- Every page reaches the services via the navbar + footer (footer reads from
  `services.ts`). Service detail pages cross-link siblings ("Other services") and
  back to the catalog. Maintain this density when adding pages.

## 404

- `public/404.html` (static, branded, `noindex`) + `.htaccess` `ErrorDocument`
  handle direct unknown-URL hits; the React `ErrorBoundary` handles in-app nav.
