import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class InertiaSharedPropsMiddleware {
  async handle({ inertia, session }: HttpContext, next: NextFn) {
    inertia.share({
      flash: () => ({
        success: session.flashMessages.get("success"),
        errors: session.flashMessages.get("errors"),
      }),
    });

    return next();
  }
}
