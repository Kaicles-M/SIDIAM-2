const KnexUserRepository = require('./repositories/KnexUserRepository');
const KnexSchoolRepository = require('./repositories/KnexSchoolRepository');
const KnexClassRepository = require('./repositories/KnexClassRepository');
const KnexStudentRepository = require('./repositories/KnexStudentRepository');
const KnexPedagogicalRecordRepository = require('./repositories/KnexPedagogicalRecordRepository');
const KnexTopicRepository = require('./repositories/KnexTopicRepository');
const KnexSkillRepository = require('./repositories/KnexSkillRepository');
const KnexQuestionRepository = require('./repositories/KnexQuestionRepository');
const KnexAssessmentRepository = require('./repositories/KnexAssessmentRepository');
const KnexBNCCRepository = require('./repositories/KnexBNCCRepository');
const KnexInterventionRepository = require('./repositories/KnexInterventionRepository');

const MemoryUserRepository = require('./repositories/MemoryUserRepository');
const MemorySchoolRepository = require('./repositories/MemorySchoolRepository');
const MemoryClassRepository = require('./repositories/MemoryClassRepository');
const MemoryStudentRepository = require('./repositories/MemoryStudentRepository');
const MemoryPedagogicalRecordRepository = require('./repositories/MemoryPedagogicalRecordRepository');
const MemoryTopicRepository = require('./repositories/MemoryTopicRepository');
const MemorySkillRepository = require('./repositories/MemorySkillRepository');
const MemoryQuestionRepository = require('./repositories/MemoryQuestionRepository');
const MemoryAssessmentRepository = require('./repositories/MemoryAssessmentRepository');
const MemoryBNCCRepository = require('./repositories/MemoryBNCCRepository');
const MemoryInterventionRepository = require('./repositories/MemoryInterventionRepository');

const RegisterUseCase = require('../use-cases/auth/RegisterUseCase');
const LoginUseCase = require('../use-cases/auth/LoginUseCase');
const GetMeUseCase = require('../use-cases/auth/GetMeUseCase');

const CreateSchoolUseCase = require('../use-cases/school/CreateSchoolUseCase');
const ListUserSchoolsUseCase = require('../use-cases/school/ListUserSchoolsUseCase');
const DeleteSchoolUseCase = require('../use-cases/school/DeleteSchoolUseCase');

const CreateUserUseCase = require('../use-cases/user/CreateUserUseCase');
const GetUserUseCase = require('../use-cases/user/GetUserUseCase');
const ListUsersUseCase = require('../use-cases/user/ListUsersUseCase');

const CreateClassUseCase = require('../use-cases/class/CreateClassUseCase');
const GetClassUseCase = require('../use-cases/class/GetClassUseCase');
const ListClassesUseCase = require('../use-cases/class/ListClassesUseCase');
const DeleteClassUseCase = require('../use-cases/class/DeleteClassUseCase');
const EnrollStudentUseCase = require('../use-cases/class/EnrollStudentUseCase');
const ListStudentsByClassUseCase = require('../use-cases/class/ListStudentsByClassUseCase');

const CreateStudentUseCase = require('../use-cases/student/CreateStudentUseCase');
const GetStudentUseCase = require('../use-cases/student/GetStudentUseCase');
const ListStudentsUseCase = require('../use-cases/student/ListStudentsUseCase');
const DeleteStudentUseCase = require('../use-cases/student/DeleteStudentUseCase');

const CreatePedagogicalRecordUseCase = require('../use-cases/pedagogical-record/CreatePedagogicalRecordUseCase');
const ListRecordsByClassUseCase = require('../use-cases/pedagogical-record/ListRecordsByClassUseCase');
const ListRecordsByStudentUseCase = require('../use-cases/pedagogical-record/ListRecordsByStudentUseCase');
const GetDashboardStatsUseCase = require('../use-cases/pedagogical-record/GetDashboardStatsUseCase');

const CreateTopicUseCase = require('../use-cases/topic/CreateTopicUseCase');
const ListTopicsUseCase = require('../use-cases/topic/ListTopicsUseCase');

const CreateSkillUseCase = require('../use-cases/skill/CreateSkillUseCase');
const ListSkillsUseCase = require('../use-cases/skill/ListSkillsUseCase');

const CreateQuestionUseCase = require('../use-cases/question/CreateQuestionUseCase');
const ListQuestionsUseCase = require('../use-cases/question/ListQuestionsUseCase');

const CreateAssessmentUseCase = require('../use-cases/assessment/CreateAssessmentUseCase');
const ListAssessmentsUseCase = require('../use-cases/assessment/ListAssessmentsUseCase');
const CreateAssessmentVersionUseCase = require('../use-cases/assessment/CreateAssessmentVersionUseCase');
const AddQuestionToAssessmentUseCase = require('../use-cases/assessment/AddQuestionToAssessmentUseCase');

