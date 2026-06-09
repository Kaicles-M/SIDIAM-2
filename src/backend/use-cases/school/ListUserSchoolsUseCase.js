class ListUserSchoolsUseCase {
  constructor(schoolRepository) {
    this.schoolRepository = schoolRepository;
  }

  async execute(userId) {
    return await this.schoolRepository.listUserSchools(userId);
  }
}

module.exports = ListUserSchoolsUseCase;
