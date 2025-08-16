import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Registration page
 * Encapsulates all interactions with the registration form
 */
export class RegistrationPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly usernameInput: Locator;
  readonly submitButton: Locator;
  readonly heading: Locator;
  readonly successMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form elements
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.passwordConfirmationInput = page.locator('#password_confirmation');
    this.usernameInput = page.locator('#username');
    this.submitButton = page.locator('button[type="submit"]');
    
    // Page elements
    this.heading = page.locator('h1');
    this.successMessage = page.locator('text=Registration successful');
    this.loginLink = page.locator('a[href="/login"]');
  }

  /**
   * Navigate to the registration page
   */
  async goto() {
    await this.page.goto('/register');
    await expect(this.heading).toContainText('Create your account');
  }

  /**
   * Fill the registration form with provided data
   */
  async fillForm(data: {
    email: string;
    password: string;
    passwordConfirmation: string;
    username?: string;
  }) {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.passwordConfirmationInput.fill(data.passwordConfirmation);
    
    if (data.username) {
      await this.usernameInput.fill(data.username);
    }
  }

  /**
   * Submit the registration form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Fill form and submit in one action
   */
  async register(data: {
    email: string;
    password: string;
    passwordConfirmation: string;
    username?: string;
  }) {
    await this.fillForm(data);
    await this.submit();
  }

  /**
   * Get error message for a specific field
   */
  async getFieldError(fieldName: 'email' | 'password' | 'password_confirmation' | 'username'): Promise<string | null> {
    const errorLocator = this.page.locator(`#${fieldName}`).locator('..').locator('.text-\\[var\\(--color-red-500\\)\\]');
    
    try {
      await errorLocator.waitFor({ timeout: 2000 });
      return await errorLocator.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if form is in processing state
   */
  async isProcessing(): Promise<boolean> {
    const buttonText = await this.submitButton.textContent();
    return buttonText?.includes('Creating account...') || false;
  }

  /**
   * Wait for success message to appear
   */
  async waitForSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Check if success message is visible
   */
  async hasSuccessMessage(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all visible error messages
   */
  async getAllErrors(): Promise<string[]> {
    const errorElements = this.page.locator('.text-\\[var\\(--color-red-500\\)\\]');
    const count = await errorElements.count();
    const errors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await errorElements.nth(i).textContent();
      if (text) {
        errors.push(text);
      }
    }
    
    return errors;
  }

  /**
   * Verify form elements are present and visible
   */
  async verifyFormElements() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordConfirmationInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.passwordConfirmationInput.clear();
    await this.usernameInput.clear();
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Wait for page to load completely
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.heading).toBeVisible();
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if we're on the registration page
   */
  async isOnRegistrationPage(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes('/register');
  }
}
