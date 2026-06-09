const { v4: uuidv4 } = require('uuid');

class CreateBNCCEntryUseCase {
  constructor(bnccRepository) {
    this.bnccRepository = bnccRepository;
  }

  async execute(data) {
    const entry = {
      id: uuidv4(),
      ...data
    };
    return await this.bnccRepository.createBNCCEntry(entry);
  }
}

module.exports = CreateBNCCEntryUseCase;
