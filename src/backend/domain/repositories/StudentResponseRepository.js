class StudentResponseRepository {
  async submitResponses(responses) {
    throw new Error('Method not implemented');
  }

  async listResponsesForStudent(studentId, assessmentVersionId) {
    throw new Error('Method not implemented');
  }

  async listResponsesForVersion(assessmentVersionId) {
    throw new Error('Method not implemented');
  }
}

module.exports = StudentResponseRepository;
