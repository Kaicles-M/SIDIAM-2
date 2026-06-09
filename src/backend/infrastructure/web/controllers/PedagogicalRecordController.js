class PedagogicalRecordController {
  constructor(
    createPedagogicalRecordUseCase,
    listRecordsByClassUseCase,
    listRecordsByStudentUseCase,
    getDashboardStatsUseCase
  ) {
    this.createPedagogicalRecordUseCase = createPedagogicalRecordUseCase;
    this.listRecordsByClassUseCase = listRecordsByClassUseCase;
    this.listRecordsByStudentUseCase = listRecordsByStudentUseCase;
    this.getDashboardStatsUseCase = getDashboardStatsUseCase;
  }

  async create(req, res) {
    const { student_id, class_id, topic, category, description, importance, action_taken } = req.body;
    try {
      const r = await this.createPedagogicalRecordUseCase.execute({
        student_id,
        class_id,
        topic,
        category,
        description,
        importance,
        action_taken
      });
      res.status(201).json(r);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async listByClass(req, res) {
    try {
      const records = await this.listRecordsByClassUseCase.execute(req.params.classId);
      res.json(records);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async listByStudent(req, res) {
    try {
      const records = await this.listRecordsByStudentUseCase.execute(req.params.studentId);
      res.json(records);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async getDashboardStats(req, res) {
    try {
      const stats = await this.getDashboardStatsUseCase.execute();
      res.json(stats);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = PedagogicalRecordController;
