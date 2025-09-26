import { test, expect, Page } from '@playwright/test';
import { DatabaseHelpers } from './database-helpers';
import { TestDataCleanup } from './test-data';

/**
 * Enhanced test reporting utilities for E2E tests
 * Provides additional debugging information and context
 */

export interface TestContext {
  testName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'running' | 'passed' | 'failed' | 'skipped';
  screenshots: string[];
  errors: string[];
  databaseState?: any;
  networkRequests?: any[];
  consoleMessages?: any[];
}

export class TestReporter {
  private static contexts: Map<string, TestContext> = new Map();

  /**
   * Start tracking a test
   */
  static startTest(testName: string): TestContext {
    const context: TestContext = {
      testName,
      startTime: Date.now(),
      status: 'running',
      screenshots: [],
      errors: [],
    };

    this.contexts.set(testName, context);
    return context;
  }

  /**
   * End tracking a test
   */
  static endTest(
    testName: string,
    status: 'passed' | 'failed' | 'skipped',
    error?: string,
  ): TestContext | undefined {
    const context = this.contexts.get(testName);
    if (!context) return undefined;

    context.endTime = Date.now();
    context.duration = context.endTime - context.startTime;
    context.status = status;

    if (error) {
      context.errors.push(error);
    }

    return context;
  }

  /**
   * Add screenshot to test context
   */
  static addScreenshot(testName: string, screenshotPath: string): void {
    const context = this.contexts.get(testName);
    if (context) {
      context.screenshots.push(screenshotPath);
    }
  }

  /**
   * Add error to test context
   */
  static addError(testName: string, error: string): void {
    const context = this.contexts.get(testName);
    if (context) {
      context.errors.push(error);
    }
  }

  /**
   * Capture database state for debugging
   */
  static async captureDatabaseState(testName: string): Promise<void> {
    const context = this.contexts.get(testName);
    if (!context) return;

    try {
      const userCount = await DatabaseHelpers.getUserCount();
      const profileCount = await DatabaseHelpers.getProfileCount();
      const trackedEmails = TestDataCleanup.getTrackedEmails();

      context.databaseState = {
        userCount,
        profileCount,
        trackedEmails,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      context.errors.push(`Failed to capture database state: ${error}`);
    }
  }

  /**
   * Capture network requests for debugging
   */
  static captureNetworkRequests(testName: string, page: Page): void {
    const context = this.contexts.get(testName);
    if (!context) return;

    context.networkRequests = [];

    page.on('request', (request) => {
      context.networkRequests!.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: new Date().toISOString(),
      });
    });

