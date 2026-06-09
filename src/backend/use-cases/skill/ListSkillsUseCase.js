class ListSkillsUseCase {
  constructor(skillRepository) {
    this.skillRepository = skillRepository;
  }

  async execute() {
    return await this.skillRepository.listSkills();
  }
}

module.exports = ListSkillsUseCase;
