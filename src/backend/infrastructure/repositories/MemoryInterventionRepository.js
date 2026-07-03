const InterventionRepository = require('../../domain/repositories/InterventionRepository');
const db = require('../database/InMemoryDB');

class MemoryInterventionRepository extends InterventionRepository {
  async listInterventionTemplates(topic, category, skillCode) {
    return db.intervention_templates.filter(item => {
      // Prioritize skill_code match if provided
      if (skillCode && item.skill_code === skillCode) {
        return true;
      }
      // Fallback to topic + category match
      const topicMatch = topic && item.topic && item.topic.toLowerCase() === topic.toLowerCase();
      const categoryMatch = category && item.category && item.category.toLowerCase() === category.toLowerCase();
      
      if (topicMatch && categoryMatch) {
        return true;
      }
      return false;
    });
  }

  async createInterventionTemplate(template) {
    const templateCopy = { 
      id: template.id || require('uuid').v4(), 
      created_at: template.created_at || new Date(),
      ...template 
    };
    db.intervention_templates.push(templateCopy);
    return templateCopy;
  }
}

module.exports = MemoryInterventionRepository;
