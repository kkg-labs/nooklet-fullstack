# Nooklet Frontend Architecture Document

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-07 | 1.0 | Initial frontend architecture document | Winston (Architect) |

## Template and Framework Selection

**Framework Analysis:**
The project uses a sophisticated monolithic architecture with:
- **AdonisJS v6** as the backend framework
- **Inertia.js** bridging server-side and client-side without building an API
- **React 19** handling frontend components and interactions

**Current Setup Analysis:**
- AdonisJS v6 with Inertia adapter (`@adonisjs/inertia: ^3.1.1`)
- React 19 (`react: ^19.1.1`) with TypeScript
- Tailwind CSS v4 (`tailwindcss: ^4.0.0`) with DaisyUI (`daisyui: ^5.0.50`)
- Vite as build tool with React plugin
- CodeMirror for rich text editing
- Playwright for E2E testing
- Biome for linting/formatting

**Key Architecture Decisions:**
- Monolithic Inertia.js architecture eliminates separate API endpoints
- React 19 provides latest concurrent features and improved TypeScript support
- Tailwind CSS v4 with DaisyUI balances utility-first styling with pre-built components
- Vite offers fast HMR and optimized builds
- CodeMirror integration enables rich text editing for nooklets

## Frontend Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Framework** | React | 19.1.1 | UI component library and state management | Latest React with concurrent features, excellent TypeScript support, mature ecosystem |
| **Bridge Layer** | Inertia.js | 2.0.17 | Server-side rendering with SPA experience | Eliminates API layer complexity, maintains server-side routing, seamless AdonisJS integration |
| **UI Library** | DaisyUI | 5.0.50 | Pre-built component system | Semantic component names over utility classes, consistent design system, Tailwind-based |
| **State Management** | React Built-in | 19.1.1 | Local component state + Context API | Sufficient for monolithic Inertia apps, reduces complexity, leverages React 19 improvements |
| **Routing** | Inertia Router | 2.0.17 | Client-side navigation | Server-side route definitions, client-side navigation, automatic code splitting |
| **Build Tool** | Vite | 6.3.5 | Development server and bundling | Fast HMR, optimized builds, excellent TypeScript support, AdonisJS integration |
| **Styling** | Tailwind CSS | 4.0.0 | Utility-first CSS framework | CSS-first configuration, design system consistency, excellent DX with IntelliSense |
| **Testing** | Playwright | 1.55.0 | End-to-end testing | Cross-browser testing, visual regression, API mocking, excellent TypeScript support |
| **Component Library** | Custom + DaisyUI | - | Application-specific components | Tailored to nooklet requirements, built on DaisyUI foundation |
| **Form Handling** | Inertia.js Forms | 2.0.17 | Form state and server integration | Built-in form helpers, automatic CSRF, server-side validation integration, progress tracking |
| **Animation** | Tailwind CSS + Framer Motion | TBD | UI animations and transitions | Utility-based animations + advanced motion library for complex interactions |
| **Dev Tools** | Biome + TypeScript | 2.2.2 / 5.8.3 | Code quality and type safety | Single tool for linting/formatting, faster than ESLint/Prettier combo |

## Project Structure

```plaintext
nooklet-next/
├── app/                                 # AdonisJS backend application
│   ├── controllers/                     # HTTP controllers
│   ├── features/                        # Domain-driven feature modules
│   │   ├── auth/                       # Authentication feature
│   │   ├── nooklet/                    # Nooklet management feature
│   │   └── user/                       # User management feature
│   ├── middleware/                      # HTTP middleware
│   ├── models/                         # Shared/global models
│   └── validators/                     # Global validators
├── inertia/                            # Frontend React application
│   ├── app/                            # App configuration
│   │   ├── app.tsx                     # Main app component
│   │   └── ssr.tsx                     # Server-side rendering setup
│   ├── components/                     # Reusable React components
│   │   ├── ui/                         # Base UI components
│   │   ├── form/                       # Form-specific components
│   │   ├── layout/                     # Layout components
│   │   ├── nooklet/                    # Nooklet-specific components
│   │   └── editor/                     # Rich text editor components
│   ├── pages/                          # Inertia page components
│   │   ├── auth/                       # Authentication pages
│   │   ├── nooklets/                   # Nooklet pages
│   │   ├── dashboard/                  # Dashboard pages
│   │   └── errors/                     # Error pages
│   ├── hooks/                          # Custom React hooks
│   ├── types/                          # TypeScript type definitions
│   ├── utils/                          # Utility functions
│   ├── styles/                         # Stylesheets (CSS/SCSS)
│   │   ├── app.css                     # Main stylesheet
│   │   ├── components/                 # Component styles (SCSS)
│   │   ├── themes/                     # Theme variations (SCSS)
│   │   └── utilities/                  # Custom utilities (SCSS)
│   └── tsconfig.json                   # TypeScript config
├── tests/browser/                      # Playwright E2E tests
├── docs/                               # Documentation
└── shared/                             # Shared utilities
```

