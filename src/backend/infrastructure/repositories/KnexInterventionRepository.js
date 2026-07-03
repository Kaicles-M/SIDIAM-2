const InterventionRepository = require('../../domain/repositories/InterventionRepository');
const db = require('../database/db');

class KnexInterventionRepository extends InterventionRepository {
  async listInterventionTemplates(topic, category, skillCode) {
    const query = db('intervention_templates').select('*');
    
    query.where((builder) => {
      if (skillCode) {
        builder.where('skill_code', skillCode);
      }
      if (topic && category) {
        builder.orWhere((innerBuilder) => {
          innerBuilder.whereRaw('LOWER(topic) = ?', [topic.toLowerCase()])
                      .andWhereRaw('LOWER(category) = ?', [category.toLowerCase()]);
        });
      }
    });

    return await query;
  }

  async createInterventionTemplate(template) {
    await db('intervention_templates').insert(template);
    return template;
  }
}

module.exports = KnexInterventionRepository;
