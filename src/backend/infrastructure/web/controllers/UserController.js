class UserController {
  constructor(createUserUseCase, getUserUseCase, listUsersUseCase) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.listUsersUseCase = listUsersUseCase;
  }

  async list(req, res) {
    try {
      const users = await this.listUsersUseCase.execute();
      res.json(users);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { name, email } = req.body;
    try {
      const u = await this.createUserUseCase.execute({ name, email, role: 'teacher' });
      res.status(201).json(u);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async get(req, res) {
    try {
      const u = await this.getUserUseCase.execute(req.params.id);
      res.json(u);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = UserController;
