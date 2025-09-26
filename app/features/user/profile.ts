import type { DateTime } from 'luxon';
import { belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Base from '#models/base_model';
import AuthUser from '#features/auth/auth_user';

export default class Profile extends Base {
  public static table = 'profiles';

  @column({ isPrimary: true })
  declare id: string;

  @column({ columnName: 'auth_user_id' })
  declare authUserId: string;

  @column()
  declare username: string | null;

  @column({ columnName: 'display_name' })
  declare displayName: string | null;

  @column()
  declare timezone: string | null;

  @column({ columnName: 'subscription_tier' })
  declare subscriptionTier: string | null;

  @column({ columnName: 'is_archived' })
  declare isArchived: boolean;

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updatedAt: DateTime | null;

  @belongsTo(() => AuthUser, {
    foreignKey: 'authUserId',
  })
  declare authUser: BelongsTo<typeof AuthUser>;
}
