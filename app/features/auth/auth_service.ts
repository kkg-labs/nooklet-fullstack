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
    const passwordHash = await hash.make(password);

    try {
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
    } catch (error: any) {
      // Handle database constraint violations gracefully
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        if (error.constraint?.includes('email')) {
          throw new Error("EMAIL_TAKEN");
        }
        if (error.constraint?.includes('username')) {
          throw new Error("USERNAME_TAKEN");
        }
      }
      // Re-throw any other errors
      throw error;
    }
  },
};

export default AuthService;
