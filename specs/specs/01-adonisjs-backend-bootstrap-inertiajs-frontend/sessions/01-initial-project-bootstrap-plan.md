# Session 01: Initial Project Bootstrap Plan

Date: 2025-08-10
Focus: Read specs, align DB config, prepare initialization plan (AdonisJS v6 + Inertia React + Tailwind v4)
Previous Status: No implementation yet. Specs prepared with detailed tasks and rules.

## Key Findings & Discoveries
- Use AdonisJS v6 official Inertia starter with React: `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr` (or `--no-ssr`).
- Domain-driven structure under `app/features/*` with `app/models/base_model.ts` for UUIDs.
- Auth separation present in ERD: `auth_users` and `profiles` (one-to-one via `auth_user_id`).
- Core entity for MVP: `nooklets` (id, user_id→profiles.id, title, content, metadata JSONB, is_archived boolean).
- Docker DB config from `nooklet-db`: user `nooklet_admin`, db `nooklet_db`, password set in `.env`, port 5432. Updated design.md to reflect correct DB name.
- Rules enforce BiomeJS only (no ESLint/Prettier), Tailwind v4 CSS-first with `@import "tailwindcss"`, and UUID PK via `gen_random_uuid()` in migrations.
- Testing requires MCP Playwright for visual/DOM flows; plan to set up basic auth and nooklet flow tests after UI is up.

## Implementation Details (Planned)
- Phase 1: Initialize Adonis + Inertia (React), prefer SSR; scaffold `inertia/app` and `inertia/pages`.
- Phase 2: Configure Biome, Vite, Tailwind v4; env setup (.env example using Docker creds).
- Phase 3: DB config and migrations for `auth_users`, `profiles`, `nooklets`, and `auth_access_tokens`.
- Phase 4: BaseModel with UUID + soft-delete scopes and ISO serialization.
- Phase 5: Auth models/services/controllers/validators; Inertia middleware and shared props.
- Phase 6: Auth UI pages (Login/Register), Dashboard, Nooklets CRUD pages.
- Phase 7: MCP Playwright setup and core flow tests.

## Testing Results
- N/A for this session (planning only).

## Current Status
- Requirements: All pending (0/16 tasks done).
- Design: Confirmed core paths, fixed DB name.
- DB: Pending container start and Adonis config.

## Handoff Information
### Immediate Next Tasks
1. Start DB container (compose up) and verify connection.
2. Initialize Adonis v6 Inertia React project using official starter.
3. Commit scaffold and add Biome configuration; ensure no ESLint/Prettier files.
4. Configure Tailwind v4 via @tailwindcss/vite and CSS imports.
5. Create initial migrations for `auth_users`, `profiles`, `nooklets` using UUIDs and JSONB.

### Technical Context
- Use `gen_random_uuid()` in migrations; ensure `pgcrypto` or `uuid-ossp` extension available depending on Adonis/Lucid idioms for v6 (verify via Context7 docs).
- Inertia shared props: auth user, flash, csrf; SSR entry `inertia/app/ssr.tsx` if SSR enabled.
- Follow folder structure from design and rules.

### Known Issues
- None yet; watch for Inertia adapter SSR configuration nuances in Adonis v6.

### Development Environment
- Node 18+, Docker installed. DB credentials in `nooklet-db/.env`.

### Architectural Decisions
- Adopt Option B paths (Adonis v6 `inertia/*` scaffolding) unless starter generates legacy paths.

### Rules & Guidelines Updates
- Synchronized DB name in design.md with Docker env (nooklet_db).

### Important Note for Next AI Agent
CRITICAL: Before implementing, consult Context7 for Adonis v6 + Inertia + Lucid migrations and Playwright MCP for testing patterns. Maintain Biome-only tooling and the domain-driven `app/features/*` structure.
