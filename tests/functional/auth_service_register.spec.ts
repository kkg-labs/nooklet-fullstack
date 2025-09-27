import { test } from '@japa/runner';
import hash from '@adonisjs/core/services/hash';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'node:crypto';

import AuthService from '#features/auth/auth_service';
import AuthUser from '#features/auth/auth_user';
import Profile from '#features/user/profile';

test.group('AuthService.register', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction();
    return async () => {
      await db.rollbackGlobalTransaction();
    };
  });

  test('creates auth user and profile for email + password registration', async ({ assert }) => {
    const email = `register-basic-${randomUUID()}@example.com`;
    const password = 'super-secret';

    const user = await AuthService.register({ email, password });

    const storedUser = await AuthUser.findByOrFail('email', email);
    assert.equal(storedUser.id, user.id);
    assert.notEqual(storedUser.passwordHash, password);
    const hashed = await hash.use('scrypt').verify(storedUser.passwordHash, password);
    assert.isTrue(hashed);

    const profile = await Profile.findByOrFail('authUserId', storedUser.id);
    assert.equal(profile.username, null);
    assert.equal(profile.displayName, null);
  });

  test('stores optional username and display name during registration', async ({ assert }) => {
    const email = `register-with-meta-${randomUUID()}@example.com`;
    const password = 'super-secret';

    const user = await AuthService.register({
      email,
      password,
      username: 'optionaluser',
      displayName: 'Optional User',
    });

    const profile = await Profile.findByOrFail('authUserId', user.id);
    assert.equal(profile.username, 'optionaluser');
    assert.equal(profile.displayName, 'Optional User');
  });

  test('throws EMAIL_TAKEN when email already exists', async ({ assert }) => {
    const email = `register-duplicate-${randomUUID()}@example.com`;

    await AuthService.register({ email, password: 'password-one' });

    await assert.rejects(
      async () => {
        await AuthService.register({ email, password: 'password-two' });
      },
      /EMAIL_TAKEN/,
    );

    const users = await AuthUser.query().where('email', email);
    assert.lengthOf(users, 1);
  });

  test('throws USERNAME_TAKEN when username already exists', async ({ assert }) => {
    const username = `duplicateuser-${randomUUID()}`;

    await AuthService.register({
      email: `register-first-${randomUUID()}@example.com`,
      password: 'password-one',
      username,
    });

    await assert.rejects(
      async () => {
        await AuthService.register({
          email: `register-second-${randomUUID()}@example.com`,
          password: 'password-two',
          username,
        });
      },
      /USERNAME_TAKEN/,
    );

    const profiles = await Profile.query().where('username', username);
    assert.lengthOf(profiles, 1);
  });
});
