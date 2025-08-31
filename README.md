# Nooklet — AdonisJS v6 + Inertia (React) Starter

## Project Overview

Nooklet is an AI‑powered "second brain" that helps you capture, organize, and retrieve knowledge. It uses AdonisJS v6 + Inertia (React) with a feature‑sliced backend and server‑driven UI.

Core goals:

- Keep domain logic isolated and testable
- Prefer server‑driven UI with Inertia over ad‑hoc REST wiring
- Provide clear structure and docs for easy onboarding

## Setup

1. Copy env template and configure values:

    ```bash
    cp .env.example .env
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start Postgres (Docker) and QDRANT:

    ```bash
    npm run db:dev
    ```

4. Run dev server (HMR + Inertia + Vite):

    ```bash
    npm run dev
    ```

5. Run Database Migrations:

    ```bash
    node ace migration:run
    ```

## Frontend

Once the dev server is running, You can access the local frontend in ``http://localhost:3333``.

## Technology Stack

- Backend
  - AdonisJS v6 (TypeScript)
  - Lucid ORM (PostgreSQL)
  - Session, Shield, Static, CORS, Inertia providers
- Frontend
  - Inertia.js (React adapter)
  - React 18+
  - Tailwind CSS v4 + daisyUI
- Tooling
  - Vite (client + SSR build)
  - Biome (lint/format)
- Testing
  - Japa (backend unit/integration)
  - Playwright (browser tests via MCP)
- Infrastructure
  - Docker (PostgreSQL 17)
  - Node.js (LTS recommended)

## Backend

The backend API is served from ``http://localhost:3333``. You can test it using tools like Postman or curl.

To view the list of API routes, run:

```bash
node ace list:routes
```

## Source Code Structure

### Feature-Based Architecture

The application follows a feature-based architecture where all endpoint source code is organized in `/app/features`. Each feature encapsulates all essential files needed for that domain.

#### Feature Organization

```text
app/features/
├── auth/                    # Authentication feature
│   ├── auth_controller.ts   # HTTP request handlers
│   ├── auth_user.ts         # Database model
│   ├── auth_service.ts      # Business logic
│   └── register_validator.ts # Input validation
└── user/                   # User management feature
    └── profile.ts          # User profile model
```

#### File Types and Responsibilities

Each feature contains the following types of files:

- **Controllers** (`*_controller.ts`): Handle HTTP requests and responses
  - Example: `auth_controller.ts` - handles registration, login endpoints
  - Contains route handlers that process requests and return responses
  - Delegates business logic to services

- **Models** (`*.ts`): Database models and data structures
  - Example: `auth_user.ts` - represents the auth_users table
  - Define database schema, relationships, and data access patterns
  - Use AdonisJS Lucid ORM for database interactions

- **Services** (`*_service.ts`): Business logic and core functionality
  - Example: `auth_service.ts` - handles user registration logic
  - Contains the main application logic separated from HTTP concerns
  - Performs database queries, data processing, and business rules

- **Validators** (`*_validator.ts`): Input validation and data sanitization
  - Example: `register_validator.ts` - validates registration form data
  - Define validation rules using VineJS
  - Ensure data integrity before processing

This type of folder architecture is called `feature-sliced` design, this is not the default AdonisJS structure, but it is a pattern being adopted slowly because of it's colocation benefits.

Currently when you use Adonis' builtin command for creating controllers/service/etc.. it may not follow our architecture. In the future we will create an Adonis command that is a codegen for our feature-sliced architecture.

#### Example Feature Structure

For the `auth` feature:

- `auth_controller.ts` - HTTP endpoints for registration/login
- `auth_user.ts` - User model with database schema
- `auth_service.ts` - Registration/authentication logic
- `register_validator.ts` - Input validation rules

#### Database Queries

Database queries are primarily handled in:

- **Models**: For basic CRUD operations and relationships
- **Services**: For complex business logic queries
- Direct database access using `db` service from `@adonisjs/lucid/services/db`

## API Documentation

- List all routes:

  ```bash
  node ace list:routes
  ```

- Route conventions:
  - Routes use dynamic imports for controllers to improve DX and boundaries.
  - Controllers are thin; they validate and delegate to services.

- Example route:

<augment_code_snippet path="start/routes.ts" mode="EXCERPT">

```ts
router.post("/register", [
  () => import("#features/auth/auth_controller"),
  "register",
])
```

## Database Migrations

- Create a migration:

  ```bash
  node ace make:migration <name>
  ```

- Run migrations:

  ```bash
  node ace migration:run
  ```

- Rollback last batch:

  ```bash
  node ace migration:rollback
  ```

- Reset and re-run:

  ```bash
  node ace migration:reset && node ace migration:run
  ```

Notes:

- Use UUID primary keys by default and include timestamps
- Ensure .env has correct Postgres connection values (see `.env.example`)
- Place complex queries in services; models express relations and common scopes

</augment_code_snippet>

## Tooling

- Biome for lint/format:

    ```bash
    npm run lint
    npm run format
    ```
