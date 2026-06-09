const { v4: uuidv4 } = require('uuid');

class CreateClassUseCase {
  constructor(classRepository) {
    this.classRepository = classRepository;
  }

  async execute({ name, year_grade, teacher_id, school_id = null }) {
    if (!name) {
      const err = new Error('name required');
      err.statusCode = 400;
      throw err;
    }
    const c = {
      id: uuidv4(),
      name,
      year_grade,
      teacher_id: teacher_id || null,
      school_id
    };
    return await this.classRepository.createClass(c);
  }
}

module.exports = CreateClassUseCase;
