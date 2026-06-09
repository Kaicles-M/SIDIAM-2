class GetClassUseCase {
  constructor(classRepository) {
    this.classRepository = classRepository;
  }

  async execute(id) {
    const c = await this.classRepository.getClass(id);
    if (!c) {
      const err = new Error('class not found');
      err.statusCode = 404;
      throw err;
    }
    return c;
  }
}

module.exports = GetClassUseCase;
