/**
 * Test data management utilities for E2E tests
 * Provides consistent test data generation and cleanup methods
 */

export interface TestUserData {
  email: string;
  password: string;
  passwordConfirmation: string;
  username?: string;
}

export interface TestUserVariant {
  valid: TestUserData;
  invalidEmail: TestUserData;
  shortPassword: TestUserData;
  passwordMismatch: TestUserData;
  missingFields: Partial<TestUserData>;
}

/**
 * Test data factory for generating consistent test data
 */
export class TestDataFactory {
  private static counter = 0;

  /**
   * Generate a unique test email
   */
  static generateEmail(prefix: string = 'test'): string {
    TestDataFactory.counter++;
    const timestamp = Date.now();
    return `${prefix}-${TestDataFactory.counter}-${timestamp}@example.com`;
  }

  /**
   * Generate a unique username
   */
  static generateUsername(prefix: string = 'user'): string {
    TestDataFactory.counter++;
    const timestamp = Date.now();
    return `${prefix}${TestDataFactory.counter}${timestamp}`;
  }

  /**
   * Generate valid registration data
   */
  static createValidUser(options: Partial<TestUserData> = {}): TestUserData {
    const email = options.email || TestDataFactory.generateEmail();
    const password = options.password || 'password123';

    return {
      email,
      password,
      passwordConfirmation: options.passwordConfirmation || password,
      username: options.username || TestDataFactory.generateUsername(),
    };
  }

  /**
   * Generate test data for various validation scenarios
   */
  static createTestVariants(baseEmail?: string): TestUserVariant {
    const email = baseEmail || TestDataFactory.generateEmail();
    const validPassword = 'password123';

    return {
      valid: {
        email,
        password: validPassword,
        passwordConfirmation: validPassword,
        username: TestDataFactory.generateUsername(),
      },
      invalidEmail: {
        email: 'invalid-email-format',
        password: validPassword,
        passwordConfirmation: validPassword,
        username: TestDataFactory.generateUsername(),
      },
      shortPassword: {
        email: TestDataFactory.generateEmail('short'),
        password: '123',
        passwordConfirmation: '123',
        username: TestDataFactory.generateUsername(),
      },
      passwordMismatch: {
        email: TestDataFactory.generateEmail('mismatch'),
        password: validPassword,
        passwordConfirmation: 'different-password',
        username: TestDataFactory.generateUsername(),
      },
      missingFields: {
        // Intentionally incomplete data
        email: '',
        password: '',
      },
    };
  }

  /**
   * Generate test data for duplicate email scenarios
   */
  static createDuplicateEmailData(existingEmail: string): {
    original: TestUserData;
    duplicate: TestUserData;
    caseVariant: TestUserData;
  } {
    const password = 'password123';

    return {
      original: {
        email: existingEmail,
        password,
        passwordConfirmation: password,
        username: TestDataFactory.generateUsername('original'),
      },
      duplicate: {
        email: existingEmail,
        password,
        passwordConfirmation: password,
        username: TestDataFactory.generateUsername('duplicate'),
      },
      caseVariant: {
        email: existingEmail.toUpperCase(),
        password,
        passwordConfirmation: password,
        username: TestDataFactory.generateUsername('case'),
      },
    };
  }

  /**
   * Generate test data for performance testing
   */
  static createPerformanceTestData(count: number): TestUserData[] {
    const users: TestUserData[] = [];

    for (let i = 0; i < count; i++) {
      users.push(
        TestDataFactory.createValidUser({
          email: TestDataFactory.generateEmail(`perf${i}`),
          username: TestDataFactory.generateUsername(`perf${i}`),
        }),
      );
    }

    return users;
  }

