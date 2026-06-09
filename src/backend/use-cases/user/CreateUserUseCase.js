const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password, role = 'teacher' }) {
    if (!name || !email) {
      const err = new Error('name and email required');
      err.statusCode = 400;
      throw err;
    }
    const password_hash = await bcrypt.hash(password || 'undefined', 10);
    const u = {
      id: uuidv4(),
      name,
      email,
      password_hash,
      role
    };
    return await this.userRepository.createUser(u);
  }
}

module.exports = CreateUserUseCase;
