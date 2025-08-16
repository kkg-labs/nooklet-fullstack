# Structure Steering

## Project Organization

### Directory Structure

**Root Level Organization**
```
nooklet-next/
├── app/                    # Backend application code
├── app-docs/              # Project documentation
├── config/                # AdonisJS configuration
├── database/              # Migrations, factories, seeders
├── inertia/               # Frontend React application
├── resources/             # Views and assets
├── specs/                 # Specification-driven development
├── start/                 # Application bootstrap
└── tests/                 # Test suites
```

**Backend Structure (Domain-Driven)**
```
app/
├── features/              # Domain-driven organization
│   ├── auth/             # Authentication domain
│   │   ├── models/       # AuthUser model
│   │   ├── controllers/  # Auth controllers
│   │   ├── services/     # Auth business logic
│   │   └── validators/   # Auth validation schemas
│   ├── user/             # User profile domain
│   │   ├── models/       # Profile model
│   │   ├── controllers/  # Profile controllers
│   │   └── services/     # Profile services
│   ├── nooklet/          # Core journaling domain
│   │   ├── models/       # Nooklet, Tag models
│   │   ├── controllers/  # Nooklet CRUD controllers
│   │   ├── services/     # Business logic
│   │   └── validators/   # Input validation
│   └── ai/               # Future AI features
├── models/
│   └── base_model.ts     # Shared base model with UUID
├── middleware/           # Global middleware
└── exceptions/           # Custom exception classes
```

**Frontend Structure (Inertia + React)**
```
inertia/
├── app/
│   └── app.tsx           # Inertia setup and root component
├── pages/                # Inertia page components
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/
│   │   └── Index.tsx     # Main timeline view
│   └── nooklets/
│       ├── Show.tsx
│       ├── Edit.tsx
│       └── Create.tsx
├── components/           # Reusable React components
│   ├── NavBar.tsx
│   ├── Timeline.tsx
│   └── NookletCard.tsx
├── css/
│   └── app.css          # Tailwind CSS v4 imports
└── tsconfig.json        # Frontend TypeScript config
```

**Documentation Structure**
```
app-docs/
├── PRD.md                    # Product Requirements Document
├── backend-architecture.md  # Backend technical details
├── frontend-architecture.md # Frontend technical details
├── layer-spec-template.md   # SPEC creation template
└── engineering/             # Additional engineering docs
    ├── Backend Specifications.md
    └── erd.dbml             # Database schema

specs/
├── templates/               # SPEC templates
├── specs/                   # Active specifications
│   └── [XX]-[feature-name]/ # Numbered feature specs
│       ├── requirements.md  # Acceptance criteria
│       ├── design.md       # Technical design
│       ├── tasks.md        # Implementation tasks
│       ├── rules.md        # Feature-specific rules
│       └── sessions/       # Implementation sessions
└── archived-specs/         # Completed specifications
```

### File Naming Conventions

**Backend Files**
- Models: `snake_case.ts` (e.g., `auth_user.ts`, `nooklet_tag.ts`)
- Controllers: `snake_case_controller.ts` (e.g., `nooklet_controller.ts`)
- Services: `snake_case_service.ts` (e.g., `nooklet_service.ts`)
- Validators: `snake_case_validator.ts` (e.g., `create_nooklet_validator.ts`)

**Frontend Files**
- Components: `PascalCase.tsx` (e.g., `NavBar.tsx`, `NookletCard.tsx`)
- Pages: `PascalCase.tsx` (e.g., `Dashboard.tsx`, `Login.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`, `apiHelpers.ts`)

