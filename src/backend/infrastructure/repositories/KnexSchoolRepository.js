const SchoolRepository = require('../../domain/repositories/SchoolRepository');
const db = require('../database/db');

class KnexSchoolRepository extends SchoolRepository {
  async createSchool(school) {
    await db('schools').insert(school);
    return school;
  }

  async listSchools() {
    return await db('schools').select('*');
  }

  async addSchoolMembership(membership) {
    await db('school_memberships').insert(membership);
    return membership;
  }

  async listUserSchools(userId) {
    return await db('schools')
      .join('school_memberships', 'schools.id', 'school_memberships.school_id')
      .where('school_memberships.user_id', userId)
      .select('schools.*', 'school_memberships.role_in_school');
  }

  async deleteSchool(id) {
    return await db('schools').where({ id }).del();
  }
}

module.exports = KnexSchoolRepository;
