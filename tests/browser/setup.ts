import { FullConfig } from '@playwright/test';
import DatabaseHelpers from './helpers/database-helpers.js';

/**
 * Global setup for Playwright tests
 * Handles database preparation and cleanup for E2E tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up Playwright E2E tests...');

  // Ensure we're using the test database if provided via env or docker-compose
  process.env.DB_HOST =
    process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost';
  process.env.DB_PORT = String(
    process.env.DB_PORT || process.env.POSTGRES_PORT || 5432,
  );
  process.env.DB_USER =
    process.env.DB_USER || process.env.POSTGRES_USER || 'nooklet_admin';
  process.env.DB_PASSWORD =
    process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '';
  process.env.DB_DATABASE =
    process.env.DB_DATABASE || process.env.POSTGRES_DB || 'nooklet_db';

  try {
    await DatabaseHelpers.cleanupTestData();
    console.log('✅ Test database cleaned');
  } catch (error) {
    console.warn('⚠️ Could not clean test database', error);
  }

  console.log('🎉 Playwright setup completed successfully');
}

export default globalSetup;
