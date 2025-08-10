# Requirements Specification: AdonisJS Backend Bootstrap with InertiaJS Frontend

## Overview
Bootstrap a minimal AdonisJS v6 backend server with InertiaJS frontend using React and Tailwind CSS v4. This specification focuses on establishing the essential foundation for the Nooklet application with core authentication and basic nooklet management functionality.
Initialization must use the official AdonisJS Inertia starter with React provider.

## Context & Background

- Nooklet is an AI-powered "second brain" application for journaling and resource management
- Following skedai-adonisjs patterns: domain-driven structure, UUID primary keys, soft-delete strategy
- MVP scope: Focus on core journaling features to evaluate design patterns on small scale
- Tech stack: AdonisJS v6 + InertiaJS + React + Tailwind CSS v4 + BiomeJS (no ESLint/Prettier)
- Testing: MCP Playwright for visual and DOM testing (always consult Playwright MCP)
- Documentation: Always consult Context7 for AdonisJS v6 + Inertia docs

## Requirements (Layered Delivery)

### REQ-001: Foundation (Layer 0)
**Description:** Set up AdonisJS v6 backend with essential configuration following skedai-adonisjs patterns

**Acceptance Criteria:**

- [x] AdonisJS v6 project initialized with TypeScript via starter kit
- [x] Starter used: `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr` (or `--no-ssr`)
- [x] Inertia SSR enabled; Vite configured with `@tailwindcss/vite`
- [x] BiomeJS configured (exclude ESLint/Prettier/pino-pretty)
- [ ] `.env.example` present with DB credentials for Docker
- [ ] Docker compose for Postgres validated

### REQ-002: Auth — Registration (Layer 1)
**Description:** Implement registration end-to-end (backend + Inertia UI), using auth separation pattern with `auth_users` and `profiles` tables

**Acceptance Criteria:**

- [ ] Migrations for `auth_users` and `profiles` (UUID PKs)
- [ ] BaseModel with UUID + ISO serialization
- [ ] AuthUser model (email unique, password_hash hidden)
- [ ] Profile model (one-to-one with AuthUser)
- [ ] Vine validator for registration
- [ ] Service to register user (hash, create auth_user + profile)
- [ ] Controller + routes: GET `/register`, POST `/register` (Inertia)
- [ ] Inertia page `inertia/pages/auth/Register.tsx` with form + validation errors
- [ ] Japa tests verifying DB rows are created and response is Inertia success (redirect/flash)

### REQ-003: Nooklet Management (Layer 4)
**Description:** Basic CRUD operations for nooklets (journal entries) with soft-delete

**Acceptance Criteria:**

- [ ] Nooklet model with UUID, title, content, metadata (JSONB), isArchived
- [ ] Create nooklet endpoint
- [ ] List nooklets endpoint (user's own, exclude archived)
- [ ] Update nooklet endpoint
- [ ] Soft-delete nooklet endpoint (set isArchived = true)
- [ ] Basic validation for nooklet data

### REQ-004: InertiaJS Frontend Setup (Through Layers)
**Description:** Configure InertiaJS with React and Tailwind CSS v4 for server-driven navigation

**Acceptance Criteria:**

- [ ] InertiaJS server adapter configured for AdonisJS
- [ ] React 18+ setup with InertiaJS client (via starter scaffolding under `inertia/`)
- [ ] Tailwind CSS v4 configured with CSS-first approach (@import "tailwindcss")
- [ ] Basic app.jsx with Inertia setup
- [ ] Shared props configuration (auth user, flash messages)
- [ ] SSR configuration validated (enable/disable per project decision)

### REQ-005: Basic UI Pages (Through Layers)
**Description:** Minimal dashboard and nooklet management interface

**Acceptance Criteria:**

- [ ] Dashboard page showing timeline of nooklets
- [ ] Simple navigation bar component
- [ ] Nooklet create/edit form
- [ ] Nooklet list/timeline component
- [ ] Basic responsive design with Tailwind CSS using extracted color palette
- [ ] Dark theme implementation matching mobile screenshot design
- [ ] Login/register forms

## Success Metrics

- Server starts without errors
- User can register, login, and access dashboard
- User can create, view, and edit nooklets
- Frontend renders correctly with proper styling
- All tests pass using MCP Playwright (documented and verified via MCP tools)

## Constraints & Assumptions

- PostgreSQL database available via Docker container (`../nooklet-db/`)
- Docker and Docker Compose installed
- Node.js 18+ environment
- Focus on essential features only (no advanced AI features yet)
- Use existing skedai-adonisjs patterns for consistency
- Minimal UI design (will be refined later)
- Always consult Context7 and Playwright MCP tools before implementing or changing specs

## Out of Scope

- Advanced AI features (embeddings, semantic search)
- Mood tracking system
- Tags and collections
- Media file uploads
- Real-time features
- Advanced error handling and monitoring
- Production deployment configuration
- Comprehensive test suite (basic testing only)
