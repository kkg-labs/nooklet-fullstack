import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'nooklets';

  async up() {
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS estimated_read_time`,
    );
  }

  async down() {
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS estimated_read_time integer NULL`,
    );
  }
}
