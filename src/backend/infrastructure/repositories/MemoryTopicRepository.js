const TopicRepository = require('../../domain/repositories/TopicRepository');
const db = require('../database/InMemoryDB');

class MemoryTopicRepository extends TopicRepository {
  async listTopics() {
    return db.topics;
  }

  async createTopic(topic) {
    const topicCopy = { ...topic, created_at: topic.created_at || new Date() };
    db.topics.push(topicCopy);
    return topicCopy;
  }
}

module.exports = MemoryTopicRepository;
