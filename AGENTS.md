# Zahdan Kamal Sentosa Catering Website: Governance
Extends the Global Rules. May add stricter requirements, never weaken them.

## Facts (verified only)
- Purpose: website for one catering business (Zahdan Kamal Sentosa), single tenant.
- Scope: public profile and menu, online ordering, online payment, admin panel.
- Users: customers and admin.
- Stack (chosen by the user, same as the MNK website): Next.js, TypeScript, TailwindCSS,
  Prisma, PostgreSQL, NextAuth. Exact versions are not decided: verify against current
  official documentation when scaffolding. Do not add other frameworks or libraries without
  asking.
- Not decided yet: payment provider, hosting. Propose options with trade-offs; do not choose.
- Verified commands (run on 2026-10-12, exit code 0): `npm run lint`, `npm run build`. No test
  command is defined yet. Do not invent others; add here only after they have been run and
  confirmed.
- Installed versions (verified from npm ls): Next.js 16.4.0, React 19.3.0, TypeScript 5.9.3,
  Tailwind CSS 4.3.3, ESLint 9.39.5.
- next.config.ts sets `agentRules: false` so that `next dev` does not write to this file. Do not
  remove it.
- Prisma 7.10.0 (prisma, @prisma/client, @prisma/adapter-pg) is pinned to exact versions. Do not
  upgrade, do not use Prisma 8 RC, and do not add packages without asking.
- Database: local PostgreSQL (Postgres.app), database zks_catering_dev, fake data only. The connection
  string lives in .env (git-ignored): never print or commit it.
- After a fresh clone: run `npm ci`, then `npm run db:generate` (src/generated is git-ignored).

## Off-limits (require explicit approval each time)
- Production database, backups, and production environment variables.
- Payment gateway keys and webhook secrets: never print, log, or commit them.
- Real customer data: never use it in tests, fixtures, logs, or screenshots.
- Admin authentication and session logic: show the planned change before editing.
- Database schema changes and migrations. The user runs `npx prisma migrate dev` in an interactive
  Terminal. Agents may edit prisma/schema.prisma only when explicitly approved, and must never run
  migrate, db push, or reset.

## Rules specific to this project
- Never store card numbers or card security codes. Use a hosted payment page from the
  payment provider.
- Compute prices and order totals on the server. Never trust values sent from the browser.
- Verify payment status via the provider's signed webhook or server API, not via the redirect.
- Store secrets only in environment variables, never in the repository.

## Release rules
- No commit, push, merge, or deploy without separate explicit approval (see Global Rules).

## Memory
- Context: @docs/agent/context.md
- Create docs/agent/decisions.md when the first significant decision is made, and
  docs/agent/status.md when work spans multiple sessions. Ask before creating them.
