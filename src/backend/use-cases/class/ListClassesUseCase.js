class ListClassesUseCase {
  constructor(classRepository) {
    this.classRepository = classRepository;
  }

  async execute(schoolId) {
    return await this.classRepository.listClasses(schoolId);
  }
}

module.exports = ListClassesUseCase;
