# Implementation Tasks: Layered Feature Slices (Backend + Inertia UI)

## Overview
- Implement the app foundation layer-by-layer. Each layer delivers a complete vertical slice: backend domain + tests + Inertia UI integration.
- Verify each layer with Japa tests (backend) and minimal UI checks; prefer Playwright for UI where feasible.

## Layer 0: Foundation (project + tooling)

- [x] L0-001: Initialize AdonisJS v6 with Inertia (React, SSR)
  - Deliverables: Starter scaffold under `inertia/app`, `inertia/pages`
- [x] L0-002: Tooling — Biome only (replace ESLint/Prettier), Tailwind v4 (CSS-first), Vite plugin
  - Deliverables: `biome.json`, `vite.config.ts` with `@tailwindcss/vite`, `inertia/css/app.css` theme tokens
- [x] L0-003: Logging — remove pino-pretty; standard stdout logging
  - Deliverables: `config/logger.ts` uses stdout/file transports only
- [ ] L0-004: Dev environment — `.env` template, Docker Compose for Postgres
  - Deliverables: `.env.example`; `nooklet-db/docker-compose.yml` usage

Acceptance (L0):
- `npm run dev` boots with SSR; Vite assets build/run; no ESLint/Prettier in toolchain.

## Layer 1: Auth — Registration (Backend → Inertia UI)

Backend
- [ ] L1-001: Migrations
  - `auth_users` (uuid PK via `gen_random_uuid()`, email unique, password_hash, timestamps, is_active)
  - `profiles` (uuid PK, `auth_user_id` unique→auth_users.id, username unique, display_name, timezone, subscription_tier, timestamps)
- [ ] L1-002: BaseModel
  - `app/models/base_model.ts` with UUID defaulting + ISO DateTime serialization + simple `isArchived` helpers (future use)
- [ ] L1-003: Models
  - `app/features/auth/models/auth_user.ts`
  - `app/features/user/models/profile.ts`
- [ ] L1-004: Validation & Service
  - Vine validator for registration (email, password, username optional)
  - `AuthService.register()` (hash password, create AuthUser + Profile)
- [ ] L1-005: Controller & Routes (Inertia)
  - GET `/register` returns Inertia page
  - POST `/register` creates user and returns success (redirect/flash)
  - Inertia shared props include flash messages

Frontend (Inertia React)
- [ ] L1-006: `inertia/pages/auth/Register.tsx`
  - `useForm` with fields: email, password, password_confirmation (username optional)
  - Submit via Inertia POST; display validation errors; show success flash

Tests & Verification
- [ ] L1-007: Japa integration tests
  - Happy path: POST `/register` persists records (auth_users + profiles)
  - Duplicate email validation
  - Response is Inertia (redirect/flash) with 2xx/3xx
- [ ] L1-008: Minimal UI verification (MCP Playwright or manual)
  - Navigate to `/register`, submit form, expect success UI and DB row exists

Acceptance (L1):
- Registering a new user returns a successful Inertia response (redirect/flash) and user+profile rows exist in DB. Login is not required yet.

## Layer 2: Auth — Login (Backend → Inertia UI)

- [ ] L2-001: Validator + Service for login (access tokens/sessions per Adonis auth)
- [ ] L2-002: Controller + Routes (GET `/login`, POST `/login`)
- [ ] L2-003: Inertia page `inertia/pages/auth/Login.tsx`
- [ ] L2-004: Japa tests (valid credentials; invalid credentials)
- [ ] L2-005: UI verification (successful login + redirect)

## Layer 3: Dashboard (Protected Inertia page)

- [ ] L3-001: Route + middleware protection; shared props user
- [ ] L3-002: `inertia/pages/Dashboard.tsx` with basic layout
- [ ] L3-003: Japa test for auth guard; UI smoke test

## Layer 4: Nooklets — Minimal CRUD (Backend → Inertia UI)

- [ ] L4-001: Migration `nooklets` (uuid PK, user_id, title, content, metadata jsonb default {}, is_archived, timestamps)
- [ ] L4-002: Model + Service; validators
- [ ] L4-003: Controller + Routes (index/create/store/edit/update/archive)
- [ ] L4-004: Inertia pages (Index, Create, Edit)
- [ ] L4-005: Japa tests (scoped to user); UI smoke tests

## Status Legend
- planned / in-progress / done

## Progress Tracking
- Completed: L0-001, L0-002, L0-003
- Remaining: L0-004 and Layers 1–4

## Testing Strategy (Per Layer)
- Backend: Japa integration tests for routes, validation, and DB persistence
- Frontend: Minimal Playwright checks (page renders, form submit, success UI); console error-free

## Notes
- Inertia-first: No client-side API calls; server renders pages and handles POSTs. Each UI form submits via Inertia and receives errors/redirects/flash.
- Always consult Context7 docs; validate UI test patterns with Playwright MCP tools.
