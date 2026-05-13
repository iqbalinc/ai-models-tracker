# AI Models Tracker

A responsive web app that tracks 90+ foundation AI models by company, country, and category — with automated weekly updates via AI scraping.

**Runs on:** Browser · Mobile · Tablet · Desktop  
**Updated:** Every Monday automatically via GitHub Actions  
**Stack:** Next.js 15 · Supabase · OpenAI · Vercel · Tailwind CSS

---

## Features

- Filter by country, category, company, or free-text search
- Table view (desktop) and card view (mobile)
- Donut chart breakdown by model category
- Stats grid (total models, open-source %, countries, top category)
- Weekly auto-update: GPT scrapes Wikipedia + LLMIndex, identifies new models, upserts to DB
- Works without a database (falls back to seed data automatically)

---

## Local Setup

### 1. Clone and install

```bash
cd ai-models-tracker
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste and run `supabase/schema.sql`
3. Copy your credentials from **Project Settings → API**

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Fill in the values in .env.local
```

Required values:
| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `REFRESH_SECRET` | Any random string (e.g. `openssl rand -hex 32`) |

### 4. Seed the database

```bash
npm run seed
```

### 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

During setup, add all environment variables from `.env.local`.

Or use the Vercel dashboard: **Project → Settings → Environment Variables**.

---

## Set Up Weekly Auto-Updates (GitHub Actions)

1. Push this repo to GitHub
2. Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `REFRESH_SECRET` | Same value as your `.env.local` `REFRESH_SECRET` |
| `APP_URL` | Your Vercel deployment URL (e.g. `https://ai-models-tracker.vercel.app`) |

3. The workflow runs every **Monday at 8:00 AM UTC** automatically.
4. To trigger manually: **Actions → Weekly AI Models Refresh → Run workflow**.

If a run fails, a GitHub Issue is created automatically.

---

## How the Weekly Update Works

```
GitHub Actions (Monday 8am UTC)
  └─► POST /api/refresh  (with x-refresh-secret header)
        ├─► Fetch Wikipedia "List of large language models" via API
        ├─► Fetch LLMIndex models page
        ├─► Send to GPT-4o-mini: "What new models aren't in our DB yet?"
        ├─► Parse structured JSON response (company, model, category, description…)
        └─► Upsert new rows into Supabase (skip duplicates)
```

Cost estimate: ~$0.01–0.05 per weekly run with GPT-4o-mini.

---

## Project Structure

```
ai-models-tracker/
├── app/
│   ├── page.tsx              ← Server component, fetches data
│   ├── ModelExplorer.tsx     ← Client component, handles filtering
│   ├── loading.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── models/route.ts   ← GET /api/models
│       └── refresh/route.ts  ← POST /api/refresh (cron target)
├── components/
│   ├── Header.tsx
│   ├── StatsGrid.tsx
│   ├── FilterBar.tsx
│   ├── ModelTable.tsx        ← Desktop table view
│   ├── ModelCard.tsx         ← Mobile card view
│   └── CategoryChart.tsx     ← Recharts donut chart
├── lib/
│   ├── types.ts              ← Shared TypeScript types
│   ├── supabase.ts           ← Browser + admin Supabase clients
│   ├── scraper.ts            ← Wikipedia + LLMIndex fetchers
│   ├── ai-updater.ts         ← GPT-4o-mini model identifier
│   └── seed-data.ts          ← 90+ initial models
├── supabase/
│   └── schema.sql            ← Run once in Supabase SQL Editor
├── scripts/
│   └── seed.ts               ← One-time DB seeder (npm run seed)
└── .github/
    └── workflows/
        └── weekly-refresh.yml
```
