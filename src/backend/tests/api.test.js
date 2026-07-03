const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');
const db = require('../infrastructure/database/InMemoryDB');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

describe('SIDIAM API Smoke Tests', () => {
  beforeEach(() => {
    db.reset();
  });

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
    
    expect(userRes.statusCode).toEqual(201);
    const teacherId = userRes.body.id;
    const teacherName = userRes.body.name;
    const teacherRole = userRes.body.role;

    // Gerar token JWT para o professor
    const token = jwt.sign({ id: teacherId, name: teacherName, role: teacherRole }, JWT_SECRET, { expiresIn: '8h' });

    // 2. Criar turma
    const classRes = await request(app)
      .post('/api/classes')
      .send({ name: 'Turma Teste', year_grade: '5 ano', teacher_id: teacherId });
    
    expect(classRes.statusCode).toEqual(201);
    const classId = classRes.body.id;

    // 3. Criar aluno
    const studentRes = await request(app)
      .post('/api/students')
      .send({ display_name: 'Aluno Teste' });
    
    expect(studentRes.statusCode).toEqual(201);
    const studentId = studentRes.body.id;

    // 4. Matricular aluno
    const enrollRes = await request(app)
      .post(`/api/classes/${classId}/enroll`)
      .send({ student_id: studentId });
    expect(enrollRes.statusCode).toEqual(201);

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

  it('should support pedagogical record enhancements and intervention templates', async () => {
    // Create teacher
    const userRes = await request(app)
      .post('/api/users')
      .send({ name: 'Professor Teste Intervenção', email: 'intervention@sidiam.com' });
    const teacherId = userRes.body.id;
    const token = jwt.sign({ id: teacherId, name: userRes.body.name, role: userRes.body.role }, JWT_SECRET, { expiresIn: '8h' });

    // Create class
    const classRes = await request(app)
      .post('/api/classes')
      .send({ name: 'Turma Teste Intervenção', year_grade: '6 ano', teacher_id: teacherId });
    const classId = classRes.body.id;

    // Create student
    const studentRes = await request(app)
      .post('/api/students')
      .send({ display_name: 'Aluno Teste Intervenção' });
    const studentId = studentRes.body.id;

    // Enroll student
    await request(app)
      .post(`/api/classes/${classId}/enroll`)
      .send({ student_id: studentId });

    // Create intervention template
    const templatePayload = {
      topic: 'Frações',
      category: 'conceitual',
      skill_code: 'EF06MA07',
      title: 'Uso de Círculos de Frações',
      description_plan: 'Trabalhar representação visual',
      recommended_resources: 'Papel, tesoura'
    };
    const createTemplateRes = await request(app)
      .post('/api/intervention-templates')
      .set('Authorization', `Bearer ${token}`)
      .send(templatePayload);
    
    expect(createTemplateRes.statusCode).toEqual(201);
    expect(createTemplateRes.body).toHaveProperty('title', 'Uso de Círculos de Frações');
    expect(createTemplateRes.body).toHaveProperty('id');

    // List intervention templates by skill_code
    const listTemplatesRes = await request(app)
      .get('/api/intervention-templates?skill_code=EF06MA07')
      .set('Authorization', `Bearer ${token}`);
    
    expect(listTemplatesRes.statusCode).toEqual(200);
    expect(listTemplatesRes.body.length).toBeGreaterThan(0);
    expect(listTemplatesRes.body[0].skill_code).toBe('EF06MA07');

    // List intervention templates by topic and category
    const listTemplatesRes2 = await request(app)
      .get('/api/intervention-templates?topic=Frações&category=conceitual')
      .set('Authorization', `Bearer ${token}`);
    
    expect(listTemplatesRes2.statusCode).toEqual(200);
    expect(listTemplatesRes2.body.length).toBeGreaterThan(0);
    expect(listTemplatesRes2.body[0].topic).toBe('Frações');

    // Create pedagogical record with enhancements
    const recordPayload = {
      student_id: studentId,
      class_id: classId,
      topic: 'Frações',
      category: 'conceitual',
      importance: 'alta',
      description: 'Dificuldade com representação de frações',
      action_taken: 'Aplicar círculo de frações',
      record_type: 'dificuldade',
      skill_code: 'EF06MA07',
      event_date: new Date().toISOString()
    };

    const recordRes = await request(app)
      .post('/api/pedagogical-records')
      .set('Authorization', `Bearer ${token}`)
      .send(recordPayload);
    
    expect(recordRes.statusCode).toEqual(201);
    expect(recordRes.body).toHaveProperty('record_type', 'dificuldade');
    expect(recordRes.body).toHaveProperty('skill_code', 'EF06MA07');
    expect(recordRes.body).toHaveProperty('event_date');
  });
});
