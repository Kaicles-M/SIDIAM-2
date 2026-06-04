/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('topics', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.uuid('parent_id').references('id').inTable('topics').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('skills', (table) => {
      table.uuid('id').primary();
      table.string('code').unique().notNullable();
      table.text('description').notNullable();
      table.string('grade_level');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('questions', (table) => {
      table.uuid('id').primary();
      table.text('statement').notNullable();
      table.text('option_a');
      table.text('option_b');
      table.text('option_c');
      table.text('option_d');
      table.text('option_e');
      table.string('correct_option', 1).notNullable(); // 'A', 'B', 'C', 'D' or 'E'
      table.uuid('topic_id').references('id').inTable('topics').onDelete('SET NULL');
      table.integer('difficulty').defaultTo(1); // 1-3
      table.string('visibility').defaultTo('private'); // private, school, public
      table.string('status').defaultTo('published'); // draft, published
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('question_skills', (table) => {
      table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE');
      table.uuid('skill_id').references('id').inTable('skills').onDelete('CASCADE');
      table.primary(['question_id', 'skill_id']);
    })
    .createTable('assessments', (table) => {
      table.uuid('id').primary();
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE');
      table.string('title').notNullable();
      table.date('date');
      table.string('status').defaultTo('draft'); // draft, active, finished
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('assessment_versions', (table) => {
      table.uuid('id').primary();
      table.uuid('assessment_id').references('id').inTable('assessments').onDelete('CASCADE');
      table.string('version_label').notNullable(); // 'A', 'B', 'C'
      table.integer('seed');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('assessment_questions', (table) => {
      table.uuid('id').primary();
      table.uuid('assessment_version_id').references('id').inTable('assessment_versions').onDelete('CASCADE');
      table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE');
      table.integer('order_index').notNullable();
      table.jsonb('mapping'); // For shuffled options as per ADR-005
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('assessment_questions')
    .dropTableIfExists('assessment_versions')
    .dropTableIfExists('assessments')
    .dropTableIfExists('question_skills')
    .dropTableIfExists('questions')
    .dropTableIfExists('skills')
    .dropTableIfExists('topics');
};