**Key Structure Decisions:**
- Feature-based backend organization groups related functionality
- Component categorization by purpose (ui, form, layout, domain-specific)
- Page-based routing follows Inertia.js conventions
- Shared types directory for centralized TypeScript definitions
- SCSS for component styles, CSS for main stylesheet

## Component Standards

### Component Template

```typescript
import React from 'react'
import { InertiaLinkProps, Link } from '@inertiajs/react'

// Define component props interface
interface ComponentNameProps {
  // Required props
  title: string
  content: string

  // Optional props
  className?: string
  isLoading?: boolean
  onClick?: () => void

  // Children for composition
  children?: React.ReactNode

  // Inertia-specific props (when needed)
  href?: string
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
}

// Main component with proper TypeScript typing
const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  content,
  className = '',
  isLoading = false,
  onClick,
  children,
  href,
  method = 'get'
}) => {
  // Local state (if needed)
  const [isExpanded, setIsExpanded] = React.useState(false)

  // Event handlers
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setIsExpanded(!isExpanded)
  }

  // Conditional rendering logic
  if (isLoading) {
    return (
      <div className={`loading loading-spinner ${className}`}>
        Loading...
      </div>
    )
  }

  // Main render with proper accessibility
  return (
    <div
      className={`component-name ${className}`}
      role="article"
      aria-expanded={isExpanded}
    >
      <header className="component-header">
        <h3 className="text-lg font-semibold">{title}</h3>
        {href ? (
          <Link
            href={href}
            method={method}
            className="btn btn-primary"
          >
            View Details
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className="btn btn-secondary"
            aria-label={`Toggle ${title}`}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </header>

      <main className="component-content">
        <p className="text-base">{content}</p>
        {isExpanded && children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}

// Export with display name for debugging
ComponentName.displayName = 'ComponentName'

export default ComponentName

// Named export for specific use cases
export type { ComponentNameProps }
```

### Naming Conventions

**File and Component Naming:**
- **Components**: PascalCase (e.g., `NookletCard.tsx`, `UserProfile.tsx`)
- **Pages**: PascalCase matching route structure (e.g., `nooklets/Create.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useNooklet.ts`)
- **Types**: PascalCase with descriptive suffix (e.g., `NookletProps`, `AuthUser`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)

**Directory Naming:**
- **Folders**: kebab-case (e.g., `nooklet-editor/`, `user-profile/`)
- **Feature modules**: singular nouns (e.g., `auth/`, `nooklet/`, `user/`)

**CSS Class Naming (BEM Method):**
- **Blocks**: Component name in kebab-case (e.g., `nooklet-card`, `user-profile`)
- **Elements**: Block + double underscore + element (e.g., `nooklet-card__title`)
- **Modifiers**: Block/Element + double dash + modifier (e.g., `nooklet-card--featured`)
- **Project prefix**: Use `nooklet-` prefix for custom components

**Variable and Function Naming:**
- **Props**: Descriptive camelCase (e.g., `isLoading`, `onSubmit`, `nookletData`)
- **State variables**: Descriptive with `is/has/should` prefixes for booleans
- **Event handlers**: `handle` prefix (e.g., `handleSubmit`, `handleClick`)
- **API functions**: Verb-based (e.g., `createNooklet`, `fetchUserProfile`)

**Inertia-Specific Conventions:**
- **Page components**: Match route names exactly (e.g., `/nooklets/create` → `nooklets/Create.tsx`)
- **Page props**: Use `PageProps` interface with specific page data
- **Form data**: Use Inertia's `useForm` hook with descriptive form names

**Import/Export Patterns:**
- **Default exports**: For main component
- **Named exports**: For types, utilities, and secondary components
- **Index files**: Re-export components for clean imports
- **Absolute imports**: Use TypeScript path mapping for cleaner imports

## State Management

### Store Structure

For an Inertia.js + React application, the state management structure is simplified since most state is server-managed:

