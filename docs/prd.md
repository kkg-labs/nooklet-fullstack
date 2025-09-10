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

### 5.1) User Activation & Engagement
- **Time to First Nooklet (TTFN)**: <3 minutes from signup to first published nooklet
- **Activation Rate**: ≥40% of signups create ≥1 nooklet within 24 hours
- **Content Diversity**: ≥60% of active users try multiple nooklet types (journal, voice, quick_capture)
- **Weekly Engagement**: Median ≥3 nooklets per user in first week

### 5.2) Retention & Growth
- **D7 Creator Retention**: ≥20% of users who create content return within 7 days
- **D30 Retention**: ≥10% of activated users remain active after 30 days
- **Content Consistency**: ≥30% of retained users create content weekly

### 5.3) Technical Performance
- **API Response Time**: p95 latency <200ms for core endpoints (create, read, update nooklets)
- **System Reliability**: 99.9% uptime SLO with graceful degradation
- **Search Performance**: <100ms for timeline filtering and basic search queries

### 5.4) Quality & Satisfaction
- **Content Quality**: Average nooklet word count >50 words (indicating thoughtful content)
- **Feature Adoption**: ≥50% of users utilize tagging system within first month
- **Privacy Usage**: ≥80% of users maintain default private settings (indicating trust in privacy controls)

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

- User registration (email/password) and email verification.
- Voice Recording: Voice nooklet capture with transcription integration.
- Notifications, comments, rich collaboration, import/export, analytics UI.

## 10) Functional Requirements

### 10.1) Authentication & User Management
- **Login/Logout**: Session management with access/refresh tokens
- **Profile Management**: Username, display name, timezone, privacy preferences
- **Security**: Rate limiting, password strength validation, secure session handling

### 10.2) Nooklet Content Management
- **Create Nooklets**:
  - Type selection: journal, voice, quick_capture
  - Content input: rich text (journal), voice recording (voice), plain text (quick_capture)
  - Metadata: optional title, mood tracking, location, tags
  - Auto-save drafts every 3 seconds
- **Read Nooklets**:
  - Timeline view with infinite scroll/pagination
  - Individual nooklet detail view
  - Search across content with filters (type, tags, date range, mood)
- **Update Nooklets**:
  - Edit title, content, tags, privacy settings
  - Version history for significant changes
  - Bulk operations (tag assignment, privacy updates, archiving)
- **Archive/Restore**:
  - Soft-delete with `is_archived` flag
  - Restore from archive with full history
  - Hard delete (admin only, GDPR compliance)

### 10.3) Privacy & Sharing
- **Privacy Levels**: Private, public, link-based sharing, user-specific sharing
- **Sharing Controls**: Generate shareable links with optional expiration
- **Privacy Audit**: View all public/shared content in dedicated interface
- **Selective AI Processing**: Granular control over AI analysis per nooklet

### 10.4) Organization & Discovery
- **Tagging System**:
  - Personal tag creation with color coding
  - AI-suggested tags based on content analysis
  - Tag management (rename, merge, delete with reassignment)
- **Collections**: Group related nooklets manually or via AI suggestions
- **Connections**: Link related entries with relationship types
- **Timeline Filtering**: Type, tags, privacy level, date range, mood, favorites

### 10.5) Content Processing
- **AI Features**: Auto-summarization, reading time estimation, content analysis
- **Voice Processing**: Real-time transcription, transcript editing, audio metadata
- **Search**: Full-text search with semantic capabilities (future)
- **Export**: JSON and Markdown formats for data portability

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

### 14.1) Core Entities

**AuthUser** (Authentication):
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
email varchar(255) UNIQUE NOT NULL,
password_hash varchar(255) NOT NULL,
is_active boolean DEFAULT true,
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now()
```

**Profile** (User Information):
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
auth_user_id uuid NOT NULL REFERENCES auth_users(id),
username varchar(50) UNIQUE NOT NULL,
display_name varchar(100),
timezone varchar(50) DEFAULT 'UTC',
subscription_tier varchar(20) DEFAULT 'free',
privacy_settings jsonb DEFAULT '{}',
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now()
```

**Nooklet** (Core Content):
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid NOT NULL REFERENCES profiles(id),
type varchar(20) NOT NULL CHECK (type IN ('journal', 'voice', 'quick_capture')),
title varchar(500),
content text,
raw_content text, -- Original voice transcript or raw input
summary text, -- AI-generated summary
metadata jsonb DEFAULT '{}', -- Type-specific data, AI insights
word_count integer,
estimated_read_time integer, -- In minutes
location jsonb, -- GPS coordinates, place names
is_favorite boolean DEFAULT false,
is_archived boolean DEFAULT false,
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now(),
published_at timestamptz
```

**Tag** (Organization):
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
user_id uuid NOT NULL REFERENCES profiles(id),
name varchar(100) NOT NULL,
color varchar(7), -- Hex color code
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now(),
UNIQUE(user_id, name)
```

**NookletTag** (Many-to-Many):
```sql
nooklet_id uuid NOT NULL REFERENCES nooklets(id) ON DELETE CASCADE,
tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
PRIMARY KEY (nooklet_id, tag_id)
```

