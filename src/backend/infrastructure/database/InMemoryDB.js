const bcrypt = require('bcryptjs');

class InMemoryDB {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = [];
    this.schools = [];
    this.school_memberships = [];
    this.classes = [];
    this.students = [];
    this.student_enrollments = [];
    this.pedagogical_records = [];
    this.topics = [];
    this.skills = [];
    this.questions = [];
    this.assessments = [];
    this.assessment_versions = [];
    this.assessment_questions = [];
    this.bncc_reference = [];
    this.intervention_templates = [];

    // Pre-populate if not running tests
    if (process.env.NODE_ENV !== 'test') {
      const teacherId = 'd3b07384-d113-4ec5-a5d7-0123456789ab';
      const schoolId = 'e4c08384-d113-4ec5-a5d7-0123456789ab';
      const classId = 'f5d09384-d113-4ec5-a5d7-0123456789ab';

      const teacherPasswordHash = bcrypt.hashSync('senha123', 8);

      this.users = [{
        id: teacherId,
        name: 'Prof. Ricardo Oliveira',
        email: 'ricardo@escola.com',
        password_hash: teacherPasswordHash,
        role: 'teacher',
        created_at: new Date()
      }];

      this.schools = [{
        id: schoolId,
        name: 'Escola Municipal de Teste',
        city: 'São Paulo'
      }];

      this.school_memberships = [{
        id: 's1-membership',
        user_id: teacherId,
        school_id: schoolId,
        role_in_school: 'admin'
      }];

      this.classes = [{
        id: classId,
        name: '6º Ano A',
        year_grade: '6º Ano',
        teacher_id: teacherId,
        school_id: schoolId,
        created_at: new Date()
      }];

      this.students = [
        { id: 'student-1', display_name: 'Ana Silva', external_code: 'MAT001', school_id: schoolId, is_active: true },
        { id: 'student-2', display_name: 'Bruno Costa', external_code: 'MAT002', school_id: schoolId, is_active: true },
        { id: 'student-3', display_name: 'Carla Souza', external_code: 'MAT003', school_id: schoolId, is_active: true },
        { id: 'student-4', display_name: 'Daniel Lima', external_code: 'MAT004', school_id: schoolId, is_active: true },
        { id: 'student-5', display_name: 'Eduarda Rocha', external_code: 'MAT005', school_id: schoolId, is_active: true },
        { id: 'student-6', display_name: 'Fabio Junior', external_code: 'MAT006', school_id: schoolId, is_active: true }
      ];

      this.student_enrollments = this.students.map(s => ({
        id: `enroll-${s.id}`,
        student_id: s.id,
        class_id: classId,
        status: 'active',
        start_date: new Date()
      }));

      this.pedagogical_records = [
        {
          id: 'record-1', student_id: 'student-4', class_id: classId,
          topic: 'Frações', category: 'conceitual', importance: 'alta',
          description: 'Não compreende a relação parte-todo.', action_taken: 'Material manipulativo.',
          record_type: 'dificuldade', skill_code: 'EF06MA07', event_date: new Date()
        },
        {
          id: 'record-2', student_id: 'student-4', class_id: classId,
          topic: 'Números Decimais', category: 'conceitual', importance: 'alta',
          description: 'Dificuldade com a vírgula.', action_taken: 'Reforço extra.',
          record_type: 'dificuldade', skill_code: 'EF06MA01', event_date: new Date()
        },
        {
          id: 'record-3', student_id: 'student-1', class_id: classId,
          topic: 'Frações', category: 'operacional', importance: 'media',
          description: 'Erro na simplificação.', action_taken: 'Exercícios de fixação.',
          record_type: 'dificuldade', skill_code: 'EF06MA07', event_date: new Date()
        }
      ];

      this.topics = [{ id: 'topic-1', name: 'Frações' }];
      
      this.skills = [{
        id: 'skill-1',
        code: 'EF06MA07',
        description: 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão.',
        grade_level: '6º Ano'
      }];

      this.bncc_reference = [
        {
          id: 'bncc-1',
          level: 'Fundamental',
          grade: '6º Ano',
          code: 'EF06MA07',
          description: 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão.',
          topic: 'Números'
        },
        {
          id: 'bncc-2',
          level: 'Fundamental',
          grade: '6º Ano',
          code: 'EF06MA01',
          description: 'Resolver e elaborar problemas com números naturais, envolvendo as quatro operações fundamentais.',
          topic: 'Números'
        }
      ];

      this.intervention_templates = [
        {
          id: 'interv-1',
          topic: 'Frações',
          category: 'conceitual',
          skill_code: 'EF06MA07',
          title: 'Uso de Círculos de Frações (Material Concreto)',
          description_plan: 'Trabalhar a representação visual de frações usando círculos ou tiras de papel fracionadas para reforçar o conceito de parte-todo.',
          recommended_resources: 'Círculos de frações impressos, tesoura, lápis de cor.',
          created_at: new Date()
        },
        {
          id: 'interv-2',
          topic: 'Frações',
          category: 'operacional',
          skill_code: 'EF06MA07',
          title: 'Prática de Algoritmo de Multiplicação de Frações',
          description_plan: 'Explicar passo a passo a multiplicação de numeradores e denominadores com exemplos simples e exercícios graduais.',
          recommended_resources: 'Folha de exercícios direcionados de multiplicação de frações.',
          created_at: new Date()
        },
        {
          id: 'interv-3',
          topic: 'Números Decimais',
          category: 'conceitual',
          skill_code: 'EF06MA01',
          title: 'Quadro de Valor Posicional (QVP) com Decimais',
          description_plan: 'Utilizar o quadro valor de lugar para ilustrar a posição dos décimos, centésimos e milésimos à direita da vírgula.',
          recommended_resources: 'Quadro negro ou cartolina com QVP, fichas numéricas.',
          created_at: new Date()
        }
      ];
    }
  }
}

const dbInstance = new InMemoryDB();
module.exports = dbInstance;
