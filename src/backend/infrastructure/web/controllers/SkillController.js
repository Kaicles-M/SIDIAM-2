class SkillController {
  constructor(createSkillUseCase, listSkillsUseCase) {
    this.createSkillUseCase = createSkillUseCase;
    this.listSkillsUseCase = listSkillsUseCase;
  }

  async list(req, res) {
    try {
      const skills = await this.listSkillsUseCase.execute();
      res.json(skills);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async create(req, res) {
    const { code, description, grade_level } = req.body;
    try {
      const s = await this.createSkillUseCase.execute({ code, description, grade_level });
      res.status(201).json(s);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = SkillController;
