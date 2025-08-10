# Design Architecture: AdonisJS Backend Bootstrap with InertiaJS Frontend

## System Overview
Minimal full-stack application using AdonisJS v6 backend with InertiaJS frontend, following domain-driven architecture patterns from skedai-adonisjs. The system provides basic authentication and nooklet management with server-driven navigation.

## Starter Kit Initialization (React)
Initialize using the official AdonisJS Inertia starter with React as the adapter. Prefer SSR enabled for better UX; disable if not needed.

- Create app with Inertia starter:
  - `npm init adonisjs@latest -- -K=inertia --adapter=react --ssr`
  - Alternative (no SSR): `npm init adonisjs@latest -- -K=inertia --adapter=react --no-ssr`
- Configure Inertia (if starting from a plain app):
  - `npm i @adonisjs/inertia`
  - `node ace configure @adonisjs/inertia`
- Vite plugin (SSR example): ensure `vite.config.ts` includes the Inertia plugin with SSR entry `inertia/app/ssr.ts`.

Strict rule: for any setup detail, consult Context7 docs for AdonisJS v6 + Inertia and validate testing patterns via the Playwright MCP tool.

## Architecture Components

### Backend Architecture
**Location:** `/app/features/*`
**Key Components:**

- Authentication feature (`app/features/auth/`)
- User profile feature (`app/features/user/`)
- Nooklet feature (`app/features/nooklet/`)

**Files to Create:**

- `app/models/base_model.ts` - UUID primary keys and custom serialization
- `app/features/auth/models/auth_user.ts` - Authentication credentials
- `app/features/auth/controllers/auth_controller.ts` - Login/register endpoints
- `app/features/auth/services/auth_service.ts` - Business logic
- `app/features/auth/validators/auth_validator.ts` - Input validation
- `app/features/user/models/profile.ts` - User profile data
- `app/features/nooklet/models/nooklet.ts` - Core nooklet entity
- `app/features/nooklet/controllers/nooklet_controller.ts` - CRUD endpoints
- `app/features/nooklet/services/nooklet_service.ts` - Business logic
- `app/middleware/auth_middleware.ts` - Route protection

### Database Setup
**Location:** `../nooklet-db/` (Docker container)
**Configuration:**
- PostgreSQL 17 via Docker Compose
- Database: `nooklet_db`
- User: `nooklet_admin`
- Password: `nooklet_pass_1234`
- Port: `5432`

**Database Schema**
**Location:** `database/migrations/`
**Key Tables:**

- `auth_users` - Authentication credentials (id, email, password_hash)
- `profiles` - User profile data (id, auth_user_id, username, display_name)
- `nooklets` - Journal entries (id, user_id, title, content, metadata, is_archived)

**Files to Create:**

- `database/migrations/001_create_auth_users_table.ts`
- `database/migrations/002_create_profiles_table.ts`
- `database/migrations/003_create_nooklets_table.ts`

### Frontend Architecture
**Location:** `resources/`
**Key Components:**

- InertiaJS setup with React
- Tailwind CSS v4 configuration
- Basic page components

**Files to Create:**

- Option A (legacy paths):
  - `resources/js/app.jsx` - Inertia setup and shared props
  - `resources/js/Pages/Dashboard.jsx` - Main timeline view
  - `resources/js/Pages/Auth/Login.jsx` - Login form
  - `resources/js/Pages/Auth/Register.jsx` - Registration form
  - `resources/js/Pages/Nooklets/Create.jsx` - Create nooklet form
  - `resources/js/Pages/Nooklets/Edit.jsx` - Edit nooklet form
  - `resources/js/Components/NavBar.jsx` - Navigation component
  - `resources/js/Components/Timeline.jsx` - Nooklet list component
  - `resources/css/app.css` - Tailwind CSS imports and custom styles

- Option B (AdonisJS v6 Inertia scaffolding):
  - `inertia/app/app.tsx` - React + Inertia bootstrap
  - `inertia/pages/Dashboard.tsx` - Main timeline view
  - `inertia/pages/auth/Login.tsx` - Login form
  - `inertia/pages/auth/Register.tsx` - Registration form
  - `inertia/pages/nooklets/Create.tsx` - Create nooklet form
  - `inertia/pages/nooklets/Edit.tsx` - Edit nooklet form
  - `inertia/pages/nooklets/Index.tsx` - List/timeline view
  - `inertia/pages/_components/NavBar.tsx` - Navigation component
  - `inertia/pages/_components/Timeline.tsx` - Nooklet list component
  - `inertia/app/ssr.tsx` - SSR entrypoint (if SSR enabled)

### Color Palette (Extracted from Mobile Screenshots)

**Dark Theme Colors (Primary):**
- `--color-navy-900`: `#1a1d29` (main background)
- `--color-gray-800`: `#2a2d3a` (secondary background/cards)
- `--color-gray-700`: `#3a3d4a` (borders/dividers)

