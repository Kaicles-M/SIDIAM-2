/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('role').notNullable().defaultTo('teacher');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('classes', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('year_grade');
      table.uuid('teacher_id').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('students', (table) => {
      table.uuid('id').primary();
      table.string('display_name').notNullable();
      table.string('external_code');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('student_enrollments', (table) => {
      table.uuid('id').primary();
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE');
      table.string('status').defaultTo('active');
      table.timestamp('start_date').defaultTo(knex.fn.now());
      table.timestamp('end_date').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('pedagogical_records', (table) => {
      table.uuid('id').primary();
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE');
      table.string('topic').notNullable();
      table.string('category').notNullable();
      table.string('importance').defaultTo('media');
      table.text('description');
      table.text('action_taken');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('pedagogical_records')
    .dropTableIfExists('student_enrollments')
    .dropTableIfExists('students')
    .dropTableIfExists('classes')
    .dropTableIfExists('users');
};
