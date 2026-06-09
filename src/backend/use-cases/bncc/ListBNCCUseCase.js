class ListBNCCUseCase {
  constructor(bnccRepository) {
    this.bnccRepository = bnccRepository;
  }

  async execute(level, grade) {
    return await this.bnccRepository.listBNCC(level, grade);
  }
}

module.exports = ListBNCCUseCase;
