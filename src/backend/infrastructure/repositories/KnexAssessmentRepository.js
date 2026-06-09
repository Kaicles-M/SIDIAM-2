const AssessmentRepository = require('../../domain/repositories/AssessmentRepository');
const db = require('../database/db');

class KnexAssessmentRepository extends AssessmentRepository {
  async listAssessments(classId) {
    const query = db('assessments').select('*');
    if (classId) query.where({ class_id: classId });
    return await query;
  }

  async createAssessment(assessment) {
    await db('assessments').insert(assessment);
    return assessment;
  }

  async createAssessmentVersion(version) {
    await db('assessment_versions').insert(version);
    return version;
  }

  async addQuestionToAssessment(assessmentQuestion) {
    await db('assessment_questions').insert(assessmentQuestion);
    return assessmentQuestion;
  }
}

module.exports = KnexAssessmentRepository;
