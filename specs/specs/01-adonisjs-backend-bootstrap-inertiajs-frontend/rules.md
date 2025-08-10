# Project Rules & Guidelines: AdonisJS Backend Bootstrap with InertiaJS Frontend

**Purpose:** This file contains project-specific rules, guidelines, and clarifications that must be followed throughout the implementation. AI agents should read this file before starting work and update it with new discoveries.

---

## Testing Procedures

### How to Test

- **MCP Playwright Testing**: Use MCP Playwright for all visual and DOM testing
  - Strict: Always validate testing patterns and examples via the Playwright MCP tool
- **Visual Testing**: Take screenshots for UI component validation
- **DOM Testing**: Check element presence, content, and structure
- **Console Monitoring**: Add debug logs and monitor console output
- **User Flow Testing**: Test complete registration → login → nooklet creation flow

### Test Environment Setup

- **Database**: Start PostgreSQL via Docker: `cd ../nooklet-db && docker-compose up -d`
- **Database Connection**: Use credentials from `../nooklet-db/.env`
  - Database: `nooklet_db`
  - User: `nooklet_admin`
  - Password: `nooklet_pass_1234`
  - Host: `localhost:5432`
- Environment variables configured (.env file)
- Server started with `node ace serve --watch`
- Frontend assets built with `npm run dev`

### Validation Criteria

- Server starts without errors
- All database migrations run successfully
- Frontend renders without console errors
- User can complete full authentication flow
- Nooklet CRUD operations work correctly
- Responsive design displays properly

---

## Implementation Guidelines

### Code Standards

- **BiomeJS Only**: Use BiomeJS for linting and formatting (NO ESLint/Prettier/pino-pretty)
- **TypeScript**: All backend code must use TypeScript
- **Domain-Driven Structure**: Follow `app/features/*` pattern from skedai-adonisjs
- **UUID Primary Keys**: All models must use UUID, not auto-increment integers
- **Soft-Delete Pattern**: Use `isArchived` boolean flag for soft deletes

### Architecture Patterns

- **Auth Separation**: Split auth_users (credentials) and profiles (user data)
- **Service Layer**: Business logic in services, controllers handle HTTP only
- **Dependency Injection**: Use `@inject()` decorator for service dependencies
- **JSONB Metadata**: Use PostgreSQL JSONB for flexible schema fields
- **InertiaJS Navigation**: Server-driven navigation, minimal client-side routing

### Documentation & Tooling Requirements (Strict)

- **Context7 First**: Always consult Context7 to retrieve up-to-date documentation for AdonisJS v6, Inertia, Lucid, VineJS, and related tooling before making or updating code/specs.
- **Resolve Before Fetch**: Use `resolve-library-id` before `get-library-docs` when using Context7 tools.
- **Playwright MCP**: Always use the Playwright MCP tool to reference testing code patterns and validate test setup for UI flows.
- **Source of Truth**: If conflicts arise, prefer official AdonisJS v6 docs (via Context7) for framework behavior and API shapes.

### File Organization

- Models: `app/features/[domain]/models/`
- Controllers: `app/features/[domain]/controllers/`
- Services: `app/features/[domain]/services/`
- Validators: `app/features/[domain]/validators/`
- Frontend Pages: `resources/js/Pages/`
- Frontend Components: `resources/js/Components/`

---

## File-Specific Instructions

### BaseModel (app/models/base_model.ts)

- Must extend Lucid BaseModel
- Configure UUID primary keys by default
- Implement custom DateTime serialization to ISO strings
- Include soft-delete query scopes

### Database Migrations

- Use `gen_random_uuid()` for UUID default values
- Include `created_at` and `updated_at` timestamps
- Add `is_archived` boolean for soft-delete capability
- Use JSONB type for metadata fields

### InertiaJS Configuration

- Configure shared props: auth user, flash messages, CSRF token
- Use server-side rendering for all pages
- Implement proper error handling for Inertia responses

### Color Usage Guidelines (From Mobile Screenshots)

