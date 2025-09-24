import type { DateTime } from "luxon";
import { belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Base from "#models/base_model";
import AuthUser from "#features/auth/auth_user";

export type NookletType = "journal" | "voice" | "quick_capture";

export default class Nooklet extends Base {
  public static table = "nooklets";

  @column({ isPrimary: true })
  declare id: string;

  @column({ columnName: "auth_user_id" })
  declare userId: string;

  @column()
  declare type: NookletType;

  @column()
  declare content: string;

  @column({ columnName: "raw_content" })
  declare rawContent: string | null;

  @column()
  declare summary: string | null;

  @column({ columnName: "metadata" })
  declare metadata: Record<string, unknown>;

  @column({ columnName: "is_favorite" })
  declare isFavorite: boolean;

  @column({ columnName: "is_archived" })
  declare isArchived: boolean;

  @column({ columnName: "is_draft" })
  declare isDraft: boolean;

  @column({ columnName: "word_count" })
  declare wordCount: number | null;

  @column({ columnName: "estimated_read_time" })
  declare estimatedReadTime: number | null;

  @column.dateTime({ columnName: "published_at" })
  declare publishedAt: DateTime | null;

  @column.dateTime({ autoCreate: true, columnName: "created_at" })
  declare createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: "updated_at",
  })
  declare updatedAt: DateTime | null;

  @belongsTo(() => AuthUser, {
    foreignKey: "userId",
  })
  declare owner: BelongsTo<typeof AuthUser>;
}
