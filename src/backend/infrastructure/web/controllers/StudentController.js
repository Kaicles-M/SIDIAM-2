class StudentController {
  constructor(createStudentUseCase, getStudentUseCase, listStudentsUseCase) {
    this.createStudentUseCase = createStudentUseCase;
    this.getStudentUseCase = getStudentUseCase;
    this.listStudentsUseCase = listStudentsUseCase;
  }

  async list(req, res) {
    try {
      const students = await this.listStudentsUseCase.execute(req.query.school_id);
      res.json(students);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { display_name, external_code } = req.body;
    try {
      const s = await this.createStudentUseCase.execute({ display_name, external_code });
      res.status(201).json(s);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async get(req, res) {
    try {
      const s = await this.getStudentUseCase.execute(req.params.id);
      res.json(s);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = StudentController;
