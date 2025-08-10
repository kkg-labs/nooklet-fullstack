## Nooklet — Frontend Architecture (Inertia.js + React + Tailwind CSS v4)

### Stack

- Inertia.js (React adapter)
- React 18+
- Tailwind CSS v4 (CSS-first config via @import "tailwindcss" and @theme in app.css)

### Objectives (MVP UI)

- Minimal dashboard: top navigation bar + timeline of nooklets
- Keep components small and file structure simple; prefer server-driven navigation via Inertia

### File Structure (proposed)

- resources/
  - js/
    - app.jsx (Inertia setup, shared props)
    - Pages/
      - Dashboard.jsx (timeline + filters)
      - Nooklets/
        - Show.jsx
        - Edit.jsx
    - Components/
      - NavBar.jsx
      - Timeline.jsx (renders list of nooklets)
  - css/
    - app.css (Tailwind v4 import + @theme overrides)

### Styling (Tailwind v4)

- Use @import "tailwindcss" in resources/css/app.css
- Define tokens with @theme; prefer CSS variables (e.g., var(--color-blue-500)) when needed
- Use @tailwindcss/vite or @tailwindcss/cli per environment

### Inertia Patterns

- Use <Link> for navigation; maintain server routes
- Shared props: auth user, flash messages, csrf, app name
- Partial reloads for filters/pagination; avoid over-fetching

### Pages (MVP)

- Dashboard.jsx
  - Shows NavBar + Timeline
  - Accepts nooklets (paginated), tags; filters by tag and privacy (self view)
- Nooklets/Show.jsx
  - Renders title/body; shows tags; visibility badge
- Nooklets/Edit.jsx
  - Simple form: title, body, tags, privacy

### Accessibility & UX

- Keyboard-friendly components; focus styles
- Reasonable empty/loading states on timeline

### Data Contracts (with backend)

- Nooklet: { id, title, body, privacy, tags[], createdAt }
- Pagination: { data[], meta: { currentPage, totalPages } }

### Open Items

- Inertia adapter/middleware for Adonis: choose library or implement minimal bridge
- Tailwind v4 configuration specifics in build (Vite vs CLI) to be decided in setup
