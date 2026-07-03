const StudentResponseRepository = require('../../domain/repositories/StudentResponseRepository');
const db = require('../database/InMemoryDB');

class MemoryStudentResponseRepository extends StudentResponseRepository {
  async submitResponses(responses) {
    const saved = [];
    for (const response of responses) {
      // Remove any existing response for this student/version/question to allow updates
      db.student_responses = db.student_responses.filter(
        r => !(r.student_id === response.student_id && 
               r.assessment_version_id === response.assessment_version_id && 
               r.question_id === response.question_id)
      );
      
      const copy = {
        id: response.id || require('uuid').v4(),
        created_at: new Date(),
        ...response
      };
      db.student_responses.push(copy);
      saved.push(copy);
    }
    return saved;
  }

  async listResponsesForStudent(studentId, assessmentVersionId) {
    return db.student_responses.filter(
      r => r.student_id === studentId && r.assessment_version_id === assessmentVersionId
    );
  }

  async listResponsesForVersion(assessmentVersionId) {
    return db.student_responses.filter(
      r => r.assessment_version_id === assessmentVersionId
    );
  }
}

module.exports = MemoryStudentResponseRepository;
