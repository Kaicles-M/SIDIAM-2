const { v4: uuidv4 } = require('uuid');

class CreatePedagogicalRecordUseCase {
  constructor(pedagogicalRecordRepository) {
    this.pedagogicalRecordRepository = pedagogicalRecordRepository;
  }

  async execute({ student_id, class_id, topic, category, description, importance, action_taken }) {
    if (!student_id || !class_id || !topic || !category) {
      const err = new Error('student_id, class_id, topic and category are required');
      err.statusCode = 400;
      throw err;
    }
    const record = {
      id: uuidv4(),
      student_id,
      class_id,
      topic,
      category,
      description,
      importance,
      action_taken
    };
    return await this.pedagogicalRecordRepository.createPedagogicalRecord(record);
  }
}

module.exports = CreatePedagogicalRecordUseCase;
