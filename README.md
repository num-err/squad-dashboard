# Squad OS — Accountability Dashboard

A dashboard for a small job-search squad that keeps each other accountable. It tracks LeetCode practice, daily standups, LinkedIn posts, two-week sprint goals, and job/internship applications for each member, and uses Claude to write a weekly recap.

The data model mirrors the tables of a companion WhatsApp bot that members log activity through, so the dashboard can read the same records.

**Stack:** Next.js 16 · React · TypeScript · Tailwind CSS 4 · Prisma · SQLite · Recharts · Radix UI · Anthropic API (Claude Haiku)

---

## Features

- **Squad overview** — a card per member with streaks, problems solved, posts, and goal progress
- **Activity heatmap** — daily consistency at a glance
- **Sprint manager** — set, complete, and review goals per two-week sprint
- **Applications log** — track where each member applied and the status of each application
- **Member deep-dive** — one person's full history on a dedicated page
- **History charts** — trends over time with Recharts
- **AI weekly recap** — Claude Haiku summarizes the squad's week in plain English

## Pages

| Route | What it shows |
|---|---|
| `/` | Squad overview, heatmap, weekly AI recap |
| `/member/[name]` | One member's stats, goals, and applications |
| `/sprint` | Current sprint goals for everyone |
| `/history` | Charts of activity over time |

## API

| Route | Methods | Purpose |
|---|---|---|
| `/api/members` | GET | Aggregated stats for every member |
| `/api/leetcode` | GET, POST | LeetCode problem logs |
| `/api/linkedin` | GET, POST | LinkedIn post logs |
| `/api/goals` | GET, POST, PUT, DELETE | Sprint goals |
| `/api/applications` | GET, POST, PUT | Job/internship applications |
| `/api/summary` | GET | AI-generated weekly recap |

## Data model

Prisma models (SQLite): `LeetcodeLog`, `StandupLog`, `LinkedinPost`, `SprintGoal`, `Application`. See `prisma/schema.prisma`.

## Running locally

```bash
git clone https://github.com/num-err/squad-dashboard.git
cd squad-dashboard
npm install
```

Create `.env.local`:

```
DATABASE_URL="file:./prisma/squad.db"
ANTHROPIC_API_KEY=...
```

Set up the database with sample data, then start the app:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Project layout

```
app/                 pages and API routes (App Router)
src/components/      dashboard components (MemberCard, ActivityHeatmap, SprintGoals, ...)
src/lib/             Prisma client, Anthropic client, date helpers
src/types/           shared types and squad config
prisma/              schema, migrations, seed script
```
