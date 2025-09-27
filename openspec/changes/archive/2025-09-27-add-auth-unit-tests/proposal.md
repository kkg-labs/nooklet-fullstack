## Why
The AuthService contains critical functions for user registration and login that currently lack unit test coverage. Adding focused unit tests will ensure these functions work correctly, handle edge cases properly, and maintain reliability as the codebase evolves.

## What Changes
- Add unit tests for AuthService.register() function
- Add unit tests for AuthService.login() function  
- Add unit tests for AuthService.verifyPassword() function
- Tests will use real database operations (no mocks) to test actual behavior
- Tests will focus on existing functionality without over-engineering

## Impact
- Affected specs: auth (new test coverage)
- Affected code: tests/functional/ (new test files)
- Improves reliability of authentication system
- Provides safety net for future auth-related changes
