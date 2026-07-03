const StudentRepository = require('../../domain/repositories/StudentRepository');
const db = require('../database/db');

class KnexStudentRepository extends StudentRepository {
  async listStudents(schoolId) {
    const query = db('students').select('*');
    if (schoolId) query.where({ school_id: schoolId });
    return await query;
  }

  async createStudent(student) {
    await db('students').insert(student);
    return student;
  }

  async getStudent(id) {
    return await db('students').where({ id }).first();
  }

  async enrollStudent(enrollment) {
    await db('student_enrollments').insert(enrollment);
    return enrollment;
  }

  async listStudentsByClass(classId) {
    return await db('students')
      .join('student_enrollments', 'students.id', 'student_enrollments.student_id')
      .where('student_enrollments.class_id', classId)
      .andWhere('student_enrollments.status', 'active')
      .select('students.*');
  }

  async deleteStudent(id) {
    return await db('students').where({ id }).del();
  }
}

module.exports = KnexStudentRepository;
