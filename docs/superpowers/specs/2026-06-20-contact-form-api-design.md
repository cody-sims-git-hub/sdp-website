# Contact Form → API → MySQL → Resend — Design

**Date:** 2026-06-20
**Status:** Approved (pending spec review)
**Author:** Cody Sims (with Claude)

## Summary

Replace the website's `mailto:` contact form with a real submission pipeline: the
static marketing site POSTs to a new backend API on the VPS, which validates and
stores each submission in MySQL and sends transactional email via Resend (a
notification to Cody and an auto-reply to the submitter). The submissions table is
designed so it can later grow into the data substrate for a customer portal / CRM,
but that future work is explicitly **out of scope** here.

## Goals

- Capture every contact-form submission durably in a database we own (not just an
  email in an inbox).
- Acknowledge submitters automatically and notify Cody immediately.
- Harden the public endpoint against bots and abuse.
- Match the existing VPS platform conventions so the service is easy to operate.
- Lay a schema foundation that a future portal/CRM can build on without migration.

## Non-Goals (YAGNI)

- No customer portal, auth, or CRM UI in this project.
- No admin dashboard for reading submissions yet (query the DB directly for now).
- Does **not** touch or reuse any other app already running on the VPS.

## Decisions (locked during brainstorming)

| Area | Decision |
|---|---|
| API language/framework | Node + TypeScript, **Hono** |
| Data layer | **Drizzle ORM** over MySQL (SQL-first, typed migrations) |
| Database | **MySQL 8** in a container with a persistent named volume |
| Email | **Resend** (domain already verified), sender `no-reply@simsdigitalpartners.com` |
| Notification recipient | `info@simsdigitalpartners.com` |
| Spam defense | Cloudflare **Turnstile** + rate limiting + honeypot + validation + CORS |
| API repo | **New, private** repo, deployed as its own service on the VPS |
| Secrets | Never in Git — `.env` on the VPS + GitHub Actions secrets only |
| Reverse proxy | Caddy block `api.simsdigitalpartners.com` → the API container |

## Environment

The VPS runs Docker Compose with a Caddy reverse proxy that fronts each app by
subdomain and handles automatic HTTPS. Apps run as containers on a shared Docker
network so Caddy can route to them by service name. The new API service follows
that same convention — its own compose stack, joined to the Caddy network, exposed
at `api.simsdigitalpartners.com`.

## Architecture

```
simsdigitalpartners.com  (Hostinger, static — this repo)
   │  ContactForm: client validation → Turnstile token → POST JSON
   ▼  (CORS: only this origin + www allowed)
api.simsdigitalpartners.com  (Caddy TLS → API container, port 3000)
   │  CORS → body-size cap → rate limit → honeypot → Turnstile verify
   │  → schema validation → insert submission → fire emails
   ├─► MySQL 8 (container, named volume)  : submissions table
   └─► Resend                             : notify Cody + auto-reply submitter
```

TLS is terminated by Caddy (automatic HTTPS), so the API container speaks plain
HTTP on the internal Docker network only — never exposed directly to the internet.

## Components

### A. Frontend (this repo)

- **`app/components/contact-form.tsx`** — replace the `mailto:` handler with a
  `fetch` POST to the API. Add submit states: idle → submitting → success → error.
  On success, replace the form with a thank-you confirmation. On error, show a
  friendly message and keep the user's input.
- **Cloudflare Turnstile widget** — rendered in the form; its token is sent with
  the POST. Loaded via Turnstile's script. Respects the dark theme.
- **`app/lib/contact-api.ts`** (new) — small typed client: builds the request,
  posts JSON, normalizes the response. Holds the request/response TypeScript types.
- **Config** — API base URL and Turnstile **site key** (public) come from Vite env
  vars (`VITE_*`), baked in at build time. No secrets here — site key is public by
  design; the Turnstile *secret* lives only on the API.
- Keep the existing `gtagEvent("contact_submit", …)` analytics call; fire it on a
  successful submission instead of on `mailto:`.
- The "Reach us directly" `mailto:` links elsewhere on the page stay as-is.

### B. API service (new private repo)

Node + TypeScript + Hono. Structure (indicative):

