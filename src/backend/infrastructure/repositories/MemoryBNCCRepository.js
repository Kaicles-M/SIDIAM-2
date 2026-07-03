const BNCCRepository = require('../../domain/repositories/BNCCRepository');
const db = require('../database/InMemoryDB');

class MemoryBNCCRepository extends BNCCRepository {
  async listBNCC(level, grade) {
    let result = [...db.bncc_reference];
    if (level) {
      result = result.filter(e => e.level === level);
    }
    if (grade) {
      result = result.filter(e => e.grade === grade);
    }
    return result.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  }

  async createBNCCEntry(entry) {
    const entryCopy = { ...entry, created_at: entry.created_at || new Date() };
    db.bncc_reference.push(entryCopy);
    return entryCopy;
  }
}

module.exports = MemoryBNCCRepository;
