const AssessmentRepository = require('../../domain/repositories/AssessmentRepository');
const db = require('../database/InMemoryDB');

class MemoryAssessmentRepository extends AssessmentRepository {
  async listAssessments(classId) {
    if (classId) {
      return db.assessments.filter(a => a.class_id === classId);
    }
    return db.assessments;
  }

  async createAssessment(assessment) {
    const assessmentCopy = { ...assessment, created_at: assessment.created_at || new Date() };
    db.assessments.push(assessmentCopy);
    return assessmentCopy;
  }

  async createAssessmentVersion(version) {
    const versionCopy = { ...version, created_at: version.created_at || new Date() };
    db.assessment_versions.push(versionCopy);
    return versionCopy;
  }

  async addQuestionToAssessment(assessmentQuestion) {
    const aqCopy = {
      ...assessmentQuestion,
      created_at: assessmentQuestion.created_at || new Date()
    };
    db.assessment_questions.push(aqCopy);
    return aqCopy;
  }
}

module.exports = MemoryAssessmentRepository;
