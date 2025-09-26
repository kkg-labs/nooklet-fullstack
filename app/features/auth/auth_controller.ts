import type { HttpContext } from '@adonisjs/core/http';
import { registerValidator } from '#features/auth/register_validator';
import { loginValidator } from '#features/auth/validators/login_validator';
import AuthService from '#features/auth/auth_service';
import AuthUser from '#features/auth/auth_user';

export default class AuthController {
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/Register');
  }

  async register({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(registerValidator);

    try {
      await AuthService.register({
        email: payload.email,
        password: payload.password,
        username: payload.username,
        displayName: payload.displayName,
      });
    } catch (error) {
      if ((error as Error).message === 'EMAIL_TAKEN') {
        session.flash('errors', { email: 'Email is already in use' });
        return response.redirect().back();
      }
      if ((error as Error).message === 'USERNAME_TAKEN') {
        session.flash('errors', { username: 'Username is already taken' });
        return response.redirect().back();
      }
      throw error;
    }

    session.flash('success', 'Registration successful');
    return response.redirect('/register');
  }

  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/Login');
  }

  async login({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(loginValidator);

    try {
      console.debug('[auth] login attempt', { email: payload.email });
      const existing = await AuthUser.findBy('email', payload.email);
      console.debug('[auth] existing?', {
        found: !!existing,
        hasHash: existing
          ? typeof (existing as any).passwordHash === 'string' &&
            (existing as any).passwordHash.startsWith('$scrypt$')
          : false,
      });
      // Verify credentials using the Lucid AuthFinder mixin
      const user = await AuthUser.verifyCredentials(
        payload.email,
        payload.password,
      );
      console.debug('[auth] verifyCredentials ok', { id: user.id });
      if (!user.isActive || user.isArchived) {
        session.flash('errors', { email: 'Account is inactive' });
        return response.redirect().back();
      }

      await auth.use('web').login(user);
      console.debug('[auth] session login ok');
      session.flash('success', 'Login successful');
      return response.redirect('/home');
    } catch (error) {
      console.error('[auth] login failed', { error });
      session.flash('errors', { email: 'Invalid email or password' });
      return response.redirect().back();
    }
  }

  async logout({ response, session, auth }: HttpContext) {
    await auth.use('web').logout();
    session.flash('success', 'Logged out successfully');
    return response.redirect('/');
  }
}
