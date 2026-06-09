const { v4: uuidv4 } = require('uuid');

class EnrollStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute({ student_id, class_id, start_date = null, status = 'active' }) {
    const enrollment = {
      id: uuidv4(),
      student_id,
      class_id,
      start_date: start_date || new Date().toISOString(),
      status
    };
    return await this.studentRepository.enrollStudent(enrollment);
  }
}

module.exports = EnrollStudentUseCase;
