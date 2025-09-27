import { test } from '@japa/runner';
import db from '@adonisjs/lucid/services/db';
import { randomUUID } from 'node:crypto';

test.group('Auth Registration', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction();
    return async () => {
      await db.rollbackGlobalTransaction();
    };
  });

  test('GET /register renders Inertia page', async ({ client }) => {
    const response = await client.get('/register').withInertia();
    response.assertStatus(200);
    response.assertInertiaComponent('auth/Register');
  });

  test('POST /register creates auth_user and profile', async ({
    client,
    assert,
  }) => {
    const email = `new-${randomUUID()}@example.com`;

    // First make a GET request to establish session and get CSRF token
    await client.get('/register');

    const response = await client
      .post('/register')
      .form({
        email,
        password: 'password123',
        password_confirmation: 'password123',
        username: 'newbie',
      })
      .withCsrfToken();

    response.assertRedirectsTo('/register');

    const user = await db.from('auth_users').where('email', email).first();
    assert.exists(user);
    const profile = await db
      .from('profiles')
      .where('auth_user_id', user.id)
      .first();
    assert.exists(profile);
  });

  test('duplicate email returns validation-like error', async ({ client }) => {
    const email = `dupe-${randomUUID()}@example.com`;

    // First registration - establish session and use CSRF token
    await client.get('/register');
    await client
      .post('/register')
      .form({
        email,
        password: 'password123',
        password_confirmation: 'password123',
      })
      .withInertia()
      .withCsrfToken();

    // Second registration with same email - should fail
    await client.get('/register');
    const response = await client
      .post('/register')
      .header('referer', 'http://localhost/register')
      .form({
        email,
        password: 'password123',
        password_confirmation: 'password123',
      })
      .withInertia()
      .withCsrfToken();

    response.assertStatus(200);
    response.assertInertiaComponent('auth/Register');
    response.assertInertiaPropsContains({
      flash: {
        errors: {
          email: 'Email is already in use',
        },
      },
    });
  });
});
