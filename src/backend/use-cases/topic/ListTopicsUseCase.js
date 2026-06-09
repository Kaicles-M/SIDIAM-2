class ListTopicsUseCase {
  constructor(topicRepository) {
    this.topicRepository = topicRepository;
  }

  async execute() {
    return await this.topicRepository.listTopics();
  }
}

module.exports = ListTopicsUseCase;
