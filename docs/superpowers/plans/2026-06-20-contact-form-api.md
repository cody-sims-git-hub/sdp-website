# Contact Form API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website's `mailto:` contact form with a real pipeline — the static site POSTs to a new VPS API that validates, stores submissions in MySQL, and sends email via Resend (notify Cody + auto-reply to submitter).

**Architecture:** A new private Node/TypeScript (Hono) service runs on the VPS behind Caddy at `api.simsdigitalpartners.com`, backed by a MySQL 8 container (Drizzle ORM). The website (this repo) is updated to POST JSON with a Cloudflare Turnstile token. Two deliverables in two repos, built in order: API first (independently testable), then the frontend wiring, then an end-to-end smoke test.

**Tech Stack:** Node 20+, Hono, `@hono/node-server`, Drizzle ORM + `mysql2`, `drizzle-kit`, Zod, Resend SDK, Pino, Vitest, Docker Compose, GitHub Actions, Caddy. Frontend: React Router 7 + TypeScript (existing).

## Global Constraints

- **API repo is private**, developed in WSL at `~/workspace/sandbox/sdp-api`, source of truth on GitHub, deployed to the VPS by GitHub Actions. Dev loop: edit/test in WSL → `git commit && git push` → Actions deploys.
- **No secrets in Git, ever.** Real values live only in `.env` on the VPS and in GitHub Actions secrets. Commit only `.env.example` with placeholders.
- **Run Node/npm inside WSL**, never the Windows host over the UNC path. Node via nvm.
- **Sender:** `no-reply@simsdigitalpartners.com` (Resend, domain already verified). **Notification recipient:** `info@simsdigitalpartners.com`.
- **Rate limit:** 5 submissions per IP per 10 minutes (conservative start).
- **`GET /health`** returns exactly `{ "status": "ok" }` — no DB status, versions, uptime, env, paths, or stack traces.
- **CORS allowlist:** `https://simsdigitalpartners.com`, `https://www.simsdigitalpartners.com` only.
- **Field max lengths:** name ≤120, email ≤254, subject ≤200, message ≤5000.
- **No SQL injection:** Drizzle parameterized queries only. **Sanitize email output:** strip newlines from name/subject, HTML-escape all user values rendered into emails.
- **The website (this repo) has no test framework** (typecheck is the only gate) — do not add one; frontend tasks verify via `npm run typecheck` + manual dev-server check. The API repo uses Vitest.
- TLS terminated by Caddy; the API container listens on plain HTTP `:3000` on the internal Docker network only.

---

## File Structure

**New API repo (`~/workspace/sandbox/sdp-api`):**
```
src/
  index.ts              # bootstrap: load config, build app, start server
  app.ts                # buildApp(deps) → Hono instance (middleware + routes)
  config.ts             # loadConfig(): Config (Zod-validated env)
  routes/
    health.ts           # GET /health
    contact.ts          # POST /contact
  middleware/
    rate-limit.ts       # checkRateLimit() + rateLimitMiddleware()
  lib/
    validation.ts       # contactSchema, ContactInput
    sanitize.ts         # stripNewlines(), escapeHtml()
    turnstile.ts        # verifyTurnstile()
    mailer.ts           # Mailer: sendNotification(), sendAutoReply()
    logger.ts           # pino logger
  db/
    client.ts           # createDb() → Drizzle instance + pool
    schema.ts           # submissions table
    repo.ts             # insertSubmission()
    migrate.ts          # standalone migration runner (container entrypoint)
drizzle/                # generated SQL migrations
drizzle.config.ts
vitest.config.ts
tsconfig.json
tsup.config.ts
package.json
Dockerfile
docker-compose.yml
.dockerignore
.gitignore
.env.example
.github/workflows/deploy.yml
README.md
```

**Website repo (this repo):**
```
app/lib/contact-config.ts     # NEW: reads VITE_ env (API url, turnstile site key)
app/lib/contact-api.ts        # NEW: submitContact() typed client
app/components/turnstile.tsx  # NEW: Turnstile widget React component
app/components/contact-form.tsx  # MODIFY: fetch POST + states + Turnstile
.env.example                  # NEW/MODIFY: document VITE_CONTACT_API_URL, VITE_TURNSTILE_SITE_KEY
```

---

# PHASE A — API Service (new repo)

## Task A1: Scaffold the private repo and toolchain

**Files:**
- Create: `package.json`, `tsconfig.json`, `.gitignore`, `.env.example`, `vitest.config.ts`, `README.md`

**Interfaces:**
- Produces: an installable, typecheckable, testable empty project; npm scripts `dev`, `build`, `typecheck`, `test`, `migrate`, `db:generate`.

- [ ] **Step 1: Create the repo directory and git init (in WSL)**

```bash
mkdir -p ~/workspace/sandbox/sdp-api && cd ~/workspace/sandbox/sdp-api
git init -q
```

- [ ] **Step 2: Initialize package.json**

Create `package.json`:

```json
{
  "name": "sdp-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "migrate": "node dist/migrate.js"
  }
}
```

- [ ] **Step 3: Install dependencies (in WSL)**

```bash
cd ~/workspace/sandbox/sdp-api
npm install hono @hono/node-server drizzle-orm mysql2 zod resend pino
npm install -D typescript tsx tsup vitest drizzle-kit @types/node
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": true
  },
  "include": ["src", "*.config.ts"]
}
```

- [ ] **Step 5: Create tsup.config.ts**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/db/migrate.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  splitting: false,
});
```

- [ ] **Step 6: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 7: Create .gitignore**

```
node_modules
dist
.env
.env.*
!.env.example
*.log
```

- [ ] **Step 8: Create .env.example (placeholders only — NEVER real values)**

```
# App
PORT=3000
ALLOWED_ORIGINS=https://simsdigitalpartners.com,https://www.simsdigitalpartners.com

# Database (app user — NOT root)
DATABASE_URL=mysql://sdp_app:CHANGE_ME@db:3306/sdp

# MySQL container (compose)
MYSQL_ROOT_PASSWORD=CHANGE_ME
MYSQL_DATABASE=sdp
MYSQL_USER=sdp_app
MYSQL_PASSWORD=CHANGE_ME

# Email (Resend)
RESEND_API_KEY=CHANGE_ME
MAIL_FROM=no-reply@simsdigitalpartners.com
NOTIFY_TO=info@simsdigitalpartners.com

