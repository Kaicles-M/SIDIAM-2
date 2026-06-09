const SkillRepository = require('../../domain/repositories/SkillRepository');
const db = require('../database/db');

class KnexSkillRepository extends SkillRepository {
  async listSkills() {
    return await db('skills').select('*');
  }

  async createSkill(skill) {
    await db('skills').insert(skill);
    return skill;
  }
}

module.exports = KnexSkillRepository;
