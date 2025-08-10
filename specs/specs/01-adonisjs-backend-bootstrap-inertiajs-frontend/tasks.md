# Implementation Tasks: AdonisJS Backend Bootstrap with InertiaJS Frontend

## Task Overview
**Total Tasks:** 16
**Estimated Duration:** 8-10 hours
**Priority:** high
**Focus:** Inertia-first development with Playwright testing

## Task List

### Phase 1: Project Foundation
**Note:** Resetting statuses to planned for a fresh start

- [ ] **TASK-001**: Initialize AdonisJS + Inertia (React)
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** None
  - **Description:** Initialize using the official starter: `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr` (or `--no-ssr`). If starting from a plain app, install and configure `@adonisjs/inertia`.
  - **Deliverables:**
    - AdonisJS project with Inertia React integration
    - TypeScript configuration
    - Starter folder structure (`inertia/app`, `inertia/pages`)

- [ ] **TASK-002**: Configure Development Environment
  - **Status:** planned
  - **Estimated Time:** 20 minutes
  - **Dependencies:** TASK-001
  - **Description:** Configure BiomeJS, Vite, Tailwind v4, and environment variables. Exclude ESLint/Prettier/pino-pretty.
  - **Deliverables:**
    - biome.json configuration
    - package.json with required dependencies
    - Tailwind v4 via `@tailwindcss/vite` and CSS-first imports

### Phase 2: Database and Models Setup (1.5 hours)

- [ ] **TASK-003**: Database Configuration and Migrations
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** TASK-002
  - **Description:** Configure PostgreSQL connection and create domain-driven migrations for Inertia consumption
  - **Deliverables:**
    - Start Docker database: `cd nooklet-db && docker-compose up -d`
    - Database configuration using Docker credentials
    - auth_users migration with UUID primary keys
    - profiles migration with auth_user relationship
    - nooklets migration with JSONB metadata and soft-delete
    - auth_access_tokens migration for API authentication

- [ ] **TASK-004**: Create BaseModel with UUID Support
  - **Status:** planned
  - **Estimated Time:** 30 minutes
  - **Dependencies:** TASK-003
  - **Description:** Implement BaseModel optimized for Inertia serialization
  - **Deliverables:**
    - app/models/base_model.ts with UUID configuration and custom serialization
    - Custom DateTime serialization for Inertia (ISO strings)
    - Soft-delete query scopes (whereNotArchived, whereNotDeleted, whereActive)
    - Domain-driven model structure: AuthUser, Profile, Nooklet models
    - Inertia-optimized serialization with computed properties

- [ ] **TASK-005**: Auth Models for Inertia Integration
  - **Status:** planned
  - **Estimated Time:** 30 minutes
  - **Dependencies:** TASK-004
  - **Description:** Create AuthUser and Profile models optimized for Inertia shared props
  - **Deliverables:**
    - app/features/auth/models/auth_user.ts
    - app/features/auth/models/profile.ts
    - Model serialization for Inertia/shared props

### Phase 3: Inertia-First Frontend Setup (2 hours)

- [ ] **TASK-006**: Inertia Server Configuration and Middleware
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** TASK-005
  - **Description:** Configure Inertia server adapter with shared props for auth state
  - **Deliverables:**
    - Inertia middleware configuration (start/kernel.ts)
    - Shared props (auth, flash, csrf) in config/inertia.ts
    - SSR enabled with entrypoint inertia/app/ssr.tsx

- [ ] **TASK-007**: Frontend Build and Styling Setup
  - **Status:** planned
  - **Estimated Time:** 30 minutes
  - **Dependencies:** TASK-006
  - **Description:** Configure Vite, React, and Tailwind CSS v4 for Inertia
  - **Deliverables:**
    - vite.config.ts with Inertia, React, Tailwind plugins
    - Tailwind v4 via `inertia/css/app.css` with `@import "tailwindcss"`
    - React + Inertia setup in inertia/app/app.tsx

- [ ] **TASK-008**: Core Inertia Components and Layout
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** TASK-007
  - **Description:** Create app.jsx and layout components with Inertia navigation
  - **Deliverables:**
    - resources/js/app.jsx with Inertia setup
    - resources/js/Components/Layout.jsx
    - resources/js/Components/NavBar.jsx with Inertia Link components
    - Basic styling with Tailwind CSS v4

### Phase 4: Authentication with Inertia (1.5 hours)

- [ ] **TASK-009**: Auth Service and Validation for Inertia
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** TASK-008
  - **Description:** Create authentication service optimized for Inertia form handling
  - **Deliverables:**
    - app/features/auth/auth_service.ts
    - app/features/auth/auth_validator.ts with Inertia error formatting
    - Password hashing and session management

- [ ] **TASK-010**: Auth Controllers for Inertia Pages
  - **Status:** planned
  - **Estimated Time:** 45 minutes
  - **Dependencies:** TASK-009
  - **Description:** Implement auth controllers that render Inertia pages
  - **Deliverables:**
    - app/features/auth/auth_controller.ts with Inertia.render()
    - Registration and login endpoints returning Inertia responses
    - Auth middleware for protected Inertia routes
    - Route definitions for auth pages

