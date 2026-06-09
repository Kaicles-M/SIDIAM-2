const TopicRepository = require('../../domain/repositories/TopicRepository');
const db = require('../database/db');

class KnexTopicRepository extends TopicRepository {
  async listTopics() {
    return await db('topics').select('*');
  }

  async createTopic(topic) {
    await db('topics').insert(topic);
    return topic;
  }
}

module.exports = KnexTopicRepository;
