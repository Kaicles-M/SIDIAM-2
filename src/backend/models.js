const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const bcrypt = require('bcryptjs');

async function listUsers() {
  return await db('users').select('id', 'name', 'email', 'role', 'created_at');
}

async function createUser({ name, email, password, role = 'teacher' }) {
  const password_hash = await bcrypt.hash(password, 10);
  const u = { id: uuidv4(), name, email, password_hash, role };
  await db('users').insert(u);
  const { password_hash: _, ...userWithoutPassword } = u;
  return userWithoutPassword;
}

async function findUserByEmail(email) {
  return await db('users').where({ email }).first();
}

async function getUser(id) {
  return await db('users').where({ id }).select('id', 'name', 'email', 'role', 'created_at').first();
}

// Schools
async function createSchool({ name, city }) {
  const s = { id: uuidv4(), name, city };
  await db('schools').insert(s);
  return s;
}

async function listSchools() {
  return await db('schools').select('*');
}

async function addSchoolMembership({ user_id, school_id, role_in_school = 'teacher' }) {
  const m = { id: uuidv4(), user_id, school_id, role_in_school };
  await db('school_memberships').insert(m);
  return m;
}

async function listUserSchools(user_id) {
  return await db('schools')
    .join('school_memberships', 'schools.id', 'school_memberships.school_id')
    .where('school_memberships.user_id', user_id)
    .select('schools.*', 'school_memberships.role_in_school');
}

async function listClasses(school_id) {
  const query = db('classes').select('*');
  if (school_id) query.where({ school_id });
  return await query;
}

async function createClass({ name, year_grade, teacher_id, school_id = null }) {
  const c = { id: uuidv4(), name, year_grade, teacher_id: teacher_id || null, school_id };
  await db('classes').insert(c);
  return c;
}

async function getClass(id) {
  return await db('classes').where({ id }).first();
}

async function listStudents(school_id) {
  const query = db('students').select('*');
  if (school_id) query.where({ school_id });
  return await query;
}

async function createStudent({ display_name, school_id = null, external_code = null, is_active = true }) {
  const s = { id: uuidv4(), display_name, school_id, external_code, is_active };
  await db('students').insert(s);
  return s;
}

async function getStudent(id) {
  return await db('students').where({ id }).first();
}

async function enrollStudent({ student_id, class_id, start_date = null, status = 'active' }) {
  const e = { 
    id: uuidv4(), 
    student_id, 
    class_id, 
    start_date: start_date || new Date().toISOString(), 
    status 
  };
  await db('student_enrollments').insert(e);
  return e;
}

async function listStudentsByClass(class_id) {
  return await db('students')
    .join('student_enrollments', 'students.id', 'student_enrollments.student_id')
    .where('student_enrollments.class_id', class_id)
    .andWhere('student_enrollments.status', 'active')
    .select('students.*');
}

async function createPedagogicalRecord({ student_id, class_id, topic, category, description, importance, action_taken }) {
  const r = {
    id: uuidv4(),
    student_id,
    class_id,
    topic,
    category,
    description,
    importance,
    action_taken
  };
  await db('pedagogical_records').insert(r);
  return r;
}

async function listRecordsByClass(class_id) {
  return await db('pedagogical_records').where({ class_id }).orderBy('created_at', 'desc');
}

async function listRecordsByStudent(student_id) {
  return await db('pedagogical_records').where({ student_id }).orderBy('created_at', 'desc');
}

async function getDashboardStats() {
  const totalStudents = await db('students').count('id as count').first();
  const totalRecords = await db('pedagogical_records').count('id as count').first();

  // Alunos críticos: Alunos com mais registros, ponderados por importância (alta=3, media=2, baixa=1)
  const criticalStudentsRaw = await db('pedagogical_records')
    .join('students', 'pedagogical_records.student_id', 'students.id')
    .select(
      'students.display_name',
      db.raw("SUM(CASE WHEN importance = 'alta' THEN 3 WHEN importance = 'media' THEN 2 ELSE 1 END) as weight")
    )
    .groupBy('students.id', 'students.display_name')
    .orderBy('weight', 'desc')
    .limit(5);

  // Estatísticas por tópico
  const topicStats = await db('pedagogical_records')
    .select('topic')
    .count('id as count')
    .groupBy('topic')
    .orderBy('count', 'desc')
    .limit(10);

  // Estatísticas por categoria
  const categoryStats = await db('pedagogical_records')
    .select('category')
    .count('id as count')
    .groupBy('category');

  return {
    totalStudents: parseInt(totalStudents.count),
    totalRecords: parseInt(totalRecords.count),
    criticalStudents: criticalStudentsRaw.map(s => ({ name: s.display_name, weight: parseInt(s.weight) })),
    topicStats: topicStats.map(t => ({ topic: t.topic, count: parseInt(t.count) })),
    categoryStats: categoryStats.map(c => ({ category: c.category, count: parseInt(c.count) }))
  };
}

// Topics
async function listTopics() {
  return await db('topics').select('*');
}

async function createTopic({ name, parent_id = null }) {
  const t = { id: uuidv4(), name, parent_id };
  await db('topics').insert(t);
  return t;
}

// Skills
async function listSkills() {
  return await db('skills').select('*');
}

async function createSkill({ code, description, grade_level = null }) {
  const s = { id: uuidv4(), code, description, grade_level };
  await db('skills').insert(s);
  return s;
}

// Questions
async function listQuestions() {
  return await db('questions').select('*');
}

async function createQuestion(qData) {
  const q = { 
    id: uuidv4(), 
    ...qData,
    created_at: new Date()
  };
  await db('questions').insert(q);
  return q;
}

// Assessments
async function listAssessments(class_id) {
  const query = db('assessments').select('*');
  if (class_id) query.where({ class_id });
  return await query;
}

async function createAssessment({ class_id, title, date, status = 'draft' }) {
  const a = { id: uuidv4(), class_id, title, date, status };
  await db('assessments').insert(a);
  return a;
}

async function createAssessmentVersion({ assessment_id, version_label, seed = null }) {
  const av = { id: uuidv4(), assessment_id, version_label, seed };
  await db('assessment_versions').insert(av);
  return av;
}

async function addQuestionToAssessment({ assessment_version_id, question_id, order_index, mapping = null }) {
  const aq = { id: uuidv4(), assessment_version_id, question_id, order_index, mapping };
  await db('assessment_questions').insert(aq);
  return aq;
}

module.exports = {
  listUsers,
  createUser,
  findUserByEmail,
  getUser,
  createSchool,
  listSchools,
  addSchoolMembership,
  listUserSchools,
  listClasses,
  createClass,
  getClass,
  listStudents,
  createStudent,
  getStudent,
  enrollStudent,
  listStudentsByClass,
  createPedagogicalRecord,
  listRecordsByClass,
  listRecordsByStudent,
  getDashboardStats,
  listTopics,
  createTopic,
  listSkills,
  createSkill,
  listQuestions,
  createQuestion,
  listAssessments,
  createAssessment,
  createAssessmentVersion,
  addQuestionToAssessment
};
