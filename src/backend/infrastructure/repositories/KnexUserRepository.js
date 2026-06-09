const UserRepository = require('../../domain/repositories/UserRepository');
const db = require('../database/db');

class KnexUserRepository extends UserRepository {
  async listUsers() {
    return await db('users').select('id', 'name', 'email', 'role', 'created_at');
  }

  async createUser(user) {
    await db('users').insert(user);
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUserByEmail(email) {
    return await db('users').where({ email }).first();
  }

  async getUser(id) {
    return await db('users').where({ id }).select('id', 'name', 'email', 'role', 'created_at').first();
  }
}

module.exports = KnexUserRepository;
