# CSS vs SCSS for Theme Management (Tailwind v4 + daisyUI v5)

## Context and Goal
- Stack: Tailwind CSS v4, daisyUI v5, Vite, BiomeJS
- Current setup: CSS custom properties declared in `inertia/css/app.css` with `@import "tailwindcss"; @plugin "daisyui";` and a :root theme using the new daisyUI v5 variable names (e.g., `--color-primary`).
- Goal: Decide whether to keep using plain CSS (custom properties) or to introduce SCSS for theme management.

## Summary Recommendation
- Use plain CSS with CSS Custom Properties for theme tokens and daisyUI integration.
- Optional: You can still adopt SCSS for non-theme authoring ergonomics (partials, mixins), but do not replace runtime theme tokens with SCSS variables.

Rationale: daisyUI v5’s theming is built around runtime CSS custom properties (e.g., `--color-primary`). These power features like dynamic theme switching, component-level variable overrides (e.g., `[--tab-bg:orange]`), and excellent DevTools debugging. SCSS variables compile away at build time and cannot support runtime theming.

## Detailed Comparison

### 1) DaisyUI v5 Compatibility
- CSS Custom Properties: Native fit. The theme system reads `--color-*` variables from :root or theme blocks.
- SCSS Variables: Compile-time only. You’d still need to emit final `--color-*` tokens for daisyUI to work. Using SCSS variables instead of CSS variables for tokens removes runtime flexibility.

### 2) Runtime Theming and Overrides
- CSS: Supports runtime theme switching (via `data-theme`), per-component overrides (e.g., `[--tab-bg:orange]`), and user-preference toggles without rebuilds.
- SCSS: No runtime theming—values are baked into the compiled CSS.

### 3) Debuggability and DX
- CSS: Variables appear in DevTools, can be inspected/edited live, and cascade/inherit naturally.
- SCSS: Token values are not visible at runtime; debugging requires tracing compile-time sources.

### 4) Tailwind v4 + @plugin Flow
- CSS: Tailwind v4 encourages authoring in CSS files with `@import "tailwindcss"` and `@plugin "daisyui"`. This is the primary, documented path in v4.
- SCSS: Sass generally passes unknown at-rules through, but adding a preprocessor is another moving part and can introduce edge cases with ordering, sourcemaps, or tooling.

### 5) BiomeJS Linting
- CSS: Works today with standard CSS syntax. We already resolved linter friction by moving theme tokens into :root.
- SCSS: Requires adding Sass tooling and configuring linters/formatters to understand `.scss`. More moving parts.

### 6) Build Complexity and Maintenance
- CSS: Zero additional deps. Fewer configs. Aligns with Tailwind v4’s simplified pipeline.
- SCSS: Requires installing `sass`, switching the main sheet to `.scss`, and keeping Vite, Tailwind, and linters aligned.

### 7) Performance and Bundle
- Both approaches produce CSS. Adding SCSS does not provide material runtime performance benefits; it increases build surface.

## Project-Specific Findings
- We already have a working theme setup in `inertia/css/app.css` using :root-level `--color-*` tokens mapped to brand variables. This aligns with daisyUI v5 guidance and Tailwind v4’s CSS-centric workflow.
- The previous linter issues were related to daisyUI `@plugin "daisyui/theme"` metadata; moving to :root variables resolved that while keeping full daisyUI functionality.

## Recommended Pattern
1) Keep theme tokens as CSS Custom Properties:
   - Define/override in `:root` (or data-theme scoped) using daisyUI v5 variable names:
     - `--color-base-100`, `--color-base-content`, `--color-primary`, `--color-primary-content`, etc.
2) If you want SCSS for authoring comfort (optional):
   - Use SCSS for structure (partials, mixins) and generate CSS that still outputs the daisyUI `--color-*` variables.
   - Do not replace `--color-*` tokens with `$variables` in places where runtime overrides are needed.
3) Continue leveraging Tailwind v4 + daisyUI via CSS `@import` and `@plugin` directives in a single main stylesheet for predictable order.

## Do/Don’t Cheat Sheet
- Do: Keep theme tokens as CSS custom properties consumed by daisyUI.
- Do: Scope alternative themes with `[data-theme]` if needed and switch at runtime.
- Do: Use DevTools to inspect/adjust `--color-*` variables during UI review.
- Consider: Introducing SCSS only for non-theme ergonomics (if the team strongly prefers it).
- Don’t: Replace runtime theme tokens with SCSS variables (you’ll lose dynamic theming and daisyUI overrides).

## Example (existing pattern)
- `inertia/css/app.css` defines brand tokens and maps them to daisyUI variables in `:root`, e.g.:
  - `--color-primary: var(--brand-accent);`
  - `--color-base-300: var(--brand-border);`
  - `--radius-field`, `--btn-border`, etc.

This provides:
- Interoperability with daisyUI v5 components (e.g., `btn btn-primary`)
- Simple, linter-friendly authoring
- Runtime theming and granular overrides for specific components/pages

## Final Decision
Stick with plain CSS custom properties for theme management. Add SCSS only if you need authoring conveniences, but continue to emit daisyUI’s `--color-*` variables to preserve runtime theming and compatibility with Tailwind v4 + daisyUI v5.
