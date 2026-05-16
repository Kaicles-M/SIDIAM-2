const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Users (Professores)
app.get('/api/users', (req, res) => res.json(models.listUsers()));

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const u = models.createUser({ name, email, role: 'teacher' });
  res.status(201).json(u);
});

app.get('/api/users/:id', (req, res) => {
  const u = models.getUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  res.json(u);
});

// Classes
app.get('/api/classes', (req, res) => res.json(models.listClasses()));

app.post('/api/classes', (req, res) => {
  const { name, year_grade, teacher_id } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const c = models.createClass({ name, year_grade, teacher_id });
  res.status(201).json(c);
});

app.get('/api/classes/:id', (req, res) => {
  const c = models.getClass(req.params.id);
  if (!c) return res.status(404).json({ error: 'class not found' });
  res.json(c);
});

// Students
app.get('/api/students', (req, res) => res.json(models.listStudents()));

app.post('/api/students', (req, res) => {
  const { display_name, external_code } = req.body;
  if (!display_name) return res.status(400).json({ error: 'display_name required' });
  const s = models.createStudent({ display_name, external_code });
  res.status(201).json(s);
});

app.get('/api/students/:id', (req, res) => {
  const s = models.getStudent(req.params.id);
  if (!s) return res.status(404).json({ error: 'student not found' });
  res.json(s);
});

// Enrollments: enroll a student into a class
app.post('/api/classes/:classId/enroll', (req, res) => {
  const { student_id, start_date } = req.body;
  const classId = req.params.classId;
  const klass = models.getClass(classId);
  const student = models.getStudent(student_id);
  if (!klass) return res.status(404).json({ error: 'class not found' });
  if (!student) return res.status(404).json({ error: 'student not found' });
  const e = models.enrollStudent({ student_id, class_id: classId, start_date });
  res.status(201).json(e);
});

// List active students in a class
app.get('/api/classes/:classId/students', (req, res) => {
  const classId = req.params.classId;
  const klass = models.getClass(classId);
  if (!klass) return res.status(404).json({ error: 'class not found' });
  const enrollments = models.listEnrollmentsByClass(classId);
  const students = enrollments.map((e) => models.getStudent(e.student_id)).filter(Boolean);
  res.json(students);
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
