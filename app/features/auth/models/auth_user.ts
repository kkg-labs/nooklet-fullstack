import type { DateTime } from "luxon";
import { column, hasOne } from "@adonisjs/lucid/orm";
import type { HasOne } from "@adonisjs/lucid/types/relations";
import Base from "#models/base_model";
import Profile from "#features/user/models/profile";

export default class AuthUser extends Base {
  public static table = "auth_users";

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare email: string;

  @column({ serializeAs: null, columnName: "password_hash" })
  declare passwordHash: string;

  @column({ columnName: "is_active" })
  declare isActive: boolean;

  @column({ columnName: "is_archived" })
  declare isArchived: boolean;

  @column.dateTime({ autoCreate: true, columnName: "created_at" })
  declare createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: "updated_at",
  })
  declare updatedAt: DateTime | null;

  @hasOne(() => Profile, {
    foreignKey: "authUserId",
  })
  declare profile: HasOne<typeof Profile>;
}
