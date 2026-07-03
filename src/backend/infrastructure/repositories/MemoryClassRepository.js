const ClassRepository = require('../../domain/repositories/ClassRepository');
const db = require('../database/InMemoryDB');

class MemoryClassRepository extends ClassRepository {
  async listClasses(schoolId) {
    if (schoolId) {
      return db.classes.filter(c => c.school_id === schoolId);
    }
    return db.classes;
  }

  async createClass(classData) {
    const classCopy = { ...classData, created_at: classData.created_at || new Date() };
    db.classes.push(classCopy);
    return classCopy;
  }

  async getClass(id) {
    return db.classes.find(c => c.id === id);
  }

  async deleteClass(id) {
    const index = db.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      db.classes.splice(index, 1);
      db.student_enrollments = db.student_enrollments.filter(e => e.class_id !== id);
      return 1;
    }
    return 0;
  }
}

module.exports = MemoryClassRepository;