  /**
   * Generate test data for cross-browser testing
   */
  static createCrossBrowserTestData(): Record<string, TestUserData> {
    return {
      chromium: TestDataFactory.createValidUser({
        email: TestDataFactory.generateEmail('chromium'),
        username: TestDataFactory.generateUsername('chromium'),
      }),
      firefox: TestDataFactory.createValidUser({
        email: TestDataFactory.generateEmail('firefox'),
        username: TestDataFactory.generateUsername('firefox'),
      }),
      webkit: TestDataFactory.createValidUser({
        email: TestDataFactory.generateEmail('webkit'),
        username: TestDataFactory.generateUsername('webkit'),
      }),
    };
  }

  /**
   * Reset the counter (useful for test isolation)
   */
  static resetCounter(): void {
    TestDataFactory.counter = 0;
  }
}

/**
 * Test data cleanup utilities
 */
export class TestDataCleanup {
  private static createdEmails: Set<string> = new Set();

  /**
   * Track an email for cleanup
   */
  static trackEmail(email: string): void {
    TestDataCleanup.createdEmails.add(email);
  }

  /**
   * Track multiple emails for cleanup
   */
  static trackEmails(emails: string[]): void {
    emails.forEach((email) => TestDataCleanup.createdEmails.add(email));
  }

  /**
   * Get all tracked emails
   */
  static getTrackedEmails(): string[] {
    return Array.from(TestDataCleanup.createdEmails);
  }

  /**
   * Clear tracking (call after cleanup)
   */
  static clearTracking(): void {
    TestDataCleanup.createdEmails.clear();
  }

  /**
   * Generate cleanup report
   */
  static getCleanupReport(): {
    trackedEmails: number;
    emails: string[];
  } {
    return {
      trackedEmails: TestDataCleanup.createdEmails.size,
      emails: Array.from(TestDataCleanup.createdEmails),
    };
  }
}

/**
 * Test scenario builder for complex test cases
 */
export class TestScenarioBuilder {
  private scenario: {
    name: string;
    users: TestUserData[];
    expectedOutcomes: string[];
    setup?: () => Promise<void>;
    cleanup?: () => Promise<void>;
  };

  constructor(name: string) {
    this.scenario = {
      name,
      users: [],
      expectedOutcomes: [],
    };
  }

  /**
   * Add a user to the scenario
   */
  addUser(user: TestUserData): this {
    this.scenario.users.push(user);
    TestDataCleanup.trackEmail(user.email);
    return this;
  }

  /**
   * Add multiple users to the scenario
   */
  addUsers(users: TestUserData[]): this {
    this.scenario.users.push(...users);
    TestDataCleanup.trackEmails(users.map((u) => u.email));
    return this;
  }

  /**
   * Add expected outcome
   */
  expectOutcome(outcome: string): this {
    this.scenario.expectedOutcomes.push(outcome);
    return this;
  }

  /**
   * Add setup function
   */
  withSetup(setup: () => Promise<void>): this {
    this.scenario.setup = setup;
    return this;
  }

  /**
   * Add cleanup function
   */
  withCleanup(cleanup: () => Promise<void>): this {
    this.scenario.cleanup = cleanup;
    return this;
  }

  /**
   * Build the scenario
   */
  build() {
    return { ...this.scenario };
  }
}

/**
 * Common test data patterns
 */
export const TestDataPatterns = {
  /**
   * Standard valid registration
   */
  validRegistration: () => TestDataFactory.createValidUser(),

  /**
   * Registration with minimal data
   */
  minimalRegistration: () =>
    TestDataFactory.createValidUser({ username: undefined }),

  /**
   * Registration with special characters in email
   */
  specialCharacterEmail: () =>
    TestDataFactory.createValidUser({
      email: 'test+special.chars@example.com',
    }),

  /**
   * Registration with long username
   */
  longUsername: () =>
    TestDataFactory.createValidUser({
      username: 'a'.repeat(50),
    }),

  /**
   * Registration with international characters
   */
  internationalChars: () =>
    TestDataFactory.createValidUser({
      username: 'üser_tëst_ñame',
    }),
};

export default {
  TestDataFactory,
  TestDataCleanup,
  TestScenarioBuilder,
  TestDataPatterns,
};
