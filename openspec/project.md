# Project Context

## Purpose
Nooklet is an AI‑powered “second brain” for fast knowledge capture and retrieval. It combines a server‑driven UX (AdonisJS v6 + Inertia React) with a feature‑sliced backend to keep domain logic isolated, testable, and easy to extend. Current MVP scope focuses on authentication and journal‑style entries called “nooklets,” edited in Markdown and rendered via Markdoc.

## Tech Stack
- Backend
  - AdonisJS v6 (TypeScript), Lucid ORM (PostgreSQL)
  - Inertia server adapter, Session, Shield, Static, CORS, Auth
- Frontend
  - Inertia.js (React adapter) + React 18/19
  - Vite build (SSR entry in `inertia/app/ssr.tsx`), Tailwind CSS v4 + daisyUI
  - CodeMirror (Markdown) with Markdoc rendering
- Database & Infra
  - PostgreSQL 17 (Docker Compose in `nooklet-db/`)
  - Node.js LTS (18+ recommended)
  - Qdrant (vector DB) for optional embeddings/search
- Tooling
  - Biome for lint/format; TypeScript strict; path aliases via `package.json#imports`
  - Hot reload via Adonis HMR + Vite
- Testing
  - Playwright via MCP for UI flows and visuals
  - Japa for backend integration tests when needed
- AI/LLM (optional, behind env flags)
  - OpenAI SDK; `@langchain/textsplitters` for content chunking

## Project Conventions

### Code Style
- Language: TypeScript everywhere (backend and Inertia React)
- Formatting/Linting: Biome only; no ESLint/Prettier
- Indentation: 2 spaces; wrap long lines; avoid deep nesting
- Naming
  - PascalCase for models/controllers/components (e.g., `Nooklet.ts`, `AuthController.tsx`)
  - kebab-case for folders; feature folders under `app/features/<domain>/`
  - Migrations: numeric prefix + snake_case file names (e.g., `1754831000004_create_nooklets_table.ts`)
- Imports: prefer path aliases from `package.json#imports` (e.g., `#features/*`, `#shared/*`)

### Architecture Patterns
- Feature‑sliced backend under `app/features/<domain>/`
  - Controllers: thin HTTP handlers (`*_controller.ts`)
  - Services: business logic (`*_service.ts`)
  - Models: Lucid models and relations (`models/*.ts`)
  - Validators: VineJS inputs (`*_validator.ts`)
- Base model enforces UUID PKs and consistent DateTime serialization (`app/models/base_model.ts`)
- Soft delete pattern via boolean `is_archived` on core tables
- Inertia SSR preferred; shared props via middleware (auth user, flash, CSRF)
- Routes use dynamic controller imports; controllers validate → delegate to services

### Testing Strategy
- Playwright (via MCP) is primary for:
  - Auth flows (register/login/logout)
  - Nooklet CRUD (create/edit/archive)
  - Visual/screenshot checks on critical pages
  - Console/network error checks during navigation
- Japa integration tests for Inertia responses and API behavior as needed
- Test locations: `tests/browser/*` (Playwright), `tests/functional/*` (Japa)

### Git Workflow
- Branches: `main` (stable), `dev` (integration), short‑lived feature branches (`feat/*`, `fix/*`)
- Commits: Conventional Commits (e.g., `feat(auth): add login flow (Inertia)`)
- PRs: merge feature → `dev`; cut releases from `main`; include screenshots and migration notes
- Spec‑driven changes: use OpenSpec proposals under `openspec/changes/` and validate with `openspec validate --strict` before implementation

## Domain Context
- Entities
  - `AuthUser` (credentials) and `Profile` (user data)
  - `Nooklet` (journal entry): markdown `content`, JSONB `metadata`, `is_archived`
- UX
  - Editor: CodeMirror Markdown with custom extensions; Markdoc rendering and preview
  - Timeline/list views of nooklets with chronological emphasis
- Data rules
  - UUID PKs (`gen_random_uuid()`)
  - JSONB for flexible metadata
  - Soft archive instead of hard delete

## Important Constraints
- Security: CSRF via Shield; password hashing; strict input validation (VineJS)
- DB: PostgreSQL 17; enable `pgcrypto` for UUIDs; avoid N+1 with Lucid relations
- Performance: SSR for first paint; pagination on timelines; Vite‑optimized assets
- Tooling: Biome is the single source for lint/format; do not add ESLint/Prettier
- Secrets: Never commit secrets; copy `.env.example` → `.env`; requires `OPENAI_API_KEY` if AI features are enabled

## External Dependencies
- PostgreSQL (Docker Compose in `nooklet-db/`)
- Qdrant (vector database) for embeddings (optional)
- OpenAI API (optional embeddings/chat)
- Tailwind v4 + daisyUI for UI theming
- InertiaJS (server + React adapter) and Edge templates for SSR/inertia layout

---

Reference docs and patterns live under:
- `README.md` (quick start, stack)
- `specs/specs/01-adonisjs-backend-bootstrap-inertiajs-frontend/` (`design.md`, `rules.md`, `tasks.md`)
- `docs/` (architecture notes, PRD)
- `openspec/AGENTS.md` (OpenSpec usage and workflow)
