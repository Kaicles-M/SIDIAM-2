class GetDashboardStatsUseCase {
  constructor(pedagogicalRecordRepository) {
    this.pedagogicalRecordRepository = pedagogicalRecordRepository;
  }

  async execute() {
    return await this.pedagogicalRecordRepository.getDashboardStats();
  }
}

module.exports = GetDashboardStatsUseCase;
