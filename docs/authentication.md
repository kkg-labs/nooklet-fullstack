# Authentication System Documentation

## Overview

This document describes the authentication system implemented for Nooklet, which provides secure login and logout functionality using session-based authentication with AdonisJS v6.

## Architecture

### Components

1. **Login Validator** (`app/features/auth/validators/login_validator.ts`)
   - VineJS validation schema for email and password
   - Ensures proper input validation before processing

2. **AuthService** (`app/features/auth/auth_service.ts`)
   - Business logic for authentication operations
   - Methods: `login()`, `verifyPassword()`
   - Handles credential validation and user lookup

3. **AuthController** (`app/features/auth/auth_controller.ts`)
   - HTTP request handling for authentication
   - Methods: `showLogin()`, `login()`, `logout()`
   - Manages session creation and destruction

4. **Session Configuration** (`config/auth.ts`)
   - Web session guard using AuthUser model
   - Session-based authentication for web interface

5. **Login Page** (`inertia/pages/auth/Login.tsx`)
   - React component for login form
   - Uses LabeledTextInput components for consistency

6. **Navigation Component** (`inertia/components/layout/Navigation.tsx`)
   - Responsive navigation with logout functionality
   - Shows different options for authenticated/guest users

## Authentication Flow

### Login Process

1. User navigates to `/login`
2. `AuthController.showLogin()` renders the login page
3. User submits email and password
4. `LoginValidator` validates input
5. `AuthService.login()` verifies credentials
6. Session is created via `auth.use('web').login(user)`
7. User is redirected to dashboard

### Logout Process

1. User clicks logout button in navigation
2. `AuthController.logout()` is called
3. Session is cleared via `auth.use('web').logout()`
4. User is redirected to home page

### Session Management

- Sessions use secure, httpOnly cookies
- Default session duration: 2 hours
- Sessions persist across browser tabs
- Automatic cleanup on logout

## Security Features

### CSRF Protection
- Enabled via Shield middleware
- All POST/PUT/PATCH/DELETE requests protected
- Automatic token validation

### Session Security
- HttpOnly cookies prevent XSS access
- Secure flag in production
- SameSite: 'lax' for CSRF protection

### Password Security
- Passwords hashed using AdonisJS Hash service
- Generic error messages prevent user enumeration
- Account status validation

## Routes

```typescript
// Authentication routes
GET  /login   -> AuthController.showLogin
POST /login   -> AuthController.login
POST /logout  -> AuthController.logout
```

## Shared Props

User data is automatically shared across all Inertia pages:

```typescript
{
  user: {
    id: string,
    email: string,
    profile: {
      username?: string,
      displayName?: string,
      timezone?: string,
      subscriptionTier: string
    } | null
  } | null
}
```

## Error Handling

### Common Error Scenarios

1. **Invalid Credentials**
   - Message: "Invalid email or password"
   - Prevents user enumeration

2. **Account Inactive**
   - Message: "Account is inactive"
   - Clear guidance for user

3. **Session Expired**
   - Automatic redirect to login
   - Informative flash message

## Troubleshooting

### Login Issues

**Problem**: User can't log in with correct credentials
- Check if account is active (`isActive = true`)
- Verify account is not archived (`isArchived = false`)
- Check password hash in database

**Problem**: Session not persisting
- Verify session middleware is enabled
- Check session configuration in `config/session.ts`
- Ensure cookies are being set properly

**Problem**: CSRF token errors
- Verify Shield middleware is enabled
- Check if CSRF protection is configured
- Ensure forms include CSRF tokens

### Development Tips

1. **Testing Authentication**
   ```bash
   # Create test user via registration
   # Then test login flow
   ```

2. **Debugging Sessions**
   ```typescript
   // In controller, check session data
   console.log(session.all())
   ```

3. **Checking User State**
   ```typescript
   // In middleware or controller
   console.log(await auth.user)
   ```

## Configuration

### Environment Variables
- `SESSION_DRIVER`: Session storage driver (default: cookie)
- `APP_KEY`: Used for session encryption

### Key Files
- `config/auth.ts`: Authentication guards configuration
- `config/session.ts`: Session management settings
- `config/shield.ts`: Security middleware settings
- `start/kernel.ts`: Middleware registration

## Future Enhancements

For production deployment, consider:

1. **Rate Limiting**: Implement login attempt rate limiting
2. **Two-Factor Authentication**: Add 2FA support
3. **Password Reset**: Implement forgot password flow
4. **Remember Me**: Extended session duration option
5. **Account Lockout**: Temporary lockout after failed attempts

## Maintenance Notes

- User data is shared via `InertiaSharedPropsMiddleware`
- Authentication state is managed by AdonisJS auth system
- Session cleanup happens automatically on logout
- Profile data is eagerly loaded for UI display
