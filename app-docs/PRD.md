# Nooklet — Product Requirements Document (PRD)

## 1) Context & Background

- Nooklet is an AI-powered "second brain" application that seamlessly integrates journaling with intelligent resource management
- This PRD captures the MVP scope focusing on core journaling features while establishing the foundation for AI-powered content management
- Full vision includes mood tracking, semantic search, and multi-modal content (articles, videos) - MVP focuses on nooklets (journal entries)

## 2) Problem Statement
Creators need a simple, fast way to publish and curate “nooklets” (short, structured posts/entries) and surface them in a personal timeline, with clear privacy controls and safe archiving.

## 3) Vision
Make creating and browsing nooklets as quick as jotting a note, but organized, searchable, and shareable with fine-grained privacy.

## 4) Goals & Non‑Goals

- Goals
  - TTFN (time to first nooklet) < 3 minutes for a new user
  - A clean, low‑friction dashboard (nav + timeline)
  - Robust privacy: public / private / limited (future)
  - Soft‑delete everywhere (recoverability)
- Non‑Goals (MVP)
  - Rich collaboration (comments, mentions)
  - Real‑time multi‑user editing
  - Mobile apps

## 5) Success Metrics (MVP)

- Activation: % of signups creating ≥1 nooklet within 24h (target ≥40%)
- Engagement: Median nooklets/user in week 1 (target ≥3)
- Retention: D7 creator retention (target ≥20%)
- Reliability: p95 API latency < 200ms; 99.9% uptime (internal)

## 6) Personas (assumptions; refine from nooklet-docs)

- Creator: Wants quick capture, light structure, and control over visibility.
- Viewer (public or permitted): Skims a user’s timeline; expects fast loads.
- Admin (internal): Needs auditability and recovery tools (soft‑deleted data).

## 7) User Stories (MVP)

- As a creator, I can:
  - Sign up, log in, and view a dashboard with my timeline.
  - Create/edit/publish/soft‑delete a nooklet.
  - Set a nooklet’s privacy (public/private; limited audiences later).
  - Tag nooklets for organization.
- As a viewer, I can:
  - Browse a creator’s public timeline.
  - Open a nooklet’s detail view.

## 8) In‑Scope (MVP)

- Dashboard: top nav + timeline list of nooklets.
- Nooklet CRUD with soft‑delete and restore.
- Privacy controls: public/private (limited audiences in a later phase).
- Tagging (basic create/assign).
- Authentication with access tokens and refresh.
- Rate limiting and basic security hardening.

## 9) Out‑of‑Scope (MVP)

- Notifications, comments, rich collaboration, import/export, analytics UI.

## 10) Functional Requirements

- Auth
  - Register, login, refresh, logout
  - Access token guard for API routes
- Nooklets
  - Create: title (required), body (optional), tags (optional), privacy
  - Read: list (timeline with pagination), get by id
  - Update: title/body/tags/privacy
  - Soft‑Delete: move to trash (deletedAt); Restore and hard‑delete (admin only)
- Tags
  - CRUD for personal tags; assign to nooklets; simple suggestions
- Timeline
  - Reverse‑chronological list of nooklets; filters: tag, privacy (self)
- Admin (post‑MVP if needed)
  - View/restore hard cases; audit soft‑deleted items

## 11) Non‑Functional Requirements

- Performance: p95 < 200ms for core endpoints; efficient pagination
- Reliability: 99.9% SLO; graceful degradation on Redis unavailability
- Security: auth + rate limits; input validation; safe error handling
- Privacy: soft‑delete across all user data; privacy defaults sane
- Observability: structured logs, request IDs; basic metrics (later)
- Accessibility: WCAG AA targets on dashboard

## 12) System Overview

- Backend: Node.js (AdonisJS v6, TypeScript), PostgreSQL (Lucid ORM), Redis (cache/limiter)
- Frontend: Inertia.js + React, Tailwind CSS v4
- Patterns: Slim controllers, service layer, validators, DI/IoC, soft‑deletes, domain‑driven app/features/*

## 13) High‑Level API (illustrative)

- Auth: POST /api/v1/auth/register | login | refresh | logout
- Nooklets: GET /api/v1/nooklets; POST /api/v1/nooklets; GET/PUT/DELETE /api/v1/nooklets/:id; POST /api/v1/nooklets/:id/restore
- Tags: GET/POST /api/v1/tags; GET/PUT/DELETE /api/v1/tags/:id; GET /api/v1/tags/suggestions

## 14) Data Model (MVP)

Based on nooklet-docs ERD, simplified for MVP:

- AuthUser: id (uuid), email, password_hash, created_at, updated_at, is_active
- Profile: id (uuid), auth_user_id, username, display_name, timezone, subscription_tier
- Nooklet: id (uuid), user_id, type (journal|voice|quick_capture), title, content, metadata (jsonb), is_favorite, is_archived, is_draft
- Tag: id (uuid), user_id, name, color, created_at, updated_at
- NookletTag: nooklet_id, tag_id (pivot table)

Future scope: mood_entries, nooklet_articles, nooklet_videos, collections, AI features
Conventions: UUID PKs; soft-delete via is_archived flags; JSONB for flexible metadata

## 15) Milestones

- 0. PRD + Architecture Review (this doc) — sign‑off
- 1. Backend scaffolding (auth, nooklets CRUD, tags, soft‑delete, rate limits)
- 2. Frontend skeleton (Inertia + React + Tailwind v4; nav + timeline)
- 3. Polish & QA (accessibility pass, perf baseline, error states)

## 16) Risks & Mitigations

- Inertia.js adapter for Adonis: confirm adapter/middleware strategy (spike); fallback is API + client routing if needed.
- Tailwind v4 changes: follow upgrade guide; lock versions; keep CSS‑first config.
- Scope creep: enforce MVP boundaries; track parking lot items.

## 17) Dependencies & Tech Choices

- Backend: AdonisJS v6, Lucid, Redis, VineJS, Limiter, Auth (access tokens), adonis‑lucid‑soft‑deletes
- Frontend: Inertia.js (React adapter), React 18+, Tailwind CSS v4 (@tailwindcss/vite or CLI)
- Tooling: Biome (lint/format) — explicitly not using ESLint/Prettier; exclude pino‑pretty

## 18) Open Questions (to fill from nooklet-docs)

- Exact creator workflows and fields for nooklets (templates? attachments?)
- Privacy granularity beyond public/private
- Branding and theming requirements

## 19) References

- AdonisJS v6 docs (structure, auth, middleware, limiter, Lucid)
- Inertia.js (React adapter, navigation, shared props)
- React 18 docs (components, hooks, Suspense)
- Tailwind CSS v4 docs (CSS‑first config, @tailwindcss/vite/cli)