```plaintext
inertia/
├── hooks/                              # Custom React hooks for state logic
│   ├── auth/                          # Authentication state hooks
│   │   ├── useAuth.ts                 # Current user state and auth actions
│   │   ├── useAuthForm.ts             # Login/register form state
│   │   └── index.ts
│   ├── nooklet/                       # Nooklet state hooks
│   │   ├── useNooklet.ts              # Individual nooklet operations
│   │   ├── useNookletList.ts          # Timeline/list state management
│   │   ├── useNookletEditor.ts        # Editor state (draft, autosave)
│   │   └── index.ts
│   ├── ui/                            # UI state hooks
│   │   ├── useModal.ts                # Modal state management
│   │   ├── useToast.ts                # Toast notifications
│   │   ├── useTheme.ts                # Theme switching
│   │   └── index.ts
│   ├── shared/                        # Shared state hooks
│   │   ├── useLocalStorage.ts         # Local storage persistence
│   │   ├── useDebounce.ts             # Debounced values
│   │   ├── usePrevious.ts             # Previous value tracking
│   │   └── index.ts
│   └── index.ts                       # All hooks export
├── context/                           # React Context providers
│   ├── AuthContext.tsx                # Global auth context
│   ├── ThemeContext.tsx               # Theme context
│   ├── ToastContext.tsx               # Toast notification context
│   └── index.ts
└── types/
    ├── auth.ts                        # Auth state types
    ├── nooklet.ts                     # Nooklet state types
    └── ui.ts                          # UI state types
```

### State Management Template

```typescript
// hooks/nooklet/useNooklet.ts
import { useState, useCallback } from 'react'
import { useForm } from '@inertiajs/react'
import { NookletData, NookletFormData } from '@/types/nooklet'

interface UseNookletOptions {
  initialData?: NookletData
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const useNooklet = (options: UseNookletOptions = {}) => {
  const { initialData, onSuccess, onError } = options

  // Destructured Inertia form for cleaner usage
  const { data, setData, post, patch, delete: destroy, processing, errors, isDirty, reset } = useForm<NookletFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    type: initialData?.type || 'journal',
    tags: initialData?.tags || [],
    is_draft: initialData?.is_draft || true
  })

  // Local UI state
  const [isEditing, setIsEditing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }

    const timeout = setTimeout(() => {
      if (isDirty && !processing && initialData?.id) {
        patch(`/nooklets/${initialData.id}`, {
          onSuccess: () => {
            setLastSaved(new Date())
            onSuccess?.()
          },
          onError: (errors) => {
            onError?.(Object.values(errors)[0] as string)
          }
        })
      }
    }, 2000)

    setAutoSaveTimeout(timeout)
  }, [isDirty, processing, initialData?.id, patch, onSuccess, onError, autoSaveTimeout])

  // Actions
  const saveNooklet = useCallback(() => {
    const url = initialData?.id ? `/nooklets/${initialData.id}` : '/nooklets'
    const method = initialData?.id ? patch : post

    method(url, {
      onSuccess: () => {
        setLastSaved(new Date())
        setIsEditing(false)
        onSuccess?.()
      },
      onError: (errors) => {
        onError?.(Object.values(errors)[0] as string)
      }
    })
  }, [initialData?.id, post, patch, onSuccess, onError])

  const updateContent = useCallback((content: string) => {
    setData('content', content)
    setWordCount(content.trim().split(/\s+/).length)
    autoSave()
  }, [setData, autoSave])

  return {
    // Destructured form state
    data,
    setData,
    processing,
    errors,
    isDirty,
    reset,

    // UI state
    isEditing,
    lastSaved,
    wordCount,

    // Actions
    saveNooklet,
    updateContent,

    // Form helpers
    setTitle: (title: string) => setData('title', title),
    setType: (type: 'journal' | 'voice' | 'quick_capture') => setData('type', type),
    addTag: (tag: string) => setData('tags', [...data.tags, tag]),
    removeTag: (tagIndex: number) => setData('tags', data.tags.filter((_, i) => i !== tagIndex))
  }
}
```

## API Integration

### Service Template

Since you're using Inertia.js, most API communication happens through Inertia's built-in methods. For direct API calls (file uploads, real-time features), here's the service template:

