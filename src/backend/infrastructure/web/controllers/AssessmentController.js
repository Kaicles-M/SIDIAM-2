class AssessmentController {
  constructor(
    createAssessmentUseCase,
    listAssessmentsUseCase,
    createAssessmentVersionUseCase,
    addQuestionToAssessmentUseCase
  ) {
    this.createAssessmentUseCase = createAssessmentUseCase;
    this.listAssessmentsUseCase = listAssessmentsUseCase;
    this.createAssessmentVersionUseCase = createAssessmentVersionUseCase;
    this.addQuestionToAssessmentUseCase = addQuestionToAssessmentUseCase;
  }

  async list(req, res) {
    try {
      const assessments = await this.listAssessmentsUseCase.execute(req.query.class_id);
      res.json(assessments);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { class_id, title, date } = req.body;
    try {
      const a = await this.createAssessmentUseCase.execute({ class_id, title, date });
      res.status(201).json(a);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async createVersion(req, res) {
    const { version_label, seed } = req.body;
    try {
      const av = await this.createAssessmentVersionUseCase.execute({
        assessment_id: req.params.id,
        version_label,
        seed
      });
      res.status(201).json(av);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async addQuestion(req, res) {
    const { question_id, order_index, mapping } = req.body;
    try {
      const aq = await this.addQuestionToAssessmentUseCase.execute({
        assessment_version_id: req.params.id,
        question_id,
        order_index,
        mapping
      });
      res.status(201).json(aq);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = AssessmentController;
