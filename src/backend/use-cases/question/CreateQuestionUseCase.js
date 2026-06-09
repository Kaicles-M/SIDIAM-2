const { v4: uuidv4 } = require('uuid');

class CreateQuestionUseCase {
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }

  async execute(questionData) {
    const question = {
      id: uuidv4(),
      ...questionData,
      created_at: new Date()
    };
    return await this.questionRepository.createQuestion(question);
  }
}

module.exports = CreateQuestionUseCase;
