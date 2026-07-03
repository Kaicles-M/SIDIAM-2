/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('pedagogical_records', (table) => {
      table.string('record_type').defaultTo('dificuldade'); // dificuldade, ponto_forte, obs_turma
      table.string('skill_code').nullable(); // Link direto com código da BNCC
      table.timestamp('event_date').defaultTo(knex.fn.now()); // Data retroativa
    })
    .createTable('intervention_templates', (table) => {
      table.uuid('id').primary();
      table.string('topic').notNullable();
      table.string('category').notNullable();
      table.string('skill_code').nullable();
      table.string('title').notNullable();
      table.text('description_plan').notNullable();
      table.text('recommended_resources').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('intervention_templates')
    .alterTable('pedagogical_records', (table) => {
      table.dropColumn('record_type');
      table.dropColumn('skill_code');
      table.dropColumn('event_date');
    });
};
