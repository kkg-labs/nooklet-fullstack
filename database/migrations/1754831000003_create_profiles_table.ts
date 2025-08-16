import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "profiles";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(this.raw("gen_random_uuid()"));
      table
        .uuid("auth_user_id")
        .notNullable()
        .unique()
        .references("id")
        .inTable("auth_users")
        .onDelete("CASCADE");
      table.string("username", 64).nullable().unique();
      table.string("display_name", 254).nullable();
      table.string("timezone", 64).nullable();
      table.string("subscription_tier", 64).nullable();
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
