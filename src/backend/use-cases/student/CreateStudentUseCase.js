const { v4: uuidv4 } = require('uuid');

class CreateStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute({ display_name, school_id = null, external_code = null, is_active = true }) {
    if (!display_name) {
      const err = new Error('display_name required');
      err.statusCode = 400;
      throw err;
    }
    const student = {
      id: uuidv4(),
      display_name,
      school_id,
      external_code,
      is_active
    };
    return await this.studentRepository.createStudent(student);
  }
}

module.exports = CreateStudentUseCase;
