# Repository Guidelines

## Project Structure & Module Organization
- Source code is not scaffolded yet. Implementation follows AdonisJS v6 + Inertia (React) per specs in `specs/specs/01-adonisjs-backend-bootstrap-inertiajs-frontend/` (see `design.md`, `tasks.md`, `rules.md`).
- Documentation lives in `app-docs/` (architecture, PRD) and `specs/` (implementation plan and templates).
- Database infra is in `nooklet-db/` (PostgreSQL 17 via Docker Compose).
- When scaffolding the app, prefer:
  - Backend: `app/features/<feature>/`, `app/models/`, `app/middleware/`
  - Frontend: `inertia/app/` and `inertia/pages/` (Adonis v6 style) or `resources/js/` (legacy)
  - Migrations: `database/migrations/001_*.ts`, `002_*.ts`, `003_*.ts`

## Build, Test, and Development Commands
- Database: `cd nooklet-db && docker-compose up -d` (uses `.env` for `POSTGRES_*`).
- Initialize app (once): `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr` (run in a new `app/` dir at repo root).
- Dev server (after scaffold): `npm run dev` (Adonis serve + Vite) or `node ace serve --watch`.
- Type check/build: `node ace build` (compiles TypeScript) and `vite build` for assets.
- E2E tests (after setup): `npx playwright test`.

## Coding Style & Naming Conventions
- Language: TypeScript (backend and Inertia React). Indentation: 2 spaces.
- Formatter/Lint: Biome (`biome.json`). Run `npx biome check --write .`.
- Naming: PascalCase for models/controllers/components (e.g., `Nooklet.ts`, `AuthController.tsx`), kebab-case for folders, migration files with numeric prefixes and snake_case names.
- Feature-first layout under `app/features/<domain>/...` (auth, user, nooklet).

## Testing Guidelines
- Primary: Playwright for UI flows and visual tests (auth, dashboard, nooklet CRUD). Place in `e2e/` or `tests/e2e/` with `*.spec.ts`.
- Optional: Japa for API/integration (`node ace test`) targeting Inertia responses.
- Aim for smoke tests on critical paths; add screenshot assertions where stable.

## Commit & Pull Request Guidelines
- Use Conventional Commits (no git history yet): e.g., `feat(auth): add login flow (Inertia)`; `fix(db): correct PG config`.
- PRs: include clear description, link relevant `TASK-xxx` from `tasks.md`, screenshots of UI changes, and notes on schema/migration impacts.

## Security & Configuration Tips
- Never commit secrets. Copy app `.env` from `.env.example`. The DB `.env` in `nooklet-db/` is for local only.
- Use CSRF protection and input validation (VineJS). Prefer UUID PKs and soft-delete as specified in `design.md`.
