const QuestionRepository = require('../../domain/repositories/QuestionRepository');
const db = require('../database/db');

class KnexQuestionRepository extends QuestionRepository {
  async listQuestions() {
    return await db('questions').select('*');
  }

  async createQuestion(question) {
    await db('questions').insert(question);
    return question;
  }
}

module.exports = KnexQuestionRepository;
