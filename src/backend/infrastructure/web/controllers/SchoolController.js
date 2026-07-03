class SchoolController {
  constructor(createSchoolUseCase, listUserSchoolsUseCase, deleteSchoolUseCase) {
    this.createSchoolUseCase = createSchoolUseCase;
    this.listUserSchoolsUseCase = listUserSchoolsUseCase;
    this.deleteSchoolUseCase = deleteSchoolUseCase;
  }

  async list(req, res) {
    try {
      const schools = await this.listUserSchoolsUseCase.execute(req.user.id);
      res.json(schools);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { name, city } = req.body;
    try {
      const school = await this.createSchoolUseCase.execute({ name, city, userId: req.user.id });
      res.status(201).json(school);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      await this.deleteSchoolUseCase.execute(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = SchoolController;
