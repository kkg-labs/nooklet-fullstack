import { test } from '@japa/runner';
import db from '@adonisjs/lucid/services/db';

import AuthService from '#features/auth/auth_service';
import AuthUser from '#features/auth/auth_user';

const resetAuthData = async () => {
  await db.transaction(async (trx) => {
    await trx.from('nooklets').delete();
    await trx.from('profiles').delete();
    await trx.from('auth_users').delete();
  });
};

test.group('AuthService.login', (group) => {
  group.each.setup(async () => {
    await resetAuthData();
  });

  test('authenticates user with valid credentials', async ({ assert }) => {
    const credentials = {
      email: 'login-success@example.com',
      password: 'super-secret',
    };

    const createdUser = await AuthService.register(credentials);

    const user = await AuthService.login(credentials);
    assert.equal(user.id, createdUser.id);
    assert.strictEqual(user.isActive, true);
    assert.strictEqual(user.isArchived, false);
  });

  test('throws error for invalid credentials', async ({ assert }) => {
    const credentials = {
      email: 'login-invalid@example.com',
      password: 'super-secret',
    };

    await AuthService.register(credentials);

    await assert.rejects(
      async () => {
        await AuthService.login({ ...credentials, password: 'wrong-password' });
      },
      /Invalid user/,
    );
  });

  test('throws ACCOUNT_INACTIVE when user is inactive', async ({ assert }) => {
    const credentials = {
      email: 'login-inactive@example.com',
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);
    user.isActive = false;
    await user.save();

    await assert.rejects(
      async () => {
        await AuthService.login(credentials);
      },
      /ACCOUNT_INACTIVE/,
    );
  });

  test('throws ACCOUNT_INACTIVE when user is archived', async ({ assert }) => {
    const credentials = {
      email: 'login-archived@example.com',
      password: 'super-secret',
    };

    const user = await AuthService.register(credentials);
    user.isArchived = true;
    await user.save();

    await assert.rejects(
      async () => {
        await AuthService.login(credentials);
      },
      /ACCOUNT_INACTIVE/,
    );
  });
});
