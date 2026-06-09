const { v4: uuidv4 } = require('uuid');

class CreateAssessmentVersionUseCase {
  constructor(assessmentRepository) {
    this.assessmentRepository = assessmentRepository;
  }

  async execute({ assessment_id, version_label, seed = null }) {
    const version = {
      id: uuidv4(),
      assessment_id,
      version_label,
      seed
    };
    return await this.assessmentRepository.createAssessmentVersion(version);
  }
}

module.exports = CreateAssessmentVersionUseCase;
