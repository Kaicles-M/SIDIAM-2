class AuthController {
  constructor(registerUseCase, loginUseCase, getMeUseCase) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
    this.getMeUseCase = getMeUseCase;
  }

  async register(req, res) {
    const { name, email, password } = req.body;
    try {
      const user = await this.registerUseCase.execute({ name, email, password });
      res.status(201).json(user);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await this.loginUseCase.execute({ email, password });
      res.json(result);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async me(req, res) {
    try {
      const user = await this.getMeUseCase.execute(req.user.id);
      res.json(user);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