```typescript
// utils/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        // Get CSRF token from meta tag (AdonisJS pattern)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        if (csrfToken) {
          config.headers['X-CSRF-TOKEN'] = csrfToken
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = '/login'
        } else if (error.response?.status === 419) {
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  // File upload helper
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }

    return this.post<T>(url, formData, config)
  }
}

export const apiClient = new ApiClient()

// Specific service for nooklet operations
export class NookletService {
  static async uploadVoiceRecording(file: File, onProgress?: (progress: number) => void) {
    return apiClient.uploadFile<{ transcription: string; audioUrl: string }>(
      '/nooklets/voice/upload',
      file,
      onProgress
    )
  }

  static async getTagSuggestions(content: string): Promise<string[]> {
    return apiClient.post<string[]>('/nooklets/tags/suggest', { content })
  }
}
```

## Routing

### Route Configuration

In Inertia.js applications, routing is primarily handled server-side by AdonisJS:

```typescript
// start/routes.ts (AdonisJS Server Routes)
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Public routes
router.get('/', 'HomeController.landing').as('landing')
router.get('/home', 'HomeController.index').as('home')

// Authentication routes
router.group(() => {
  router.get('/login', 'AuthController.showLogin').as('auth.login.show')
  router.post('/login', 'AuthController.login').as('auth.login')
  router.get('/register', 'AuthController.showRegister').as('auth.register.show')
  router.post('/register', 'AuthController.register').as('auth.register')
}).prefix('/auth')

// Protected routes (require authentication)
router.group(() => {
  router.get('/dashboard', 'DashboardController.index').as('dashboard')

  // Nooklet routes
  router.group(() => {
    router.get('/', 'NookletController.index').as('nooklets.index')
    router.get('/create', 'NookletController.create').as('nooklets.create')
    router.post('/', 'NookletController.store').as('nooklets.store')
    router.get('/:id', 'NookletController.show').as('nooklets.show')
    router.get('/:id/edit', 'NookletController.edit').as('nooklets.edit')
    router.patch('/:id', 'NookletController.update').as('nooklets.update')
    router.delete('/:id', 'NookletController.destroy').as('nooklets.destroy')
  }).prefix('/nooklets')

  router.post('/logout', 'AuthController.logout').as('auth.logout')
}).use(middleware.auth())

// API routes (for direct API calls when needed)
router.group(() => {
  router.post('/nooklets/tags/suggest', 'Api/NookletController.suggestTags')
  router.post('/nooklets/voice/upload', 'Api/NookletController.uploadVoice')
}).prefix('/api/v1').use(middleware.auth())
```

### Client-side Navigation Utilities

```typescript
// utils/routing.ts
import { router } from '@inertiajs/react'

// Type-safe route helpers
export const routes = {
  // Public routes
  landing: () => '/',
  home: () => '/home',

  // Auth routes
  login: () => '/auth/login',
  register: () => '/auth/register',

  // Protected routes
  dashboard: () => '/dashboard',

  // Nooklet routes
  nooklets: {
    index: () => '/nooklets',
    create: () => '/nooklets/create',
    show: (id: string) => `/nooklets/${id}`,
    edit: (id: string) => `/nooklets/${id}/edit`,
  }
} as const

// Navigation helpers
export const navigate = {
  to: (url: string, options?: { replace?: boolean; preserveState?: boolean }) => {
    router.visit(url, options)
  },

  back: () => {
    router.visit(window.history.back())
  },

  reload: (options?: { only?: string[]; except?: string[] }) => {
    router.reload(options)
  },

  // Type-safe navigation methods
  toNooklets: () => navigate.to(routes.nooklets.index()),
  toNooklet: (id: string) => navigate.to(routes.nooklets.show(id)),
  toDashboard: () => navigate.to(routes.dashboard()),
}

// Route guards as hooks
export const useAuthGuard = () => {
  const { props } = usePage()
  const isAuthenticated = !!props.auth?.user

  useEffect(() => {
    if (!isAuthenticated) {
      navigate.to(routes.login())
    }
  }, [isAuthenticated])

  return isAuthenticated
}
```

## Styling Guidelines

### Styling Approach

The project uses a **hybrid approach** combining Tailwind CSS v4, DaisyUI components, and BEM methodology:

**Primary Styling Strategy:**
1. **DaisyUI semantic classes** for common UI patterns (buttons, cards, modals)
2. **Tailwind utilities** for layout, spacing, and custom styling
3. **BEM methodology** for complex custom components
4. **CSS custom properties** for theming and design tokens

