# E2E Testing with Playwright

This directory contains end-to-end tests for the Nooklet application using Playwright.

## Overview

The E2E test suite covers:
- User registration flow with comprehensive validation
- Cross-browser compatibility testing
- Performance and accessibility testing
- Database verification and cleanup
- Error handling and edge cases

## Test Structure

```
tests/browser/
├── auth/
│   ├── registration.spec.ts           # Main registration tests
│   └── registration-performance.spec.ts # Performance & accessibility tests
├── helpers/
│   ├── registration-page.ts           # Page Object Model for registration
│   ├── database-helpers.ts            # Database verification utilities
│   ├── test-data.ts                   # Test data generation and management
│   └── test-reporter.ts               # Enhanced reporting utilities
├── setup.ts                           # Global test setup
└── README.md                          # This file
```

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run cross-browser tests
npm run test:e2e:cross-browser

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Specific Test Files

```bash
# Run only registration tests
npx playwright test tests/browser/auth/registration.spec.ts

# Run only performance tests
npx playwright test tests/browser/auth/registration-performance.spec.ts

# Run specific test by name
npx playwright test -g "should successfully register a new user"
```

### Browser-Specific Testing

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Cross-browser support**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Automatic screenshots**: Captured on test failures
- **Video recording**: Recorded on test failures
- **Trace collection**: Collected on retry
- **Multiple reporters**: HTML, JSON, JUnit, GitHub Actions

## Database Setup

Tests require a PostgreSQL database. The setup:

1. **Database Connection**: Uses environment variables or defaults to local PostgreSQL
2. **Automatic Cleanup**: Each test cleans up its data before and after execution
3. **Data Isolation**: Tests use unique email addresses and usernames
4. **Verification**: Database state is verified after operations

### Environment Variables

```bash
# Database configuration (optional - defaults provided)
DB_HOST=localhost
DB_PORT=5432
DB_USER=nooklet_admin
DB_PASSWORD=
DB_DATABASE=nooklet_db
```

## Page Object Model

The tests use the Page Object Model pattern for maintainable test code:

### RegistrationPage

```typescript
const registrationPage = new RegistrationPage(page);

// Navigate to registration page
await registrationPage.goto();

// Fill and submit form
await registrationPage.register({
  email: 'test@example.com',
  password: 'password123',
  passwordConfirmation: 'password123',
  username: 'testuser'
});

// Verify success
await registrationPage.waitForSuccess();
```

## Test Data Management

The `TestDataFactory` provides consistent test data generation:

```typescript
// Generate valid user data
const userData = TestDataFactory.createValidUser();

// Generate test variants for validation testing
const variants = TestDataFactory.createTestVariants();

// Use predefined patterns
const minimalUser = TestDataPatterns.minimalRegistration();
```

## Database Verification

The `DatabaseHelpers` class provides database verification:

```typescript
// Verify user was created
const verification = await DatabaseHelpers.verifyUserCreated(email);

// Verify password is hashed
await DatabaseHelpers.verifyPasswordHashed(email, plainPassword);

// Clean up test data
await DatabaseHelpers.cleanupTestData();
```

## Enhanced Reporting

The test suite includes enhanced reporting features:

- **Automatic screenshots** on test failures
- **Network request logging** for debugging
- **Console message capture** for error tracking
- **Database state snapshots** for verification
- **Performance metrics** for optimization

### Viewing Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

The report includes:
- Test results with pass/fail status
- Screenshots and videos for failed tests
- Execution traces for debugging
- Performance metrics
- Cross-browser compatibility results

## Debugging Tests

### Debug Mode

```bash
# Run in debug mode (opens browser dev tools)
npm run test:e2e:debug

# Debug specific test
npx playwright test --debug -g "test name"
```

### Manual Debugging

1. **Add breakpoints** in test code using `await page.pause()`
2. **Inspect elements** using browser dev tools
3. **Check console logs** for JavaScript errors
4. **Review network requests** in the Network tab
5. **Examine database state** using database verification helpers

### Common Issues

1. **Database connection errors**: Ensure PostgreSQL is running and accessible
2. **Port conflicts**: Check if the development server is running on the expected port
3. **Timing issues**: Use proper waits instead of fixed timeouts
4. **Element not found**: Verify selectors match the current UI
5. **Test data conflicts**: Ensure proper cleanup between tests

## Performance Testing

The performance test suite includes:

- **Page load time** verification (< 2 seconds)
- **Form interaction** responsiveness (< 500ms)
- **Network condition** simulation (slow 3G)
- **Mobile viewport** testing
- **Core Web Vitals** measurement

## Accessibility Testing

Accessibility tests verify:

- **Proper form labels** and ARIA attributes
- **Keyboard navigation** functionality
- **Focus management** and visual indicators
- **Color contrast** and high contrast mode
- **Screen reader** compatibility
- **Reduced motion** preference support

## Continuous Integration

The test suite is designed for CI/CD integration:

- **GitHub Actions** reporter for CI integration
- **JUnit XML** output for test result parsing
- **JSON results** for custom reporting
- **Parallel execution** for faster CI runs
- **Retry logic** for flaky test handling

### CI Configuration Example

```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true
    DB_HOST: localhost
    DB_PORT: 5432
    DB_USER: postgres
    DB_PASSWORD: postgres
    DB_DATABASE: test_db
```

## Contributing

When adding new tests:

1. **Follow the Page Object Model** pattern
2. **Use TestDataFactory** for consistent test data
3. **Include proper cleanup** in beforeEach/afterEach
4. **Add database verification** where appropriate
5. **Include error scenarios** and edge cases
6. **Test across multiple browsers** when relevant
7. **Add performance checks** for critical user flows
8. **Verify accessibility** for new UI components

## Troubleshooting

### Test Failures

1. Check the HTML report for detailed failure information
2. Review screenshots and videos of failed tests
3. Examine console logs and network requests
4. Verify database state before and after test execution
5. Run tests in headed mode to observe browser behavior

### Performance Issues

1. Check if the development server is running optimally
2. Verify database queries are efficient
3. Monitor network requests for unnecessary calls
4. Test on different network conditions
5. Profile the application using browser dev tools

### Database Issues

1. Ensure PostgreSQL service is running
2. Verify database credentials and connection
3. Check if migrations are up to date
4. Confirm test database is separate from development
5. Review cleanup procedures for data isolation
