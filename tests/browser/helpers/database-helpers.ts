import { Pool } from 'pg';

/**
 * Database verification utilities for E2E tests (Playwright)
 * Uses direct PostgreSQL connection to avoid coupling with Adonis app boot
 */

// Create a singleton connection pool
const pool = new Pool({
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT || 5432),
  user: process.env.DB_USER || process.env.POSTGRES_USER || 'nooklet_admin',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '',
  database: process.env.DB_DATABASE || process.env.POSTGRES_DB || 'nooklet_db',
});

async function query<T = any>(
  text: string,
  params: any[] = [],
): Promise<{ rows: T[] }> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return { rows: result.rows as T[] };
  } finally {
    client.release();
  }
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileRecord {
  id: string;
  auth_user_id: string;
  username: string | null;
  display_name: string | null;
  timezone: string | null;
  subscription_tier: string | null;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RegistrationVerification {
  authUser: {
    id: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  profile: {
    id: string;
    authUserId: string;
    username: string | null;
    displayName: string | null;
    timezone: string | null;
    subscriptionTier: string | null;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class DatabaseHelpers {
  static async verifyUserCreated(
    email: string,
  ): Promise<RegistrationVerification> {
    const { rows: users } = await query<UserRecord>(
      'SELECT * FROM auth_users WHERE email = $1 LIMIT 1',
      [email],
    );
    const authUser = users[0];
    if (!authUser)
      throw new Error(`AuthUser with email ${email} not found in database`);

    const { rows: profiles } = await query<ProfileRecord>(
      'SELECT * FROM profiles WHERE auth_user_id = $1 LIMIT 1',
      [authUser.id],
    );
    const profile = profiles[0];
    if (!profile)
      throw new Error(
        `Profile for AuthUser ${authUser.id} not found in database`,
      );

    return {
      authUser: {
        id: authUser.id,
        email: authUser.email,
        passwordHash: authUser.password_hash,
        isActive: authUser.is_active,
        isArchived: authUser.is_archived,
        createdAt: authUser.created_at,
        updatedAt: authUser.updated_at,
      },
      profile: {
        id: profile.id,
        authUserId: profile.auth_user_id,
        username: profile.username,
        displayName: profile.display_name,
        timezone: profile.timezone,
        subscriptionTier: profile.subscription_tier,
        isArchived: profile.is_archived,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    };
  }

  static async verifyUserNotCreated(email: string): Promise<void> {
    const { rows } = await query<UserRecord>(
      'SELECT id FROM auth_users WHERE email = $1 LIMIT 1',
      [email],
    );
    if (rows.length) {
      throw new Error(
        `AuthUser with email ${email} should not exist but was found in database`,
      );
    }
  }

  static async verifyPasswordHashed(
    email: string,
    plainPassword: string,
  ): Promise<void> {
    const { rows } = await query<UserRecord>(
      'SELECT password_hash FROM auth_users WHERE email = $1 LIMIT 1',
      [email],
    );
    const authUser = rows[0];
    if (!authUser) throw new Error(`AuthUser with email ${email} not found`);

    if (authUser.password_hash === plainPassword) {
      throw new Error(
        'Password appears to be stored in plain text instead of hashed',
      );
    }
    if (!authUser.password_hash.startsWith('$')) {
      throw new Error('Password hash does not appear to be properly formatted');
    }
  }

  static async verifyProfileUsername(
    email: string,
    expectedUsername: string | null,
  ): Promise<void> {
    const verification = await this.verifyUserCreated(email);
    if (verification.profile.username !== expectedUsername) {
      throw new Error(
        `Profile username mismatch. Expected: ${expectedUsername}, Got: ${verification.profile.username}`,
      );
    }
  }

  static async getUserCount(): Promise<number> {
    const { rows } = await query<{ total: string }>(
      'SELECT COUNT(*) as total FROM auth_users',
    );
    return parseInt(rows[0].total);
  }

  static async getProfileCount(): Promise<number> {
    const { rows } = await query<{ total: string }>(
      'SELECT COUNT(*) as total FROM profiles',
    );
    return parseInt(rows[0].total);
  }

  static async cleanupTestData(): Promise<void> {
    await query('DELETE FROM profiles');
    await query('DELETE FROM auth_users');
  }

  static async cleanupUser(email: string): Promise<void> {
    const { rows } = await query<UserRecord>(
      'SELECT id FROM auth_users WHERE email = $1 LIMIT 1',
      [email],
    );
    const authUser = rows[0];
    if (authUser) {
      await query('DELETE FROM profiles WHERE auth_user_id = $1', [
        authUser.id,
      ]);
      await query('DELETE FROM auth_users WHERE id = $1', [authUser.id]);
    }
  }

  static async verifyDatabaseEmpty(): Promise<void> {
    const userCount = await this.getUserCount();
    const profileCount = await this.getProfileCount();
    if (userCount > 0 || profileCount > 0) {
      throw new Error(
        `Database not empty. Users: ${userCount}, Profiles: ${profileCount}`,
      );
    }
  }

  static async createTestUser(
    email: string,
    username?: string,
  ): Promise<RegistrationVerification> {
    const { rows: userRows } = await query<UserRecord>(
      `INSERT INTO auth_users (email, password_hash, is_active, is_archived)
       VALUES ($1, $2, true, false)
       RETURNING *`,
      [email, '$scrypt$n=16384,r=8,p=1$test$hash'],
    );
    const authUser = userRows[0];

    const { rows: profileRows } = await query<ProfileRecord>(
      `INSERT INTO profiles (auth_user_id, username, display_name, timezone, subscription_tier, is_archived)
       VALUES ($1, $2, NULL, NULL, NULL, false)
       RETURNING *`,
      [authUser.id, username || null],
    );
    const profile = profileRows[0];

    return {
      authUser: {
        id: authUser.id,
        email: authUser.email,
        passwordHash: authUser.password_hash,
        isActive: authUser.is_active,
        isArchived: authUser.is_archived,
        createdAt: authUser.created_at,
        updatedAt: authUser.updated_at,
      },
      profile: {
        id: profile.id,
        authUserId: profile.auth_user_id,
        username: profile.username,
        displayName: profile.display_name,
        timezone: profile.timezone,
        subscriptionTier: profile.subscription_tier,
        isArchived: profile.is_archived,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    };
  }
}

export default DatabaseHelpers;