# Cloudflare Turnstile (secret — public site key lives in the website build)
TURNSTILE_SECRET_KEY=CHANGE_ME
```

- [ ] **Step 9: Create README.md**

````markdown
# sdp-api

Contact-form API for simsdigitalpartners.com. Node + Hono + Drizzle (MySQL) + Resend.

## Dev
```bash
npm install
cp .env.example .env   # fill in local values
npm run dev
```

## Test / typecheck
```bash
npm run test
npm run typecheck
```

Deployed to the VPS by GitHub Actions on push to `main`. Secrets live only in
`.env` on the VPS and in GitHub Actions secrets — never committed.
````

- [ ] **Step 10: Verify typecheck runs on the empty project**

Run: `cd ~/workspace/sandbox/sdp-api && npm run typecheck`
Expected: exits 0 (no `src` files yet → no errors).

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "chore: scaffold sdp-api toolchain"
```

---

## Task A2: Config loader (Zod-validated env)

**Files:**
- Create: `src/config.ts`, `src/config.test.ts`

**Interfaces:**
- Produces: `type Config` and `loadConfig(env = process.env): Config` with fields
  `port: number`, `allowedOrigins: string[]`, `databaseUrl: string`,
  `resendApiKey: string`, `mailFrom: string`, `notifyTo: string`,
  `turnstileSecret: string`. Throws if a required var is missing.

- [ ] **Step 1: Write the failing test**

`src/config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { loadConfig } from "./config.js";

const base = {
  PORT: "3000",
  ALLOWED_ORIGINS: "https://a.com,https://b.com",
  DATABASE_URL: "mysql://u:p@db:3306/sdp",
  RESEND_API_KEY: "re_test",
  MAIL_FROM: "no-reply@x.com",
  NOTIFY_TO: "info@x.com",
  TURNSTILE_SECRET_KEY: "ts_secret",
};

describe("loadConfig", () => {
  it("parses a full env", () => {
    const c = loadConfig(base);
    expect(c.port).toBe(3000);
    expect(c.allowedOrigins).toEqual(["https://a.com", "https://b.com"]);
    expect(c.databaseUrl).toBe("mysql://u:p@db:3306/sdp");
  });

  it("throws when a required var is missing", () => {
    const { RESEND_API_KEY, ...rest } = base;
    expect(() => loadConfig(rest)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- config`
Expected: FAIL (cannot find `./config.js`).

- [ ] **Step 3: Implement src/config.ts**

```ts
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGINS: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  MAIL_FROM: z.string().min(1),
  NOTIFY_TO: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
});

export interface Config {
  port: number;
  allowedOrigins: string[];
  databaseUrl: string;
  resendApiKey: string;
  mailFrom: string;
  notifyTo: string;
  turnstileSecret: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const p = schema.parse(env);
  return {
    port: p.PORT,
    allowedOrigins: p.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
    databaseUrl: p.DATABASE_URL,
    resendApiKey: p.RESEND_API_KEY,
    mailFrom: p.MAIL_FROM,
    notifyTo: p.NOTIFY_TO,
    turnstileSecret: p.TURNSTILE_SECRET_KEY,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- config`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Zod-validated config loader"
```

---

## Task A3: Logger

**Files:**
- Create: `src/lib/logger.ts`

**Interfaces:**
- Produces: `export const logger` (Pino). JSON logs to stdout.

- [ ] **Step 1: Implement src/lib/logger.ts**

```ts
import { pino } from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: undefined, // no pid/hostname noise
});
```

- [ ] **Step 2: Verify it typechecks**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: pino logger"
```

---

## Task A4: Sanitization helpers

**Files:**
- Create: `src/lib/sanitize.ts`, `src/lib/sanitize.test.ts`

**Interfaces:**
- Produces: `stripNewlines(s: string): string` (collapses CR/LF to a space, trims),
  `escapeHtml(s: string): string` (escapes `& < > " '`).

- [ ] **Step 1: Write the failing test**

`src/lib/sanitize.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { stripNewlines, escapeHtml } from "./sanitize.js";

describe("stripNewlines", () => {
  it("removes CR/LF used for header injection", () => {
    expect(stripNewlines("Subject\r\nBcc: evil@x.com")).toBe("Subject Bcc: evil@x.com");
  });
  it("trims", () => {
    expect(stripNewlines("  hi  ")).toBe("hi");
  });
});

describe("escapeHtml", () => {
  it("escapes html-significant chars", () => {
    expect(escapeHtml(`<b>"a"&'b'</b>`)).toBe("&lt;b&gt;&quot;a&quot;&amp;&#39;b&#39;&lt;/b&gt;");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- sanitize`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement src/lib/sanitize.ts**

```ts
export function stripNewlines(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

const MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => MAP[c]!);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- sanitize`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: sanitize helpers (newline strip + html escape)"
```

---

## Task A5: Validation schema

**Files:**
- Create: `src/lib/validation.ts`, `src/lib/validation.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `contactSchema` (Zod) and `type ContactInput = { name; email; subject; message; turnstileToken; website }`.
  - `name` 1–120, `email` valid + ≤254, `subject` ≤200 (optional → defaults `""`),
    `message` 1–5000, `turnstileToken` non-empty string, `website` honeypot optional string (default `""`).
  - `parseContact(body: unknown)` returns `{ success: true; data } | { success: false; errors }`.

- [ ] **Step 1: Write the failing test**

`src/lib/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseContact } from "./validation.js";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  subject: "Hello",
  message: "I have a project.",
  turnstileToken: "tok",
};

describe("parseContact", () => {
  it("accepts a valid payload and defaults subject/website", () => {
    const r = parseContact({ ...valid, subject: undefined });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.subject).toBe("");
      expect(r.data.website).toBe("");
    }
  });

  it("rejects a too-long message", () => {
    const r = parseContact({ ...valid, message: "x".repeat(5001) });
    expect(r.success).toBe(false);
  });

  it("rejects a bad email", () => {
    const r = parseContact({ ...valid, email: "nope" });
    expect(r.success).toBe(false);
  });

  it("rejects a missing turnstile token", () => {
    const { turnstileToken, ...rest } = valid;
    const r = parseContact(rest);
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- validation`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement src/lib/validation.ts**

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  turnstileToken: z.string().min(1),
  website: z.string().max(0).optional().default(""), // honeypot: must be empty
});

export type ContactInput = z.infer<typeof contactSchema>;

