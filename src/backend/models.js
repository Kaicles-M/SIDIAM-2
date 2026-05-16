const { v4: uuidv4 } = require('uuid');

const users = [];
const classes = [];
const students = [];
const studentEnrollments = [];

function listUsers() {
  return users;
}

function createUser({ name, email, role = 'teacher' }) {
  const u = { id: uuidv4(), name, email, role, created_at: new Date().toISOString() };
  users.push(u);
  return u;
}

function getUser(id) {
  return users.find((u) => u.id === id) || null;
}

function listClasses() {
  return classes;
}

function createClass({ name, year_grade, teacher_id }) {
  const c = { id: uuidv4(), name, year_grade, teacher_id: teacher_id || null, created_at: new Date().toISOString() };
  classes.push(c);
  return c;
}

function getClass(id) {
  return classes.find((c) => c.id === id) || null;
}

function listStudents() {
  return students;
}

function createStudent({ display_name, external_code = null, is_active = true }) {
  const s = { id: uuidv4(), display_name, external_code, is_active, created_at: new Date().toISOString() };
  students.push(s);
  return s;
}

function getStudent(id) {
  return students.find((s) => s.id === id) || null;
}

function enrollStudent({ student_id, class_id, start_date = null, end_date = null, status = 'active' }) {
  const e = { id: uuidv4(), student_id, class_id, start_date: start_date || new Date().toISOString(), end_date, status, created_at: new Date().toISOString() };
  studentEnrollments.push(e);
  return e;
}

function listEnrollmentsByClass(class_id) {
  return studentEnrollments.filter((e) => e.class_id === class_id && e.status === 'active' && !e.end_date);
}

function listEnrollmentsByStudent(student_id) {
  return studentEnrollments.filter((e) => e.student_id === student_id);
}

module.exports = {
  listUsers,
  createUser,
  getUser,
  listClasses,
  createClass,
  getClass,
  listStudents,
  createStudent,
  getStudent,
  enrollStudent,
  listEnrollmentsByClass,
  listEnrollmentsByStudent
};
