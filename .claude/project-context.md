# Project Context — Sims Digital Partners

Quick-reference context for working in this repo. See `CLAUDE.md` (repo root) for
the authoritative, detailed guidance; this file is the distilled operating brief.

## What this is

The **Sims Digital Partners** website — a business site whose job is to win
potential customers, backed by a credible developer portfolio. Priority order,
used to settle any tradeoff:

1. **Primary — convert visitors into customers.** Make the services clear and
   compelling, and make reaching out about a project easy and obvious. Favor what
   drives qualified inquiries.
2. **Secondary — portfolio credibility.** Show that Cody Sims can deliver, so the
   work and background build the trust that supports conversion.

Positioning: a one-person studio led by **Cody Sims**, not an agency. Business-
first, but credible, clean, and focused — never hypey or like a lead-gen mill.

## Stack

- **React Router v7** (framework mode, the Remix successor), **React 19**,
  **TypeScript** (strict), **Tailwind CSS 4** (via `@tailwindcss/vite`, no
  `tailwind.config.js`), **Vite 8**, shadcn/ui (new-york, slate), lucide-react.
- **Fully static (SSG).** `ssr: true` + `prerender: true` in
  `react-router.config.ts` → `npm run build` prerenders every route to real HTML
  under `build/client/`. **No backend, DB, or auth at runtime.** Loaders/actions
  run at build time only — all data must be static.

## Deployment — READ BEFORE PUSHING

- **CI deploys on every push to `main`** (`.github/workflows/deploy.yml`):
  builds and FTP-uploads `build/client/` to Hostinger. **Pushing `main` = the
  live site rebuilds.** Nothing else (local commits, other branches) deploys.
- During active dev phases, **work on a branch** (e.g. `feature/redesign`) and
  only merge → push `main` when intentionally going live.
- Deep links work because every route is a prerendered HTML file. Adding a page
  REQUIRES registering it in `app/routes.ts` or it 404s on direct nav.
- `public/.htaccess` sets `ErrorDocument 404 /404.html` for host-level unknown
  URLs; dotfiles in `public/` are copied to `build/client/` and uploaded.

## Run commands inside WSL (not Windows PowerShell)

The project lives on the WSL filesystem; running npm/npx over the `\\wsl...` UNC
path corrupts `node_modules/.bin` symlinks. Prefix:

```
wsl -e bash -lc 'export NVM_DIR=~/.nvm; . ~/.nvm/nvm.sh; nvm use v22.22.3 >/dev/null; cd /home/cody/workspace/sandbox/simsdigitalpartners && <cmd>'
```

- `npm run dev` — HMR dev server (user typically runs their own on :5173).
- `npm run build` — SSG build; prerenders all routes.
- `npm run typecheck` — `react-router typegen` + `tsc`. The only static-analysis
  gate (no lint/test setup). Run after changing `routes.ts` or loader/meta sigs.

> A browser cannot reach the WSL dev server from this agent environment
> (connection refused on all interfaces) — verify visually via the user's
> :5173, or via build-output HTML inspection, not by driving a browser here.

## Routing & pages

Config-based in `app/routes.ts` (not file-based). A pathless `layout()` wraps all
routes (`components/layout.tsx` → VideoBackground + SiteHeader + Outlet +
SiteFooter). Current routes:

- `/` (home) · `/services` (catalog) · `/services/<slug>` ×4 · `/about` ·
  `/resume` · `/contact`

## Key source files (single sources of truth)

- **`app/lib/services.ts`** — the service catalog data (slug, icon, copy, tags,
  `metaTitle`, `metaDescription`, `summary`, `features`, `process`). Home,
  `/services`, the 4 detail pages, and the footer ALL read from this. Add/rename
  a service here + add a route module + register in `routes.ts`.
- **`app/lib/site-meta.ts`** — `siteMeta({title, description, path})` builds
  `<title>`, description, canonical, OG + Twitter tags. Every route's `meta`
  uses it.
- **`app/lib/structured-data.ts`** — schema.org JSON-LD builders, injected via
  `{ "script:ld+json": ... }` in each route's `meta`.
- **`app/components/service-detail.tsx`** — reusable template for service pages.
- Detail route modules (`routes/services.<slug>.tsx`) are thin: meta + render.

## Conventions

- Import app code with the `~/*` alias (→ `app/*`).
- Dark-only theme; build from tokens (`bg-background`, `bg-card`,
  `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`,
  `text-accent-blue`, `text-tech-cyan`) — never ad-hoc hex.
- `font-mono` for eyebrows, labels, stats, code; sans elsewhere.
- See `.claude/brand.md` (voice + design) and `.claude/seo-rules.md` (SEO) for
  the established patterns; `.claude/evals.md` for the done/pre-deploy checklist.
