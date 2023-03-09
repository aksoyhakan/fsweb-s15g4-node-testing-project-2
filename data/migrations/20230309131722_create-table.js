/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("username", 128).unique().notNullable();
      tbl.string("institute").notNullable();
      tbl.string("email").notNullable();
      tbl.string("password").notNullable();
      tbl.string("role").defaultTo("student");
    })
    .createTable("books", (tbl) => {
      tbl.increments("book_id");
      tbl.string("bookname").notNullable();
      tbl.string("author").notNullable();
      tbl
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("books").dropTableIfExists("users");
};
