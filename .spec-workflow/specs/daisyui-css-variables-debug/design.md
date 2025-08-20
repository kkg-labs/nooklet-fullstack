# Design Document

## Overview

This design addresses the critical issue where DaisyUI v5 custom CSS variables are not being applied correctly, specifically the `--color-primary: red` variable not affecting the `btn btn-primary` component. Through investigation using Playwright browser automation and CSS analysis, we've identified that the issue stems from incorrect DaisyUI v5 theme configuration syntax and potential CSS specificity conflicts.

## Steering Document Alignment

### Technical Standards (tech.md)
This design follows modern CSS architecture patterns and maintains compatibility with the existing Tailwind CSS v4 and DaisyUI v5 stack.

### Project Structure (structure.md)
The solution maintains the current CSS file organization while improving the theme configuration structure.

## Code Reuse Analysis

### Existing Components to Leverage
- **Current CSS Architecture**: The existing `@theme` and `@plugin` structure in app.css provides a solid foundation
- **Browser Debugging Tools**: Playwright integration for automated CSS inspection and validation
- **DaisyUI Component System**: Existing button and component implementations that need proper theming

### Integration Points
- **Tailwind CSS v4**: Ensure compatibility with the new CSS variable system
- **DaisyUI v5**: Proper integration with the updated theme configuration syntax
- **Build Pipeline**: CSS compilation and processing through the existing build system

## Architecture

The root cause analysis reveals that the issue is in the DaisyUI v5 theme configuration. The current implementation uses an incomplete theme definition that doesn't properly override the default DaisyUI theme.

### Current Problem Analysis
1. **Incomplete Theme Definition**: The `@plugin "daisyui/theme"` block lacks required theme metadata
2. **Missing Theme Name**: DaisyUI v5 requires a theme name to properly register custom themes
3. **Default Theme Override**: The default DaisyUI theme is taking precedence over custom variables
4. **CSS Variable Scope**: Custom variables may not be properly scoped to the DaisyUI component system

### Modular Design Principles
- **Theme Isolation**: Separate theme configuration from component overrides
- **Variable Hierarchy**: Clear precedence order for CSS variables
- **Component Compatibility**: Ensure all DaisyUI components respect custom variables
- **Build-time Validation**: Verify theme configuration during compilation

```mermaid
graph TD
    A[app.css] --> B[@theme block]
    A --> C[@plugin daisyui]
    A --> D[@plugin daisyui/theme]
    
    D --> E[Theme Name Required]
    D --> F[Color Variables]
    D --> G[Default Flag]
    
    F --> H[--color-primary: red]
    F --> I[--color-primary-content]
    
    H --> J[btn-primary component]
    J --> K[Expected: Red Background]
    J --> L[Actual: Purple Background]
    
    L --> M[Root Cause: Incomplete Theme Config]
    M --> N[Solution: Proper DaisyUI v5 Syntax]
```

## Components and Interfaces

### Component 1: Theme Configuration Module
- **Purpose:** Properly configure DaisyUI v5 custom theme with complete metadata
- **Interfaces:** CSS `@plugin "daisyui/theme"` directive with required properties
- **Dependencies:** DaisyUI v5, Tailwind CSS v4
- **Reuses:** Existing color variable definitions

### Component 2: CSS Variable Validation System
- **Purpose:** Ensure custom CSS variables are properly applied and accessible
- **Interfaces:** Browser-based validation using Playwright
- **Dependencies:** Playwright browser automation
- **Reuses:** Existing browser testing infrastructure

### Component 3: SCSS Evaluation Framework
- **Purpose:** Assess benefits and compatibility of migrating from CSS to SCSS
- **Interfaces:** Comparative analysis of CSS vs SCSS for theme management
- **Dependencies:** SCSS compiler, DaisyUI compatibility assessment
- **Reuses:** Current CSS architecture patterns

## Data Models

