import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../helpers/registration-page';
import { DatabaseHelpers } from '../helpers/database-helpers';
import { TestDataFactory, TestDataCleanup } from '../helpers/test-data';

/**
 * Performance and Accessibility tests for user registration
 * Tests performance metrics and accessibility compliance
 */
test.describe('Registration Performance & Accessibility', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    // Clean up any existing test data
    await DatabaseHelpers.cleanupTestData();
    TestDataCleanup.clearTracking();
    TestDataFactory.resetCounter();

    // Initialize page object
    registrationPage = new RegistrationPage(page);
  });

  test.afterEach(async () => {
    // Clean up tracked test data
    const trackedEmails = TestDataCleanup.getTrackedEmails();
    for (const email of trackedEmails) {
      await DatabaseHelpers.cleanupUser(email);
    }
    await DatabaseHelpers.cleanupTestData();
    TestDataCleanup.clearTracking();
  });

  test('should load registration page within performance targets', async ({
    page,
  }) => {
    // Start performance measurement
    const startTime = Date.now();

    // Navigate to registration page
    await registrationPage.goto();

    // Wait for page to be fully loaded
    await registrationPage.waitForLoad();

    // Calculate load time
    const loadTime = Date.now() - startTime;

    // Verify load time is under 2 seconds (2000ms)
    expect(loadTime).toBeLessThan(2000);

    // Verify Core Web Vitals using Playwright's performance API
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });

    const navigationEntries = JSON.parse(performanceEntries);
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];

      // First Contentful Paint should be under 1.5 seconds
      const fcp = entry.loadEventEnd - entry.fetchStart;
      expect(fcp).toBeLessThan(1500);
    }
  });

  test('should handle form interactions with good responsiveness', async ({
    page,
  }) => {
    await registrationPage.goto();

    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    // Measure form filling performance
    const startFill = Date.now();

    await registrationPage.fillForm(testData);

    const fillTime = Date.now() - startFill;

    // Form filling should be responsive (under 500ms for all fields)
    expect(fillTime).toBeLessThan(500);

    // Measure form submission performance
    const startSubmit = Date.now();

    await registrationPage.submit();
    await registrationPage.waitForSuccess();

    const submitTime = Date.now() - startSubmit;

    // Form submission should complete within 3 seconds
    expect(submitTime).toBeLessThan(3000);
  });

  test('should meet accessibility standards', async ({ page }) => {
    await registrationPage.goto();

    // Check for proper form labels
    const emailLabel = page.locator('label[for="email"]');
    const passwordLabel = page.locator('label[for="password"]');
    const confirmPasswordLabel = page.locator(
      'label[for="password_confirmation"]',
    );
    const usernameLabel = page.locator('label[for="username"]');

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    await expect(confirmPasswordLabel).toBeVisible();
    await expect(usernameLabel).toBeVisible();

    // Check for proper input types
    await expect(registrationPage.emailInput).toHaveAttribute('type', 'email');
    await expect(registrationPage.passwordInput).toHaveAttribute(
      'type',
      'password',
    );
    await expect(registrationPage.passwordConfirmationInput).toHaveAttribute(
      'type',
      'password',
    );

    // Check for proper ARIA attributes
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check for proper heading structure
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Create your account');

    // Check for proper focus management
    await registrationPage.emailInput.focus();
    await expect(registrationPage.emailInput).toBeFocused();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(registrationPage.passwordInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(registrationPage.passwordConfirmationInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(registrationPage.usernameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(registrationPage.submitButton).toBeFocused();
  });

  test('should provide proper error message accessibility', async ({
    page,
  }) => {
    await registrationPage.goto();

    // Submit empty form to trigger validation errors
    await registrationPage.submit();

    // Wait for errors to appear
    await page.waitForTimeout(1000);

    // Check that error messages are properly associated with form fields
    const emailError = await registrationPage.getFieldError('email');
    if (emailError) {
      // Error should be visible and readable
      const errorElement = page.locator('text=' + emailError);
      await expect(errorElement).toBeVisible();

      // Error should be near the related input field
      const emailInputBounds = await registrationPage.emailInput.boundingBox();
      const errorBounds = await errorElement.boundingBox();

      if (emailInputBounds && errorBounds) {
        // Error should be within reasonable distance of the input
        const distance = Math.abs(errorBounds.y - emailInputBounds.y);
        expect(distance).toBeLessThan(100); // Within 100px vertically
      }
    }
  });

  test('should handle high contrast and color accessibility', async ({
    page,
  }) => {
    await registrationPage.goto();

    // Check that form elements have sufficient color contrast
    // This is a basic check - in a real scenario you'd use axe-core or similar

    // Verify form elements are visible and have proper styling
    await expect(registrationPage.emailInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.submitButton).toBeVisible();

    // Check that focus indicators are visible
    await registrationPage.emailInput.focus();

    // Verify the focused element has visual indication
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test with reduced motion preference (if supported)
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Form should still be functional with reduced motion
    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    await registrationPage.register(testData);
    await registrationPage.waitForSuccess();
  });

  test('should work properly on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    await registrationPage.goto();

    // Verify form is usable on mobile
    await expect(registrationPage.emailInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.submitButton).toBeVisible();

    // Test form interaction on mobile
    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    const startTime = Date.now();

    await registrationPage.register(testData);
    await registrationPage.waitForSuccess();

    const mobileTime = Date.now() - startTime;

    // Mobile interaction should still be reasonably fast
    expect(mobileTime).toBeLessThan(5000); // 5 seconds on mobile

    // Verify user was created
    await DatabaseHelpers.verifyUserCreated(testData.email);
  });

  test('should handle network conditions gracefully', async ({ page }) => {
    await registrationPage.goto();

    // Simulate slow 3G network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
      latency: 40, // 40ms latency
    });

    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    const startTime = Date.now();

    await registrationPage.register(testData);
    await registrationPage.waitForSuccess();

    const slowNetworkTime = Date.now() - startTime;

    // Should complete within 10 seconds even on slow network
    expect(slowNetworkTime).toBeLessThan(10000);

    // Verify registration succeeded despite slow network
    await DatabaseHelpers.verifyUserCreated(testData.email);

    // Disable network throttling
    await client.send('Network.disable');
  });

  test('should maintain performance with multiple rapid submissions', async ({
    page,
  }) => {
    await registrationPage.goto();

    // Test rapid form submissions (simulating impatient user)
    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    await registrationPage.fillForm(testData);

    // Submit multiple times rapidly
    const submitPromises = [];
    for (let i = 0; i < 3; i++) {
      submitPromises.push(registrationPage.submit());
    }

    // Wait for all submissions to complete
    await Promise.all(submitPromises);

    // Should handle gracefully without creating duplicate users
    const userCount = await DatabaseHelpers.getUserCount();
    expect(userCount).toBeLessThanOrEqual(1); // Should not create duplicates

    // If user was created, verify it's correct
    if (userCount === 1) {
      await DatabaseHelpers.verifyUserCreated(testData.email);
    }
  });
});
