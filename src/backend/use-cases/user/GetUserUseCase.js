class GetUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      const err = new Error('user not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = GetUserUseCase;
