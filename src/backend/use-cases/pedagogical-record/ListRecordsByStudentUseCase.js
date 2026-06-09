class ListRecordsByStudentUseCase {
  constructor(pedagogicalRecordRepository) {
    this.pedagogicalRecordRepository = pedagogicalRecordRepository;
  }

  async execute(studentId) {
    return await this.pedagogicalRecordRepository.listRecordsByStudent(studentId);
  }
}

module.exports = ListRecordsByStudentUseCase;
