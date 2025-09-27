import { test } from '@japa/runner';
import db from '@adonisjs/lucid/services/db';

import AuthService from '#features/auth/auth_service';

const resetAuthData = async () => {
  await db.transaction(async (trx) => {
    await trx.from('nooklets').delete();
    await trx.from('profiles').delete();
    await trx.from('auth_users').delete();
  });
};

test.group('AuthService.verifyPassword', (group) => {
  group.each.setup(async () => {
    await resetAuthData();
  });

  test('returns true for correct password', async ({ assert }) => {
    const credentials = {
      email: 'verify-password@example.com',
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);

    const result = await AuthService.verifyPassword(user, credentials.password);
    assert.isTrue(result);
  });

  test('returns false for incorrect password', async ({ assert }) => {
    const credentials = {
      email: 'verify-password-fail@example.com',
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);

    const result = await AuthService.verifyPassword(user, 'wrong-password');
    assert.isFalse(result);
  });
});
