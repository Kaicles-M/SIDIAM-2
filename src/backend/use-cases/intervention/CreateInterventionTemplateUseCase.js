const { v4: uuidv4 } = require('uuid');

class CreateInterventionTemplateUseCase {
  constructor(interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute({ topic, category, skill_code, title, description_plan, recommended_resources }) {
    if (!topic || !category || !title || !description_plan) {
      const err = new Error('topic, category, title, and description_plan are required');
      err.statusCode = 400;
      throw err;
    }
    const template = {
      id: uuidv4(),
      topic,
      category,
      skill_code: skill_code || null,
      title,
      description_plan,
      recommended_resources: recommended_resources || null,
      created_at: new Date()
    };
    return await this.interventionRepository.createInterventionTemplate(template);
  }
}

module.exports = CreateInterventionTemplateUseCase;
