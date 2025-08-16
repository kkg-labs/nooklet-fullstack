# Technical Steering

## Architecture Overview

### System Architecture

**Full-Stack Architecture**: Modern web application with server-side rendering and progressive enhancement
- **Backend**: AdonisJS v6 with TypeScript for API and server-side logic
- **Frontend**: Inertia.js + React for seamless SPA-like experience with SSR benefits
- **Database**: PostgreSQL with advanced features (JSONB, UUIDs, future vector support)
- **Styling**: Tailwind CSS v4 with CSS-first configuration
- **Build**: Vite for fast development and optimized production builds

### Technology Stack Choices

**Backend Stack**
- **Framework**: AdonisJS v6 (TypeScript) - Full-featured Node.js framework
- **ORM**: Lucid ORM with PostgreSQL driver
- **Authentication**: @adonisjs/auth with access token strategy
- **Validation**: VineJS for request validation
- **Database**: PostgreSQL 14+ with extensions (future: pgvector for AI)

**Frontend Stack**
- **Framework**: React 18+ with modern hooks and concurrent features
- **Routing**: Inertia.js for server-driven navigation
- **Styling**: Tailwind CSS v4 with CSS-first approach via @tailwindcss/vite
- **Build Tool**: Vite for fast HMR and optimized builds

**Development Tools**
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Testing**: Japa for backend tests, Playwright for E2E
- **Type Checking**: TypeScript with strict configuration

### Integration Patterns

**Inertia.js Integration**
- Server-side rendering with client-side navigation
- Shared props for global state (auth, flash messages, CSRF)
- Partial reloads for efficient data updates
- Form handling with automatic CSRF protection

**Database Integration**
- UUID primary keys with `gen_random_uuid()`
- JSONB columns for flexible metadata storage
- Soft-delete pattern with dual flags (`is_archived` + `deleted_at`)
- Future-ready for vector embeddings and semantic search

### Data Flow Design

**Request Flow**
1. Client request → AdonisJS router
2. Middleware chain (auth, CSRF, rate limiting)
3. Controller → Service layer → Model/Database
4. Response via Inertia.render() or JSON API
5. Client-side Inertia handling and React rendering

**Authentication Flow**
- Access token-based authentication
- Separate `auth_users` (credentials) and `profiles` (user data)
- Session-based token storage with refresh capability
- Middleware guards for protected routes

## Development Standards

### Coding Conventions

**TypeScript Standards**
- Strict TypeScript configuration with `noImplicitAny`
- Explicit return types for public methods
- Interface definitions for all data contracts
- Consistent naming: camelCase for variables, PascalCase for classes

**Code Organization**
- Domain-driven structure under `app/features/*`
- Feature-based grouping: models, controllers, services, validators per domain
- Dependency injection with `@inject()` decorator
- Service layer pattern for business logic separation

**File Naming**
- Snake_case for database tables and columns
- camelCase for TypeScript variables and methods
- PascalCase for classes and React components
- kebab-case for file names and routes

### Testing Requirements

**Backend Testing (Japa)**
- Unit tests for services and models
- Integration tests for controllers and routes
- Database tests with transaction rollback
- Minimum 80% code coverage for core features

**Frontend Testing**
- Component testing with React Testing Library
- Integration tests for user workflows
- Playwright for critical E2E scenarios
- Manual verification plans for complex UI interactions

**Test Organization**
```
tests/
├── functional/          # API integration tests
├── unit/               # Service and model tests
└── browser/            # Playwright E2E tests
```

### Security Guidelines

**Authentication & Authorization**
- Access token-based auth with secure token storage
- CSRF protection on all state-changing operations
- Rate limiting on authentication endpoints
- Input validation with VineJS schemas

**Data Protection**
- Soft-delete for all user data with recovery options
- Password hashing with Adonis auth providers
- Secure session management with httpOnly cookies
- SQL injection prevention via ORM parameter binding

**API Security**
- Request validation on all endpoints
- Proper error handling without information leakage
- CORS configuration for production deployment
- Security headers via @adonisjs/shield

### Performance Standards

**Backend Performance**
- p95 response time < 200ms for core endpoints
- Efficient database queries with proper indexing
- Pagination for all list endpoints
- Caching strategy for frequently accessed data

**Frontend Performance**
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Code splitting for optimal bundle sizes

**Database Performance**
- Proper indexing on frequently queried columns
- JSONB indexing for metadata queries
- Connection pooling for concurrent requests
- Query optimization and monitoring

## Technology Choices

### Programming Languages and Versions

**Backend**
- TypeScript 5.8+ with strict configuration
- Node.js 18+ LTS for runtime
- PostgreSQL 14+ for database

