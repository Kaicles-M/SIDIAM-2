const UserRepository = require('../../domain/repositories/UserRepository');
const db = require('../database/InMemoryDB');

class MemoryUserRepository extends UserRepository {
  async listUsers() {
    return db.users.map(({ id, name, email, role, created_at }) => ({
      id,
      name,
      email,
      role,
      created_at: created_at || new Date()
    }));
  }

  async createUser(user) {
    const userCopy = { ...user, created_at: user.created_at || new Date() };
    db.users.push(userCopy);
    const { password_hash, ...userWithoutPassword } = userCopy;
    return userWithoutPassword;
  }

  async findUserByEmail(email) {
    return db.users.find(u => u.email === email);
  }

  async getUser(id) {
    const user = db.users.find(u => u.id === id);
    if (!user) return undefined;
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = MemoryUserRepository;
