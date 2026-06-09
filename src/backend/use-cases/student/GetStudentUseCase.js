class GetStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(id) {
    const student = await this.studentRepository.getStudent(id);
    if (!student) {
      const err = new Error('student not found');
      err.statusCode = 404;
      throw err;
    }
    return student;
  }
}

module.exports = GetStudentUseCase;
