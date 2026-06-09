const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class RegisterUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    if (!name || !email || !password) {
      const err = new Error('all fields required');
      err.statusCode = 400;
      throw err;
    }
    const existing = await this.userRepository.findUserByEmail(email);
    if (existing) {
      const err = new Error('email already in use');
      err.statusCode = 400;
      throw err;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password_hash,
      role: 'teacher'
    };
    return await this.userRepository.createUser(user);
  }
}

module.exports = RegisterUseCase;
