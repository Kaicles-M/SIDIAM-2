/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('student_responses', (table) => {
    table.uuid('id').primary();
    table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE');
    table.uuid('assessment_version_id').references('id').inTable('assessment_versions').onDelete('CASCADE');
    table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.string('selected_option', 1).notNullable();
    table.boolean('is_correct').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Ensure a student can only have one response per question per assessment version
    table.unique(['student_id', 'assessment_version_id', 'question_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('student_responses');
};
