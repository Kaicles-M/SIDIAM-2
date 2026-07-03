const { v4: uuidv4 } = require('uuid');

class CreatePedagogicalRecordUseCase {
  constructor(pedagogicalRecordRepository) {
    this.pedagogicalRecordRepository = pedagogicalRecordRepository;
  }

  async execute({ student_id, class_id, topic, category, description, importance, action_taken, record_type, skill_code, event_date }) {
    const isObsTurma = record_type === 'obs_turma';
    if (!class_id || !topic || !category || (!isObsTurma && !student_id)) {
      const err = new Error('class_id, topic, category and student_id (for individual records) are required');
      err.statusCode = 400;
      throw err;
    }
    const record = {
      id: uuidv4(),
      student_id: isObsTurma ? null : student_id,
      class_id,
      topic,
      category,
      description,
      importance: importance || 'media',
      action_taken,
      record_type: record_type || 'dificuldade',
      skill_code: skill_code || null,
      event_date: event_date || new Date()
    };
    return await this.pedagogicalRecordRepository.createPedagogicalRecord(record);
  }
}

module.exports = CreatePedagogicalRecordUseCase;