type ParseResult =
  | { success: true; data: ContactInput }
  | { success: false; errors: Record<string, string[]> };

export function parseContact(body: unknown): ParseResult {
  const r = contactSchema.safeParse(body);
  if (r.success) return { success: true, data: r.data };
  return { success: false, errors: r.error.flatten().fieldErrors };
}
```

Note: the honeypot is enforced two ways — `website` must be empty to *validate*, and the route also treats a filled honeypot as a silent fake-success (Task A9) before validation. Keeping `max(0)` here is defense-in-depth.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- validation`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: contact payload validation schema"
```

---

## Task A6: Turnstile verifier

**Files:**
- Create: `src/lib/turnstile.ts`, `src/lib/turnstile.test.ts`

**Interfaces:**
- Produces: `verifyTurnstile(token: string, secret: string, remoteIp?: string, fetchImpl?: typeof fetch): Promise<boolean>`.
  POSTs form-encoded `secret`/`response`/`remoteip` to Cloudflare siteverify; returns `json.success === true`. Returns `false` on any network/parse error.

- [ ] **Step 1: Write the failing test**

`src/lib/turnstile.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { verifyTurnstile } from "./turnstile.js";

function fakeFetch(ok: boolean): typeof fetch {
  return vi.fn(async () =>
    new Response(JSON.stringify({ success: ok }), { status: 200 }),
  ) as unknown as typeof fetch;
}