    page.on('response', (response) => {
      const existingRequest = context.networkRequests!.find(
        (req) => req.url === response.url(),
      );
      if (existingRequest) {
        existingRequest.status = response.status();
        existingRequest.statusText = response.statusText();
        existingRequest.responseHeaders = response.headers();
      }
    });
  }

  /**
   * Capture console messages for debugging
   */
  static captureConsoleMessages(testName: string, page: Page): void {
    const context = this.contexts.get(testName);
    if (!context) return;

    context.consoleMessages = [];

    page.on('console', (message) => {
      context.consoleMessages!.push({
        type: message.type(),
        text: message.text(),
        location: message.location(),
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Generate detailed test report
   */
  static generateReport(testName: string): string {
    const context = this.contexts.get(testName);
    if (!context) return `No context found for test: ${testName}`;

    const report = [
      `=== Test Report: ${testName} ===`,
      `Status: ${context.status}`,
      `Duration: ${context.duration}ms`,
      `Start Time: ${new Date(context.startTime).toISOString()}`,
      context.endTime
        ? `End Time: ${new Date(context.endTime).toISOString()}`
        : '',
      '',
    ];

    if (context.errors.length > 0) {
      report.push('Errors:');
      context.errors.forEach((error, index) => {
        report.push(`  ${index + 1}. ${error}`);
      });
      report.push('');
    }

    if (context.screenshots.length > 0) {
      report.push('Screenshots:');
      context.screenshots.forEach((screenshot, index) => {
        report.push(`  ${index + 1}. ${screenshot}`);
      });
      report.push('');
    }

    if (context.databaseState) {
      report.push('Database State:');
      report.push(`  Users: ${context.databaseState.userCount}`);
      report.push(`  Profiles: ${context.databaseState.profileCount}`);
      report.push(
        `  Tracked Emails: ${context.databaseState.trackedEmails.length}`,
      );
      if (context.databaseState.trackedEmails.length > 0) {
        report.push(`    - ${context.databaseState.trackedEmails.join(', ')}`);
      }
      report.push('');
    }

    if (context.networkRequests && context.networkRequests.length > 0) {
      report.push('Network Requests:');
      context.networkRequests.forEach((request, index) => {
        report.push(
          `  ${index + 1}. ${request.method} ${request.url} - ${request.status || 'pending'}`,
        );
      });
      report.push('');
    }

    if (context.consoleMessages && context.consoleMessages.length > 0) {
      report.push('Console Messages:');
      context.consoleMessages.forEach((message, index) => {
        report.push(`  ${index + 1}. [${message.type}] ${message.text}`);
      });
      report.push('');
    }

    return report.join('\n');
  }

  /**
   * Clear all contexts (useful for cleanup)
   */
  static clearAll(): void {
    this.contexts.clear();
  }

  /**
   * Get all test contexts
   */
  static getAllContexts(): Map<string, TestContext> {
    return new Map(this.contexts);
  }
}

/**
 * Enhanced test utilities with automatic reporting
 */
export class EnhancedTest {
  /**
   * Wrap a test with enhanced reporting
   */
  static async withReporting<T>(
    testName: string,
    page: Page,
    testFn: () => Promise<T>,
  ): Promise<T> {
    const context = TestReporter.startTest(testName);

    // Set up monitoring
    TestReporter.captureNetworkRequests(testName, page);
    TestReporter.captureConsoleMessages(testName, page);

    try {
      // Capture initial database state
      await TestReporter.captureDatabaseState(testName);

      // Run the test
      const result = await testFn();

      // Test passed
      TestReporter.endTest(testName, 'passed');

      return result;
    } catch (error) {
      // Test failed - capture additional debugging info
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      TestReporter.addError(testName, errorMessage);

      // Take screenshot on failure
      try {
        const screenshotPath = `test-results/screenshots/${testName}-failure-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        TestReporter.addScreenshot(testName, screenshotPath);
      } catch (screenshotError) {
        TestReporter.addError(
          testName,
          `Failed to take screenshot: ${screenshotError}`,
        );
      }

      // Capture final database state
      await TestReporter.captureDatabaseState(testName);

      // End test with failure
      TestReporter.endTest(testName, 'failed', errorMessage);

      // Generate and log detailed report
      const report = TestReporter.generateReport(testName);
      console.error(report);

      throw error;
    }
  }

  /**
   * Assert with enhanced error reporting
   */
  static async assertWithContext(
    testName: string,
    assertion: () => Promise<void> | void,
    context: string,
  ): Promise<void> {
    try {
      await assertion();
    } catch (error) {
      const enhancedError = `${context}: ${error}`;
      TestReporter.addError(testName, enhancedError);
      throw new Error(enhancedError);
    }
  }

  /**
   * Wait with timeout and enhanced error reporting
   */
  static async waitWithContext(
    testName: string,
    waitFn: () => Promise<void>,
    context: string,
    timeout: number = 5000,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      await Promise.race([
        waitFn(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Timeout after ${timeout}ms`)),
            timeout,
          ),
        ),
      ]);
    } catch (error) {
      const duration = Date.now() - startTime;
      const enhancedError = `${context} (waited ${duration}ms): ${error}`;
      TestReporter.addError(testName, enhancedError);
      throw new Error(enhancedError);
    }
  }
}

/**
 * Test fixture for enhanced reporting
 */
export const enhancedTest = test.extend<{ reporter: TestReporter }>({
  reporter: async ({ page }, use, testInfo) => {
    const testName = testInfo.title;

    // Start test tracking
    TestReporter.startTest(testName);
    TestReporter.captureNetworkRequests(testName, page);
    TestReporter.captureConsoleMessages(testName, page);

    await use(TestReporter);

    // End test tracking
    const status = testInfo.status === 'passed' ? 'passed' : 'failed';
    TestReporter.endTest(testName, status);

    // Generate report if test failed
    if (status === 'failed') {
      const report = TestReporter.generateReport(testName);
      console.error(report);
    }
  },
});

export default TestReporter;
