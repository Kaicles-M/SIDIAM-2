class ListQuestionsUseCase {
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }

  async execute() {
    return await this.questionRepository.listQuestions();
  }
}

module.exports = ListQuestionsUseCase;
