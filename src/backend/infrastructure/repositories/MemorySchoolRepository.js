const SchoolRepository = require('../../domain/repositories/SchoolRepository');
const db = require('../database/InMemoryDB');

class MemorySchoolRepository extends SchoolRepository {
  async createSchool(school) {
    const schoolCopy = { ...school, created_at: school.created_at || new Date() };
    db.schools.push(schoolCopy);
    return schoolCopy;
  }

  async listSchools() {
    return db.schools;
  }

  async addSchoolMembership(membership) {
    const membershipCopy = { ...membership, created_at: membership.created_at || new Date() };
    db.school_memberships.push(membershipCopy);
    return membershipCopy;
  }

  async listUserSchools(userId) {
    const userMemberships = db.school_memberships.filter(m => m.user_id === userId);
    return userMemberships.map(m => {
      const school = db.schools.find(s => s.id === m.school_id);
      if (!school) return null;
      return {
        ...school,
        role_in_school: m.role_in_school
      };
    }).filter(Boolean);
  }

  async deleteSchool(id) {
    const index = db.schools.findIndex(s => s.id === id);
    if (index !== -1) {
      db.schools.splice(index, 1);
      db.school_memberships = db.school_memberships.filter(m => m.school_id !== id);
      return 1;
    }
    return 0;
  }
}

module.exports = MemorySchoolRepository;