const CreateBNCCEntryUseCase = require('../use-cases/bncc/CreateBNCCEntryUseCase');
const ListBNCCUseCase = require('../use-cases/bncc/ListBNCCUseCase');

const CreateInterventionTemplateUseCase = require('../use-cases/intervention/CreateInterventionTemplateUseCase');
const ListInterventionTemplatesUseCase = require('../use-cases/intervention/ListInterventionTemplatesUseCase');

// Instantiate Repositories
const useKnex = process.env.PERSISTENCE_TYPE === 'knex' || process.env.PERSISTENCE_TYPE === 'postgres';

const userRepository = useKnex ? new KnexUserRepository() : new MemoryUserRepository();
const schoolRepository = useKnex ? new KnexSchoolRepository() : new MemorySchoolRepository();
const classRepository = useKnex ? new KnexClassRepository() : new MemoryClassRepository();
const studentRepository = useKnex ? new KnexStudentRepository() : new MemoryStudentRepository();
const pedagogicalRecordRepository = useKnex ? new KnexPedagogicalRecordRepository() : new MemoryPedagogicalRecordRepository();
const topicRepository = useKnex ? new KnexTopicRepository() : new MemoryTopicRepository();
const skillRepository = useKnex ? new KnexSkillRepository() : new MemorySkillRepository();
const questionRepository = useKnex ? new KnexQuestionRepository() : new MemoryQuestionRepository();
const assessmentRepository = useKnex ? new KnexAssessmentRepository() : new MemoryAssessmentRepository();
const bnccRepository = useKnex ? new KnexBNCCRepository() : new MemoryBNCCRepository();
const interventionRepository = useKnex ? new KnexInterventionRepository() : new MemoryInterventionRepository();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = {
  // Auth
  registerUseCase: new RegisterUseCase(userRepository),
  loginUseCase: new LoginUseCase(userRepository, JWT_SECRET),
  getMeUseCase: new GetMeUseCase(userRepository),

  // School
  createSchoolUseCase: new CreateSchoolUseCase(schoolRepository),
  listUserSchoolsUseCase: new ListUserSchoolsUseCase(schoolRepository),
  deleteSchoolUseCase: new DeleteSchoolUseCase(schoolRepository),

  // User
  createUserUseCase: new CreateUserUseCase(userRepository),
  getUserUseCase: new GetUserUseCase(userRepository),
  listUsersUseCase: new ListUsersUseCase(userRepository),

  // Class
  createClassUseCase: new CreateClassUseCase(classRepository),
  getClassUseCase: new GetClassUseCase(classRepository),
  listClassesUseCase: new ListClassesUseCase(classRepository),
  deleteClassUseCase: new DeleteClassUseCase(classRepository),
  enrollStudentUseCase: new EnrollStudentUseCase(studentRepository),
  listStudentsByClassUseCase: new ListStudentsByClassUseCase(studentRepository),

  // Student
  createStudentUseCase: new CreateStudentUseCase(studentRepository),
  getStudentUseCase: new GetStudentUseCase(studentRepository),
  listStudentsUseCase: new ListStudentsUseCase(studentRepository),
  deleteStudentUseCase: new DeleteStudentUseCase(studentRepository),

  // Pedagogical Record
  createPedagogicalRecordUseCase: new CreatePedagogicalRecordUseCase(pedagogicalRecordRepository),
  listRecordsByClassUseCase: new ListRecordsByClassUseCase(pedagogicalRecordRepository),
  listRecordsByStudentUseCase: new ListRecordsByStudentUseCase(pedagogicalRecordRepository),
  getDashboardStatsUseCase: new GetDashboardStatsUseCase(pedagogicalRecordRepository),

  // Topic
  createTopicUseCase: new CreateTopicUseCase(topicRepository),
  listTopicsUseCase: new ListTopicsUseCase(topicRepository),

  // Skill
  createSkillUseCase: new CreateSkillUseCase(skillRepository),
  listSkillsUseCase: new ListSkillsUseCase(skillRepository),

  // Question
  createQuestionUseCase: new CreateQuestionUseCase(questionRepository),
  listQuestionsUseCase: new ListQuestionsUseCase(questionRepository),

  // Assessment
  createAssessmentUseCase: new CreateAssessmentUseCase(assessmentRepository),
  listAssessmentsUseCase: new ListAssessmentsUseCase(assessmentRepository),
  createAssessmentVersionUseCase: new CreateAssessmentVersionUseCase(assessmentRepository),
  addQuestionToAssessmentUseCase: new AddQuestionToAssessmentUseCase(assessmentRepository),

  // BNCC
  createBNCCEntryUseCase: new CreateBNCCEntryUseCase(bnccRepository),
  listBNCCUseCase: new ListBNCCUseCase(bnccRepository),

  // Intervention Templates
  createInterventionTemplateUseCase: new CreateInterventionTemplateUseCase(interventionRepository),
  listInterventionTemplatesUseCase: new ListInterventionTemplatesUseCase(interventionRepository)
};
