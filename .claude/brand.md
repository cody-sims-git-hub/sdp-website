# Brand — Voice & Design

How Sims Digital Partners should sound and look. Apply consistently.

## Positioning

A business site that wins customers, backed by a credible developer portfolio — a
one-person studio led by **Cody Sims**, not an agency, not an aggressive "custom
software" shop. Business-first, but credible, clean, and focused. Audience:
small business owners and prospective clients first; potential employers,
recruiters, and technical reviewers second.

## Voice — first person plural vs. singular

This is the rule that keeps the dual identity coherent:

- **"We" (business voice)** on the marketing/conversion surfaces:
  **home, services index, service detail pages, contact.** Sounds like a studio.
- **"I" (personal voice)** on **About and Resume** — they're literally about
  Cody, so they stay in his own words ("I'm a software support engineer…").
- **Project / work ownership is personal:** featured work is attributed to
  **Cody Sims** ("projects built by Cody Sims"), not "we" — it's his portfolio.
- The hero keeps the name present (e.g. studio framing that mentions Cody Sims);
  About is framed as the company with **"Founded by Cody Sims."**

When adding copy, match the surface: building a services/marketing section → use
"we"; writing About/Resume bio → use "I"; describing a specific project → Cody.

## Tone

Professional, direct, modern, practical. No corporate fluff, no hype. Benefit-led
on service pages (what it does for the business), confident but not overclaiming.
Truthful — no invented case studies, metrics, or guarantees.

## Naming

- Company: **Sims Digital Partners**. Founder: **Cody Sims**.
- Title pattern (SEO + tabs): `<phrase> | Sims Digital Partners`.

## Design language (dark high-tech / SaaS)

Dark-only theme. Deep-navy / near-black background, electric-blue primary with a
lighter blue + cyan accent, layered gradients and soft glow, over a fixed global
looping video background (dark overlay). Homepage is the most visually rich page;
inner pages are simpler but share the background, tokens, and `PageHeader`.

### Always build from theme tokens — never ad-hoc hex

- Surfaces: `bg-background`, `bg-card` (cards only, usually `bg-card/60` +
  `backdrop-blur-sm`), `border-border`.
- Text: `text-foreground` (white headings), `text-muted-foreground` (body),
  `text-primary` (electric blue), `text-accent-blue` (lighter), `text-tech-cyan`
  (sparingly).
- theme-color meta: `#0b101e`.

### Typography

- **Geist** (sans) + **Geist Mono**, via Google Fonts (`--font-sans` /
  `--font-mono`).
- `font-mono` for **eyebrows, labels, stats, code, pills** (the technical
  accent); sans for everything else.

### Component patterns

- Rounded cards (`rounded-2xl`), subtle borders, hover `hover:border-primary/40`,
  optional radial glow blob (`bg-primary/20 blur-3xl`, `aria-hidden`).
- Eyebrow: mono, `text-xs uppercase tracking-[0.2em] text-primary`, often with a
  small glowing dot.
- Icons: **lucide-react**, quiet and consistent (`size-4` / `size-5`). Brand
  icons (GitHub/LinkedIn) are inline SVGs in `components/icons.tsx`.
- Reusable components: `PageHeader`, `ServiceCard`, `ServiceDetail`,
  `ProjectCard`, `ContactForm`, plus home-only `HeroVisual`, `TechMarquee`.
- Respect `prefers-reduced-motion` — all animations disable under it.

## Logo & assets

- Mark: two-tone circuit-"S" (blue top, slate-gray-blue bottom, transparent).
  `public/images/sdp-mark.png` in navbar/footer; `sdp-icon-{32,180,512}.png` for
  favicons/apple-touch (wired in `app/root.tsx`); `public/favicon.ico`.
- Share image: `/og-image.jpg`, **1200×610**.
- Photos: `headshot.JPG` (chest-height crop, high-res from original),
  `military-photo.JPG`. Originals kept outside the repo in WSL home
  (`~/sdp-image-originals/`).

## Guardrail

Keep priorities in order: the site's primary job is to **win customers** — make
the services clear and reaching out easy and obvious. The **portfolio is
secondary**: it builds the credibility that supports conversion. Stay
professional and trustworthy — never hypey or like a lead-gen mill.