**Frontend**
- TypeScript 5.8+ for type safety
- React 18+ with concurrent features
- Modern JavaScript (ES2022+) features

### Frameworks and Libraries

**Core Dependencies**
```json
{
  "backend": {
    "@adonisjs/core": "^6.18.0",
    "@adonisjs/lucid": "^21.6.1",
    "@adonisjs/auth": "^9.4.0",
    "@adonisjs/inertia": "^3.1.1",
    "@vinejs/vine": "^3.0.1"
  },
  "frontend": {
    "@inertiajs/react": "^2.0.17",
    "react": "^19.1.1",
    "tailwindcss": "^4.0.0"
  },
  "tooling": {
    "@biomejs/biome": "^1.9.4",
    "vite": "^6.3.5",
    "typescript": "~5.8.3"
  }
}
```

**Development Tools**
- Biome for linting and formatting (no ESLint/Prettier)
- Vite for build tooling and HMR
- Hot-hook for backend hot reloading
- Japa for testing framework

### Deployment Infrastructure

**Development Environment**
- Docker Compose for local PostgreSQL
- Vite dev server with HMR
- Hot reloading for backend changes

**Production Considerations**
- Node.js runtime with PM2 or similar
- PostgreSQL with connection pooling
- CDN for static assets
- Redis for caching and rate limiting (future)

## Patterns & Best Practices

### Recommended Code Patterns

**Domain-Driven Design**
```typescript
// Feature organization
app/features/nooklet/
├── models/nooklet.ts
├── controllers/nooklet_controller.ts
├── services/nooklet_service.ts
└── validators/nooklet_validator.ts
```

**Service Layer Pattern**
```typescript
@inject()
export default class NookletService {
  constructor(private nookletRepo: NookletRepository) {}
  
  async createNooklet(data: CreateNookletData): Promise<Nooklet> {
    // Business logic here
  }
}
```

**BaseModel with UUID**
```typescript
export default class BaseModel extends LucidBaseModel {
  public static primaryKey = 'id'
  
  public serialize() {
    const json = super.serialize()
    // Custom DateTime serialization
    return json
  }
}
```

### Error Handling Approaches

**Backend Error Handling**
- Custom exception classes for domain errors
- Global exception handler for consistent API responses
- Structured logging with request IDs
- Graceful degradation for external service failures

**Frontend Error Handling**
- Error boundaries for React component errors
- Inertia error page handling
- User-friendly error messages
- Retry mechanisms for transient failures

### Logging and Monitoring

**Structured Logging**
- JSON-formatted logs for production
- Request IDs for tracing
- Performance metrics logging
- Error tracking with stack traces

**Monitoring Strategy**
- Application performance monitoring
- Database query performance
- Error rate tracking
- User experience metrics

### Documentation Standards

**Code Documentation**
- JSDoc comments for public APIs
- README files for each feature domain
- Architecture decision records (ADRs)
- API documentation with examples

**Specification Documentation**
- Layer-based SPEC creation for vertical slices
- Requirements, design, and tasks documentation
- Session files for implementation tracking
- Rules and constraints documentation

## AI Integration Architecture

### Future AI Capabilities

**Vector Database Integration**
- pgvector extension for PostgreSQL
- Embedding storage for semantic search
- Vector similarity queries for content discovery

**AI Service Integration**
- External AI API integration patterns
- Content analysis and auto-tagging
- Mood detection and sentiment analysis
- RAG (Retrieval-Augmented Generation) system

**Data Pipeline Architecture**
- Async processing for AI operations
- Queue system for background tasks
- Caching for AI-generated insights
- Incremental processing for large datasets

## Migration and Upgrade Strategy

### Database Migrations
- UUID primary keys with `gen_random_uuid()`
- JSONB columns with default empty objects
- Soft-delete columns (`is_archived`, `deleted_at`)
- Proper indexing for performance

### Dependency Management
- Lock file management with npm
- Regular security updates
- Compatibility testing for major upgrades
- Gradual migration strategies for breaking changes

### Backward Compatibility
- API versioning strategy
- Database schema evolution
- Feature flag system for gradual rollouts
- Deprecation notices and migration guides

## Quality Assurance

### Code Quality Metrics
- TypeScript strict mode compliance
- Test coverage thresholds (80%+ for core features)
- Performance benchmarks
- Security vulnerability scanning

### Review Process
- Pull request reviews for all changes
- Automated testing in CI/CD pipeline
- Code quality checks with Biome
- Performance regression testing

### Continuous Integration
- Automated testing on all commits
- Build verification for multiple environments
- Security scanning and dependency checks
- Performance monitoring and alerting