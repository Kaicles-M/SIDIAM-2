class DeleteSchoolUseCase {
  constructor(schoolRepository) {
    this.schoolRepository = schoolRepository;
  }

  async execute(id) {
    if (!id) {
      const err = new Error('school id required');
      err.statusCode = 400;
      throw err;
    }

    const deletedCount = await this.schoolRepository.deleteSchool(id);
    if (!deletedCount) {
      const err = new Error('school not found');
      err.statusCode = 404;
      throw err;
    }

    return { success: true };
  }
}

module.exports = DeleteSchoolUseCase;