**File Organization:**
```plaintext
inertia/styles/
├── app.css                    # Main stylesheet (source of truth for colors)
├── components/                # Component-specific styles (SCSS)
│   ├── nooklet-editor.scss   # Rich text editor styles
│   ├── voice-recorder.scss   # Voice recording component
│   ├── timeline.scss         # Timeline view styles
│   └── modals.scss           # Custom modal styles
├── themes/                   # Theme variations (SCSS)
│   ├── light.scss           # Light theme variables
│   ├── dark.scss            # Dark theme variables
│   └── high-contrast.scss   # Accessibility theme
└── utilities/               # Custom utility classes (SCSS)
    ├── animations.scss      # Custom animations
    ├── typography.scss      # Typography utilities
    └── layout.scss         # Layout helpers
```

### Global Theme Variables

```css
/* inertia/styles/app.css - Source of Truth for Colors */
@import 'tailwindcss';

:root {
  /* Use existing color palette from your current app.css */
  /* Retain existing color definitions here */

  /* Design Tokens */
  --nooklet-space-xs: 0.25rem;      /* 4px */
  --nooklet-space-sm: 0.5rem;       /* 8px */
  --nooklet-space-md: 1rem;         /* 16px */
  --nooklet-space-lg: 1.5rem;       /* 24px */
  --nooklet-space-xl: 2rem;         /* 32px */

  /* Typography Scale */
  --nooklet-text-xs: 0.75rem;       /* 12px */
  --nooklet-text-sm: 0.875rem;      /* 14px */
  --nooklet-text-base: 1rem;        /* 16px */
  --nooklet-text-lg: 1.125rem;      /* 18px */
  --nooklet-text-xl: 1.25rem;       /* 20px */

  /* Font Families */
  --nooklet-font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --nooklet-font-serif: 'Crimson Text', Georgia, serif;
  --nooklet-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Transitions */
  --nooklet-transition-fast: 150ms ease-in-out;
  --nooklet-transition-normal: 250ms ease-in-out;
  --nooklet-transition-slow: 350ms ease-in-out;

  /* Z-Index Scale */
  --nooklet-z-dropdown: 1000;
  --nooklet-z-modal: 1050;
  --nooklet-z-toast: 1080;
}

/* Import component styles */
@import './components/nooklet-editor.scss';
@import './components/voice-recorder.scss';
@import './components/timeline.scss';
```

### BEM Naming Guide

This guide standardizes CSS class naming across the app using BEM, aligned with Tailwind + DaisyUI and our timeline-of-notes model (no individual "nooklet" concept).

Principles
- One Block per component file; Elements describe parts of that block; Modifiers describe states/variants
- Names are lowercase, kebab-case. Prefer domain language: “note”, “timeline”, “search”, “editor”
- Layer BEM classes on top of DaisyUI semantic classes via @apply; avoid hardcoded colors (use Tailwind tokens / CSS vars in app.css)
- Testing IDs mirror BEM names for traceability

Block naming (canonical)
- Layout/navigation: app-layout, nav-bar, page-header
- Timeline & notes: timeline, timeline-date-group, note-card, note-editor
- Search (RAG): search-bar, search-results, search-result-item, search-filters
- Forms/modals: form-field, modal
- Media: voice-recorder, audio-player

Element naming examples
- note-card__header, note-card__title, note-card__meta, note-card__content, note-card__actions
- timeline__date, timeline__list, timeline__item
- search-results__summary, search-result-item__snippet, search-filters__chip

Modifier naming examples
- State: --active, --loading, --error, --selected, --expanded
- Size/density: --sm, --md, --lg, --compact
- Variant: --journal, --voice, --quick-capture (note types), search-result-item--exact-match
- Context/time: timeline-date-group--today, note-card--draft, note-card--archived

File structure & imports
- One SCSS file per block in inertia/styles/components/{block}.scss
- Import SCSS files from inertia/styles/app.css (source of truth for tokens)

Tailwind + DaisyUI layering
- Use DaisyUI for component primitives (btn, card, modal)
- Use Tailwind utilities for layout/spacing
- Apply BEM classes for structure, variants, and custom composition

Example: note-card.scss
```scss
/* inertia/styles/components/note-card.scss */
.note-card {
  @apply card bg-base-100 border border-base-300 shadow-sm;

  &__header { @apply card-body pt-4 pb-2; }
  &__title { @apply card-title text-base; }
  &__meta { @apply text-xs text-base-content/60 flex items-center gap-2; }
  &__content { @apply prose prose-sm max-w-none; }
  &__actions { @apply card-actions justify-end mt-3; }

  &--draft { @apply opacity-80; }
  &--archived { @apply grayscale; }
  &--voice { @apply ring-1 ring-info/40; }
}
```