**Database Conventions**
- Tables: `snake_case` (e.g., `auth_users`, `nooklet_tags`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`, `is_archived`)
- Primary Keys: `id` (UUID type)
- Foreign Keys: `[table]_id` (e.g., `user_id`, `nooklet_id`)

**Route Conventions**
- REST-like patterns: `/nooklets`, `/nooklets/:id`, `/nooklets/:id/edit`
- Kebab-case for multi-word resources: `/user-settings`, `/tag-management`
- API versioning: `/api/v1/...` (future consideration)

### Module Organization

**Feature-Based Modules**
Each domain feature is self-contained with:
- Models for data representation
- Controllers for HTTP handling
- Services for business logic
- Validators for input validation
- Tests for the complete feature

**Shared Modules**
- `app/models/base_model.ts` - Common model functionality
- `app/middleware/` - Cross-cutting concerns
- `app/exceptions/` - Custom error handling
- `inertia/components/` - Reusable UI components

**Import Path Mapping**
```json
{
  "#features/*": "./app/features/*.js",
  "#models/*": "./app/models/*.js",
  "#controllers/*": "./app/controllers/*.js",
  "#services/*": "./app/services/*.js",
  "#validators/*": "./app/validators/*.js"
}
```

### Configuration Management

**Environment Configuration**
- `.env` files for environment-specific settings
- `config/` directory for structured configuration
- Type-safe configuration with TypeScript interfaces
- Separate configs for database, auth, session, etc.

**Build Configuration**
- `vite.config.ts` for frontend build configuration
- `tsconfig.json` for TypeScript compilation
- `biome.json` for linting and formatting rules
- `package.json` for dependency management and scripts

## Development Workflow

### Specification-Driven Development

**Layer-Based SPEC Creation**
1. **Planning Phase**: Identify vertical slice ("Layer") to implement
2. **SPEC Creation**: Use `layer-spec-template.md` to create comprehensive specification
3. **Review Phase**: Team review of requirements, design, and tasks
4. **Implementation Phase**: Follow tasks.md checklist for development
5. **Verification Phase**: Test against acceptance criteria

**SPEC Structure**
```
specs/specs/[XX]-[layer-slug]/
├── requirements.md    # Acceptance criteria and user stories
├── design.md         # Data model, routes, UI design
├── tasks.md          # Checkboxed implementation steps
├── rules.md          # Layer-specific constraints
└── sessions/         # Implementation session tracking
    └── 01-[init].md  # Session notes and progress
```

**Vertical Slice Approach**
Each layer includes:
- Backend: models, migrations, services, controllers, routes
- Frontend: Inertia pages, forms, components
- Tests: Japa backend tests + Playwright E2E verification
- Documentation: Updated specs and session notes

### Git Branching Strategy

**Branch Naming**
- Feature branches: `feature/[layer-name]` (e.g., `feature/nooklet-journal`)
- Bug fixes: `fix/[issue-description]` (e.g., `fix/auth-token-refresh`)
- Documentation: `docs/[update-description]` (e.g., `docs/api-documentation`)

**Workflow Process**
1. Create feature branch from `main`
2. Implement according to SPEC tasks
3. Create pull request with SPEC reference
4. Code review and testing
5. Merge to `main` after approval
6. Update SPEC status and archive if complete

### Code Review Process

**Review Checklist**
- [ ] SPEC requirements met
- [ ] Code follows established patterns
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Performance considerations addressed
- [ ] Security best practices followed

**Review Criteria**
- Domain-driven structure maintained
- Service layer pattern followed
- Proper error handling implemented
- TypeScript types properly defined
- Biome formatting and linting passed

### Testing Workflow

**Test-Driven Development**
1. Write failing tests based on SPEC acceptance criteria
2. Implement minimum code to pass tests
3. Refactor while maintaining test coverage
4. Add integration and E2E tests

**Test Execution**
```bash
# Backend tests
npm run test

# Frontend type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run format
```

**Continuous Integration**
- Automated testing on pull requests
- Code quality checks with Biome
- TypeScript compilation verification
- Performance regression testing

## Documentation Structure

### Where to Find What

**Product Information**
- `app-docs/PRD.md` - Product requirements and vision
- `.spec-workflow/steering/product.md` - Product steering document
- `specs/specs/*/requirements.md` - Feature-specific requirements

**Technical Information**
- `app-docs/backend-architecture.md` - Backend technical details
- `app-docs/frontend-architecture.md` - Frontend technical details
- `.spec-workflow/steering/tech.md` - Technical steering document
- `specs/specs/*/design.md` - Feature-specific technical design

**Process Information**
- `.spec-workflow/steering/structure.md` - This document
- `app-docs/layer-spec-template.md` - SPEC creation template
- `specs/specs/*/tasks.md` - Implementation task lists
- `specs/specs/*/sessions/` - Development session notes

### How to Update Documentation

**SPEC Updates**
1. Update relevant SPEC documents when requirements change
2. Create new session files for significant implementation phases
3. Archive completed SPECs to `specs/archived-specs/`
4. Update layer template based on lessons learned

**Architecture Updates**
1. Update steering documents for major architectural changes
2. Update feature-specific architecture in design.md files
3. Document decisions in session files
4. Communicate changes to team

**Process Updates**
1. Update this structure document for workflow changes
2. Update layer template for process improvements
3. Document new patterns and conventions
4. Share updates in team communications

### Spec Organization

**Active Development**
- `specs/specs/` - Current and planned features
- Numbered prefixes for implementation order
- Clear naming: `01-auth-bootstrap`, `02-nooklet-journal`

**Completed Work**
- `specs/archived-specs/` - Completed implementations
- Maintain for reference and future enhancements
- Include final session notes and lessons learned

**Templates and Guidelines**
- `specs/templates/` - Reusable SPEC templates
- `app-docs/layer-spec-template.md` - Primary template
- Guidelines for creating consistent SPECs

## Team Conventions

### Communication Guidelines

**SPEC-Driven Communication**
- Reference SPEC numbers in discussions
- Use session files for implementation notes
- Document decisions and rationale
- Share progress through task completion

**Code Review Communication**
- Reference specific SPEC requirements
- Explain architectural decisions
- Suggest improvements with rationale
- Maintain constructive feedback culture

### Meeting Structures

**SPEC Review Meetings**
- Review new SPECs before implementation
- Validate requirements and design decisions
- Identify risks and dependencies
- Assign implementation ownership

**Progress Check-ins**
- Review task completion status
- Discuss blockers and solutions
- Plan next implementation phases
- Update project timeline

### Decision-Making Process

**Architectural Decisions**
1. Document in relevant SPEC or steering document
2. Team review and discussion
3. Decision recorded with rationale
4. Implementation guidelines updated

**Feature Decisions**
1. Update requirements in SPEC
2. Review impact on design and tasks
3. Team approval for significant changes
4. Update implementation plan

### Knowledge Sharing

**Documentation First**
- All decisions documented in SPECs
- Session notes for implementation details
- Code comments for complex logic
- README files for setup and usage

**Code Patterns**
- Follow established domain-driven patterns
- Use service layer for business logic
- Maintain consistent error handling
- Share reusable components and utilities

**Learning and Improvement**
- Regular retrospectives on SPEC process
- Update templates based on experience
- Share lessons learned in session notes
- Continuous improvement of development workflow

## Quality Assurance

### Code Quality Standards

**TypeScript Standards**
- Strict mode enabled
- Explicit types for public APIs
- Interface definitions for data contracts
- Consistent naming conventions

**Testing Standards**
- Unit tests for services and models
- Integration tests for controllers
- E2E tests for critical user flows
- Minimum 80% coverage for core features

**Documentation Standards**
- Up-to-date SPEC documents
- Clear session notes
- Code comments for complex logic
- API documentation with examples

### Process Quality

**SPEC Quality**
- Clear acceptance criteria
- Comprehensive task breakdown
- Risk identification and mitigation
- Regular review and updates

**Implementation Quality**
- Follow established patterns
- Complete task checklists
- Proper error handling
- Performance considerations

**Review Quality**
- Thorough code review process
- SPEC compliance verification
- Test coverage validation
- Documentation completeness check