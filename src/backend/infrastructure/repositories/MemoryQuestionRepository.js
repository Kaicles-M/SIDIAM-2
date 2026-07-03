const QuestionRepository = require('../../domain/repositories/QuestionRepository');
const db = require('../database/InMemoryDB');

class MemoryQuestionRepository extends QuestionRepository {
  async listQuestions() {
    return db.questions;
  }

  async createQuestion(question) {
    const questionCopy = { ...question, created_at: question.created_at || new Date() };
    db.questions.push(questionCopy);
    return questionCopy;
  }
}

module.exports = MemoryQuestionRepository;