### Theme Configuration Model
```css
@plugin "daisyui/theme" {
  name: "nooklet-custom";
  default: true;
  color-scheme: dark;
  
  --color-primary: red;
  --color-primary-content: white;
  --color-secondary: #6A7E9E;
  --color-accent: #475C7D;
  /* ... other required variables */
}
```

### CSS Variable Validation Model
```javascript
{
  element: HTMLElement,
  computedStyles: CSSStyleDeclaration,
  expectedValues: {
    '--color-primary': 'red',
    backgroundColor: 'red'
  },
  actualValues: {
    '--color-primary': 'oklch(45% 0.24 277.023)',
    backgroundColor: 'oklch(45% 0.24 277.023)'
  },
  isValid: boolean
}
```

## Error Handling

### Error Scenarios
1. **Theme Not Applied:** DaisyUI continues using default theme
   - **Handling:** Add proper theme name and default flag
   - **User Impact:** Custom colors not visible, design inconsistency

2. **CSS Variable Conflicts:** Multiple theme definitions conflict
   - **Handling:** Use CSS specificity and !important declarations strategically
   - **User Impact:** Unpredictable color behavior

3. **Build-time Compilation Errors:** Invalid CSS syntax or missing dependencies
   - **Handling:** Validate theme configuration syntax and provide clear error messages
   - **User Impact:** Build failures, development workflow interruption

4. **Browser Compatibility Issues:** CSS variables not supported in older browsers
   - **Handling:** Provide fallback values and progressive enhancement
   - **User Impact:** Degraded visual experience in unsupported browsers

## Testing Strategy

### Unit Testing
- CSS variable resolution testing
- Theme configuration validation
- Component style inheritance verification

### Integration Testing
- DaisyUI component rendering with custom theme
- Tailwind CSS utility class compatibility
- Build pipeline integration testing

### End-to-End Testing
- Browser-based visual regression testing using Playwright
- Cross-browser compatibility validation
- Theme switching functionality testing

## Implementation Plan

### Phase 1: Root Cause Fix
1. **Update DaisyUI Theme Configuration**
   - Add required `name` property to theme definition
   - Set `default: true` to override default theme
   - Ensure all required CSS variables are defined

2. **Validate CSS Variable Application**
   - Use Playwright to verify variables are applied
   - Check computed styles match expected values
   - Test component rendering with custom theme

### Phase 2: SCSS Evaluation
1. **Assess SCSS Benefits**
   - Variable management improvements
   - Nesting and organization capabilities
   - Mixin and function support for theme generation

2. **Compatibility Testing**
   - DaisyUI v5 SCSS support verification
   - Tailwind CSS v4 integration testing
   - Build pipeline impact assessment

### Phase 3: Validation and Documentation
1. **Comprehensive Testing**
   - All DaisyUI components with custom theme
   - Cross-browser compatibility validation
   - Performance impact measurement

2. **Documentation Updates**
   - Theme customization guidelines
   - CSS variable usage patterns
   - Troubleshooting guide for common issues

## CSS vs SCSS Recommendation

### CSS Advantages
- **Simplicity**: Direct compatibility with Tailwind CSS v4 and DaisyUI v5
- **Performance**: No additional compilation step for SCSS processing
- **Native Support**: CSS custom properties are natively supported
- **Debugging**: Easier to debug CSS variables in browser dev tools

### SCSS Advantages
- **Organization**: Better file organization with partials and imports
- **Variables**: More powerful variable system with calculations and functions
- **Mixins**: Reusable style patterns for theme generation
- **Nesting**: Cleaner syntax for component-specific overrides

### Recommendation
**Stick with CSS** for this project because:
1. DaisyUI v5 and Tailwind CSS v4 are optimized for CSS custom properties
2. The current issue is configuration-related, not a limitation of CSS
3. CSS custom properties provide runtime flexibility that SCSS variables cannot
4. Simpler build pipeline and better debugging experience
5. Native browser support for CSS variables enables dynamic theming