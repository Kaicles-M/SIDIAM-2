const PedagogicalRecordRepository = require('../../domain/repositories/PedagogicalRecordRepository');
const db = require('../database/db');

class KnexPedagogicalRecordRepository extends PedagogicalRecordRepository {
  async createPedagogicalRecord(record) {
    await db('pedagogical_records').insert(record);
    return record;
  }

  async listRecordsByClass(classId) {
    return await db('pedagogical_records')
      .where({ class_id: classId })
      .orderBy('created_at', 'desc');
  }

  async listRecordsByStudent(studentId) {
    return await db('pedagogical_records')
      .where({ student_id: studentId })
      .orderBy('created_at', 'desc');
  }

  async getDashboardStats() {
    const totalStudents = await db('students').count('id as count').first();
    const totalRecords = await db('pedagogical_records').count('id as count').first();

    const criticalStudentsRaw = await db('pedagogical_records')
      .join('students', 'pedagogical_records.student_id', 'students.id')
      .select(
        'students.display_name',
        db.raw("SUM(CASE WHEN importance = 'alta' THEN 3 WHEN importance = 'media' THEN 2 ELSE 1 END) as weight")
      )
      .groupBy('students.id', 'students.display_name')
      .orderBy('weight', 'desc')
      .limit(5);

    const topicStats = await db('pedagogical_records')
      .select('topic')
      .count('id as count')
      .groupBy('topic')
      .orderBy('count', 'desc')
      .limit(10);

    const categoryStats = await db('pedagogical_records')
      .select('category')
      .count('id as count')
      .groupBy('category');

    return {
      totalStudents: parseInt(totalStudents.count) || 0,
      totalRecords: parseInt(totalRecords.count) || 0,
      criticalStudents: criticalStudentsRaw.map(s => ({ name: s.display_name, weight: parseInt(s.weight) || 0 })),
      topicStats: topicStats.map(t => ({ topic: t.topic, count: parseInt(t.count) || 0 })),
      categoryStats: categoryStats.map(c => ({ category: c.category, count: parseInt(c.count) || 0 }))
    };
  }
}

module.exports = KnexPedagogicalRecordRepository;
