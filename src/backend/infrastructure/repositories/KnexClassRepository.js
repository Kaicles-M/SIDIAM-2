const ClassRepository = require('../../domain/repositories/ClassRepository');
const db = require('../database/db');

class KnexClassRepository extends ClassRepository {
  async listClasses(schoolId) {
    const query = db('classes').select('*');
    if (schoolId) query.where({ school_id: schoolId });
    return await query;
  }

  async createClass(classData) {
    await db('classes').insert(classData);
    return classData;
  }

  async getClass(id) {
    return await db('classes').where({ id }).first();
  }

  async deleteClass(id) {
    return await db('classes').where({ id }).del();
  }
}

module.exports = KnexClassRepository;
