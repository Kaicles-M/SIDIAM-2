const StudentResponseRepository = require('../../domain/repositories/StudentResponseRepository');
const db = require('../database/db');

class KnexStudentResponseRepository extends StudentResponseRepository {
  async submitResponses(responses) {
    const saved = [];
    for (const response of responses) {
      await db('student_responses')
        .where({
          student_id: response.student_id,
          assessment_version_id: response.assessment_version_id,
          question_id: response.question_id
        })
        .del();

      const copy = {
        id: response.id || require('uuid').v4(),
        ...response
      };
      await db('student_responses').insert(copy);
      saved.push(copy);
    }
    return saved;
  }

  async listResponsesForStudent(studentId, assessmentVersionId) {
    return await db('student_responses')
      .where({ student_id: studentId, assessment_version_id: assessmentVersionId });
  }

  async listResponsesForVersion(assessmentVersionId) {
    return await db('student_responses')
      .where({ assessment_version_id: assessmentVersionId });
  }
}

module.exports = KnexStudentResponseRepository;
