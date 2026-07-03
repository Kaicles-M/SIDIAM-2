class DeleteClassUseCase {
  constructor(classRepository) {
    this.classRepository = classRepository;
  }

  async execute(id) {
    if (!id) {
      const err = new Error('class id required');
      err.statusCode = 400;
      throw err;
    }

    const deletedCount = await this.classRepository.deleteClass(id);
    if (!deletedCount) {
      const err = new Error('class not found');
      err.statusCode = 404;
      throw err;
    }

    return { success: true };
  }
}

module.exports = DeleteClassUseCase;
