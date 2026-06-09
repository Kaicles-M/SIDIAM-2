/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require('dotenv').config({ path: './src/backend/.env' });

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || 'postgres://sidiam_user:sidiam_password@localhost:5432/sidiam_db',
    migrations: {
      directory: './src/backend/migrations'
    }
  },
  test: {
    client: 'postgresql',
    connection: 'postgres://sidiam_user:sidiam_password@localhost:5432/sidiam_test',
    migrations: {
      directory: './src/backend/migrations'
    }
  }
};
