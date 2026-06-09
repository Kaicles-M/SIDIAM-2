class QuestionController {
  constructor(createQuestionUseCase, listQuestionsUseCase) {
    this.createQuestionUseCase = createQuestionUseCase;
    this.listQuestionsUseCase = listQuestionsUseCase;
  }

  async list(req, res) {
    try {
      const questions = await this.listQuestionsUseCase.execute();
      res.json(questions);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const q = await this.createQuestionUseCase.execute({ ...req.body, created_by: req.user.id });
      res.status(201).json(q);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = QuestionController;
