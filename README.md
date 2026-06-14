# Tes Pauli

A web app for practicing the **Kraepelin / Pauli test** — a classic concentration and speed drill where you sum adjacent single-digit numbers column-by-column under time pressure.

The app runs in Indonesian (`id_ID`) and is built with Next.js 15 (App Router) + React 19 + Supabase + Tailwind CSS. Supabase Postgres is the single source of truth; the Supabase JS client (via `@supabase/ssr`) is the only database driver.

## Stack

- **Next.js 15.5** — App Router, Server Components, Server Actions
- **React 19**
- **TypeScript** with `strict: true`
- **Supabase** (Postgres + JS client + `@supabase/ssr`)
- **Tailwind CSS 3** with semantic color tokens
- **clsx + tailwind-merge** for the `cn()` utility
- **Vitest 4** (unit tests)
- **lucide-react** (icons)
- **Vercel Analytics + Speed Insights**

## Getting started

### Prerequisites

- Node.js **>= 20.9** (see `engines` in `package.json`)
- npm
- A Supabase project (free tier is fine)

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

```env
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-public-key>"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

Get both from: **Supabase dashboard → Project Settings → API**.

### 3. Set up the database

The schema lives in `supabase/migrations/`. Run the SQL in the Supabase dashboard:

1. Open **Supabase dashboard → SQL Editor**.
2. Paste the contents of `supabase/migrations/20260603_create_leaderboard_entries.sql`.
3. Click **Run**.

This drops the old Prisma-created `LeaderboardEntry` table (if present) and creates the lowercase `leaderboard_entries` table with permissive RLS (anyone can read and insert — there's no auth).

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint (via `next lint`) |
| `npm run typecheck` | `tsc --noEmit` type check |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:ui` | Vitest UI |
| `npm run analyze` | Production build with the bundle analyzer |

## Project layout

```
app/
  actions/              # Server Actions (leaderboard save + read)
  components/           # Shared client components (Navbar)
  leaderboard/          # /leaderboard route
  pauli/                # /pauli route + client components
  layout.tsx            # Root layout (server)
  page.tsx              # Home page
  globals.css
lib/
  pauli-game.ts         # Pure game logic (extracted, unit-tested)
  form-utils.ts         # getFormValue() helper
  utils.ts              # cn(), formatDate, formatPercent
src/lib/supabase/
  server.ts             # createServerClient() for server actions
supabase/
  migrations/           # SQL migration files
__tests__/              # Vitest suites
public/                 # Static assets (icon, etc.)
```

## How the test works

1. User opens `/pauli` → `PauliTest` generates 8 columns of 7 random digits **client-side** (no server roundtrip).
2. The user types answers (1 digit per row). For instant feedback the client locally checks each answer.
3. When the timer hits 0, the user enters their name in a modal. The client posts `{ name, columns, answers }` to `saveLeaderboardEntry`.
4. The server validates the shape (digits 0-9, no XSS in name, correct lengths), recomputes the score with `scoreFromAnswers()`, and inserts the row into `leaderboard_entries`.
5. The leaderboard is revalidated.

The score is bounded by the number of answers the user submitted (max 48 correct for a fully-answered 8×6 grid). The server recomputes the score from the submitted columns and answers, so users cannot inflate their score beyond their actual answers.

## Security headers

`next.config.ts` sets HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, a `Permissions-Policy` that disables camera/mic/geolocation/FLoC, and a strict CSP that allowlists Vercel Analytics + Supabase endpoints.

## Deployment

The app is Vercel-ready. Set the same Supabase environment variables and `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard. Run the SQL migration in the Supabase dashboard before the first deploy.

### SEO

Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml` point at the public site. After deployment, submit `https://your-domain.com/sitemap.xml` in Google Search Console and request indexing for the homepage.

### Supabase keep-alive

Free Supabase projects can be paused after low activity. This repo includes a Vercel Cron job in `vercel.json` that calls `/api/keepalive` once per day. The route performs a tiny read against `leaderboard_entries`, which keeps the project active without writing junk data.

In Vercel, set a random `CRON_SECRET` environment variable. Vercel Cron sends it as a bearer token automatically, and `/api/keepalive` rejects requests with the wrong token when the variable is configured.

If you do not host on Vercel, point another external scheduler at:

```text
GET https://your-domain.com/api/keepalive
Authorization: Bearer <CRON_SECRET>
```

## License

Private / unlicensed.
