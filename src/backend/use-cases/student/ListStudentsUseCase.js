class ListStudentsUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(schoolId) {
    return await this.studentRepository.listStudents(schoolId);
  }
}

module.exports = ListStudentsUseCase;