### 14.2) Future Scope Entities
- **MoodEntry**: Daily/momentary mood tracking linked to nooklets
- **Collection**: Curated groups of nooklets with smart/manual organization
- **NookletConnection**: Relationships between nooklets (references, inspired_by, follow_up)
- **ShareLink**: Generated links for privacy-controlled sharing
- **NookletArticle/Video**: Resource link management for read-later functionality

### 14.3) Design Conventions
- **UUID Primary Keys**: All entities use UUID for better distribution and security
- **Soft Delete**: `is_archived` flags instead of hard deletes for recoverability
- **JSONB Flexibility**: Metadata fields for extensible, type-specific data storage
- **Timestamp Tracking**: Created/updated timestamps on all entities
- **User Isolation**: All user data scoped by user_id for multi-tenancy

## 15) Development Milestones

### Phase 0: Foundation & Planning (Week 1)
- **PRD Approval**: Stakeholder sign-off on this document
- **Technical Architecture Review**: Backend/frontend architecture validation
- **Development Environment Setup**: Database, tooling, CI/CD pipeline
- **Success Criteria**: All technical decisions documented and approved

### Phase 1: Core Backend (Weeks 2-4)
- **Authentication System**: Registration, login, JWT tokens, rate limiting
- **Nooklet CRUD API**: Create, read, update, archive operations for all nooklet types
- **Tag Management**: Personal tag CRUD with color coding and suggestions
- **Data Layer**: PostgreSQL schema, Lucid ORM models, soft-delete implementation
- **Success Criteria**: All API endpoints functional with comprehensive test coverage

### Phase 2: Frontend Foundation (Weeks 5-7)
- **Inertia.js Integration**: React adapter setup with AdonisJS v6
- **Core UI Components**: Navigation, timeline, nooklet editor, tag management
- **Authentication Flow**: Login/register pages with proper error handling
- **Tailwind v4 Setup**: CSS-first configuration with design system tokens
- **Success Criteria**: Complete user journey from signup to nooklet creation

### Phase 3: Content Management (Weeks 8-10)
- **Rich Text Editor**: Journal nooklet creation with markdown support
- **Quick Capture**: The home page markdown editor functions as the primary quick capture mechanism, with immediate saving to the timeline.
- **Timeline Interface**: Chronological view with filtering and search
- **Widgets UI**: Implement customizable widgets for the home page dashboard.
- **Success Criteria**: All three nooklet types fully functional with smooth UX, and dashboard widgets are operational.

### Phase 4: AI & RAG Integration (Weeks 11-14)
- **RAG Features**: Implement core Retrieval Augmented Generation capabilities.
- **Embedding User Data**: Develop mechanisms to embed user-generated content.
- **Dynamic Embedding Updates**: Ensure embeddings are updated when user data changes.
- **Graph RAG for Entities**: Integrate graph-based RAG for storing and retrieving entities.
- **Enhanced Chunking**: Implement advanced chunking strategies using appropriate embedding models.
- **"Recall Memories" Search**: Develop the AI-powered search feature for saved writings.
- **Additional AI Features**: Explore and integrate further AI capabilities as identified.
- **Success Criteria**: Core RAG features are functional, "Recall Memories" search is operational, and embeddings are managed effectively.

### Phase 5: Polish & Launch Prep (Weeks 15-16)
- **Privacy Controls**: Granular privacy settings and sharing functionality
- **Performance Optimization**: API response times, frontend bundle optimization
- **Accessibility Audit**: WCAG AA compliance verification
- **Error Handling**: Comprehensive error states and recovery flows
- **Success Criteria**: Production-ready application meeting all success metrics

## 16) Risks & Mitigations

- Inertia.js adapter for Adonis: confirm adapter/middleware strategy (spike); fallback is API + client routing if needed.
- Tailwind v4 changes: follow upgrade guide; lock versions; keep CSS‑first config.
- Scope creep: enforce MVP boundaries; track parking lot items.

## 17) Dependencies & Tech Choices

- Backend: AdonisJS v6, Lucid, Redis, VineJS, Limiter, Auth (access tokens), adonis‑lucid‑soft‑deletes
- Frontend: Inertia.js (React adapter), React 18+, Tailwind CSS v4 (@tailwindcss/vite or CLI)
- Tooling: Biome (lint/format) — explicitly not using ESLint/Prettier; exclude pino‑pretty

## 18) Creator Workflows & Content Structure

### 18.1) Nooklet Content Types & Fields

**Core Nooklet Types** (MVP):
- **Journal**: Personal thoughts, reflections, daily entries
  - Fields: title (optional), content (rich text), mood_entry_id (optional), location (optional)
  - Workflow: Create → Draft → Publish → Archive/Restore
- **Voice**: Voice notes with AI transcription
  - Fields: title (auto-generated from content), raw_content (transcript), content (cleaned), audio_metadata (duration, quality)
  - Workflow: Record → Transcribe → Edit → Publish
- **Quick Capture**: Rapid text input, meeting notes, highlights
  - Fields: title (optional), content (plain text), source_context (optional)
  - Workflow: Capture → Tag → Publish (streamlined, minimal friction)