### Phase 5: Inertia Authentication UI (1.5 hours)

- [ ] **TASK-011**: Authentication Pages with Inertia Forms
  - **Status:** planned
  - **Estimated Time:** 60 minutes
  - **Dependencies:** TASK-010
  - **Description:** Create login and registration forms using Inertia form helpers
  - **Deliverables:**
    - resources/js/Pages/Auth/Login.jsx with useForm hook
    - resources/js/Pages/Auth/Register.jsx with validation
    - Form submission with Inertia.post()
    - Error handling and flash messages

- [ ] **TASK-012**: Dashboard with Inertia Navigation
  - **Status:** planned
  - **Estimated Time:** 30 minutes
  - **Dependencies:** TASK-011
  - **Description:** Create protected dashboard page with Inertia navigation
  - **Deliverables:**
    - resources/js/Pages/Dashboard.jsx
    - Protected route middleware
    - Basic timeline layout preparation

### Phase 6: Nooklet Management with Inertia (2 hours)

- [ ] **TASK-013**: Nooklet Model and Service for Inertia
  - **Status:** planned
  - **Estimated Time:** 30 minutes
  - **Dependencies:** TASK-012
  - **Description:** Create Nooklet model and service optimized for Inertia data flow
  - **Deliverables:**
    - app/features/nooklet/models/nooklet.ts with JSONB metadata
    - app/features/nooklet/services/nooklet_service.ts
    - Soft-delete implementation with Inertia-friendly responses

- [ ] **TASK-014**: Nooklet Controllers for Inertia Pages
  - **Status:** planned
  - **Estimated Time:** 60 minutes
  - **Dependencies:** TASK-013
  - **Description:** Implement nooklet CRUD controllers that render Inertia pages
  - **Deliverables:**
    - app/features/nooklet/nooklet_controller.ts with Inertia.render()
    - Create, read, update, delete endpoints with Inertia responses
    - app/features/nooklet/nooklet_validator.ts
    - Route definitions for nooklet management

- [ ] **TASK-015**: Nooklet Management UI with Inertia
  - **Status:** planned
  - **Estimated Time:** 90 minutes
  - **Dependencies:** TASK-014
  - **Description:** Create nooklet CRUD interface using Inertia forms and navigation
  - **Deliverables:**
    - resources/js/Pages/Nooklets/Index.jsx (timeline view)
    - resources/js/Pages/Nooklets/Create.jsx with useForm
    - resources/js/Pages/Nooklets/Edit.jsx with form pre-population
    - resources/js/Pages/Nooklets/Show.jsx for detail view
    - resources/js/Components/Timeline.jsx for nooklet list
    - Full CRUD functionality with Inertia navigation

### Phase 7: Playwright Testing Setup (1 hour)

- [ ] **TASK-016**: Playwright Testing Configuration
  - **Status:** planned
  - **Estimated Time:** 60 minutes
  - **Dependencies:** TASK-015
  - **Description:** Set up Playwright for frontend functionality testing
  - **Deliverables:**
    - playwright.config.js configuration
    - Basic test structure for Inertia pages
    - Authentication flow tests
    - Nooklet CRUD operation tests
    - Visual regression testing setup
    - CI/CD integration preparation

## Status Legend

- **planned**: Task is defined and ready to start
- **in-progress**: Task is currently being worked on
- **done**: Task is completed and verified

## Progress Tracking
**Completed:** 0/16 tasks (0%)
**In Progress:** 0/16 tasks
**Remaining:** 16/16 tasks

## Testing Strategy (Playwright Focus)

Each task should include Playwright testing for:

- **Visual Testing**: Screenshot comparisons for UI components
- **DOM Structure Validation**: Ensure proper Inertia page rendering
- **Form Interactions**: Test Inertia form submissions and validation
- **Navigation Testing**: Verify Inertia.js client-side navigation
- **Authentication Flows**: Login/logout with Inertia redirects
- **CRUD Operations**: Full nooklet management workflow
- **Console Log Monitoring**: Detect JavaScript errors
- **Performance Metrics**: Page load times and Inertia navigation speed

## Dependencies Summary

- Tasks 1-3: Project foundation + Database
- Tasks 4-5: Models with UUID support (sequential, Inertia-optimized)
- Tasks 6-8: Inertia frontend setup (depends on models)
- Tasks 9-10: Authentication backend (depends on Inertia setup)
- Tasks 11-12: Authentication UI (depends on auth backend)
- Tasks 13-14: Nooklet backend (depends on auth completion)
- Task 15: Nooklet UI (depends on nooklet backend)
- Task 16: Playwright testing (depends on full functionality)

## Key Notes

- Use the AdonisJS Inertia starter kit with React (`npm init adonisjs@latest -- -K=inertia --adapter=react`).
- Always consult Context7 for AdonisJS v6 + Inertia documentation when making architectural or API choices.
- Always validate testing approach and examples using the Playwright MCP tool.
- Prefer Adonis v6 Inertia scaffolding paths (`inertia/app`, `inertia/pages`); legacy `resources/js` paths acceptable if already present.