```
src/
  index.ts            # app bootstrap, middleware wiring, server start
  routes/
    contact.ts        # POST /contact
    health.ts         # GET /health → { "status": "ok" } and nothing else
  middleware/
    cors.ts           # allowlist: https://simsdigitalpartners.com + www
    rate-limit.ts     # per-IP, 5 submissions / 10 min (conservative start)
    body-limit.ts     # reject oversized payloads early
  lib/
    turnstile.ts      # verify token with Cloudflare siteverify
    mailer.ts         # Resend client: notify() + autoReply()
    validation.ts     # zod schema for the contact payload
    sanitize.ts       # strip newlines, HTML-escape for email output
    logger.ts         # structured logging
  db/
    client.ts         # Drizzle + mysql2 connection pool
    schema.ts         # submissions table
    migrations/       # Drizzle-generated SQL migrations
drizzle.config.ts
docker-compose.yml    # api + mysql services, shared Caddy network
Dockerfile            # multi-stage, non-root, pinned base image
.env.example          # documents required vars (no real values)
.github/workflows/    # CI: typecheck/build/test; deploy step (see Deployment)
```

**Request handling order for `POST /contact`:**
1. CORS preflight / origin check (reject disallowed origins).
2. Body-size cap (reject early if too large).
3. Rate limit by client IP — **5 submissions per IP per 10 minutes** to start
   (conservative; tune later). Caddy sets `X-Forwarded-For`; trust it from the proxy.
