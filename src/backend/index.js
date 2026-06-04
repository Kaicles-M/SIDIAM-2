const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const models = require('./models');
const { connectMongo } = require('./db_mongo');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize MongoDB
connectMongo();

// Middleware de Autenticação
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'connected' }));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'all fields required' });
  try {
    const existing = await models.findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'email already in use' });
    const user = await models.createUser({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await models.findUserByEmail(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }
  
  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  const user = await models.getUser(req.user.id);
  res.json(user);
});

// Schools
app.get('/api/schools', authenticate, async (req, res) => {
  const schools = await models.listUserSchools(req.user.id);
  res.json(schools);
});

app.post('/api/schools', authenticate, async (req, res) => {
  const { name, city } = req.body;
  const s = await models.createSchool({ name, city });
  await models.addSchoolMembership({ user_id: req.user.id, school_id: s.id, role_in_school: 'admin' });
  res.status(201).json(s);
});

// Users (Professores)
app.get('/api/users', authenticate, async (req, res) => {
  const users = await models.listUsers();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  try {
    const u = await models.createUser({ name, email, role: 'teacher' });
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const u = await models.getUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  res.json(u);
});

// Classes
app.get('/api/classes', async (req, res) => {
  const classes = await models.listClasses();
  res.json(classes);
});

app.post('/api/classes', async (req, res) => {
  const { name, year_grade, teacher_id } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const c = await models.createClass({ name, year_grade, teacher_id });
  res.status(201).json(c);
});

app.get('/api/classes/:id', async (req, res) => {
  const c = await models.getClass(req.params.id);
  if (!c) return res.status(404).json({ error: 'class not found' });
  res.json(c);
});

// Students
app.get('/api/students', async (req, res) => {
  const students = await models.listStudents();
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const { display_name, external_code } = req.body;
  if (!display_name) return res.status(400).json({ error: 'display_name required' });
  const s = await models.createStudent({ display_name, external_code });
  res.status(201).json(s);
});

app.get('/api/students/:id', async (req, res) => {
  const s = await models.getStudent(req.params.id);
  if (!s) return res.status(404).json({ error: 'student not found' });
  res.json(s);
});

// Enrollments
app.post('/api/classes/:classId/enroll', async (req, res) => {
  const { student_id, start_date } = req.body;
  const classId = req.params.classId;
  const e = await models.enrollStudent({ student_id, class_id: classId, start_date });
  res.status(201).json(e);
});

app.get('/api/classes/:classId/students', async (req, res) => {
  const students = await models.listStudentsByClass(req.params.classId);
  res.json(students);
});

// Pedagogical Records
app.post('/api/pedagogical-records', authenticate, async (req, res) => {
  const { student_id, class_id, topic, category, description, importance, action_taken } = req.body;
  if (!student_id || !class_id || !topic || !category) {
    return res.status(400).json({ error: 'student_id, class_id, topic and category are required' });
  }
  const r = await models.createPedagogicalRecord({
    student_id,
    class_id,
    topic,
    category,
    description,
    importance,
    action_taken
  });
  res.status(201).json(r);
});

app.get('/api/classes/:classId/records', authenticate, async (req, res) => {
  const records = await models.listRecordsByClass(req.params.classId);
  res.json(records);
});

app.get('/api/students/:studentId/records', authenticate, async (req, res) => {
  const records = await models.listRecordsByStudent(req.params.studentId);
  res.json(records);
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticate, async (req, res) => {
  try {
    const stats = await models.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Topics
app.get('/api/topics', authenticate, async (req, res) => {
  const topics = await models.listTopics();
  res.json(topics);
});

app.post('/api/topics', authenticate, async (req, res) => {
  const { name, parent_id } = req.body;
  const t = await models.createTopic({ name, parent_id });
  res.status(201).json(t);
});

// Skills
app.get('/api/skills', authenticate, async (req, res) => {
  const skills = await models.listSkills();
  res.json(skills);
});

app.post('/api/skills', authenticate, async (req, res) => {
  const { code, description, grade_level } = req.body;
  const s = await models.createSkill({ code, description, grade_level });
  res.status(201).json(s);
});

// Questions
app.get('/api/questions', authenticate, async (req, res) => {
  const questions = await models.listQuestions();
  res.json(questions);
});

app.post('/api/questions', authenticate, async (req, res) => {
  const q = await models.createQuestion({ ...req.body, created_by: req.user.id });
  res.status(201).json(q);
});

// Assessments
app.get('/api/assessments', authenticate, async (req, res) => {
  const { class_id } = req.query;
  const assessments = await models.listAssessments(class_id);
  res.json(assessments);
});

app.post('/api/assessments', authenticate, async (req, res) => {
  const { class_id, title, date } = req.body;
  const a = await models.createAssessment({ class_id, title, date });
  res.status(201).json(a);
});

app.post('/api/assessments/:id/versions', authenticate, async (req, res) => {
  const { version_label, seed } = req.body;
  const av = await models.createAssessmentVersion({ 
    assessment_id: req.params.id, 
    version_label, 
    seed 
  });
  res.status(201).json(av);
});

app.post('/api/assessment-versions/:id/questions', authenticate, async (req, res) => {
  const { question_id, order_index, mapping } = req.body;
  const aq = await models.addQuestionToAssessment({
    assessment_version_id: req.params.id,
    question_id,
    order_index,
    mapping
  });
  res.status(201).json(aq);
});

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}
