import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "nooklets";

  async up() {
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS title`
    );
  }

  async down() {
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS title varchar(500) NOT NULL DEFAULT ''`
    );
  }
}
