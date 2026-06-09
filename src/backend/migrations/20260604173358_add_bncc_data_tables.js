/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('bncc_reference', (table) => {
      table.uuid('id').primary();
      table.string('level').notNullable(); // 'Fundamental' or 'Medio'
      table.string('grade').notNullable(); // '6º Ano', '1ª Série', etc
      table.string('code').unique().notNullable(); // EF06MA01
      table.text('description').notNullable();
      table.string('topic'); // Unidade Temática
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bncc_reference');
};
