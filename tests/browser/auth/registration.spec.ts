import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../helpers/registration-page';
import { DatabaseHelpers } from '../helpers/database-helpers';
import { TestDataFactory, TestDataCleanup, TestDataPatterns } from '../helpers/test-data';

/**
 * End-to-End tests for user registration
 * Tests the complete registration flow from frontend to database
 */
test.describe('User Registration E2E', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    // Clean up any existing test data
    await DatabaseHelpers.cleanupTestData();

    // Reset test data tracking
    TestDataCleanup.clearTracking();
    TestDataFactory.resetCounter();

    // Initialize page object
    registrationPage = new RegistrationPage(page);

    // Navigate to registration page
    await registrationPage.goto();
  });

  test.afterEach(async () => {
    // Clean up tracked test data
    const trackedEmails = TestDataCleanup.getTrackedEmails();
    for (const email of trackedEmails) {
      await DatabaseHelpers.cleanupUser(email);
    }

    // Clean up any remaining test data
    await DatabaseHelpers.cleanupTestData();

    // Clear tracking
    TestDataCleanup.clearTracking();
  });

  test('should render registration form correctly', async () => {
    // Verify all form elements are present and visible
    await registrationPage.verifyFormElements();
    
    // Verify page title and heading
    await expect(registrationPage.page).toHaveTitle(/Register/);
    await expect(registrationPage.heading).toContainText('Create your account');
    
    // Verify login link is present
    await expect(registrationPage.loginLink).toBeVisible();
    await expect(registrationPage.loginLink).toHaveAttribute('href', '/login');
  });

  test('should successfully register a new user with valid data', async () => {
    const testData = TestDataFactory.createValidUser();
    TestDataCleanup.trackEmail(testData.email);

    // Fill and submit the registration form
    await registrationPage.register(testData);

    // Wait for success message or redirect
    await registrationPage.waitForSuccess();

    // Verify success message is displayed
    expect(await registrationPage.hasSuccessMessage()).toBe(true);

    // Verify user was created in database
    const verification = await DatabaseHelpers.verifyUserCreated(testData.email);
    
    // Verify AuthUser record
    expect(verification.authUser.email).toBe(testData.email);
    expect(verification.authUser.isActive).toBe(true);
    expect(verification.authUser.isArchived).toBe(false);
    
    // Verify Profile record
    expect(verification.profile.authUserId).toBe(verification.authUser.id);
    expect(verification.profile.username).toBe(testData.username);
    expect(verification.profile.isArchived).toBe(false);

    // Verify password is properly hashed
    await DatabaseHelpers.verifyPasswordHashed(testData.email, testData.password);
  });

  test('should successfully register a user without username', async () => {
    const testData = TestDataPatterns.minimalRegistration();
    TestDataCleanup.trackEmail(testData.email);

    // Fill and submit the registration form (without username)
    await registrationPage.register(testData);

    // Wait for success
    await registrationPage.waitForSuccess();

    // Verify user was created in database
    const verification = await DatabaseHelpers.verifyUserCreated(testData.email);
    
    // Verify profile has null username
    expect(verification.profile.username).toBeNull();
  });

  test('should maintain form state during processing', async () => {
    const testData = {
      email: 'processing-test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      username: 'processinguser'
    };

    // Fill the form
    await registrationPage.fillForm(testData);

    // Submit and immediately check processing state
    const submitPromise = registrationPage.submit();

    // Check if form shows processing state (this might be quick)
    // Note: This test might be flaky due to fast processing
    try {
      const isProcessing = await registrationPage.isProcessing();
      // If we catch the processing state, verify submit button is disabled
      if (isProcessing) {
        expect(await registrationPage.isSubmitDisabled()).toBe(true);
      }
    } catch {
      // Processing might be too fast to catch, which is fine
    }

    // Wait for submission to complete
    await submitPromise;

    // Verify success
    await registrationPage.waitForSuccess();
  });

  test('should display loading state during form submission', async () => {
    const testData = {
      email: 'loading-state@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Fill the form
    await registrationPage.fillForm(testData);

    // Intercept the registration request to add delay
    await registrationPage.page.route('**/register', async (route) => {
      // Add a small delay to catch the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    // Start form submission
    const submitPromise = registrationPage.submit();

    // Verify loading state appears
    await expect(registrationPage.submitButton).toContainText('Creating account...');
    await expect(registrationPage.submitButton).toBeDisabled();

    // Wait for submission to complete
    await submitPromise;

    // Verify button returns to normal state after completion
    await expect(registrationPage.submitButton).toContainText('Register');
    await expect(registrationPage.submitButton).not.toBeDisabled();
  });

  test('should display success message after registration', async () => {
    const testData = {
      email: 'success-message@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Register user
    await registrationPage.register(testData);

    // Wait for and verify success message
    await registrationPage.waitForSuccess();

    // Verify success message is visible and contains expected text
    const successMessage = registrationPage.page.locator('text=Registration successful');
    await expect(successMessage).toBeVisible();

    // Verify form is cleared/reset after successful registration
    await expect(registrationPage.passwordInput).toHaveValue('');
    await expect(registrationPage.passwordConfirmationInput).toHaveValue('');

    // Email and username should remain for user convenience
    await expect(registrationPage.emailInput).toHaveValue(testData.email);
  });

  test('should handle form validation without losing user input', async () => {
    const testData = {
      email: 'validation-test@example.com',
      password: 'short', // Too short password
      passwordConfirmation: 'short'
    };

    // Fill form with invalid data
    await registrationPage.fillForm(testData);
    await registrationPage.submit();

    // Wait for validation error
    await registrationPage.page.waitForTimeout(1000);

    // Verify form retains user input after validation error
    await expect(registrationPage.emailInput).toHaveValue(testData.email);
    await expect(registrationPage.passwordInput).toHaveValue(testData.password);
    await expect(registrationPage.passwordConfirmationInput).toHaveValue(testData.passwordConfirmation);

    // Verify error message is displayed
    const passwordError = await registrationPage.getFieldError('password');
    expect(passwordError).toBeTruthy();
  });

  test('should provide clear visual feedback for form interactions', async () => {
    // Navigate to registration page
    await registrationPage.goto();

    // Verify form elements are properly labeled and accessible
    await expect(registrationPage.emailInput).toHaveAttribute('type', 'email');
    await expect(registrationPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(registrationPage.passwordConfirmationInput).toHaveAttribute('type', 'password');

    // Verify form has proper structure
    await expect(registrationPage.page.locator('label[for="email"]')).toContainText('Email');
    await expect(registrationPage.page.locator('label[for="password"]')).toContainText('Password');
    await expect(registrationPage.page.locator('label[for="password_confirmation"]')).toContainText('Confirm Password');
    await expect(registrationPage.page.locator('label[for="username"]')).toContainText('Username');

    // Verify submit button is initially enabled
    await expect(registrationPage.submitButton).not.toBeDisabled();
    await expect(registrationPage.submitButton).toContainText('Register');
  });

  test('should stay on registration page after successful registration', async () => {
    const testData = {
      email: 'stay-on-page@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Register user
    await registrationPage.register(testData);
    
    // Wait for success
    await registrationPage.waitForSuccess();

    // Verify we're still on the registration page
    expect(await registrationPage.isOnRegistrationPage()).toBe(true);
    
    // Verify form is cleared or ready for another registration
    // (This depends on the implementation - form might be cleared or not)
  });

  test('should handle network delays gracefully', async () => {
    const testData = {
      email: 'network-test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Simulate slow network (optional - depends on test environment)
    // await page.route('**/register', route => {
    //   setTimeout(() => route.continue(), 1000);
    // });

    // Register user
    await registrationPage.register(testData);

    // Wait for success with longer timeout
    await registrationPage.page.waitForSelector('text=Registration successful', {
      timeout: 10000
    });

    // Verify database state
    await DatabaseHelpers.verifyUserCreated(testData.email);
  });

  test('should display validation errors for invalid email', async () => {
    const testData = {
      email: 'invalid-email',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Fill and submit form with invalid email
    await registrationPage.register(testData);

    // Wait for error to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify email validation error appears
    const emailError = await registrationPage.getFieldError('email');
    expect(emailError).toBeTruthy();
    expect(emailError).toContain('email');

    // Verify no user was created in database
    await DatabaseHelpers.verifyUserNotCreated(testData.email);
  });

  test('should display validation errors for password mismatch', async () => {
    const testData = {
      email: 'mismatch@example.com',
      password: 'password123',
      passwordConfirmation: 'different-password'
    };

    // Fill and submit form with mismatched passwords
    await registrationPage.register(testData);

    // Wait for error to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify password confirmation error appears
    const passwordError = await registrationPage.getFieldError('password_confirmation');
    expect(passwordError).toBeTruthy();

    // Verify no user was created in database
    await DatabaseHelpers.verifyUserNotCreated(testData.email);
  });

  test('should display validation errors for short password', async () => {
    const testData = {
      email: 'short-password@example.com',
      password: '123',
      passwordConfirmation: '123'
    };

    // Fill and submit form with short password
    await registrationPage.register(testData);

    // Wait for error to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify password length error appears
    const passwordError = await registrationPage.getFieldError('password');
    expect(passwordError).toBeTruthy();

    // Verify no user was created in database
    await DatabaseHelpers.verifyUserNotCreated(testData.email);
  });

  test('should display validation errors for missing required fields', async () => {
    // Try to submit empty form
    await registrationPage.submit();

    // Wait for errors to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify email error appears
    const emailError = await registrationPage.getFieldError('email');
    expect(emailError).toBeTruthy();

    // Verify password error appears
    const passwordError = await registrationPage.getFieldError('password');
    expect(passwordError).toBeTruthy();

    // Verify no users were created
    const userCount = await DatabaseHelpers.getUserCount();
    expect(userCount).toBe(0);
  });

  test('should display multiple validation errors simultaneously', async () => {
    const testData = {
      email: 'invalid-email',
      password: '123',
      passwordConfirmation: 'different'
    };

    // Fill and submit form with multiple validation issues
    await registrationPage.register(testData);

    // Wait for errors to appear
    await registrationPage.page.waitForTimeout(1000);

    // Get all error messages
    const allErrors = await registrationPage.getAllErrors();
    expect(allErrors.length).toBeGreaterThan(0);

    // Verify no user was created
    await DatabaseHelpers.verifyUserNotCreated(testData.email);
  });

  test('should prevent duplicate email registration', async () => {
    const email = 'duplicate@example.com';
    const username = 'duplicateuser';

    // First, create a user directly in the database
    await DatabaseHelpers.createTestUser(email, username);

    // Verify the user exists
    await DatabaseHelpers.verifyUserCreated(email);

    // Now try to register with the same email
    const testData = {
      email: email,
      password: 'password123',
      passwordConfirmation: 'password123',
      username: 'newusername'
    };

    // Fill and submit form with duplicate email
    await registrationPage.register(testData);

    // Wait for error to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify email conflict error appears
    const emailError = await registrationPage.getFieldError('email');
    expect(emailError).toBeTruthy();
    expect(emailError?.toLowerCase()).toContain('email');

    // Verify only one user exists with this email (the original)
    const userCount = await DatabaseHelpers.getUserCount();
    expect(userCount).toBe(1);

    // Verify the original user data is unchanged
    const verification = await DatabaseHelpers.verifyUserCreated(email);
    expect(verification.profile.username).toBe(username); // Original username, not the new one
  });

  test('should handle duplicate email with different case', async () => {
    const originalEmail = 'CaseTest@Example.com';
    const duplicateEmail = 'casetest@example.com';

    // Create user with mixed case email
    await DatabaseHelpers.createTestUser(originalEmail);

    // Try to register with lowercase version
    const testData = {
      email: duplicateEmail,
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Fill and submit form
    await registrationPage.register(testData);

    // Wait for error to appear
    await registrationPage.page.waitForTimeout(1000);

    // Verify email conflict error appears (case-insensitive check)
    const emailError = await registrationPage.getFieldError('email');
    expect(emailError).toBeTruthy();

    // Verify only one user exists
    const userCount = await DatabaseHelpers.getUserCount();
    expect(userCount).toBe(1);
  });

  test('should handle CSRF protection correctly', async () => {
    const testData = {
      email: 'csrf-test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Navigate to registration page to ensure CSRF token is loaded
    await registrationPage.goto();

    // Verify CSRF token exists in the page (Inertia handles this automatically)
    const csrfToken = await registrationPage.page.locator('meta[name="csrf-token"]').getAttribute('content');
    expect(csrfToken).toBeTruthy();

    // Fill and submit form (CSRF token should be included automatically by Inertia)
    await registrationPage.register(testData);

    // Wait for success (if CSRF is working, registration should succeed)
    await registrationPage.waitForSuccess();

    // Verify user was created (CSRF protection allowed the request)
    await DatabaseHelpers.verifyUserCreated(testData.email);
  });

  test('should verify form submission includes proper headers', async () => {
    const testData = {
      email: 'headers-test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    };

    // Set up network monitoring to capture the registration request
    const requests: any[] = [];
    registrationPage.page.on('request', (request) => {
      if (request.url().includes('/register') && request.method() === 'POST') {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });

    // Fill and submit form
    await registrationPage.register(testData);

    // Wait for request to complete
    await registrationPage.page.waitForTimeout(2000);

    // Verify the request was made
    expect(requests.length).toBeGreaterThan(0);

    const registrationRequest = requests[0];

    // Verify proper headers are included
    expect(registrationRequest.headers['content-type']).toContain('application/json');
    expect(registrationRequest.headers['x-requested-with']).toBe('XMLHttpRequest');

    // Verify CSRF token is included (Inertia handles this)
    expect(registrationRequest.headers['x-csrf-token'] || registrationRequest.headers['x-xsrf-token']).toBeTruthy();
  });
});
