class TopicController {
  constructor(createTopicUseCase, listTopicsUseCase) {
    this.createTopicUseCase = createTopicUseCase;
    this.listTopicsUseCase = listTopicsUseCase;
  }

  async list(req, res) {
    try {
      const topics = await this.listTopicsUseCase.execute();
      res.json(topics);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { name, parent_id } = req.body;
    try {
      const t = await this.createTopicUseCase.execute({ name, parent_id });
      res.status(201).json(t);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = TopicController;
