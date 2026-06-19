# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Sims Digital Partners website** — a modern business/portfolio site presenting Cody Sims and the practical websites, business applications, automations, and AI-assisted tools he builds for businesses.

**Objectives (the guiding rule for all decisions):**
1. **Primary — win potential customers.** First and foremost this site exists to turn visitors into qualified inquiries: make the services clear and compelling and make reaching out about a project easy and obvious. When a tradeoff arises, favor what drives qualified contact.
2. **Secondary — portfolio credibility.** Establish Cody as a credible software developer so the work and background build the trust that supports conversion.

Keep these in priority order: the site's job is to win customers; the portfolio is the credibility that supports it. Stay professional and trustworthy — never hypey or like a lead-gen mill.

**Positioning:** A business site that wins customers, backed by a credible developer portfolio — a one-person studio led by Cody Sims, not a large agency, not an aggressive "custom software" shop. Business-first, but credible, clean, and focused.

**Audience:** Small business owners and prospective clients first; potential employers, recruiters, and technical reviewers second.

**Tone:** Professional, direct, modern, practical. No corporate fluff.

### Pages
Home · Services · Projects / Recent Work · About · Resume · Contact.

### Services to present
- Websites for small businesses
- Business applications / CRM-style tools
- Workflow automation
- AI-assisted tools

### Design direction
Dark modern technology aesthetic — premium but not overdesigned:
- **Background:** near-black / deep navy
- **Primary accent:** electric blue · **Secondary accent:** lighter blue
- **Text:** white headings, muted slate/gray-blue body
- **Cards:** dark navy with subtle borders
- Rounded cards, subtle borders, soft blue glow effects, clean spacing, a strong hero section

Drive all of this through theme tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `--color-primary`) rather than ad-hoc hex values — see the shadcn theming guidance.

### Reusable components to build
`Layout`, `Navbar`, `Footer`, `Hero`, `SectionHeader`, `ServiceCard`, `ProjectCard`, `CTA`, `ContactForm`.

### Constraints
- **Static deployment to Hostinger** via uploading the production build — **no backend, no database, no authentication.** The build is configured for SSG (`ssr: true` + `prerender: true`) so `npm run build` emits fully static HTML under `build/client/`, which is uploaded directly. See the Commands section for the deployment details and the contact-form approach.
- Stack: React Router v7 + TypeScript + Tailwind CSS + shadcn/ui where useful + `lucide-react` for icons (quiet, consistent, `h-4 w-4` / `h-5 w-5`).

## Commands

> **Run npm/node commands inside WSL, not Windows PowerShell.** The project lives on the WSL filesystem; running `npm install`/`npx` from the Windows host over the `\\wsl.localhost\...` UNC path corrupts `node_modules/.bin` symlinks (`EISDIR`). Node is managed by nvm in WSL. Prefix commands like so:
> ```
> wsl -e bash -lc 'export NVM_DIR=~/.nvm; . ~/.nvm/nvm.sh; nvm use v22.22.3 >/dev/null; cd /home/cody/workspace/sandbox/simsdigitalpartners && <cmd>'
> ```

- `npm run dev` — Start the dev server with HMR at `http://localhost:5173`.
- `npm run build` — Production build (SSG). Prerenders every route to full static HTML under `build/client/` (`/` → `index.html`, `/about` → `about/index.html`, …). A `build/server/` is also emitted but is **only used at build time to render the HTML** — it is not deployed.
- `npm run typecheck` — Runs `react-router typegen` then `tsc`. There is no lint or test setup; this is the only static-analysis gate.
- Add shadcn components: `npx shadcn@latest add <name>` (works inside WSL; the `~` alias and `app/components/ui` path are already configured in `components.json`).

