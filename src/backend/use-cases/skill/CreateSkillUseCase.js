const { v4: uuidv4 } = require('uuid');

class CreateSkillUseCase {
  constructor(skillRepository) {
    this.skillRepository = skillRepository;
  }

  async execute({ code, description, grade_level = null }) {
    const skill = {
      id: uuidv4(),
      code,
      description,
      grade_level
    };
    return await this.skillRepository.createSkill(skill);
  }
}

module.exports = CreateSkillUseCase;
