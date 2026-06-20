# Marketing Funnel MVP + Analytics Dashboard

A 3-step marketing funnel (quiz start → email capture → mock paywall) with
email-based user identity and an analytics dashboard covering funnel
conversion, traffic sources, and first/last-touch attribution.

## Stack

- **Next.js (App Router) + TypeScript** — funnel, dashboard, and API in one app
- **Neon** (serverless Postgres) + **Drizzle ORM**
- **Recharts** + **Tailwind CSS** for the dashboard
- **jose** JWT for funnel identity; **Basic Auth** for the dashboard

## How it works

### Identity & attribution

- Each anonymous visitor gets a `visitor_id` cookie. Every funnel entry creates
  a `visits` row capturing the UTM source/medium/campaign (`direct` when no UTM).
- On email submit:
  - **New email** → a `user` is created and its `first_touch_*` is frozen from
    the current visit's source.
  - **Existing email** → the user is recognized (returning) and a fresh JWT is
    issued. The anonymous visitor's visits/events are linked to the user.
- A signed **JWT** (`{ userId }`, httpOnly cookie) keeps the user recognized on
  future visits.

### Attribution model

- **First touch** = `users.first_touch_source` (immutable, set at registration).
- **Last touch** = source of the user's most recent visit (window function over
  `visits`).
- **New vs returning** is *derived* (not stored): a user's visits are ranked by
  `started_at`; rank 1 is the acquisition (new) visit, rank > 1 is returning.

### Events

Append-only `events` table, past-tense naming:
`quiz_started`, `email_submitted`, `paywall_visited`, `purchase_clicked`
(completion = `purchase_clicked` on the Pay button).

## Local setup

1. `npm install`
2. Create a free Neon project and copy the pooled connection string.
3. Copy `.env.example` to `.env.local` and fill it in:
   - `DATABASE_URL` — Neon pooled connection string
   - `JWT_SECRET` — 32+ random bytes (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `DASHBOARD_USER` / `DASHBOARD_PASS` — dashboard Basic Auth credentials
4. Push the schema: `npm run db:push`
5. `npm run dev` → funnel at `/`, dashboard at `/dashboard`

## Deploy (Vercel)

1. Push the repo to GitHub and import it in Vercel.
2. Add the same four env vars in Vercel → Project → Settings → Environment Variables.
3. Run `npm run db:push` once against the production `DATABASE_URL`.
4. Deploy. The funnel is at `/`, the dashboard at `/dashboard`.

## Test scenarios

Track funnel state by adding UTM params, e.g. `/?utm_source=google`.

1. **New user** — open `/?utm_source=google`, complete the funnel with a fresh
   email. The dashboard shows a new user and first-touch = `google`.
2. **Returning user** — reopen `/?utm_source=facebook` in the same browser and
   submit the *same* email. The user is recognized; last-touch becomes
   `facebook` while first-touch stays `google`.
3. **Dashboard accuracy** — the funnel counts equal the number of events fired.
4. **Attribution** — first-touch and last-touch differ once the source changes
   between visits.

## Testing

```bash
npm test            # Vitest unit tests (funnel metrics, filters, utm, email)
npm run smoke       # end-to-end funnel run against a running dev server
```

Unit tests cover the pure logic (conversion math, filter parsing, UTM, email
validation). `smoke.ts` drives the full new-user → returning-user flow over HTTP.

## Project structure

```
src/
  app/                pages (/ /email /paywall /dashboard) + API routes
  components/
    funnel/           funnel UI (shell, progress, paywall view)
    dashboard/        dashboard UI, grouped: charts/ tables/ timeline/ filters/ ...
  server/
    repositories/     data access (user/visit/event/visitor/analytics)
    services/         business logic (funnelService: tracking + identity)
  lib/                framework-free helpers (env, jwt, cookies, utm, metrics, ...)
  db/                 Drizzle schema + lazy Neon client
```

## Scaling note

Hot columns are indexed (`events.type`, `events.visit_id`, `events(user_id,
type)`, `visits(user_id, started_at)`, `visits.source`, `users.first_touch_source`).
For the MVP, events live in the same Postgres as users — fine at this volume.
At scale, partition `events` by `created_at`, move it to a dedicated analytics
store / read replica, or adopt a column store (e.g. ClickHouse).
