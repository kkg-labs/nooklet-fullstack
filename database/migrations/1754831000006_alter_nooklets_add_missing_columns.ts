import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'nooklets';

  async up() {
    // Use IF NOT EXISTS to avoid failures if columns already exist
    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS title varchar(500) NOT NULL DEFAULT ''`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS raw_content text NULL`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS summary text NULL`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS word_count integer NULL`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS estimated_read_time integer NULL`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS published_at timestamptz NULL`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false`,
    );

    await this.schema.raw(
      `ALTER TABLE ${this.tableName}
       ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false`,
    );
  }

  async down() {
    // Drop columns if present (Postgres does not support IF EXISTS for drop column in all versions; wrap with raw IF EXISTS)
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS is_draft`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS is_favorite`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS published_at`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS estimated_read_time`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS word_count`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS summary`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS raw_content`,
    );
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS title`,
    );
  }
}
