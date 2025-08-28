# Implementation Plan

## Task Overview
This implementation plan addresses the DaisyUI CSS variable issue through systematic debugging, root cause analysis, and proper theme configuration. The tasks are designed to identify why `--color-primary: red` is not being applied to `btn btn-primary` components and implement the correct DaisyUI v5 theme syntax.

## Tasks

- [x] 1. Investigate and diagnose CSS variable application issue
  - File: inertia/css/app.css (analysis)
  - Analyze current DaisyUI v5 theme configuration syntax
  - Use browser dev tools to inspect CSS variable resolution
  - Document the root cause of variable override behavior
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Fix DaisyUI v5 theme configuration syntax
  - File: inertia/css/app.css
  - Add required `name` property to `@plugin "daisyui/theme"` block
  - Set `default: true` to ensure custom theme overrides defaults
  - Verify all required CSS variables are properly defined
  - _Requirements: 2.1, 2.2_
  - _Leverage: existing color variable definitions in @theme block_

- [ ] 3. Create browser-based validation script using Playwright
  - File: tests/css-variables-validation.js
  - Implement automated CSS variable inspection
  - Verify computed styles match expected custom values
  - Test button component background color resolution
  - _Requirements: 4.1, 4.2, 4.3_
  - _Leverage: existing Playwright browser automation setup_

- [ ] 4. Validate CSS variable inheritance and specificity
  - File: inertia/css/app.css (verification)
  - Check CSS cascade and specificity conflicts
  - Ensure custom variables take precedence over defaults
  - Test variable accessibility across component hierarchy
  - _Requirements: 1.4, 1.5, 4.4_

- [ ] 5. Test and verify the fix across all DaisyUI components
  - Files: Multiple component templates
  - Test primary color application on buttons, badges, and other components
  - Verify no regression in existing component styling
  - Validate theme consistency across the application
  - _Requirements: 2.3, 2.4, 4.5_
  - _Leverage: existing component implementations_

- [x] 6. Evaluate CSS vs SCSS for theme management
  - File: docs/css-vs-scss-analysis.md
  - Analyze SCSS benefits for variable management and organization
  - Assess DaisyUI v5 and Tailwind CSS v4 compatibility with SCSS
  - Compare build complexity and maintainability factors
  - Provide recommendation based on project needs
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 7. Create comprehensive CSS variable debugging guide
  - File: docs/css-variables-debugging.md
  - Document common DaisyUI v5 theme configuration issues
  - Provide troubleshooting steps for CSS variable problems
  - Include browser dev tools usage for CSS variable inspection
  - Create reference for future theme customizations
  - _Requirements: 4.1, 4.2_
  - _Leverage: findings from investigation and validation tasks_

- [ ] 8. Implement CSS variable validation in development workflow
  - File: scripts/validate-theme.js
  - Create automated validation for theme configuration
  - Add build-time checks for required CSS variables
  - Implement warnings for potential theme conflicts
  - _Requirements: 2.5, 4.4_
  - _Leverage: Playwright validation script from task 3_