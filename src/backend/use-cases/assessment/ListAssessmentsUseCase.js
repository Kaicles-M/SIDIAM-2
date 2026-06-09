class ListAssessmentsUseCase {
  constructor(assessmentRepository) {
    this.assessmentRepository = assessmentRepository;
  }

  async execute(classId) {
    return await this.assessmentRepository.listAssessments(classId);
  }
}

module.exports = ListAssessmentsUseCase;
