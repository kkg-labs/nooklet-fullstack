import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import type AuthUser from "#features/auth/auth_user";

export default class InertiaSharedPropsMiddleware {
  async handle({ inertia, session, auth }: HttpContext, next: NextFn) {
    inertia.share({
      flash: () => ({
        success: session.flashMessages.get("success"),
        errors: session.flashMessages.get("errors"),
      }),
      user: async () => {
        try {
          const user = await auth.user as AuthUser;
          if (user) {
            await user.load('profile');
            return {
              id: user.id,
              email: user.email,
              profile: user.profile ? {
                username: user.profile.username,
                displayName: user.profile.displayName,
                timezone: user.profile.timezone,
                subscriptionTier: user.profile.subscriptionTier,
              } : null,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    });

    return next();
  }
}
