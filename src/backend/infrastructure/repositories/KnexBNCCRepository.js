const BNCCRepository = require('../../domain/repositories/BNCCRepository');
const db = require('../database/db');

class KnexBNCCRepository extends BNCCRepository {
  async listBNCC(level, grade) {
    const query = db('bncc_reference').select('*').orderBy('code', 'asc');
    if (level) query.where({ level });
    if (grade) query.where({ grade });
    return await query;
  }

  async createBNCCEntry(entry) {
    await db('bncc_reference').insert(entry);
    return entry;
  }
}

module.exports = KnexBNCCRepository;
