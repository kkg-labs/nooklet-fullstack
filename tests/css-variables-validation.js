/**
 * DaisyUI CSS Variables Validation Script
 *
 * This script validates that custom CSS variables are properly applied
 * to DaisyUI components and provides comprehensive debugging information.
 */

import { test, expect } from '@playwright/test';

// Expected CSS variable values for validation
const EXPECTED_THEME_VARIABLES = {
  '--color-primary': 'red',
  '--color-primary-content': '#1E293A',
  '--color-secondary': '#6A7E9E',
  '--color-accent': '#475C7D',
  '--color-neutral': '#3F4B5E',
  '--color-info': '#60a5fa',
  '--color-success': '#10b981',
  '--color-warning': '#f59e0b',
  '--color-error': '#ef4444',
  '--color-base-100': '#1a1d29', // var(--brand-bg)
  '--color-base-content': '#f8fafc', // var(--brand-text)
};

// Expected computed styles for components
const EXPECTED_COMPONENT_STYLES = {
  'btn-primary': {
    backgroundColor: 'rgb(255, 0, 0)', // red
    selector: '.btn.btn-primary, a.btn.btn-primary',
  },
  'btn-secondary': {
    backgroundColor: 'rgb(106, 126, 158)', // #6A7E9E
    selector: '.btn.btn-secondary',
  },
  'btn-accent': {
    backgroundColor: 'rgb(71, 92, 125)', // #475C7D
    selector: '.btn.btn-accent',
  },
};

