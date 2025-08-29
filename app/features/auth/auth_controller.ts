import type { HttpContext } from "@adonisjs/core/http";
import { registerValidator } from "#features/auth/register_validator";
import AuthService from "#features/auth/auth_service";

export default class AuthController {
  async showRegister({ inertia }: HttpContext) {
    return inertia.render("auth/Register");
  }

  async register({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(registerValidator);

    try {
      await AuthService.register({
        email: payload.email,
        password: payload.password,
        username: payload.username,
      });
    } catch (error) {
      if ((error as Error).message === "EMAIL_TAKEN") {
        session.flash("errors", { email: "Email is already in use" });
        return response.redirect().back();
      }
      if ((error as Error).message === "USERNAME_TAKEN") {
        session.flash("errors", { username: "Username is already taken" });
        return response.redirect().back();
      }
      throw error;
    }

    session.flash("success", "Registration successful");
    return response.redirect("/register");
  }
}
