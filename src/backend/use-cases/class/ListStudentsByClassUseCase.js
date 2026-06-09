class ListStudentsByClassUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(classId) {
    return await this.studentRepository.listStudentsByClass(classId);
  }
}

module.exports = ListStudentsByClassUseCase;
