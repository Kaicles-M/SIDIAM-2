/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('schools', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('city');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .alterTable('users', (table) => {
      table.string('password_hash');
    })
    .alterTable('classes', (table) => {
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE');
    })
    .alterTable('students', (table) => {
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE');
    })
    .createTable('school_memberships', (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE');
      table.string('role_in_school').defaultTo('teacher'); // teacher, admin
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('school_memberships')
    .alterTable('students', (table) => {
      table.dropColumn('school_id');
    })
    .alterTable('classes', (table) => {
      table.dropColumn('school_id');
    })
    .alterTable('users', (table) => {
      table.dropColumn('password_hash');
    })
    .dropTableIfExists('schools');
};