**Universal Fields** (all types):
- `id` (UUID), `user_id`, `type`, `title`, `content`, `raw_content`, `summary` (AI-generated)
- `metadata` (JSONB): flexible storage for type-specific data, AI insights, source attribution
- `word_count`, `estimated_read_time` (auto-calculated)
- `is_favorite`, `is_archived`, `is_draft` (state management)
- `created_at`, `updated_at`, `published_at` (timestamps)
- `mood_entry_id` (optional link to mood tracking)
- `location` (JSONB): GPS coordinates, place names, context

### 18.2) Creator Workflow Patterns

**Frictionless Capture Flow**:
1. **Entry Point**: Dashboard "+" button, keyboard shortcut (Cmd+N), or quick capture widget
2. **Type Selection**: Auto-detect or manual selection (journal/voice/quick_capture)
3. **Content Creation**:
   - Journal: Rich text editor with markdown support
   - Voice: Record button → real-time transcription → edit transcript
   - Quick Capture: Plain text area with auto-save every 3 seconds
4. **Metadata Enhancement**: Optional mood logging, location detection, tag suggestions
5. **Publishing**: Auto-save → immediate display in timeline

**Content Organization Flow**:
1. **Tagging**: AI-suggested tags based on content analysis + manual tag creation
2. **Collections**: Group related nooklets (manual or AI-suggested)
3. **Connections**: Link related entries with relationship types (references, inspired_by, follow_up)
4. **Timeline Navigation**: Chronological view with filters (type, tags, mood, date range)

### 18.3) Privacy Granularity

**Privacy Levels** (beyond public/private):
- **Private**: Only creator can view (default for new nooklets)
- **Public**: Discoverable via public timeline, search engines
- **Limited Sharing**:
  - **Link-based**: Generate shareable links with optional expiration
  - **User-based**: Share with specific users by username/email
  - **Collection-based**: Share entire collections with granular permissions
- **Selective AI Processing**: Granular control over which entries get AI analysis
- **Archive Privacy**: Archived items maintain original privacy settings but hidden from public timelines

**Privacy Controls UI**:
- Privacy selector in nooklet editor (dropdown with icons)
- Bulk privacy updates for multiple nooklets
- Privacy audit view showing all public/shared content
- Default privacy settings in user preferences

### 18.4) Branding & Theming Requirements

**Visual Identity**:
- **Primary Brand Colors**: Warm, approachable palette (sage green, warm gray, cream)
- **Typography**: Clean, readable fonts optimized for long-form reading
- **Logo/Icon**: Minimalist design reflecting "second brain" concept
- **Tone**: Thoughtful, personal, non-intimidating

**Theming System**:
- **Light/Dark Mode**: System preference detection with manual override
- **Reading Preferences**: Font size, line height, column width adjustments
- **Accessibility**: WCAG AA compliance, high contrast options, screen reader optimization
- **Customization**: User-selectable accent colors, layout density options

**Brand Guidelines**:
- Emphasize simplicity and focus over feature complexity
- Prioritize content readability and writing experience
- Maintain consistent spacing and visual hierarchy
- Use progressive disclosure to avoid overwhelming new users

## 19) Technical References & Documentation

### 19.1) Framework Documentation
- **AdonisJS v6**: [adonisjs.com](https://adonisjs.com) - Structure, auth, middleware, rate limiting, Lucid ORM
- **Inertia.js**: [inertiajs.com](https://inertiajs.com) - React adapter, navigation, shared props, SSR
- **React 18**: [react.dev](https://react.dev) - Components, hooks, Suspense, concurrent features
- **Tailwind CSS v4**: [tailwindcss.com](https://tailwindcss.com) - CSS-first config, Vite integration

### 19.2) Development Tools
- **Biome**: [biomejs.dev](https://biomejs.dev) - Linting and formatting (replaces ESLint/Prettier)
- **VineJS**: [vinejs.dev](https://vinejs.dev) - Input validation for AdonisJS
- **PostgreSQL 17**: [postgresql.org](https://postgresql.org) - Database features and best practices
- **Redis**: [redis.io](https://redis.io) - Caching and rate limiting implementation

### 19.3) AI & Voice Processing
- **OpenAI Whisper**: Voice transcription API integration
- **Content Summarization**: AI-powered text analysis and summarization
- **Semantic Search**: Vector embeddings for future search capabilities

### 19.4) Design & UX References
- **WCAG 2.1 AA**: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21) - Accessibility guidelines
- **Progressive Web App**: [web.dev/pwa](https://web.dev/pwa) - Mobile optimization patterns
- **Design System**: Component library and design token architecture

### 19.5) Project Documentation
- **Engineering Specs**: `docs/architecture/engineering/` - Detailed technical specifications
- **Database Schema**: `docs/architecture/engineering/erd.dbml` - Complete data model
- **Feature Repository**: `docs/nooklet-feature-repository.md` - Future feature inspiration
- **Implementation Specs**: `specs/specs/01-adonisjs-backend-bootstrap-inertiajs-frontend/` - Development sessions and tasks