- **Primary Background**: Use `navy-900` (#1a1d29) for main app background
- **Card/Component Background**: Use `gray-800` (#2a2d3a) for elevated surfaces
- **Borders/Dividers**: Use `gray-700` (#3a3d4a) for subtle separations
- **Primary Actions**: Use `blue-400` (#60a5fa) for buttons, links, CTAs
- **Secondary Highlights**: Use `blue-300` (#93c5fd) for hover states, secondary actions
- **Subtle Accents**: Use `blue-100` (#dbeafe) for very light highlights, badges
- **Primary Text**: Use `slate-50` (#f8fafc) for main content text
- **Secondary Text**: Use `slate-300` (#cbd5e1) for labels, descriptions
- **Muted Text**: Use `slate-400` (#94a3b8) for timestamps, metadata
- **Status Indicators**: Use semantic colors (green-500, orange-500, red-500) for success/warning/error states

---

## User Clarifications

### Project Scope

- **Essential Features Only**: Focus on MVP functionality for pattern evaluation
- **No Advanced Features**: Skip AI features, mood tracking, tags for now
- **Simple UI**: Basic responsive design, will be refined later
- **Testing Priority**: Visual and DOM testing more important than unit tests

### Technology Preferences

- **Backend**: Follow skedai-adonisjs patterns exactly
- **Frontend**: InertiaJS + React + Tailwind v4 (CSS-first config)
- **Tooling**: BiomeJS only, exclude ESLint/Prettier/pino-pretty
- **Testing**: MCP Playwright for visual/DOM testing

---

## Gotchas & Considerations

### Known Issues

- InertiaJS AdonisJS adapter may need custom configuration
- Tailwind CSS v4 uses different configuration approach (@import "tailwindcss")
- UUID primary keys require PostgreSQL `gen_random_uuid()` function

### Things to Watch Out For

- Don't create ESLint or Prettier configuration files
- Ensure all models extend custom BaseModel, not Lucid BaseModel directly
- Use `isArchived` flag for soft deletes, not `deletedAt` timestamp
- InertiaJS requires specific middleware configuration for AdonisJS

### Dependencies

- PostgreSQL with UUID extension
- Node.js 18+ for AdonisJS v6 compatibility
- Vite for frontend build process
- React 18+ for modern features

---

## Development Environment

### Required Tools

- Node.js 18+
- Docker and Docker Compose
- npm or yarn package manager
- BiomeJS CLI

### Setup Instructions

1. **Start Database**: `cd ../nooklet-db && docker-compose up -d`
2. Initialize AdonisJS project with TypeScript
3. Configure PostgreSQL connection using Docker database credentials
4. Install InertiaJS server and client packages
5. Set up Vite with React and Tailwind CSS v4
6. Configure BiomeJS for code formatting

---

## Debugging & Troubleshooting

### Common Issues

- **Database Connection**: Check PostgreSQL service and credentials
- **Migration Errors**: Ensure UUID extension is enabled
- **Frontend Build**: Verify Vite configuration and dependencies
- **InertiaJS**: Check middleware order and shared props configuration

### Debugging Procedures

1. Check server logs for backend errors
2. Monitor browser console for frontend errors
3. Verify database connection and migrations
4. Test API endpoints independently
5. Use MCP Playwright for visual debugging

### Log Analysis

- Add console.log statements for debugging
- Monitor network requests in browser dev tools
- Check AdonisJS request/response logs
- Verify database query logs if needed

---

## Integration Points

### External Systems

- PostgreSQL database for data persistence
- InertiaJS for server-client communication
- Vite for frontend asset building

### API Requirements

- RESTful endpoints for nooklet CRUD
- Authentication via access tokens
- JSON responses for API calls
- Inertia responses for page navigation

### Data Flow

1. User authenticates via InertiaJS forms
2. Server validates and creates session
3. Protected routes serve Inertia responses with data
4. React components render with server props
5. User interactions trigger Inertia requests

---

## Performance Considerations

### Optimization Requirements

- Efficient database queries (avoid N+1 problems)
- Minimal frontend bundle size
- Server-side rendering for fast initial loads
- Proper pagination for nooklet lists

### Resource Constraints

- Keep initial implementation simple
- Focus on functionality over optimization
- Use standard patterns for maintainability

---

## Notes for AI Agents

### Critical Instructions

- **Always read this file before starting work**
- **Update this file with new discoveries and clarifications**
- **Reference this file in session handoffs**
- **Add critical rules to Augment user rules and memories when possible**
- **Use MCP Playwright for all testing validation**
- **Always consult Context7 for documentation and examples**
- **Follow skedai-adonisjs patterns exactly**

### Update Guidelines

- Add new sections as needed
- Keep information specific and actionable
- Include examples when helpful
- Remove outdated information
- Maintain clear organization

---

*This file should be continuously updated throughout the project lifecycle to capture important guidelines and clarifications.*
