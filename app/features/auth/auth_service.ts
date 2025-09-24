import db from "@adonisjs/lucid/services/db";
import AuthUser from "#features/auth/auth_user";
import Profile from "#features/user/profile";

export type RegisterData = {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

const AuthService = {
  async register({ email, password, username, displayName }: RegisterData) {
    try {
      return await db.transaction(async (trx) => {
        const user = new AuthUser();
        user.email = email;
        // Assign to the same property AuthFinder uses so its hook hashes it
        (user as any).passwordHash = password;
        user.useTransaction(trx);
        await user.save();

        await Profile.create(
          {
            authUserId: user.id,
            username: username ?? null,
            displayName: displayName ?? null,
          },
          { client: trx }
        );
        return user;
      });
    } catch (error: any) {
      // Handle database constraint violations gracefully
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        if (error.constraint?.includes("email")) {
          throw new Error("EMAIL_TAKEN");
        }
        if (error.constraint?.includes("username")) {
          throw new Error("USERNAME_TAKEN");
        }
      }
      // Re-throw any other errors
      throw error;
    }
  },

  async login({ email, password }: LoginData) {
    const user = await AuthUser.verifyCredentials(email, password);
    if (!user.isActive || user.isArchived) {
      throw new Error("ACCOUNT_INACTIVE");
    }
    return user;
  },

  async verifyPassword(user: AuthUser, password: string): Promise<boolean> {
    return await AuthUser.verifyCredentials(user.email, password)
      .then(() => true)
      .catch(() => false);
  },
};

export default AuthService;
