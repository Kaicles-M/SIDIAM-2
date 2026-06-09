const { v4: uuidv4 } = require('uuid');

class AddQuestionToAssessmentUseCase {
  constructor(assessmentRepository) {
    this.assessmentRepository = assessmentRepository;
  }

  async execute({ assessment_version_id, question_id, order_index, mapping = null }) {
    const aq = {
      id: uuidv4(),
      assessment_version_id,
      question_id,
      order_index,
      mapping
    };
    return await this.assessmentRepository.addQuestionToAssessment(aq);
  }
}

module.exports = AddQuestionToAssessmentUseCase;
