class InterventionController {
  constructor(createInterventionTemplateUseCase, listInterventionTemplatesUseCase) {
    this.createInterventionTemplateUseCase = createInterventionTemplateUseCase;
    this.listInterventionTemplatesUseCase = listInterventionTemplatesUseCase;
  }

  async create(req, res) {
    const { topic, category, skill_code, title, description_plan, recommended_resources } = req.body;
    try {
      const template = await this.createInterventionTemplateUseCase.execute({
        topic,
        category,
        skill_code,
        title,
        description_plan,
        recommended_resources
      });
      res.status(201).json(template);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async list(req, res) {
    const { topic, category, skill_code } = req.query;
    try {
      const templates = await this.listInterventionTemplatesUseCase.execute({
        topic,
        category,
        skill_code
      });
      res.json(templates);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = InterventionController;
