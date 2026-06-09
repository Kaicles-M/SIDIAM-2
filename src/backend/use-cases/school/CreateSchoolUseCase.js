const { v4: uuidv4 } = require('uuid');

class CreateSchoolUseCase {
  constructor(schoolRepository) {
    this.schoolRepository = schoolRepository;
  }

  async execute({ name, city, userId }) {
    const s = {
      id: uuidv4(),
      name,
      city
    };
    const school = await this.schoolRepository.createSchool(s);
    await this.schoolRepository.addSchoolMembership({
      id: uuidv4(),
      user_id: userId,
      school_id: school.id,
      role_in_school: 'admin'
    });
    return school;
  }
}

module.exports = CreateSchoolUseCase;