describe("verifyTurnstile", () => {
  it("returns true when Cloudflare says success", async () => {
    expect(await verifyTurnstile("tok", "secret", "1.2.3.4", fakeFetch(true))).toBe(true);
  });
  it("returns false when Cloudflare says failure", async () => {
    expect(await verifyTurnstile("tok", "secret", undefined, fakeFetch(false))).toBe(false);
  });
  it("returns false when fetch throws", async () => {
    const throwing = (() => { throw new Error("net"); }) as unknown as typeof fetch;
    expect(await verifyTurnstile("tok", "secret", undefined, throwing)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- turnstile`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement src/lib/turnstile.ts**

```ts
const ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetchImpl(ENDPOINT, { method: "POST", body });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- turnstile`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Cloudflare Turnstile verifier"
```

---

## Task A7: Rate limiter

**Files:**
- Create: `src/middleware/rate-limit.ts`, `src/middleware/rate-limit.test.ts`

**Interfaces:**
- Produces:
  - `checkRateLimit(store: Map<string, number[]>, key: string, now: number, windowMs: number, max: number): boolean` — pure; returns `true` if allowed and records the hit, `false` if over the limit. Prunes timestamps older than the window.
  - `createRateLimit(windowMs: number, max: number)` → a Hono middleware that keys by client IP (`x-forwarded-for` first hop, else connection) and returns a generic `429` when blocked.

- [ ] **Step 1: Write the failing test**

`src/middleware/rate-limit.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limit.js";

describe("checkRateLimit", () => {
  it("allows up to max within the window then blocks", () => {
    const store = new Map<string, number[]>();
    const now = 1000;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(store, "ip", now, 600_000, 5)).toBe(true);
    }
    expect(checkRateLimit(store, "ip", now, 600_000, 5)).toBe(false);
  });

  it("frees up slots once old hits fall outside the window", () => {
    const store = new Map<string, number[]>();
    for (let i = 0; i < 5; i++) checkRateLimit(store, "ip", 0, 600_000, 5);
    expect(checkRateLimit(store, "ip", 0, 600_000, 5)).toBe(false);
    // 10 minutes + 1ms later, the earlier hits expire
    expect(checkRateLimit(store, "ip", 600_001, 600_000, 5)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- rate-limit`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement src/middleware/rate-limit.ts**

```ts
import type { MiddlewareHandler } from "hono";

export function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  now: number,
  windowMs: number,
  max: number,
): boolean {
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    store.set(key, hits);
    return false;
  }
  hits.push(now);
  store.set(key, hits);
  return true;
}

function clientIp(forwarded: string | undefined): string {
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0]!.trim();
}

export function createRateLimit(windowMs: number, max: number): MiddlewareHandler {
  const store = new Map<string, number[]>();
  return async (c, next) => {
    const ip = clientIp(c.req.header("x-forwarded-for"));
    if (!checkRateLimit(store, ip, Date.now(), windowMs, max)) {
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }
    await next();
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- rate-limit`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: in-memory per-IP rate limiter (5/10min)"
```

---

## Task A8: Database schema, client, repo, and migration generation

**Files:**
- Create: `src/db/schema.ts`, `src/db/client.ts`, `src/db/repo.ts`, `src/db/migrate.ts`, `drizzle.config.ts`
- Create (generated): `drizzle/*.sql`

**Interfaces:**
- Produces:
  - `submissions` Drizzle table (columns per spec).
  - `type NewSubmission = { name; email; subject; message; source; ip; userAgent }`.
  - `createDb(databaseUrl: string)` → `{ db, pool }` (Drizzle `mysql2` instance + pool).
  - `insertSubmission(db, row: NewSubmission): Promise<number>` (returns insert id).
  - `runMigrations(databaseUrl: string): Promise<void>`.

- [ ] **Step 1: Implement src/db/schema.ts**

```ts
import {
  mysqlTable,
  bigint,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

export const submissions = mysqlTable(
  "submissions",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    subject: varchar("subject", { length: 200 }).notNull().default(""),
    message: text("message").notNull(),
    status: mysqlEnum("status", ["new", "read", "archived"]).notNull().default("new"),
    source: varchar("source", { length: 64 }).notNull().default("contact_form"),
    ip: varchar("ip", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("submissions_created_at_idx").on(t.createdAt),
    emailIdx: index("submissions_email_idx").on(t.email),
  }),
);

export type NewSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  ip: string | null;
  userAgent: string | null;
};
```

- [ ] **Step 2: Implement src/db/client.ts**

```ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export function createDb(databaseUrl: string) {
  const pool = mysql.createPool(databaseUrl);
  const db = drizzle(pool);
  return { db, pool };
}

export type Db = ReturnType<typeof createDb>["db"];
```

- [ ] **Step 3: Implement src/db/repo.ts**

```ts
import type { Db } from "./client.js";
import { submissions, type NewSubmission } from "./schema.js";

export async function insertSubmission(db: Db, row: NewSubmission): Promise<number> {
  const [result] = await db.insert(submissions).values(row);
  // mysql2 returns ResultSetHeader with insertId
  return (result as unknown as { insertId: number }).insertId;
}
```

- [ ] **Step 4: Implement src/db/migrate.ts (container entrypoint runner)**

```ts
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

export async function runMigrations(databaseUrl: string): Promise<void> {
  const pool = mysql.createPool(databaseUrl);
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await pool.end();
}

// Executed directly by the container before the server starts.
if (process.argv[1] && process.argv[1].endsWith("migrate.js")) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for migrations");
  runMigrations(url)
    .then(() => { console.log(JSON.stringify({ msg: "migrations applied" })); process.exit(0); })
    .catch((err) => { console.error(JSON.stringify({ msg: "migration failed", err: String(err) })); process.exit(1); });
}
```

- [ ] **Step 5: Implement drizzle.config.ts**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL ?? "mysql://root:root@localhost:3306/sdp" },
});
```

- [ ] **Step 6: Generate the SQL migration**

Run: `cd ~/workspace/sandbox/sdp-api && npm run db:generate`
Expected: a new file under `drizzle/0000_*.sql` creating the `submissions` table + indexes. (No DB connection needed for `generate`.)

- [ ] **Step 7: Verify typecheck**

Run: `npm run typecheck`
Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: MySQL schema, client, repo, migration runner"
```

---

## Task A9: Mailer (Resend)

**Files:**
- Create: `src/lib/mailer.ts`, `src/lib/mailer.test.ts`

**Interfaces:**
- Consumes: `escapeHtml`, `stripNewlines` (A4); `Config` fields `mailFrom`, `notifyTo`, `resendApiKey`.
- Produces:
  - `type SubmissionEmail = { name; email; subject; message; createdAt: Date }`.
  - `createMailer(opts: { apiKey; from; notifyTo; send?: SendFn }): Mailer` where
    `Mailer = { sendNotification(s): Promise<void>; sendAutoReply(s): Promise<void> }`.
  - `SendFn = (msg: { from; to; subject; html; replyTo? }) => Promise<void>`.
  - Injecting `send` allows tests without hitting Resend.

- [ ] **Step 1: Write the failing test**

`src/lib/mailer.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { createMailer } from "./mailer.js";

const sub = {
  name: "Ada <script>",
  email: "ada@example.com",
  subject: "Hi\r\nBcc: x",
  message: "Hello & <b>welcome</b>",
  createdAt: new Date("2026-06-20T00:00:00Z"),
};

describe("mailer", () => {
  it("notification escapes html, strips newline subject, sets reply-to to submitter", async () => {
    const send = vi.fn(async () => {});
    const m = createMailer({ apiKey: "k", from: "no-reply@x.com", notifyTo: "info@x.com", send });
    await m.sendNotification(sub);
    const msg = send.mock.calls[0]![0];
    expect(msg.to).toBe("info@x.com");
    expect(msg.from).toBe("no-reply@x.com");
    expect(msg.replyTo).toBe("ada@example.com");
    expect(msg.html).toContain("Ada &lt;script&gt;");
    expect(msg.html).not.toContain("<script>");
    expect(msg.subject).not.toContain("\n");
  });

  it("auto-reply goes to the submitter from no-reply", async () => {
    const send = vi.fn(async () => {});
    const m = createMailer({ apiKey: "k", from: "no-reply@x.com", notifyTo: "info@x.com", send });
    await m.sendAutoReply(sub);
    const msg = send.mock.calls[0]![0];
    expect(msg.to).toBe("ada@example.com");
    expect(msg.from).toBe("no-reply@x.com");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- mailer`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement src/lib/mailer.ts**

```ts
import { Resend } from "resend";
import { escapeHtml, stripNewlines } from "./sanitize.js";

export interface SubmissionEmail {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export type SendFn = (msg: {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) => Promise<void>;

export interface Mailer {
  sendNotification(s: SubmissionEmail): Promise<void>;
  sendAutoReply(s: SubmissionEmail): Promise<void>;
}

export function createMailer(opts: {
  apiKey: string;
  from: string;
  notifyTo: string;
  send?: SendFn;
}): Mailer {
  const send: SendFn =
    opts.send ??
    (async (msg) => {
      const resend = new Resend(opts.apiKey);
      await resend.emails.send({
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        replyTo: msg.replyTo,
      });
    });

  return {
    async sendNotification(s) {
      const subject = stripNewlines(s.subject) || `New contact from ${stripNewlines(s.name)}`;
      const html = `
        <h2>New contact submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(s.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(s.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(stripNewlines(s.subject))}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(s.message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Received ${s.createdAt.toISOString()} · source: contact_form</small></p>`;
      await send({ from: opts.from, to: opts.notifyTo, subject: `[Contact] ${subject}`, html, replyTo: s.email });
    },

    async sendAutoReply(s) {
      const html = `
        <p>Hi ${escapeHtml(stripNewlines(s.name))},</p>
        <p>Thanks for reaching out to Sims Digital Partners — we've received your
        message and Cody will be in touch soon.</p>
        <p>For reference, here's what you sent:</p>
        <blockquote>${escapeHtml(s.message).replace(/\n/g, "<br>")}</blockquote>
        <p>— Sims Digital Partners</p>`;
      await send({ from: opts.from, to: s.email, subject: "Thanks for contacting Sims Digital Partners", html });
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- mailer`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Resend mailer (notification + auto-reply)"
```

---

## Task A10: Routes + app assembly

**Files:**
- Create: `src/routes/health.ts`, `src/routes/contact.ts`, `src/app.ts`, `src/app.test.ts`

**Interfaces:**
- Consumes: everything above + `Mailer` (A9), `Db`/`insertSubmission` (A8), `verifyTurnstile` (A6), `parseContact` (A5), `createRateLimit` (A7), `Config` (A2).
- Produces: `buildApp(deps: AppDeps): Hono` where
  `AppDeps = { config: Config; db: Db; mailer: Mailer; verify?: typeof verifyTurnstile }`.
  Routes: `GET /health` → `{ status: "ok" }`; `POST /contact` runs the full pipeline.

- [ ] **Step 1: Implement src/routes/health.ts**

```ts
import { Hono } from "hono";

export const health = new Hono();

health.get("/health", (c) => c.json({ status: "ok" }));
```

- [ ] **Step 2: Implement src/routes/contact.ts**

```ts
import { Hono } from "hono";
import type { Config } from "../config.js";
import type { Db } from "../db/client.js";
import type { Mailer } from "../lib/mailer.js";
import { parseContact } from "../lib/validation.js";
import { verifyTurnstile } from "../lib/turnstile.js";
import { insertSubmission } from "../db/repo.js";
import { logger } from "../lib/logger.js";

export interface ContactDeps {
  config: Config;
  db: Db;
  mailer: Mailer;
  verify?: typeof verifyTurnstile;
}

export function contactRoutes(deps: ContactDeps): Hono {
  const app = new Hono();
  const verify = deps.verify ?? verifyTurnstile;

  app.post("/contact", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const ip = (c.req.header("x-forwarded-for") ?? "").split(",")[0]?.trim() || null;
    const userAgent = c.req.header("user-agent") ?? null;

    // Honeypot: silently fake-success so bots don't learn they were caught.
    if (typeof body?.website === "string" && body.website.length > 0) {
      logger.info({ msg: "honeypot triggered", ip });
      return c.json({ ok: true });
    }

    const parsed = parseContact(body);
    if (!parsed.success) {
      return c.json({ error: "Please check the form and try again.", fields: parsed.errors }, 400);
    }

    const ok = await verify(parsed.data.turnstileToken, deps.config.turnstileSecret, ip ?? undefined);
    if (!ok) {
      return c.json({ error: "Verification failed. Please try again." }, 400);
    }

    let id: number;
    try {
      id = await insertSubmission(deps.db, {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        source: "contact_form",
        ip,
        userAgent: userAgent ? userAgent.slice(0, 512) : null,
      });
    } catch (err) {
      logger.error({ msg: "db insert failed", err: String(err) });
      return c.json({ error: "Something went wrong. Please try again." }, 500);
    }

    // Best-effort email; never fail the request if Resend hiccups.
    const emailPayload = {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      createdAt: new Date(),
    };
    void Promise.allSettled([
      deps.mailer.sendNotification(emailPayload),
      deps.mailer.sendAutoReply(emailPayload),
    ]).then((results) => {
      for (const r of results) {
        if (r.status === "rejected") logger.error({ msg: "email send failed", err: String(r.reason) });
      }
    });

    logger.info({ msg: "submission stored", id, ip });
    return c.json({ ok: true });
  });

  return app;
}
```

- [ ] **Step 3: Implement src/app.ts**

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import type { Config } from "./config.js";
import type { Db } from "./db/client.js";
import type { Mailer } from "./lib/mailer.js";
import type { verifyTurnstile } from "./lib/turnstile.js";
import { health } from "./routes/health.js";
import { contactRoutes } from "./routes/contact.js";
import { createRateLimit } from "./middleware/rate-limit.js";

export interface AppDeps {
  config: Config;
  db: Db;
  mailer: Mailer;
  verify?: typeof verifyTurnstile;
}

export function buildApp(deps: AppDeps): Hono {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: (origin) => (deps.config.allowedOrigins.includes(origin) ? origin : ""),
      allowMethods: ["POST", "GET", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    }),
  );

  app.route("/", health);

  app.use("/contact", bodyLimit({ maxSize: 64 * 1024 })); // 64 KB cap
  app.use("/contact", createRateLimit(10 * 60 * 1000, 5)); // 5 / 10 min
  app.route("/", contactRoutes(deps));

  return app;
}
```

- [ ] **Step 4: Write the failing app test**

`src/app.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { buildApp } from "./app.js";
import type { Config } from "./config.js";

const config: Config = {
  port: 3000,
  allowedOrigins: ["https://simsdigitalpartners.com"],
  databaseUrl: "mysql://x",
  resendApiKey: "k",
  mailFrom: "no-reply@x.com",
  notifyTo: "info@x.com",
  turnstileSecret: "secret",
};

function deps(over: Partial<Parameters<typeof buildApp>[0]> = {}) {
  const insert = vi.fn(async () => 1);
  const mailer = { sendNotification: vi.fn(async () => {}), sendAutoReply: vi.fn(async () => {}) };
  return {
    insert,
    mailer,
    app: buildApp({
      config,
      // db is only passed to insertSubmission, which we stub via verify path below
      db: { insert: () => ({ values: insert }) } as any,
      mailer,
      verify: (over.verify as any) ?? (async () => true),
      ...over,
    }),
  };
}

const valid = {
  name: "Ada",
  email: "ada@example.com",
  subject: "Hi",
  message: "Hello",
  turnstileToken: "tok",
};

describe("GET /health", () => {
  it("returns exactly { status: ok }", async () => {
    const { app } = deps();
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("POST /contact", () => {
  it("rejects a disallowed origin via CORS (no allow-origin header)", async () => {
    const { app } = deps();
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://evil.com" },
      body: JSON.stringify(valid),
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("silently fake-succeeds on honeypot", async () => {
    const { app, mailer } = deps();
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...valid, website: "spam" }),
    });
    expect(res.status).toBe(200);
    expect(mailer.sendNotification).not.toHaveBeenCalled();
  });

  it("400s on invalid payload", async () => {
    const { app } = deps();
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...valid, email: "nope" }),
    });
    expect(res.status).toBe(400);
  });

  it("400s when Turnstile fails", async () => {
    const { app } = deps({ verify: async () => false });
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valid),
    });
    expect(res.status).toBe(400);
  });

  it("stores and returns ok on the happy path", async () => {
    const { app, mailer } = deps();
    const res = await app.request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valid),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
```

Note: the `db` stub mimics `db.insert(...).values(...)` returning `[{ insertId: 1 }]` shape is simplified to the `insert` mock returning `1`; `insertSubmission` reads `result.insertId`, so the stub returns an array — adjust the stub to `insert: vi.fn(async () => [{ insertId: 1 }])` and `db: { insert: () => ({ values: insert }) }`. Verify the happy-path test passes with this wiring; if the shape mismatches, fix the stub (not the production code).

- [ ] **Step 5: Run test to verify it fails, then passes**

Run: `npm run test -- app`
Expected: initially FAIL (module not found), then PASS after Steps 1–3 exist. Fix the `db` stub shape as noted until the happy-path test passes (6 tests total).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: health + contact routes and app assembly (CORS, body cap, rate limit, honeypot, turnstile, store, email)"
```

---

## Task A11: Server entrypoint

**Files:**
- Create: `src/index.ts`

**Interfaces:**
- Consumes: `loadConfig`, `createDb`, `createMailer`, `buildApp`, `logger`.
- Produces: a running HTTP server on `config.port`.

- [ ] **Step 1: Implement src/index.ts**

```ts
import { serve } from "@hono/node-server";
import { loadConfig } from "./config.js";
import { createDb } from "./db/client.js";
import { createMailer } from "./lib/mailer.js";
import { buildApp } from "./app.js";
import { logger } from "./lib/logger.js";

const config = loadConfig();
const { db } = createDb(config.databaseUrl);
const mailer = createMailer({
  apiKey: config.resendApiKey,
  from: config.mailFrom,
  notifyTo: config.notifyTo,
});

const app = buildApp({ config, db, mailer });

serve({ fetch: app.fetch, port: config.port }, (info) => {
  logger.info({ msg: "sdp-api listening", port: info.port });
});
```

- [ ] **Step 2: Verify build + typecheck**

Run: `npm run typecheck && npm run build`
Expected: both exit 0; `dist/index.js` and `dist/migrate.js` exist.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: server entrypoint"
```

---

## Task A12: Local end-to-end run against a throwaway MySQL

**Files:** none (verification task)

**Interfaces:** confirms the built artifact boots, migrates, and serves locally.

- [ ] **Step 1: Start a throwaway MySQL (in WSL)**

```bash
docker run -d --name sdp-mysql-dev -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=sdp -e MYSQL_USER=sdp_app -e MYSQL_PASSWORD=devpass \
  -p 3307:3306 mysql:8
sleep 20
```

- [ ] **Step 2: Create a local .env (NOT committed)**

```bash
cat > .env <<'EOF'
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=mysql://sdp_app:devpass@127.0.0.1:3307/sdp
RESEND_API_KEY=re_local_unused
MAIL_FROM=no-reply@simsdigitalpartners.com
NOTIFY_TO=info@simsdigitalpartners.com
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
EOF
```

(`1x000…AA` is Cloudflare's documented "always passes" Turnstile test secret.)

- [ ] **Step 3: Build, migrate, run**

```bash
npm run build
env $(grep -v '^#' .env | xargs) node dist/migrate.js
env $(grep -v '^#' .env | xargs) node dist/index.js &
sleep 2
```

- [ ] **Step 4: Hit health and a contact submission**

```bash
curl -s localhost:3000/health
# Expected: {"status":"ok"}

curl -s -X POST localhost:3000/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","subject":"Hi","message":"Test","turnstileToken":"XXXX.DUMMY.TOKEN.XXXX"}'
# Expected: {"ok":true}  (Turnstile test secret always passes; email send will log a failure with the unused key — that's fine)
```

- [ ] **Step 5: Confirm the row landed**

```bash
docker exec sdp-mysql-dev mysql -usdp_app -pdevpass sdp -e "SELECT id,name,email,status,source FROM submissions;"
# Expected: one row, status=new, source=contact_form
```

- [ ] **Step 6: Tear down the dev DB and stop the server**

```bash
kill %1 2>/dev/null || true
docker rm -f sdp-mysql-dev
rm -f .env
```

- [ ] **Step 7: Commit (nothing to commit unless fixes were needed)**

If Steps 1–6 surfaced bugs, fix them under the relevant task's TDD cycle and commit there. Otherwise no commit.

---

## Task A13: Containerization (Dockerfile + compose)

**Files:**
- Create: `Dockerfile`, `.dockerignore`, `docker-compose.yml`

**Interfaces:**
- Produces: a non-root image that runs migrations then the server; a compose stack (`api` + `db`) joined to Caddy's external network.

- [ ] **Step 1: Create .dockerignore**

```
node_modules
dist
.git
.env
.env.*
*.log
```

- [ ] **Step 2: Create Dockerfile (multi-stage, non-root, pinned)**

```dockerfile
# ---- build ----
FROM node:20.18-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:20.18-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
USER node
EXPOSE 3000
# Run migrations, then start the server.
CMD ["sh", "-c", "node dist/migrate.js && node dist/index.js"]
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
services:
  api:
    build: .
    image: sdp-api:latest
    container_name: sdp-api
    restart: unless-stopped
    env_file: .env
    environment:
      DATABASE_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@db:3306/${MYSQL_DATABASE}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - default
      - caddy

  db:
    image: mysql:8.4
    container_name: sdp-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - sdp-mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 5s
      timeout: 5s
      retries: 20
    networks:
      - default

volumes:
  sdp-mysql-data:

networks:
  caddy:
    external: true
```

Note: `caddy` is the external network Caddy already runs on. Confirm its real name on the VPS with `docker network ls` and set `external: true` with `name:` if it differs from `caddy`.

- [ ] **Step 4: Verify compose config parses**

Run: `docker compose config >/dev/null && echo OK`
Expected: `OK` (after creating a temporary `.env` from `.env.example` for interpolation; delete it after).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Dockerfile + compose (api + mysql, caddy network)"
```

---

## Task A14: Create the private GitHub repo and push

**Files:** none (infra)

**Interfaces:** publishes the repo as the source of truth.

- [ ] **Step 1: Create the private repo and push (in WSL)**

```bash
cd ~/workspace/sandbox/sdp-api
gh repo create sdp-api --private --source=. --remote=origin --push
```

Expected: repo created private; `main` pushed. Confirm with `gh repo view --json visibility -q .visibility` → `PRIVATE`.

- [ ] **Step 2: No commit needed** (push only).

---

## Task A15: CI/CD — GitHub Actions deploy to the VPS

**Files:**
- Create: `.github/workflows/deploy.yml`

**Decision (resolves the open item):** CI builds and tests, then deploys by SSHing to the VPS over Tailscale, doing a `git pull` + `docker compose up -d --build` in the deployed checkout. This avoids a container registry and matches the platform's on-VPS build pattern. The VPS holds the real `.env`; Actions never sees app secrets — only the Tailscale auth key and SSH access.

**Prerequisites (manual, one-time):**
- On the VPS: clone the repo to its deploy location and create `~/<deploy>/.env` with real values (Resend key, Turnstile secret, MySQL passwords). The deploy `git pull` updates code; `.env` stays put and untracked.
- GitHub repo secrets: `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET` (Tailscale OAuth client for ephemeral CI node) **or** `TS_AUTHKEY`; `VPS_SSH_HOST` (Tailscale hostname/IP), `VPS_SSH_USER`, `VPS_SSH_KEY` (private key authorized on the VPS), `VPS_DEPLOY_DIR`.

- [ ] **Step 1: Create .github/workflows/deploy.yml**

```yaml
name: deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Connect to Tailscale
        uses: tailscale/github-action@v3
        with:
          oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
          oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
          tags: tag:ci
      - name: Deploy over SSH
        env:
          KEY: ${{ secrets.VPS_SSH_KEY }}
          HOST: ${{ secrets.VPS_SSH_HOST }}
          USER: ${{ secrets.VPS_SSH_USER }}
          DIR: ${{ secrets.VPS_DEPLOY_DIR }}
        run: |
          mkdir -p ~/.ssh
          echo "$KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh -o StrictHostKeyChecking=accept-new -i ~/.ssh/id_ed25519 "$USER@$HOST" \
            "cd $DIR && git pull --ff-only && docker compose up -d --build && docker image prune -f"
```

- [ ] **Step 2: Verify the workflow file is valid YAML**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('OK')"`
Expected: `OK`.

- [ ] **Step 3: Commit and push to trigger CI (test job will run; deploy needs secrets set first)**

```bash
git add -A && git commit -m "ci: test + deploy-to-VPS over Tailscale SSH"
git push
```

- [ ] **Step 4: Set the GitHub secrets**

Set each secret listed in Prerequisites via `gh secret set <NAME>` (or the repo UI). Do this before relying on the deploy job. Re-run the workflow; confirm `test` passes and `deploy` completes.

---

## Task A16: First deploy + Caddy + DNS (infra wiring)

**Files:** Caddy config on the VPS (outside both repos).

**Interfaces:** brings `https://api.simsdigitalpartners.com` live.

- [ ] **Step 1: DNS** — create an `A` record `api.simsdigitalpartners.com` → the VPS public IP. Wait for it to resolve (`dig +short api.simsdigitalpartners.com`).

- [ ] **Step 2: VPS bootstrap** — on the VPS, clone the repo to the deploy dir, create `.env` with real values (app-user MySQL password ≠ root), and confirm the `caddy` external network name. Bring the stack up once manually:

```bash
git clone <repo-url> "$VPS_DEPLOY_DIR" && cd "$VPS_DEPLOY_DIR"
# create .env with real secrets (never committed)
docker compose up -d --build
docker compose ps        # api + db healthy
docker compose logs api  # "migrations applied" then "sdp-api listening"
```

- [ ] **Step 3: Add the Caddy block** — append to the Caddy config and reload:

```
api.simsdigitalpartners.com {
    reverse_proxy sdp-api:3000
}
```

Reload Caddy (e.g. `docker exec caddy caddy reload --config /etc/caddy/Caddyfile` or the platform's reload command). Caddy auto-provisions the TLS cert once DNS resolves.

- [ ] **Step 4: Verify public health**

Run: `curl -s https://api.simsdigitalpartners.com/health`
Expected: `{"status":"ok"}` over valid TLS.

- [ ] **Step 5: Verify a real submission end-to-end (live Turnstile not yet wired — use a direct curl with the test token only if the secret is still the test secret; otherwise defer the full check to Phase C smoke test).**

No commit (infra).

---

# PHASE B — Frontend Integration (this website repo)

> All Phase B work is in `~/workspace/sandbox/simsdigitalpartners`. Verification is `npm run typecheck` (run via the WSL wrapper from CLAUDE.md) + manual dev-server checks — this repo has no test framework; do not add one.

## Task B1: Contact config + typed API client

**Files:**
- Create: `app/lib/contact-config.ts`, `app/lib/contact-api.ts`
- Modify: `.env.example` (create if absent)

**Interfaces:**
- Produces:
  - `contactConfig = { apiUrl: string; turnstileSiteKey: string }` from `import.meta.env`.
  - `type ContactRequest = { name; email; subject; message; turnstileToken; website }`.
  - `type ContactResult = { ok: true } | { ok: false; message: string; fields?: Record<string,string[]> }`.
  - `submitContact(req: ContactRequest): Promise<ContactResult>`.

- [ ] **Step 1: Create app/lib/contact-config.ts**

```ts
export const contactConfig = {
  apiUrl: import.meta.env.VITE_CONTACT_API_URL ?? "",
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "",
};
```

- [ ] **Step 2: Create app/lib/contact-api.ts**

```ts
import { contactConfig } from "./contact-config";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
  website: string; // honeypot
}

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fields?: Record<string, string[]> };

export async function submitContact(req: ContactRequest): Promise<ContactResult> {
  try {
    const res = await fetch(`${contactConfig.apiUrl}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      fields?: Record<string, string[]>;
    };
    return { ok: false, message: data.error ?? "Something went wrong.", fields: data.fields };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
```

- [ ] **Step 3: Add/extend .env.example in the website repo**

```
VITE_CONTACT_API_URL=https://api.simsdigitalpartners.com
VITE_TURNSTILE_SITE_KEY=your_public_turnstile_site_key
```

- [ ] **Step 4: Typecheck**

Run (WSL wrapper): `... npm run typecheck`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add app/lib/contact-config.ts app/lib/contact-api.ts .env.example
git commit -m "feat: contact API client + config"
```

---

## Task B2: Turnstile widget component

**Files:**
- Create: `app/components/turnstile.tsx`

**Interfaces:**
- Produces: `<Turnstile siteKey onVerify onExpire? />` — loads the Cloudflare script once, renders the widget (dark theme), calls `onVerify(token)` when solved and `onExpire()` when the token expires. Also exposes a `resetTurnstile()` via a ref-less module function keyed by widget id.

- [ ] **Step 1: Create app/components/turnstile.tsx**

```tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function ensureScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", () => resolve(), { once: true });
    document.head.appendChild(s);
  });
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export function Turnstile({ siteKey, onVerify, onExpire }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureScript().then(() => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token: string) => onVerify(token),
        "expired-callback": () => onExpire?.(),
      });
    });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire]);

  return <div ref={ref} className="mt-2" />;
}
```

- [ ] **Step 2: Typecheck**

Run (WSL wrapper): `... npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/components/turnstile.tsx
git commit -m "feat: Cloudflare Turnstile widget component"
```

---

## Task B3: Rewrite ContactForm to POST with states + Turnstile

**Files:**
- Modify: `app/components/contact-form.tsx`

**Interfaces:**
- Consumes: `submitContact`, `ContactRequest` (B1); `Turnstile` (B2); `contactConfig` (B1); existing `gtagEvent` (`~/lib/analytics`).
- Produces: a form that validates client-side, requires a Turnstile token, POSTs JSON, and shows submitting/success/error states. Keeps the existing `email` prop (now used only as a fallback "email us directly" link in the error state).

- [ ] **Step 1: Replace app/components/contact-form.tsx**

```tsx
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { gtagEvent } from "~/lib/analytics";
import { Turnstile } from "~/components/turnstile";
import { contactConfig } from "~/lib/contact-config";
import { submitContact } from "~/lib/contact-api";

interface ContactFormProps {
  /** Fallback address shown if the API submission fails. */
  email: string;
  className?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ email, className }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [token, setToken] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Please complete the verification challenge.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    const result = await submitContact({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      turnstileToken: token,
      website,
    });
    if (result.ok) {
      gtagEvent("contact_submit", { method: "contact_form" });
      setStatus("success");
    } else {
      setError(result.message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center",
          className,
        )}
      >
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="mt-4 text-lg font-medium text-foreground">Message sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out — we've got your message and Cody will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-8",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required value={form.name} onChange={update("name")} placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" value={form.subject} onChange={update("subject")} placeholder="What's this about?" />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} value={form.message} onChange={update("message")} placeholder="Share a bit about your project or why you're reaching out." />
      </div>

      {/* Honeypot: visually hidden, off-screen, not announced. Bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Turnstile siteKey={contactConfig.turnstileSiteKey} onVerify={setToken} onExpire={() => setToken("")} />

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">
          {error}{" "}
          <a className="underline" href={`mailto:${email}`}>
            Or email us directly.
          </a>
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "submitting"}>
        <Send className="size-4" /> {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck**

Run (WSL wrapper): `... npm run typecheck`
Expected: exits 0.

- [ ] **Step 3: Manual dev-server check**

Run the dev server; load `/contact`. With `VITE_TURNSTILE_SITE_KEY` set to Cloudflare's test site key `1x00000000000000000000AA` and `VITE_CONTACT_API_URL` pointed at the live API, verify: the widget renders dark, the form submits, and the success panel appears. (Set these in a local `.env` for the website build.)

- [ ] **Step 4: Commit**

```bash
git add app/components/contact-form.tsx
git commit -m "feat: contact form posts to API with Turnstile + states"
```

---

# PHASE C — End-to-End Verification & Ship

## Task C1: Full end-to-end smoke test

**Files:** none (verification).

- [ ] **Step 1: Build the website with production env**

In the website repo, set `.env` with `VITE_CONTACT_API_URL=https://api.simsdigitalpartners.com` and the **real** Turnstile **site** key, then `npm run build` (WSL wrapper). Confirm the build succeeds and the keys are baked into the client bundle.

- [ ] **Step 2: Deploy the website to Hostinger** — upload `build/client/` as usual.

- [ ] **Step 3: Submit the real form** at `https://simsdigitalpartners.com/contact` with a real email you control. Solve the Turnstile challenge. Expect the success panel.

- [ ] **Step 4: Confirm storage** — on the VPS:

```bash
docker exec sdp-mysql mysql -usdp_app -p"$MYSQL_PASSWORD" sdp \
  -e "SELECT id,name,email,status,created_at FROM submissions ORDER BY id DESC LIMIT 3;"
```

Expected: your submission as the newest row, `status=new`.

- [ ] **Step 5: Confirm email** — verify the notification arrived at `info@simsdigitalpartners.com` (reply-to = your address) and the auto-reply arrived at your address from `no-reply@simsdigitalpartners.com`.

- [ ] **Step 6: Negative checks**
  - POST from a disallowed origin (e.g. `curl` with `Origin: https://evil.com`) → no `access-control-allow-origin` echoed.
  - Submit 6 times quickly from one IP → the 6th returns `429`.
  - Submit with the honeypot `website` field filled (via curl) → `{"ok":true}` but **no** new DB row.

- [ ] **Step 7: Done.** No code commit; this task is acceptance.

---

## Task C2: Decommission the old behavior & docs

**Files:**
- Modify: `CLAUDE.md` (website repo) — update the contact-form description.

- [ ] **Step 1: Update CLAUDE.md** — replace the "No-backend contact form" architecture note to describe the new pipeline: the form POSTs to `api.simsdigitalpartners.com` (separate private `sdp-api` repo: Node/Hono + MySQL + Resend), Turnstile-protected; the page's other `mailto:` links remain. Note that adding form fields means updating both the API validation/schema and the frontend client.

- [ ] **Step 2: Typecheck (sanity) and commit**

```bash
# WSL wrapper
git add CLAUDE.md
git commit -m "docs: contact form now posts to sdp-api (MySQL + Resend + Turnstile)"
```

- [ ] **Step 3: Push the website repo**

```bash
git push
```

---

## Self-Review Notes (addressed)

- **Spec coverage:** data flow (A10/A11), MySQL schema incl. status/source/ip/ua (A8), Resend notify+auto-reply with reply-to (A9), Turnstile (A6/B2), rate limit 5/10min (A7), CORS allowlist (A10), body cap (A10), honeypot (A5 + A10 + B3), max lengths + validation (A5), sanitized email output (A4/A9), least-priv DB user (A13 compose: app user, root separate; A16 reminder), secrets hygiene (.env.example only; A15 secrets), minimal /health (A10), non-root container + pinned base (A13), structured logging (A3 + route logs), Caddy block + DNS (A16), dev/deploy workflow (A14/A15), backups (volume noted; folded into A16 VPS routine), frontend states (B3) — all mapped.
- **Open items resolved:** CI/CD mechanism = Tailscale SSH + on-VPS compose build (A15); migration trigger = container CMD runs `migrate.js` before server (A8/A13); Turnstile dark theme = `theme: "dark"` (B2).
- **Type consistency:** `ContactInput` (A5) → used in routes (A10); `NewSubmission` (A8) → `insertSubmission` (A8) → route (A10); `Mailer`/`SubmissionEmail` (A9) → route (A10); `submitContact`/`ContactRequest`/`ContactResult` (B1) → ContactForm (B3); `Turnstile` props (B2) → ContactForm (B3). Consistent.
- **Known wiring caveat:** A10 Step 4's `db` stub shape must mirror `db.insert().values()` returning `[{ insertId }]`; flagged inline to fix the test stub (not production) until green.