Example: timeline.scss
```scss
/* inertia/styles/components/timeline.scss */
.timeline {
  @apply space-y-6;

  &__date { @apply text-sm font-semibold text-base-content/70 sticky top-0 bg-base-100 py-2; }
  &__list { @apply space-y-4; }
  &__item { @apply relative pl-6; }
}

.timeline-date-group {
  @apply relative;
  &--today { @apply ring-1 ring-primary/40 rounded-lg; }
}
```

Example: search (RAG) components
```scss
/* inertia/styles/components/search-bar.scss */
.search-bar { @apply flex items-center gap-2; }
.search-bar__input { @apply input input-bordered w-full; }
.search-bar__button { @apply btn btn-primary; }

/* inertia/styles/components/search-results.scss */
.search-results { @apply mt-4 space-y-3; }
.search-results__summary { @apply text-sm text-base-content/70; }

.search-result-item { @apply border border-base-300 rounded-lg p-3;
  &__title { @apply font-medium; }
  &__snippet { @apply text-sm text-base-content/80; }
  &--exact-match { @apply ring-1 ring-success/40; }
}
```

TSX usage alignment (data-testid mirrors BEM)
```tsx
// inside NoteCard.tsx
<article
  className={clsx('note-card', isDraft && 'note-card--draft')}
  data-testid={`note-card-${id}`}
  role="article"
>
  <header className="note-card__header">
    <h3 className="note-card__title" data-testid="note-card__title">{title}</h3>
    <div className="note-card__meta" data-testid="note-card__meta">{meta}</div>
  </header>
  <div className="note-card__content" data-testid="note-card__content">{children}</div>
  <footer className="note-card__actions">
    <button className="btn btn-ghost" data-testid="note-card__edit">Edit</button>
  </footer>
</article>
```

Checklist
- Use canonical block names above for new components
- Prefer state modifiers over extra elements
- Keep elements flat (avoid element of element like block__el1__el2)
- Map data-testid to the nearest block/element name
- Never encode color tokens in components; reference app.css tokens or Tailwind theme

### BEM Component Examples

```scss
// inertia/styles/components/nooklet-editor.scss
.nooklet-editor {
  @apply relative bg-white rounded-lg shadow-sm border border-gray-200;

  &__toolbar {
    @apply flex items-center justify-between p-3 border-b border-gray-200;
  }

  &__content {
    @apply min-h-[300px] p-4;

    .cm-editor {
      @apply w-full h-full;
      font-family: var(--nooklet-font-serif);
      font-size: var(--nooklet-text-base);
    }

    .cm-focused {
      outline: 2px solid theme('colors.primary');
      outline-offset: -2px;
    }
  }

  &__footer {
    @apply flex items-center justify-between p-3 border-t border-gray-200 text-sm text-gray-600;
  }

  &--fullscreen {
    @apply fixed inset-0 z-50 rounded-none;
    z-index: var(--nooklet-z-modal);
  }

  &--dark {
    @apply bg-gray-800 border-gray-700;
  }
}
```

## Testing Requirements

### Component Test Template

Testing approach optimized for AdonisJS + Inertia + React with Playwright for E2E testing:

