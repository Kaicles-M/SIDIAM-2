const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class LoginUseCase {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findUserByEmail(email);
    
    if (!user) {
      const err = new Error('Usuário não encontrado');
      err.statusCode = 401;
      throw err;
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      const err = new Error('Senha incorreta');
      err.statusCode = 401;
      throw err;
    }
    
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      this.jwtSecret,
      { expiresIn: '8h' }
    );
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginUseCase;
