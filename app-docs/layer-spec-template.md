## Layered SPEC Template and Briefs

This document provides a reusable prompt template for creating vertical-slice SPECs (backend + Inertia UI), plus concise briefs for upcoming layers.

### How to use
- Copy the template prompt below into the next agent when creating a new layer SPEC.
- Fill in the bracketed fields and use the appropriate layer brief for context.

---

### Template prompt for creating the next “Layer” SPEC

```markdown
You are a senior full‑stack engineer. Create a SPEC for a single vertical slice (“Layer”) in this AdonisJS v6 + Inertia React app.

Context
- Stack: AdonisJS v6 (TS), Inertia.js (React), Vite, Tailwind CSS v4 (CSS-first), Postgres (Docker), Japa tests, Playwright (light UI checks).
- Project rules:
  - Domain-driven: `app/features/*`
  - Biome only (no ESLint/Prettier). No pino-pretty.
  - Inertia-first: no client REST endpoints between frontend and backend; use `Inertia.render` and Inertia forms.
  - SSR enabled.
- Source anchors to consult: 
  - `specs/specs/01-adonisjs-backend-bootstrap-inertiajs-frontend/{requirements.md,tasks.md,rules.md}`
  - `app-docs/PRD.md`, `app-docs/frontend-architecture.md`, `app-docs/backend-architecture.md`
  - Current codebase structure under `inertia/*`, `config/*`, `start/*`

Goal
- Produce a SPEC folder for the layer `[LAYER_NAME]`, defining requirements, design, tasks, rules, and a first session file.

Outputs
- Create `specs/specs/[XX]-[layer-slug]/`
  - `requirements.md` (acceptance criteria)
  - `design.md` (data model, routes, Inertia pages, shared props)
  - `tasks.md` (checkboxed steps: backend, Inertia UI, tests)
  - `rules.md` (layer-specific rules/constraints)
  - `sessions/01-[init].md` (session file template + immediate next tasks)
- Do NOT implement code; produce only the SPEC.

Constraints
- Vertical slice: backend model/migrations/service/controller/routes + Inertia page(s) + tests (Japa) + minimal Playwright check or manual verification plan.
- Use Postgres UUIDs via `gen_random_uuid()`. Use JSONB where noted. Use `is_archived` for soft-deletes when relevant.
- Keep UI minimal and dark theme compatible (Tailwind v4; CSS-first import).
- Validation with VineJS. Password hashing with Adonis auth. Use session/cookie guard for auth.

SPEC Structure (fill these)
1) Overview
   - Layer name: [LAYER_NAME]
   - Objective: [WHAT THIS LAYER DELIVERS END-TO-END]
   - In-scope / Out-of-scope for this layer
2) Data Model
   - Tables: [LIST] with fields and indexes (UUID PKs)
   - Relations: [LIST]
3) API/Routes (Server)
   - Inertia GET pages, POST/PUT routes (no JSON API)
   - Route names and middlewares (e.g., `auth`)
4) Frontend (Inertia React)
   - Pages: [LIST], forms with `useForm`, error display, flash messages
5) Validation & Security
   - Vine schemas, constraints, error mapping to Inertia
6) Tests
   - Japa: [SCENARIOS]
   - Playwright/Manual: [SCENARIOS]
   - DB verification steps (what rows should exist after success)
7) Acceptance Criteria
   - Bullet list; must be objectively verifiable
8) Tasks (checkboxed)
   - Backend: migrations, models, service, controller, routes
   - Frontend: page(s), forms, states
   - Tests: Japa + UI verification
9) Risks & Mitigations
10) Environment & Runbook
   - Docker up, env variables, local commands

Implementation Rules (carry over)
- Use `app/features/[domain]/` for models/controllers/services/validators.
- Use `app/models/base_model.ts` with UUID + ISO DateTime serialization.
- Tailwind v4 CSS-first via `@tailwindcss/vite` plugin.
- Biome scripts: `npm run lint`, `npm run format`.

Layer Inputs (fill these for this SPEC)
- Layer: [LAYER_NAME]
- Entities/tables: [TABLES]
- Routes (GET/POST): [ROUTES]
- Inertia pages: [PAGES]
- Validation rules: [RULES]
- Success signal (frontend): [E.G., redirect + flash]
- Success signal (backend/DB): [E.G., rows inserted/updated]
- Out-of-scope: [ANYTHING NOT IN THIS SLICE]

Deliverables Check
- SPEC files created under `specs/specs/[XX]-[layer-slug]/`
- Clear acceptance criteria and tests
- No code changes in app
```

---

### Layer briefs

Use these to fill the “Layer Inputs” for each SPEC.

- Registration
  - Entities: `auth_users(id uuid, email unique, password_hash, is_active, timestamps)`, `profiles(id uuid, auth_user_id unique→auth_users.id, username unique, display_name, timezone, subscription_tier, timestamps)`
  - Routes: GET `/register`, POST `/register`
  - Pages: `inertia/pages/auth/Register.tsx`
  - Validation: email required/unique, password length ≥ 8, confirm match, optional username constraints
  - Success: redirect + flash; DB has new auth_user + profile

- Login
  - Entities: existing auth tables
  - Routes: GET `/login`, POST `/login`
  - Pages: `inertia/pages/auth/Login.tsx`
  - Validation: email required, password required
  - Success: redirect to dashboard; session established

- Logout
  - Routes: POST `/logout` (guarded)
  - UI: small Inertia form/button integrated in layout
  - Success: session cleared, redirect to home/login

- Nooklet Journal (basic)
  - Entities: `nooklets(id uuid, user_id→profiles.id, title, content text, metadata jsonb default '{}', is_archived boolean default false, created_at, updated_at)`
  - Routes: GET `/nooklets/create`, POST `/nooklets`
  - Pages: `inertia/pages/nooklets/Create.tsx` (+ optional `Index.tsx`)
  - Validation: title required, content optional
  - Success: redirect to index/show; DB row saved

- Tags (minimal)
  - Entities: `tags(id uuid, user_id→profiles.id, name unique per user, color, timestamps)`, `nooklet_tags(nooklet_id, tag_id)`
  - Routes: GET `/tags`, POST `/tags`, POST `/nooklets/:id/tags`
  - Pages: simple tag management and assignment UI (could be embedded in Nooklet Edit later)
  - Validation: name required, uniqueness per user

- Collections (minimal)
  - Entities: `collections(id uuid, user_id→profiles.id, name, description, is_public, timestamps)`, `collection_nooklets(collection_id, nooklet_id)`
  - Routes: GET `/collections`, POST `/collections`, POST `/collections/:id/add-nooklet`
  - Pages: `Collections/Index.tsx`, `Collections/Create.tsx`
  - Validation: name required

- Nooklet Bookmarks (articles/videos, basic)
  - Entities:
    - Articles: `nooklet_articles(id uuid, user_id, original_url, title, domain, published_date, word_count, timestamps)`
    - Videos: `nooklet_videos(id uuid, user_id, original_url, title, domain, published_date, duration_seconds, timestamps)`
  - Routes: GET `/bookmarks/new`, POST `/bookmarks` (type inferred by URL or form select)
  - Pages: `bookmarks/Create.tsx`
  - Validation: valid URL; basic parsing placeholder step acceptable
  - Success: DB row saved with parsed fields (if parsing implemented) or stored placeholders