test.describe('DaisyUI CSS Variables Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3333');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should have all required CSS variables defined in :root', async ({
    page,
  }) => {
    const cssVariables = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const variables = {};

      // Get all CSS custom properties
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--')) {
          variables[prop] = rootStyles.getPropertyValue(prop).trim();
        }
      }

      return variables;
    });

    // Validate each expected variable
    for (const [varName, expectedValue] of Object.entries(
      EXPECTED_THEME_VARIABLES,
    )) {
      expect(
        cssVariables[varName],
        `CSS variable ${varName} should be defined`,
      ).toBeDefined();

      // For brand variables that use var() references, just check they're not empty
      if (expectedValue.startsWith('#') || expectedValue === 'red') {
        expect(
          cssVariables[varName],
          `CSS variable ${varName} should match expected value`,
        ).toBe(expectedValue);
      } else {
        expect(
          cssVariables[varName],
          `CSS variable ${varName} should not be empty`,
        ).toBeTruthy();
      }
    }
  });

  test('should apply primary color to btn-primary components', async ({
    page,
  }) => {
    // Find the primary button
    const primaryButton = page
      .locator('a[href="/register"].btn.btn-primary')
      .first();
    await expect(primaryButton).toBeVisible();

    // Get computed styles
    const styles = await primaryButton.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        cssVariables: {
          colorPrimary: computed.getPropertyValue('--color-primary'),
          colorPrimaryContent: computed.getPropertyValue(
            '--color-primary-content',
          ),
        },
      };
    });

    // Validate background color is red
    expect(styles.backgroundColor).toBe('rgb(255, 0, 0)');

    // Validate CSS variables are accessible
    expect(styles.cssVariables.colorPrimary).toBe('red');
    expect(styles.cssVariables.colorPrimaryContent).toBeTruthy();
  });

  test('should validate CSS variable inheritance across components', async ({
    page,
  }) => {
    const validationResults = await page.evaluate(() => {
      const results = [];

      // Test different DaisyUI components
      const testSelectors = [
        {
          name: 'primary-button',
          selector: '.btn.btn-primary',
          expectedBg: 'rgb(255, 0, 0)',
        },
        {
          name: 'badge-primary',
          selector: '.badge.badge-primary',
          expectedBg: 'rgb(255, 0, 0)',
        },
        { name: 'alert-info', selector: '.alert.alert-info', expectedBg: null }, // May not have background
      ];

      testSelectors.forEach(({ name, selector, expectedBg }) => {
        const elements = document.querySelectorAll(selector);

        if (elements.length > 0) {
          const element = elements[0];
          const computed = window.getComputedStyle(element);

          results.push({
            component: name,
            selector,
            found: true,
            backgroundColor: computed.backgroundColor,
            primaryVariable: computed.getPropertyValue('--color-primary'),
            expectedBg,
          });
        } else {
          results.push({
            component: name,
            selector,
            found: false,
            backgroundColor: null,
            primaryVariable: null,
            expectedBg,
          });
        }
      });

      return results;
    });

    // Validate results
    validationResults.forEach((result) => {
      if (result.found && result.expectedBg) {
        expect(
          result.backgroundColor,
          `${result.component} should have correct background color`,
        ).toBe(result.expectedBg);
      }

      if (result.found) {
        expect(
          result.primaryVariable,
          `${result.component} should have access to --color-primary`,
        ).toBe('red');
      }
    });
  });

  test('should validate theme consistency across page load', async ({
    page,
  }) => {
    // Take initial snapshot of CSS variables
    const initialVariables = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      return {
        primary: rootStyles.getPropertyValue('--color-primary'),
        primaryContent: rootStyles.getPropertyValue('--color-primary-content'),
        base100: rootStyles.getPropertyValue('--color-base-100'),
      };
    });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Take snapshot after reload
    const reloadedVariables = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      return {
        primary: rootStyles.getPropertyValue('--color-primary'),
        primaryContent: rootStyles.getPropertyValue('--color-primary-content'),
        base100: rootStyles.getPropertyValue('--color-base-100'),
      };
    });

    // Validate consistency
    expect(reloadedVariables.primary).toBe(initialVariables.primary);
    expect(reloadedVariables.primaryContent).toBe(
      initialVariables.primaryContent,
    );
    expect(reloadedVariables.base100).toBe(initialVariables.base100);
  });

  test('should provide comprehensive debugging information', async ({
    page,
  }) => {
    const debugInfo = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const primaryButton = document.querySelector('.btn.btn-primary');

      const info = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        cssVariables: {},
        componentStyles: {},
        daisyuiVersion: null,
        tailwindVersion: null,
      };

      // Collect all CSS variables
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (
          prop.startsWith('--color-') ||
          prop.startsWith('--radius-') ||
          prop.startsWith('--border')
        ) {
          info.cssVariables[prop] = rootStyles.getPropertyValue(prop).trim();
        }
      }

      // Collect component styles
      if (primaryButton) {
        const buttonStyles = window.getComputedStyle(primaryButton);
        info.componentStyles.primaryButton = {
          backgroundColor: buttonStyles.backgroundColor,
          color: buttonStyles.color,
          borderColor: buttonStyles.borderColor,
          borderRadius: buttonStyles.borderRadius,
        };
      }

      return info;
    });

    // Log debug information for manual inspection
    console.log(
      'CSS Variables Debug Info:',
      JSON.stringify(debugInfo, null, 2),
    );

    // Basic validation that debug info is collected
    expect(debugInfo.cssVariables['--color-primary']).toBe('red');
    expect(debugInfo.componentStyles.primaryButton?.backgroundColor).toBe(
      'rgb(255, 0, 0)',
    );
  });
});

// Utility function for manual testing
export async function validateCSSVariables(page) {
  return await page.evaluate(() => {
    const validation = {
      success: true,
      errors: [],
      warnings: [],
      variables: {},
    };

    const rootStyles = window.getComputedStyle(document.documentElement);
    const requiredVars = [
      '--color-primary',
      '--color-primary-content',
      '--color-base-100',
      '--color-base-content',
    ];

    requiredVars.forEach((varName) => {
      const value = rootStyles.getPropertyValue(varName).trim();
      validation.variables[varName] = value;

      if (!value) {
        validation.success = false;
        validation.errors.push(`Missing required CSS variable: ${varName}`);
      }
    });

    // Check if primary color is applied to buttons
    const primaryButtons = document.querySelectorAll('.btn.btn-primary');
    if (primaryButtons.length > 0) {
      const buttonStyle = window.getComputedStyle(primaryButtons[0]);
      const bgColor = buttonStyle.backgroundColor;

      if (bgColor !== 'rgb(255, 0, 0)') {
        validation.warnings.push(
          `Primary button background is ${bgColor}, expected rgb(255, 0, 0)`,
        );
      }
    }

    return validation;
  });
}
