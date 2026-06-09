class ListRecordsByClassUseCase {
  constructor(pedagogicalRecordRepository) {
    this.pedagogicalRecordRepository = pedagogicalRecordRepository;
  }

  async execute(classId) {
    return await this.pedagogicalRecordRepository.listRecordsByClass(classId);
  }
}

module.exports = ListRecordsByClassUseCase;
