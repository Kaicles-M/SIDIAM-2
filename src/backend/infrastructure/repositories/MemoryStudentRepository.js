const StudentRepository = require('../../domain/repositories/StudentRepository');
const db = require('../database/InMemoryDB');
const { v4: uuidv4 } = require('uuid');

class MemoryStudentRepository extends StudentRepository {
  async listStudents(schoolId) {
    if (schoolId) {
      return db.students.filter(s => s.school_id === schoolId);
    }
    return db.students;
  }

  async createStudent(student) {
    const studentCopy = { ...student, created_at: student.created_at || new Date() };
    db.students.push(studentCopy);
    return studentCopy;
  }

  async getStudent(id) {
    return db.students.find(s => s.id === id);
  }

  async enrollStudent(enrollment) {
    const enrollmentCopy = {
      id: enrollment.id || uuidv4(),
      status: enrollment.status || 'active',
      start_date: enrollment.start_date || new Date(),
      created_at: enrollment.created_at || new Date(),
      ...enrollment
    };
    db.student_enrollments.push(enrollmentCopy);
    return enrollmentCopy;
  }

  async listStudentsByClass(classId) {
    const activeEnrollments = db.student_enrollments.filter(
      e => e.class_id === classId && e.status === 'active'
    );
    return activeEnrollments.map(e => db.students.find(s => s.id === e.student_id)).filter(Boolean);
  }

  async deleteStudent(id) {
    const index = db.students.findIndex(s => s.id === id);
    if (index !== -1) {
      db.students.splice(index, 1);
      db.student_enrollments = db.student_enrollments.filter(e => e.student_id !== id);
      return 1;
    }
    return 0;
  }
}

module.exports = MemoryStudentRepository;
