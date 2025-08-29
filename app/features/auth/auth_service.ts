import hash from "@adonisjs/core/services/hash";
import db from "@adonisjs/lucid/services/db";
import AuthUser from "#features/auth/auth_user";
import Profile from "#features/user/profile";

export type RegisterData = {
  email: string;
  password: string;
  username?: string;
};

const AuthService = {
  async register({ email, password, username }: RegisterData) {
    const existing = await AuthUser.query().where("email", email).first();
    if (existing) {
      throw new Error("EMAIL_TAKEN");
    }

    const passwordHash = await hash.make(password);

    return await db.transaction(async (trx) => {
      const user = await AuthUser.create(
        { email, passwordHash },
        { client: trx }
      );
      await Profile.create(
        { authUserId: user.id, username: username ?? null },
        { client: trx }
      );
      return user;
    });
  },
};

export default AuthService;
