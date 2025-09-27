import { test } from '@japa/runner';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'node:crypto';

import AuthService from '#features/auth/auth_service';

test.group('AuthService.verifyPassword', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction();
    return async () => {
      await db.rollbackGlobalTransaction();
    };
  });

  test('returns true for correct password', async ({ assert }) => {
    const credentials = {
      email: `verify-password-${randomUUID()}@example.com`,
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);

    const result = await AuthService.verifyPassword(user, credentials.password);
    assert.isTrue(result);
  });

  test('returns false for incorrect password', async ({ assert }) => {
    const credentials = {
      email: `verify-password-fail-${randomUUID()}@example.com`,
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);

    const result = await AuthService.verifyPassword(user, 'wrong-password');
    assert.isFalse(result);
  });
});