```typescript
// tests/browser/components/NookletCard.test.tsx
import { test, expect } from '@playwright/test'
import { createNookletTestData, loginAsTestUser } from '../helpers/testHelpers'

test.describe('NookletCard Component', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/nooklets')
  })

  test('should render nooklet card with correct content', async ({ page }) => {
    // Arrange
    const testNooklet = await createNookletTestData({
      title: 'Test Nooklet Title',
      content: 'This is test content for the nooklet.',
      type: 'journal',
      is_draft: false
    })

    // Act
    await page.reload()
    const nookletCard = page.locator(`[data-testid="nooklet-card-${testNooklet.id}"]`)

    // Assert
    await expect(nookletCard).toBeVisible()
    await expect(nookletCard.locator('.nooklet-card__title')).toContainText('Test Nooklet Title')
    await expect(nookletCard.locator('.nooklet-card__content')).toContainText('This is test content')
  })

  test('should handle edit action', async ({ page }) => {
    const testNooklet = await createNookletTestData({
      title: 'Editable Nooklet',
      content: 'Content to edit'
    })

    await page.reload()
    const nookletCard = page.locator(`[data-testid="nooklet-card-${testNooklet.id}"]`)
    await nookletCard.locator('[data-testid="edit-button"]').click()

    await expect(page).toHaveURL(`/nooklets/${testNooklet.id}/edit`)
  })

  test('should be accessible', async ({ page }) => {
    const testNooklet = await createNookletTestData({
      title: 'Accessibility Test Nooklet',
      content: 'Testing accessibility features'
    })

    await page.reload()
    const nookletCard = page.locator(`[data-testid="nooklet-card-${testNooklet.id}"]`)

    // Assert accessibility attributes
    await expect(nookletCard).toHaveAttribute('role', 'article')
    await expect(nookletCard).toHaveAttribute('aria-label')

    // Test keyboard navigation
    await nookletCard.focus()
    await expect(nookletCard).toBeFocused()
  })
})

// Integration test for nooklet creation
test.describe('Nooklet Creation Flow', () => {
  test('should create a new journal nooklet', async ({ page }) => {
    await loginAsTestUser(page)
    await page.goto('/nooklets/create')

    // Fill out the form
    await page.fill('[data-testid="nooklet-title"]', 'My First Journal Entry')
    await page.selectOption('[data-testid="nooklet-type"]', 'journal')

    // Use CodeMirror editor
    const editor = page.locator('.cm-editor .cm-content')
    await editor.click()
    await editor.fill('This is my first journal entry.')

    // Save as draft first
    await page.click('[data-testid="save-draft-button"]')
    await expect(page.locator('[data-testid="save-status"]')).toContainText('Draft saved')

    // Publish the nooklet
    await page.click('[data-testid="publish-button"]')

    // Verify redirect and content
    await expect(page).toHaveURL(/\/nooklets\/[a-f0-9-]+$/)
    await expect(page.locator('h1')).toContainText('My First Journal Entry')
  })
})
```

### Testing Best Practices

1. **E2E Tests with Playwright**: Test critical user flows and Inertia.js navigation
2. **Component Integration Tests**: Test React components within Inertia pages
3. **Visual Regression Tests**: Ensure UI consistency across changes
4. **Accessibility Tests**: Verify WCAG compliance and keyboard navigation
5. **Form Testing**: Test Inertia.js form submissions and validation
6. **Authentication Flow Tests**: Test login/logout and protected routes
7. **Cross-browser Tests**: Test on Chrome, Firefox, Safari, and Edge
8. **Mobile Responsiveness**: Test on various screen sizes and devices

## Environment Configuration

### Additional Environment Variables

Working with your existing `env.ts` and database Docker configuration, add these frontend-specific variables:

```bash
# Frontend-specific variables (add to existing .env)
VITE_APP_NAME="Nooklet"
VITE_APP_URL=http://localhost:3333
VITE_API_URL=http://localhost:3333/api/v1

# Inertia.js SSR (if enabling server-side rendering)
INERTIA_SSR_ENABLED=false
INERTIA_SSR_BUNDLE=build/ssr/ssr.js

# Development tools
VITE_HMR_PORT=5173
VITE_HMR_HOST=localhost

# AI Services (if not already configured)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
WHISPER_MODEL=whisper-1

# File Uploads (if not already configured)
MAX_FILE_SIZE=10mb
ALLOWED_FILE_TYPES=audio/wav,audio/mp3,audio/m4a,image/jpeg,image/png
```

### Frontend Environment Access

