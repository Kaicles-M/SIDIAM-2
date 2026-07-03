class DeleteStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(id) {
    if (!id) {
      const err = new Error('student id required');
      err.statusCode = 400;
      throw err;
    }

    const deletedCount = await this.studentRepository.deleteStudent(id);
    if (!deletedCount) {
      const err = new Error('student not found');
      err.statusCode = 404;
      throw err;
    }

    return { success: true };
  }
}

module.exports = DeleteStudentUseCase;
