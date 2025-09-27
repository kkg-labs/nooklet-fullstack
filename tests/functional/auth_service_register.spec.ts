import { test } from '@japa/runner';
import hash from '@adonisjs/core/services/hash';
import db from '@adonisjs/lucid/services/db';

import AuthService from '#features/auth/auth_service';
import AuthUser from '#features/auth/auth_user';
import Profile from '#features/user/profile';

const resetAuthData = async () => {
  await db.transaction(async (trx) => {
    await trx.from('nooklets').delete();
    await trx.from('profiles').delete();
    await trx.from('auth_users').delete();
  });
};

test.group('AuthService.register', (group) => {
  group.each.setup(async () => {
    await resetAuthData();
  });

  test('creates auth user and profile for email + password registration', async ({ assert }) => {
    const email = 'register-basic@example.com';
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
    const email = 'register-with-meta@example.com';
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
    const email = 'register-duplicate@example.com';

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
    await AuthService.register({
      email: 'register-first@example.com',
      password: 'password-one',
      username: 'duplicateuser',
    });

    await assert.rejects(
      async () => {
        await AuthService.register({
          email: 'register-second@example.com',
          password: 'password-two',
          username: 'duplicateuser',
        });
      },
      /USERNAME_TAKEN/,
    );

    const profiles = await Profile.query().where('username', 'duplicateuser');
    assert.lengthOf(profiles, 1);
  });
});
