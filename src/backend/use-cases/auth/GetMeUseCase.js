class GetMeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.getUser(userId);
    if (!user) {
      const err = new Error('user not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = GetMeUseCase;