**Deployment:** upload the contents of `build/client/` to Hostinger — nothing else. All routes are prerendered to real HTML files, so deep links work without rewrites. Adding a new page requires registering it in `app/routes.ts` so it gets prerendered (otherwise it won't have a static file and will 404 on direct navigation).

> **Why `ssr: true` for a static site:** with `ssr: false` (SPA mode), `prerender` only renders the *index* route's content — nested routes under the `layout()` come out as empty shells. `ssr: true` + `prerender: true` renders every route's full HTML at build time, which is what we want. There is no runtime server.

## Architecture

This is a **React Router 7 app in framework mode** (the successor to Remix) configured for **fully static prerendered output** (`ssr: true`, `prerender: true` in `react-router.config.ts`) — React 19, Tailwind CSS 4, Vite 8, TypeScript strict mode. There is no backend, database, or auth at runtime; loaders/actions run at build time only (data must be static).

- **Design language: dark high-tech / SaaS.** Deep-navy with electric-blue + cyan accents, layered gradients, glow for depth, over a global video background. `image-references/` holds the brand source graphic that sets the quality bar (design reference, not a site asset). **The homepage is the most visually rich page**; inner pages (Services/Projects/About/Resume/Contact) are simpler but use the same background, tokens, and `PageHeader`.
- **Layout shell & global background.** `app/components/layout.tsx` is a pathless `layout()` route (wired in `app/routes.ts`) that renders `VideoBackground` (fixed full-screen looping MP4 + dark overlay, shared by every page) + `SiteHeader` + `<Outlet />` + `SiteFooter`. Because the background is fixed behind everything (`z-10`), page/section wrappers stay transparent (use `bg-card` only on actual cards) so the video shows through and content scrolls over it.
- **`VideoBackground`** (`app/components/video-background.tsx`) plays `public/videos/background.mp4` — autoplay/loop/muted/playsInline, `object-cover`, with a `bg-background/70` overlay. Respects `prefers-reduced-motion`: hidden via `motion-reduce:hidden` (CSS, works without JS) **and** paused via a `matchMedia` effect. The `playbackRate` prop (default `1`) can slow it further at runtime. The committed `background.mp4` is already slowed to ~0.35× and smoothed at encode time: re-encoded from the original with `ffmpeg -vf "scale=1280:720,setpts=2.8571*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1"` (CRF 24, faststart, no audio) so the slow motion has interpolated frames instead of looking steppy — 720p/5.7MB vs the 1080p/18MB source. The untouched original is backed up at `~/sdp-background-original-1080p.mp4` in WSL (outside the repo).
- **Components** (`app/components/`): `VideoBackground`, `SiteHeader`, `SiteFooter`, `PageHeader` (inner-page intro: mono eyebrow + heading + optional `action`), `ServiceCard`, `ProjectCard`, `CTA` (`variant="panel" | "bar"`), `ContactForm`, plus home-only visuals `HeroVisual` (glowing code window) and `TechMarquee`. shadcn primitives are in `app/components/ui/`. The homepage hero and section composition live inline in `app/routes/home.tsx` (bespoke); pages hold their own content data and pass it to components.
- **No-backend contact form.** `app/components/contact-form.tsx` composes a `mailto:` link on submit (no server). To collect submissions automatically, point the form at a form service (e.g. Formspree) instead.
- **Icons:** lucide-react no longer ships brand icons — GitHub/LinkedIn marks are inline SVGs in `site-footer.tsx`.
- **Brand logo.** Source is `public/images/sdp-logo-offset.png` (the two-tone circuit-"S" mark — blue top, **slate gray-blue** bottom, transparent background; the stray "1" watermark is erased during processing). Derived assets (generated with Pillow): `sdp-mark.png` (transparent, trimmed) used in the navbar (`site-header.tsx`) and footer; `sdp-icon-{32,180,512}.png` (the trimmed mark centered on a **transparent** square, slight padding) wired as favicon / apple-touch-icon in `app/root.tsx`'s `links`, plus a regenerated `public/favicon.ico`. The gray-blue lower half keeps the mark legible on both light and dark browser tabs. To regenerate after a logo change, re-run the corner-erase + trim/center steps (Pillow `getbbox` + `alpha_composite`).
- **Static route discovery.** `routeDiscovery: { mode: "initial" }` in `react-router.config.ts` is required: it embeds the full route manifest at build time. Without it the client fetches `/__manifest` at runtime, which 404s on a static host (no server).

- **Routing is config-based, not file-based.** Routes are declared explicitly in `app/routes.ts` using helpers from `@react-router/dev/routes` (`index`, `route`, etc.). Adding a page means both creating the route module under `app/routes/` and registering it in `app/routes.ts`.
- **Route modules** export named functions that the framework calls: `loader`/`action` (server data), `meta`, `links`, and a default component. `app/root.tsx` is the document shell (`<html>`, global `<Links>`/`<Meta>`/`<Scripts>`) and defines the app-wide `ErrorBoundary`.
- **Generated route types.** Each route imports its prop/arg types from `./+types/<name>` (e.g. `Route.MetaArgs`, `Route.LoaderArgs`). These are generated by `react-router typegen` into `.react-router/types/`. After changing `routes.ts` or loader/action signatures, run `npm run typecheck` (or `react-router typegen`) to regenerate them before relying on the types.
- **v8 future flags are enabled** in `react-router.config.ts` (`v8_middleware`, `v8_passThroughRequests`, `v8_splitRouteModules`, `v8_trailingSlashAwareDataRequests`, `v8_viteEnvironmentApi`) — expect the v8 behavior for middleware and route module splitting.

## Conventions

- Import from app code with the `~/*` alias (maps to `app/*`), configured in `tsconfig.json` and resolved via tsconfigPaths in `vite.config.ts`. shadcn aliases (`~/components`, `~/lib/utils`, etc.) are set in `components.json`.
- **Typography:** Geist (sans) + Geist Mono, loaded via Google Fonts in `app/root.tsx` and set as `--font-sans` / `--font-mono` in `app/app.css`. Use `font-mono` for eyebrows, labels, stats, and code (the technical accent); sans for everything else.
- **Styling & theme** live in `app/app.css` (imported in `app/root.tsx`); Tailwind 4 is wired through the `@tailwindcss/vite` plugin (no `tailwind.config.js`). The dark-navy / electric-blue palette is defined as shadcn CSS variables there. The site is **dark-only**: `<html className="dark">` is hardcoded in `app/root.tsx`. Build surfaces from theme tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`) plus custom `text-accent-blue` (lighter blue) and `text-tech-cyan` (used sparingly). Custom `@utility` helpers in `app.css`: `bg-grid`, `text-gradient`, `glow-blue`, `ring-glow`, and the animations `animate-fade-up` (staggered via inline `animationDelay`), `animate-float`, `animate-marquee`, `animate-pulse-soft` — all disabled under `prefers-reduced-motion`.
- shadcn/ui is set up (`style: new-york`, `baseColor: slate`, radix base, lucide icons). Components land in `app/components/ui/`; build app-specific components alongside in `app/components/`.
