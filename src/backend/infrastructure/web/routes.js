const express = require('express');
const router = express.Router();
const container = require('../container');
const authenticate = require('./middleware/authenticate');

// Controllers
const AuthController = require('./controllers/AuthController');
const SchoolController = require('./controllers/SchoolController');
const UserController = require('./controllers/UserController');
const ClassController = require('./controllers/ClassController');
const StudentController = require('./controllers/StudentController');
const PedagogicalRecordController = require('./controllers/PedagogicalRecordController');
const TopicController = require('./controllers/TopicController');
const SkillController = require('./controllers/SkillController');
const QuestionController = require('./controllers/QuestionController');
const AssessmentController = require('./controllers/AssessmentController');
const BNCCController = require('./controllers/BNCCController');

const authCtrl = new AuthController(
  container.registerUseCase,
  container.loginUseCase,
  container.getMeUseCase
);
const schoolCtrl = new SchoolController(
  container.createSchoolUseCase,
  container.listUserSchoolsUseCase
);
const userCtrl = new UserController(
  container.createUserUseCase,
  container.getUserUseCase,
  container.listUsersUseCase
);
const classCtrl = new ClassController(
  container.createClassUseCase,
  container.getClassUseCase,
  container.listClassesUseCase,
  container.enrollStudentUseCase,
  container.listStudentsByClassUseCase
);
const studentCtrl = new StudentController(
  container.createStudentUseCase,
  container.getStudentUseCase,
  container.listStudentsUseCase
);
const pedagogicalRecordCtrl = new PedagogicalRecordController(
  container.createPedagogicalRecordUseCase,
  container.listRecordsByClassUseCase,
  container.listRecordsByStudentUseCase,
  container.getDashboardStatsUseCase
);
const topicCtrl = new TopicController(
  container.createTopicUseCase,
  container.listTopicsUseCase
);
const skillCtrl = new SkillController(
  container.createSkillUseCase,
  container.listSkillsUseCase
);
const questionCtrl = new QuestionController(
  container.createQuestionUseCase,
  container.listQuestionsUseCase
);
const assessmentCtrl = new AssessmentController(
  container.createAssessmentUseCase,
  container.listAssessmentsUseCase,
  container.createAssessmentVersionUseCase,
  container.addQuestionToAssessmentUseCase
);
const bnccCtrl = new BNCCController(
  container.listBNCCUseCase
);

// Health Check
router.get('/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

// Auth Routes
router.post('/auth/register', (req, res) => authCtrl.register(req, res));
router.post('/auth/login', (req, res) => authCtrl.login(req, res));
router.get('/auth/me', authenticate, (req, res) => authCtrl.me(req, res));

// School Routes
router.get('/schools', authenticate, (req, res) => schoolCtrl.list(req, res));
router.post('/schools', authenticate, (req, res) => schoolCtrl.create(req, res));

// User Routes
router.get('/users', authenticate, (req, res) => userCtrl.list(req, res));
router.post('/users', (req, res) => userCtrl.create(req, res));
router.get('/users/:id', (req, res) => userCtrl.get(req, res));

// Class Routes
router.get('/classes', (req, res) => classCtrl.list(req, res));
router.post('/classes', (req, res) => classCtrl.create(req, res));
router.get('/classes/:id', (req, res) => classCtrl.get(req, res));
router.post('/classes/:classId/enroll', (req, res) => classCtrl.enroll(req, res));
router.get('/classes/:classId/students', (req, res) => classCtrl.listStudents(req, res));

// Student Routes
router.get('/students', (req, res) => studentCtrl.list(req, res));
router.post('/students', (req, res) => studentCtrl.create(req, res));
router.get('/students/:id', (req, res) => studentCtrl.get(req, res));

// Pedagogical Record Routes
router.post('/pedagogical-records', authenticate, (req, res) => pedagogicalRecordCtrl.create(req, res));
router.get('/classes/:classId/records', authenticate, (req, res) => pedagogicalRecordCtrl.listByClass(req, res));
router.get('/students/:studentId/records', authenticate, (req, res) => pedagogicalRecordCtrl.listByStudent(req, res));
router.get('/dashboard/stats', authenticate, (req, res) => pedagogicalRecordCtrl.getDashboardStats(req, res));

// Topic Routes
router.get('/topics', authenticate, (req, res) => topicCtrl.list(req, res));
router.post('/topics', authenticate, (req, res) => topicCtrl.create(req, res));

// Skill Routes
router.get('/skills', authenticate, (req, res) => skillCtrl.list(req, res));
router.post('/skills', authenticate, (req, res) => skillCtrl.create(req, res));

// Question Routes
router.get('/questions', authenticate, (req, res) => questionCtrl.list(req, res));
router.post('/questions', authenticate, (req, res) => questionCtrl.create(req, res));

// Assessment Routes
router.get('/assessments', authenticate, (req, res) => assessmentCtrl.list(req, res));
router.post('/assessments', authenticate, (req, res) => assessmentCtrl.create(req, res));
router.post('/assessments/:id/versions', authenticate, (req, res) => assessmentCtrl.createVersion(req, res));
router.post('/assessment-versions/:id/questions', authenticate, (req, res) => assessmentCtrl.addQuestion(req, res));

// BNCC Routes
router.get('/bncc', authenticate, (req, res) => bnccCtrl.list(req, res));

module.exports = router;
