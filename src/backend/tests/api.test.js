const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

describe('SIDIAM API Smoke Tests', () => {
  it('should return health status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should create and list pedagogical records', async () => {
    // 1. Criar professor
    const userRes = await request(app)
      .post('/api/users')
      .send({ name: 'Professor Teste', email: 'test@sidiam.com' });
    const teacherId = userRes.body.id;
    const teacherName = userRes.body.name;
    const teacherRole = userRes.body.role;

    // Gerar token JWT para o professor
    const token = jwt.sign({ id: teacherId, name: teacherName, role: teacherRole }, JWT_SECRET, { expiresIn: '8h' });

    // 2. Criar turma
    const classRes = await request(app)
      .post('/api/classes')
      .send({ name: 'Turma Teste', year_grade: '5 ano', teacher_id: teacherId });
    const classId = classRes.body.id;

    // 3. Criar aluno
    const studentRes = await request(app)
      .post('/api/students')
      .send({ display_name: 'Aluno Teste' });
    const studentId = studentRes.body.id;

    // 4. Matricular aluno
    await request(app)
      .post(`/api/classes/${classId}/enroll`)
      .send({ student_id: studentId });

    // 5. Criar registro pedagógico
    const recordPayload = {
      student_id: studentId,
      class_id: classId,
      topic: 'Matemática Básica',
      category: 'operacional',
      importance: 'alta',
      description: 'Dificuldade em somas simples',
      action_taken: 'Reforço individual'
    };
    const recordRes = await request(app)
      .post('/api/pedagogical-records')
      .set('Authorization', `Bearer ${token}`)
      .send(recordPayload);
    
    expect(recordRes.statusCode).toEqual(201);
    expect(recordRes.body).toHaveProperty('topic', 'Matemática Básica');

    // 6. Listar registros por turma
    const listRes = await request(app)
      .get(`/api/classes/${classId}/records`)
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.statusCode).toEqual(200);
    expect(listRes.body.length).toBeGreaterThan(0);
    expect(listRes.body[0].student_id).toBe(studentId);
  });
});
