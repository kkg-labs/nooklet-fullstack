import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "auth_users";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(this.raw("gen_random_uuid()"));
      table.string("email", 254).notNullable().unique();
      table.string("password_hash").notNullable();
      table.boolean("is_active").notNullable().defaultTo(true);
      table.boolean("is_archived").notNullable().defaultTo(false);
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .nullable()
        .defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
