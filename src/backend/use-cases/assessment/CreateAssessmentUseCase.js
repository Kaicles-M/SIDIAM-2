const { v4: uuidv4 } = require('uuid');

class CreateAssessmentUseCase {
  constructor(assessmentRepository) {
    this.assessmentRepository = assessmentRepository;
  }

  async execute({ class_id, title, date, status = 'draft' }) {
    const assessment = {
      id: uuidv4(),
      class_id,
      title,
      date,
      status
    };
    return await this.assessmentRepository.createAssessment(assessment);
  }
}

module.exports = CreateAssessmentUseCase;
