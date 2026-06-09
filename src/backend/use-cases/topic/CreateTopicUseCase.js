const { v4: uuidv4 } = require('uuid');

class CreateTopicUseCase {
  constructor(topicRepository) {
    this.topicRepository = topicRepository;
  }

  async execute({ name, parent_id = null }) {
    const topic = {
      id: uuidv4(),
      name,
      parent_id
    };
    return await this.topicRepository.createTopic(topic);
  }
}

module.exports = CreateTopicUseCase;
