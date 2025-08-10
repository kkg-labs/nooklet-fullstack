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

## Requirements

### REQ-001: AdonisJS Backend Foundation
**Description:** Set up AdonisJS v6 backend with essential configuration following skedai-adonisjs patterns

**Acceptance Criteria:**

- [ ] AdonisJS v6 project initialized with TypeScript via starter kit
- [ ] Starter used: `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr` (or `--no-ssr`)
- [ ] Domain-driven structure: `app/features/*` instead of standard controllers/models
- [ ] UUID primary keys configured in BaseModel
- [ ] PostgreSQL database connection configured using Docker container from `../nooklet-db/`
- [ ] BiomeJS configured for linting/formatting (exclude ESLint/Prettier/pino-pretty)
- [ ] Basic environment configuration (.env setup with Docker database credentials)

### REQ-002: Authentication System
**Description:** Implement auth separation pattern with auth_users and profiles tables

**Acceptance Criteria:**

- [ ] AuthUser model for credentials (email, password_hash)
- [ ] Profile model for user data (username, display_name, timezone)
- [ ] User registration endpoint
- [ ] User login endpoint with access token
- [ ] Auth middleware for protected routes
- [ ] Basic password hashing and validation

### REQ-003: Nooklet Management (Core Feature)
**Description:** Basic CRUD operations for nooklets (journal entries) with soft-delete

**Acceptance Criteria:**

- [ ] Nooklet model with UUID, title, content, metadata (JSONB), isArchived
- [ ] Create nooklet endpoint
- [ ] List nooklets endpoint (user's own, exclude archived)
- [ ] Update nooklet endpoint
- [ ] Soft-delete nooklet endpoint (set isArchived = true)
- [ ] Basic validation for nooklet data

### REQ-004: InertiaJS Frontend Setup
**Description:** Configure InertiaJS with React and Tailwind CSS v4 for server-driven navigation

**Acceptance Criteria:**

- [ ] InertiaJS server adapter configured for AdonisJS
- [ ] React 18+ setup with InertiaJS client (via starter scaffolding under `inertia/`)
- [ ] Tailwind CSS v4 configured with CSS-first approach (@import "tailwindcss")
- [ ] Basic app.jsx with Inertia setup
- [ ] Shared props configuration (auth user, flash messages)
- [ ] SSR configuration validated (enable/disable per project decision)

### REQ-005: Basic UI Pages
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
