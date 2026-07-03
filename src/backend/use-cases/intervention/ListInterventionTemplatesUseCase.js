class ListInterventionTemplatesUseCase {
  constructor(interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute({ topic, category, skill_code }) {
    return await this.interventionRepository.listInterventionTemplates(topic, category, skill_code);
  }
}

module.exports = ListInterventionTemplatesUseCase;
