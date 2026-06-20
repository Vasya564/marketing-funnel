@AGENTS.md

# CLAUDE.md

Guidance for working in this repo.

## What this is

Marketing funnel MVP + analytics dashboard. A 3-step funnel
(quiz start → email capture → mock paywall) with email-based identity and a
dashboard covering funnel conversion, traffic sources, and first/last-touch
attribution. Built as a take-home assignment (Copymind Team).

## Stack

Next.js 16 (App Router) + TypeScript · Drizzle ORM + Neon (serverless Postgres)
· Recharts · Tailwind CSS v4 · `jose` JWT (funnel identity) · Basic Auth
(dashboard, via `src/proxy.ts`).

## Layout

- `src/app/` — pages (`/`, `/email`, `/paywall`, `/dashboard`) and API routes
  (`/api/track`, `/api/funnel/email`, `/api/dashboard/users/[id]`).
- `src/server/` — server-only logic, kept out of components:
  - `repositories/` — data access, one per aggregate (`user`, `visit`, `event`,
    `visitor`, `analytics`).
  - `services/` — business logic (`funnelService`: tracking + identity).
- `src/db/` — `schema.ts` (Drizzle tables + indexes), `index.ts` (lazy Neon
  client + Drizzle instance).
- `src/lib/` — framework-free helpers and constants (`env`, `routes`, `events`,
  `cookies`, `jwt`, `utm`, `metrics`, `filters`, `validation`, `cn`,
  `track-client`).
- `src/components/funnel/` — funnel UI; `src/components/dashboard/` — dashboard
  UI grouped by area (`charts/`, `tables/`, `timeline/`, `filters/`,
  `feedback/`, `common/`) plus its own `hooks/`. One component per file.
- `src/proxy.ts` — Basic Auth gate for `/dashboard` and `/api/dashboard`.

Route handlers stay thin: parse + cookies, delegate to a service; services
orchestrate repositories. Dashboard reads call `analyticsRepository` directly
(read model, no business logic).

## Conventions

- **Constants, not magic strings.** Event names live in the `FunnelEvent` enum
  (`src/lib/events.ts`); route/API paths in `src/lib/routes.ts`; cookie names in
  `src/lib/cookies.ts`. Reference these everywhere — never inline the literal.
- **Event names are past tense**, `<domain>_<verbPast>`:
  `quiz_started`, `email_submitted`, `paywall_visited`, `purchase_clicked`.
- **Derive state, don't store denormalized flags.** "New vs returning" is
  computed from visit order (`ROW_NUMBER()`), not a boolean column.
- **No mutable `let` reassignment, no non-null `!`.** Use `const`, early returns,
  type guards, and `??` defaults.
- **Lazy DB access.** Never touch `env.*` or build the Neon client at module load
  (it breaks `next build` page-data collection). Use `getDb()` / `getRawSql()`.
- **Comments explain "why", not "what".** Prefer better names over comments.
- **Env vars** go through `src/lib/env.ts` (throws if missing). Four required:
  `DATABASE_URL`, `JWT_SECRET`, `DASHBOARD_USER`, `DASHBOARD_PASS`.

## Common commands

```bash
npm run dev        # local dev server
npm run db:push    # push schema (incl. indexes) to the DB in .env.local
npm run db:studio  # Drizzle Studio
npm test           # Vitest unit tests (colocated *.test.ts)
npm run smoke      # end-to-end funnel smoke test against a running server
npm run build      # production build (also runs type-check)
npx tsc --noEmit   # type-check only
npx eslint src     # lint
```

## Two layers of auth — don't conflate them

- **Funnel identity** = email → signed JWT in an httpOnly cookie. Recognizes
  returning users; no password.
- **Dashboard access** = HTTP Basic Auth in `src/proxy.ts`, env credentials.
