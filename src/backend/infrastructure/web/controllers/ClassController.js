class ClassController {
  constructor(
    createClassUseCase,
    getClassUseCase,
    listClassesUseCase,
    deleteClassUseCase,
    enrollStudentUseCase,
    listStudentsByClassUseCase
  ) {
    this.createClassUseCase = createClassUseCase;
    this.getClassUseCase = getClassUseCase;
    this.listClassesUseCase = listClassesUseCase;
    this.deleteClassUseCase = deleteClassUseCase;
    this.enrollStudentUseCase = enrollStudentUseCase;
    this.listStudentsByClassUseCase = listStudentsByClassUseCase;
  }

  async list(req, res) {
    try {
      const classes = await this.listClassesUseCase.execute(req.query.school_id);
      res.json(classes);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { name, year_grade, teacher_id, school_id } = req.body;
    try {
      const c = await this.createClassUseCase.execute({ name, year_grade, teacher_id, school_id });
      res.status(201).json(c);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async get(req, res) {
    try {
      const c = await this.getClassUseCase.execute(req.params.id);
      res.json(c);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      await this.deleteClassUseCase.execute(req.params.id);
      res.status(200).json({ success: true });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async enroll(req, res) {
    const { student_id, start_date } = req.body;
    const classId = req.params.classId;
    try {
      const e = await this.enrollStudentUseCase.execute({ student_id, class_id: classId, start_date });
      res.status(201).json(e);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async listStudents(req, res) {
    try {
      const students = await this.listStudentsByClassUseCase.execute(req.params.classId);
      res.json(students);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = ClassController;