4. Honeypot check — if the hidden field is non-empty, return a fake 200 (silently
   drop; don't tip off bots).
5. Turnstile verification — POST token to Cloudflare siteverify; reject on failure.
6. Schema validation (zod) — types, required fields, **max lengths** (e.g. name ≤120,
   email ≤254 + format, subject ≤200, message ≤5000). Reject with field errors.
7. Insert sanitized row into MySQL (parameterized via Drizzle — no SQL injection).
8. Fire emails via Resend (notify + auto-reply). Email send is **best-effort**:
   failures are logged but do **not** fail the request, since the submission is
   already persisted. Return success once the row is committed.
9. Generic error responses to the client; full detail only in server logs.

### C. Database (MySQL 8 container)

`submissions` table — CRM-friendly from day one:

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT UNSIGNED, PK, auto-increment | |
| `name` | VARCHAR(120) | required |
| `email` | VARCHAR(254) | required, validated |
| `subject` | VARCHAR(200) | optional |
| `message` | TEXT | required, capped at app layer |
| `status` | ENUM('new','read','archived') | default 'new' — for future triage/CRM |
| `source` | VARCHAR(64) | default 'contact_form' — future multi-source |
| `ip` | VARCHAR(45) | for abuse triage (IPv4/IPv6) |
| `user_agent` | VARCHAR(512) | for abuse triage |
| `created_at` | TIMESTAMP | default CURRENT_TIMESTAMP |

Indexes: `created_at`, `email`. The app connects as a **least-privilege** MySQL
user (DML only on this schema), never `root`. Root password and app-user password
are distinct, both from `.env`.

### D. Reverse proxy (Caddy)

Add one block to the Caddy config:

```
api.simsdigitalpartners.com {
    reverse_proxy <api-container>:3000
}
```

Then reload Caddy. The API service must join the same external Docker network Caddy
uses so it's reachable by service name. DNS: an A record for `api` → the VPS IP must
exist before Caddy can issue the cert.

## Email design (Resend)

- **Notification → Cody.** To `info@simsdigitalpartners.com`, `from: no-reply@…`,
  `reply-to:` = submitter's email (so a direct reply reaches them). Body lists
  name/email/subject/message, all HTML-escaped, plus timestamp and source.
- **Auto-reply → submitter.** To the submitter, `from: no-reply@…`, a short branded
  acknowledgement ("Thanks for reaching out — we've got your message and Cody will
  be in touch."). Dark/brand-consistent but simple HTML.
- Both are best-effort; a Resend outage never loses a submission (already in DB).

## Security measures (consolidated)

Requested + recommended, all in v1:

- **Cloudflare Turnstile** — bot challenge, verified server-side.
- **Honeypot** — hidden field; silent drop if filled (defense-in-depth).
- **Rate limiting** — per-IP, **5 submissions / 10 min** on `POST /contact` to start.
- **Minimal `/health`** — returns only `{ "status": "ok" }`; no DB status, versions,
  uptime, env values, internal paths, or stack traces. Normal rate limiting and
  logging still apply.
- **CORS allowlist** — only `https://simsdigitalpartners.com` and `www`.
- **Body-size cap** — reject oversized payloads before processing.
- **Max lengths** — enforced on every field in the validation schema.
- **Sanitized email output** — strip newlines from name/subject; HTML-escape all
  user values rendered into emails.
- **Least-privilege DB user** — app user is not root, scoped to the one schema.
- **Secrets hygiene** — `.env` on the VPS (gitignored) + GitHub Actions secrets;
  **nothing sensitive committed**. The API repo is **private**.
- **Generic client errors** — detailed errors only in server logs.
- **Container hardening** — non-root user, pinned base image, minimal final image.
- **Structured logging** — submissions (minus message body in logs), rejections,
  Turnstile failures, and email errors, with enough context to triage abuse.

## Configuration / secrets

API `.env` (on VPS only; documented by `.env.example` with placeholder values):

- `DATABASE_URL` (or discrete `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME`)
- `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD` (compose)
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `NOTIFY_TO=info@simsdigitalpartners.com`
- `MAIL_FROM=no-reply@simsdigitalpartners.com`
- `ALLOWED_ORIGINS=https://simsdigitalpartners.com,https://www.simsdigitalpartners.com`
- `PORT=3000`

Frontend (this repo, build-time, **public** values only):

- `VITE_CONTACT_API_URL=https://api.simsdigitalpartners.com`
- `VITE_TURNSTILE_SITE_KEY=…` (public site key)

## Dev & deploy workflow

The three environments are distinct and one-directional:

```
WSL clone (~/workspace/sandbox/sdp-api)   ← develop, test locally
   │  git push
   ▼
GitHub private repo (source of truth)
   │  GitHub Actions
   ▼
VPS (deployed copy / running container)
```

Day-to-day loop for adding routes/forms later:

```
cd ~/workspace/sandbox/sdp-api
# make changes in WSL, test locally
git commit && git push        # → GitHub Actions deploys to the VPS
```

Deployment details:

- The API runs as its own Docker Compose stack on the VPS (api + mysql), joined to
  Caddy's network — mirroring the platform's per-app pattern.
- CI (GitHub Actions) typechecks/builds/tests on push, then **deploys to the VPS**.
  All credentials come from **GitHub Actions secrets**; none are committed. Exact
  deploy mechanism (build image → registry → VPS pull, vs. VPS pull + compose build)
  finalized in the implementation plan.
- DB migrations run via Drizzle on deploy (a migrate step before app start).
- The MySQL named volume is included in the VPS backup routine.
- The website (this repo) is rebuilt and re-uploaded to Hostinger once it points at
  the API; no other Hostinger change.

## Error handling & resilience

- DB unreachable → request fails with a generic 5xx; client shows a retry message;
  nothing is silently lost (user can resubmit).
- Resend failure → submission still succeeds (already persisted); error logged.
- Turnstile/validation failure → 4xx with a friendly, non-leaky message.
- Honeypot triggered → fake 200, row silently discarded.

## Testing strategy

- **API unit tests:** validation schema (accept/reject + max lengths), sanitizer
  (newline strip + HTML escape), Turnstile verifier (mock success/failure),
  honeypot logic, CORS origin checks.
- **API integration tests:** `POST /contact` happy path writes a row (test DB) and
  calls the mailer (mocked); rejection paths (bad Turnstile, oversized body, rate
  limit, invalid payload) return correct status codes and don't write rows.
- **Frontend:** form submit success/error state transitions; payload shape matches
  the API contract.
- **Manual smoke test:** real submission through the deployed stack end-to-end
  (DB row present, both emails delivered).

## Open items for the implementation plan

- Finalize the exact CI/CD deploy mechanism (registry vs. on-VPS build).
- Confirm Turnstile widget appearance in the dark theme.
- Decide the migration-run trigger (compose entrypoint vs. CI step).
