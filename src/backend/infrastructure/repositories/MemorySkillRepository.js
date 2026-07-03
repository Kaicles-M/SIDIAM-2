const SkillRepository = require('../../domain/repositories/SkillRepository');
const db = require('../database/InMemoryDB');

class MemorySkillRepository extends SkillRepository {
  async listSkills() {
    return db.skills;
  }

  async createSkill(skill) {
    const skillCopy = { ...skill, created_at: skill.created_at || new Date() };
    db.skills.push(skillCopy);
    return skillCopy;
  }
}

module.exports = MemorySkillRepository;
