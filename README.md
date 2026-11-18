# ZKS Catering Web

Website and admin panel for **Zahdan Kamal Sentosa**, an industrial catering business in Indonesia.
Customers browse the menu and place orders without an account. Staff manage orders,
procurement, inventory and kitchen work from one admin panel.

The project is also a working example of **governed AI-assisted development**: the code was written
by AI coding agents (Gemini in Google Antigravity, and Claude) under a written rule set, with
every phase approved and verified by a human.

## Features

**Public site**
- Company profile and menu (`/`, `/menu`)
- Online ordering without an account (`/pesan`)
- Order tracking through a private token link (`/pesanan/[token]`)

**Order rules, enforced on the server** (`src/lib/order-logic.ts`)
- Minimum lead time depends on order size: 1 day under 500 pieces, 3 days from 500 pieces up
- Prices and totals are computed on the server and never taken from the browser
- Optional 20% down payment; full payment is due by one day before the event
- Order access tokens are stored only as SHA-256 hashes
- WhatsApp order notifications through the Fonnte API

**Admin panel** (`/admin`)
- Login with Auth.js, scrypt password hashing and rate limiting (client IPs are stored only as HMACs)
- Dashboard, ad hoc orders, kitchen display, production planning
- Procurement (purchase requests, purchase orders, suppliers)
- Inventory (items, receiving, transfers, stock movements, stock opname)

Some admin modules currently show UI with sample data while their backend is in progress.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL with Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Auth.js (next-auth v5) |
| Tests | Node.js built-in test runner (`node:test`) |

## How it was built: AI agents under governance

The agents work inside a fixed set of rules instead of free-form prompting:

- **Global rules** shared across all my projects: no commits, pushes or deploys without approval;
  no secrets in prompts, code or logs.
- **[`AGENTS.md`](AGENTS.md)**: project rules, verified commands, pinned versions and off-limits areas
  (production data, payment secrets, authentication logic, database migrations).
- **[`docs/agent/decisions.md`](docs/agent/decisions.md)**: a log of every business and technical decision,
  with its reason.
- **[`docs/ADR/`](docs/ADR)** and **[`docs/MASTERBOOK/`](docs/MASTERBOOK)**: architecture and design records.

Work runs in phases (planning, scaffold, database, admin login, and so on). In each phase the
agent proposes, I approve, the agent implements, and I verify in my own terminal. Secrets such
as `AUTH_SECRET` are added by hand, so the agent never sees them. Database migrations are run by a
human only.

## Getting started

Requirements: Node.js 22 or later and PostgreSQL.

Create a `.env` file (it is git-ignored):

```bash
DATABASE_URL="postgresql://USER@localhost:5432/zks_catering_dev"
AUTH_SECRET="<output of: openssl rand -base64 32>"
ADMIN_RATE_LIMIT_SECRET="<output of: openssl rand -base64 32>"
# Optional: WhatsApp notifications through Fonnte
FONNTE_TOKEN=""
NEXT_PUBLIC_APP_URL="http://localhost:3100"
```

Then:

```bash
npm ci
npm run db:generate
npx prisma migrate dev      # creates the tables in your local database
npm run init-admin          # creates the first admin account
npm run dev -- -p 3100
```

Open http://localhost:3100. The admin panel is at http://localhost:3100/admin/login.

## Checks

```bash
npm run lint
npm run build
node --experimental-strip-types --test tests/*.test.ts   # 10 unit tests: order rules and password hashing
```

On Node.js 23.6 or later, `--experimental-strip-types` is not needed.

## Author

Elfano Sultan Syahbana ([@elfonda256](https://github.com/elfonda256)), Maudy Network Komunikasi
