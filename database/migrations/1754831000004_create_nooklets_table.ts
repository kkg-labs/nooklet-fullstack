import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "nooklets";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid("id")
        .primary()
        .notNullable()
        .defaultTo(this.raw("gen_random_uuid()"));

      table
        .uuid("user_id")
        .notNullable()
        .references("id")
        .inTable("profiles")
        .onDelete("CASCADE");

      table.string("type", 20).notNullable().defaultTo("journal");
      table.string("title", 500).notNullable();
      table.text("content").notNullable();
      table.text("raw_content").nullable();
      table.text("summary").nullable();
      table.jsonb("metadata").notNullable().defaultTo(this.raw("'{}'::jsonb"));
      table.boolean("is_favorite").notNullable().defaultTo(false);
      table.boolean("is_archived").notNullable().defaultTo(false);
      table.boolean("is_draft").notNullable().defaultTo(false);
      table.integer("word_count").nullable();
      table.integer("estimated_read_time").nullable();
      table
        .timestamp("published_at", { useTz: true })
        .nullable();
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .nullable()
        .defaultTo(this.now());

      table.index(["user_id", "is_archived"], "nooklets_user_archived_idx");
      table.index(["created_at"], "nooklets_created_at_idx");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