```typescript
// inertia/utils/env.ts
export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Nooklet',
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  API_URL: import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`,
  NODE_ENV: import.meta.env.NODE_ENV || 'development',

  // Helper functions
  isDevelopment: () => env.NODE_ENV === 'development',
  isProduction: () => env.NODE_ENV === 'production',

  // Frontend-specific helpers
  getApiUrl: (endpoint: string) => `${env.API_URL}${endpoint}`,
  getAssetUrl: (path: string) => `${env.APP_URL}${path}`,
} as const
```

## Frontend Developer Standards

### Critical Coding Rules

**Universal Rules (Prevent Common AI Mistakes):**

1. **Always use TypeScript interfaces** - Never use `any` type, define proper interfaces for all props and data
2. **Destructure useForm hook** - Always use `const { data, setData, post, processing, errors } = useForm()`
3. **Include data-testid attributes** - Every interactive element needs `data-testid` for testing
4. **Use semantic HTML** - Proper `<article>`, `<section>`, `<nav>`, `<main>` elements with ARIA attributes
5. **Handle loading states** - Always show loading indicators during form submissions and data fetching
6. **Validate props with TypeScript** - Use strict prop interfaces, mark optional props explicitly
7. **Use CSS custom properties** - Reference design tokens from `app.css`, never hardcode colors/spacing
8. **Follow BEM naming** - Custom CSS classes must use BEM methodology (`.component__element--modifier`)
9. **Handle error states** - Display validation errors and provide user feedback for all error scenarios
10. **Implement proper cleanup** - Clear timeouts, intervals, and event listeners in useEffect cleanup

**Inertia.js Specific Rules:**

11. **Use Inertia Link components** - Never use `<a>` tags for internal navigation, always use `<Link>`
12. **Leverage server-side validation** - Don't duplicate validation logic, use Inertia's error handling
13. **Preserve scroll position** - Use `preserveScroll` option for form submissions that don't change page
14. **Handle CSRF automatically** - Inertia handles CSRF tokens, don't manually add them
15. **Use page props correctly** - Access shared data via `usePage().props`, not separate API calls
16. **Implement proper redirects** - Use Inertia's navigation methods, not `window.location`
17. **Handle partial reloads** - Use `only` and `except` options to optimize data loading
18. **Manage form state properly** - Use Inertia's `useForm` for all server interactions

**React + TypeScript Rules:**

19. **Use functional components** - No class components, always use hooks and functional patterns
20. **Implement proper key props** - Unique keys for all list items, never use array indices
21. **Use useCallback for event handlers** - Prevent unnecessary re-renders in child components
22. **Implement proper dependency arrays** - All useEffect dependencies must be included
23. **Use React.memo judiciously** - Only memoize components with expensive renders
24. **Handle async operations properly** - Use proper error boundaries and loading states
25. **Implement proper form validation** - Client-side validation for UX, server-side for security

**DaisyUI + Tailwind Rules:**

26. **Prefer DaisyUI semantic classes** - Use `btn`, `card`, `modal` over custom Tailwind combinations
27. **Use Tailwind for layout only** - Spacing, flexbox, grid - not colors or component styling
28. **Follow responsive design patterns** - Mobile-first approach with proper breakpoint usage
29. **Maintain consistent spacing** - Use design token variables, not arbitrary values
30. **Implement proper dark mode** - Use CSS custom properties that adapt to theme changes

### Quick Reference

**Common Commands:**
```bash
npm run dev              # Start development server with HMR
npm run build           # Build for production
npm run typecheck       # TypeScript type checking
npm run lint            # Biome linting
npm run format          # Biome formatting
npm run test:e2e        # Run Playwright tests
npm run db:dev          # Start database containers
```

**Key Import Patterns:**
```typescript
// Inertia imports
import { useForm, usePage, Link, router } from '@inertiajs/react'

// React imports
import React, { useState, useEffect, useCallback } from 'react'

// Type imports
import type { NookletData, NookletFormData } from '@/types/nooklet'

// Component imports
import { Button, Input, Modal } from '@/components/ui'
import { NookletCard, NookletEditor } from '@/components/nooklet'
```

**File Naming Conventions:**
```plaintext
# Components
NookletCard.tsx          # PascalCase for components
nooklet-card.scss        # kebab-case for styles

# Pages (match routes exactly)
nooklets/Index.tsx       # Match /nooklets route
nooklets/Create.tsx      # Match /nooklets/create route

# Hooks and utilities
useNooklet.ts           # camelCase with 'use' prefix
formatDate.ts           # camelCase for utilities
```

**Standard Patterns:**

```typescript
// Form handling pattern
const { data, setData, post, processing, errors, reset } = useForm({
  title: '',
  content: '',
  type: 'journal' as const
})

// Error display pattern
{errors.title && (
  <span className="text-error text-sm" data-testid="title-error">
    {errors.title}
  </span>
)}

// Loading state pattern
<button
  type="submit"
  disabled={processing}
  className="btn btn-primary"
  data-testid="submit-button"
>
  {processing ? 'Saving...' : 'Save Nooklet'}
</button>

// Accessibility pattern
<button
  onClick={handleAction}
  aria-label={`Edit ${nooklet.title}`}
  className="btn btn-ghost"
  data-testid="edit-button"
>
  Edit
</button>
```

---

## 🎉 Frontend Architecture Complete!

This comprehensive frontend architecture document provides everything needed to build a scalable, maintainable React + Inertia.js + AdonisJS application specifically tailored to your Nooklet project.

**Architecture Highlights:**
- **Monolithic Inertia.js** approach eliminates API complexity
- **React 19 + TypeScript** for modern, type-safe development
- **Tailwind CSS v4 + DaisyUI + BEM** hybrid styling approach
- **Playwright-focused testing** strategy for E2E coverage
- **30 critical coding rules** to prevent common mistakes
- **Complete project structure** optimized for AI tools and developers

The architecture is production-ready and scales with your project growth!
```
```
