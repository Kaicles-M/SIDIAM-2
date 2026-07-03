const PedagogicalRecordRepository = require('../../domain/repositories/PedagogicalRecordRepository');
const db = require('../database/InMemoryDB');

class MemoryPedagogicalRecordRepository extends PedagogicalRecordRepository {
  async createPedagogicalRecord(record) {
    const recordCopy = { ...record, created_at: record.created_at || new Date() };
    db.pedagogical_records.push(recordCopy);
    return recordCopy;
  }

  async listRecordsByClass(classId) {
    return db.pedagogical_records
      .filter(r => r.class_id === classId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async listRecordsByStudent(studentId) {
    return db.pedagogical_records
      .filter(r => r.student_id === studentId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async getDashboardStats() {
    const totalStudents = db.students.length;
    const totalRecords = db.pedagogical_records.length;

    const studentWeights = {};
    for (const record of db.pedagogical_records) {
      const student = db.students.find(s => s.id === record.student_id);
      if (!student) continue;
      const weight = record.importance === 'alta' ? 3 : record.importance === 'media' ? 2 : 1;
      if (!studentWeights[student.id]) {
        studentWeights[student.id] = { name: student.display_name, weight: 0 };
      }
      studentWeights[student.id].weight += weight;
    }

    const criticalStudents = Object.values(studentWeights)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    const topicsMap = {};
    for (const record of db.pedagogical_records) {
      topicsMap[record.topic] = (topicsMap[record.topic] || 0) + 1;
    }
    const topicStats = Object.entries(topicsMap)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const categoriesMap = {};
    for (const record of db.pedagogical_records) {
      categoriesMap[record.category] = (categoriesMap[record.category] || 0) + 1;
    }
    const categoryStats = Object.entries(categoriesMap).map(([category, count]) => ({
      category,
      count
    }));

    return {
      totalStudents,
      totalRecords,
      criticalStudents,
      topicStats,
      categoryStats
    };
  }
}

module.exports = MemoryPedagogicalRecordRepository;