**Accent Colors (Light Blue):**
- `--color-blue-400`: `#60a5fa` (primary actions)
- `--color-blue-300`: `#93c5fd` (secondary highlights)
- `--color-blue-100`: `#dbeafe` (subtle accents)

**Text Colors:**
- `--color-slate-50`: `#f8fafc` (primary text)
- `--color-slate-300`: `#cbd5e1` (secondary text)
- `--color-slate-400`: `#94a3b8` (muted text)

**Status Colors:**
- `--color-green-500`: `#10b981` (success)
- `--color-orange-500`: `#f59e0b` (warning)
- `--color-red-500`: `#ef4444` (error)

**Tailwind CSS v4 Configuration:**
```css
/* resources/css/app.css */
@import "tailwindcss";

@theme {
  --color-navy-900: #1a1d29;
  --color-gray-800: #2a2d3a;
  --color-gray-700: #3a3d4a;
  --color-blue-400: #60a5fa;
  --color-blue-300: #93c5fd;
  --color-blue-100: #dbeafe;
  --color-slate-50: #f8fafc;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-green-500: #10b981;
  --color-orange-500: #f59e0b;
  --color-red-500: #ef4444;
}
```

### Configuration Files
**Location:** Root and config directories
**Files to Modify/Create:**

- `package.json` - Dependencies and scripts
- `biome.json` - Linting and formatting configuration
- `vite.config.ts` - Build configuration with InertiaJS (SSR optional)
- `config/database.ts` - PostgreSQL connection
- `config/inertia.ts` - InertiaJS server configuration
- `.env.example` - Environment variables template

## Integration Points

### InertiaJS Integration

- Server adapter middleware for AdonisJS
- Shared props: authenticated user, flash messages, CSRF token
- Client-side navigation with `<Link>` components
- Form handling with Inertia form helpers
 - SSR optional: configure in `config/inertia.ts` and `vite.config.ts`

### Authentication Flow

- Registration creates AuthUser and Profile records
- Login returns access token for API authentication
- Middleware protects nooklet routes
- Frontend receives user data via shared props

### Data Flow

1. User authenticates via InertiaJS forms
2. Backend validates and creates session
3. Protected routes serve Inertia responses with data
4. React components render with server-provided props
5. User interactions trigger Inertia requests

## Security & Performance Considerations

### Security

- Password hashing with bcrypt
- CSRF protection via AdonisJS middleware
- Input validation using VineJS
- SQL injection prevention via Lucid ORM

### Performance

- Minimal database queries (no N+1 problems)
- Efficient pagination for nooklet timeline
- Static asset optimization via Vite
- Server-side rendering via InertiaJS

## Testing Strategy

### MCP Playwright Testing

- Visual testing: Screenshot comparison for UI components
- DOM testing: Element presence and content validation
- Console log monitoring: Debug output and error detection
- User flow testing: Registration, login, nooklet CRUD

**Test Scenarios:**

- User registration and login flow
- Dashboard timeline rendering
- Nooklet creation and editing
- Navigation between pages
- Responsive design validation

### Testing Files to Create

- Basic test setup for Playwright integration
- Test utilities for authentication
- Page object models for main components
 - Japa integration tests for Inertia endpoints as needed (`withInertia`, `assertInertia*`)

## Development Environment

### Required Dependencies
**Backend:**

- `@adonisjs/core` - Framework core
- `@adonisjs/lucid` - Database ORM
- `@adonisjs/auth` - Authentication
- `@vinejs/vine` - Validation
- `pg` - PostgreSQL driver
- `@biomejs/biome` - Linting/formatting

**Frontend:**

- `@inertiajs/react` - React adapter
- `react` - UI library
- `@tailwindcss/vite` - Tailwind CSS v4
- `vite` - Build tool

### Build Process

1. Biome handles code formatting and linting
2. Vite builds frontend assets with Tailwind CSS
3. AdonisJS serves both API and Inertia responses
4. Hot reload for development efficiency

## File Structure Summary

```
app/
├── features/
│   ├── auth/
│   ├── user/
│   └── nooklet/
├── models/
│   └── base_model.ts
└── middleware/
    └── auth_middleware.ts

resources/ (if using legacy paths)
├── js/
│   ├── app.jsx
│   ├── Pages/
│   └── Components/
└── css/
    └── app.css

inertia/ (if using Adonis v6 scaffolding)
├── app/
│   ├── app.tsx
│   └── ssr.tsx
└── pages/
    ├── Dashboard.tsx
    ├── auth/
    └── nooklets/

database/
└── migrations/
    ├── 001_create_auth_users_table.ts
    ├── 002_create_profiles_table.ts
    └── 003_create_nooklets_table.ts
```

## Documentation & Tools Policy
- Always consult Context7 for AdonisJS v6 + Inertia documentation before finalizing changes.
- Always validate testing approaches and examples using the Playwright MCP tool.
