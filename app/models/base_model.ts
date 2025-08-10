import type { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import { BaseModel as LucidBaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

/**
 * BaseModel
 * - UUID primary keys by default
 * - ISO serialization for DateTime
 * - Soft archive helpers (isArchived) for future use
 */
export default class BaseModel extends LucidBaseModel {
  /**
   * Use string UUIDs for the primary key, self assigned in app layer
   */
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(model: BaseModel) {
    if (!model.id) {
      model.id = randomUUID()
    }
  }

  /**
   * Serialize DateTime columns to ISO strings
   */
  public serializeAsDate(value?: DateTime | null): string | null {
    if (!value) return null
    return value.toISO()
  }

  /**
   * Soft archive helpers (future use)
   */
  public static queryNonArchived<TQuery extends { where: (col: string, val: unknown) => TQuery }>(
    query: TQuery,
  ): TQuery {
    return query.where('is_archived', false)
  }
}


