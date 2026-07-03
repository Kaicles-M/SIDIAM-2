const db = require('./src/backend/infrastructure/database/db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  console.log('Iniciando semeio de dados para teste...');

  try {
    // 1. Limpar dados existentes (opcional, cuidado em prod)
    await db('assessment_questions').del();
    await db('assessment_versions').del();
    await db('assessments').del();
    await db('question_skills').del();
    await db('questions').del();
    await db('skills').del();
    await db('topics').del();
    await db('pedagogical_records').del();
    await db('student_enrollments').del();
    await db('students').del();
    await db('classes').del();
    await db('users').del();
    await db('intervention_templates').del();
    await db('bncc_reference').del();

    // 2. Criar Professor com Senha
    const teacherId = uuidv4();
    const passwordHash = await require('bcryptjs').hash('senha123', 10);
    await db('users').insert({
      id: teacherId,
      name: 'Prof. Ricardo Oliveira',
      email: 'ricardo@escola.com',
      password_hash: passwordHash,
      role: 'teacher'
    });

    // 2.1 Criar Escola e Vínculo
    const schoolId = uuidv4();
    await db('schools').insert({
      id: schoolId,
      name: 'Escola Municipal de Teste',
      city: 'São Paulo'
    });

    await db('school_memberships').insert({
      id: uuidv4(),
      user_id: teacherId,
      school_id: schoolId,
      role_in_school: 'admin'
    });

    // 3. Criar Turmas vinculadas à Escola
    const class6AId = uuidv4();
    const class6BId = uuidv4();
    await db('classes').insert([
      { id: class6AId, name: '6º Ano A', year_grade: '6º Ano', teacher_id: teacherId, school_id: schoolId },
      { id: class6BId, name: '6º Ano B', year_grade: '6º Ano', teacher_id: teacherId, school_id: schoolId }
    ]);

    // 4. Criar Alunos vinculados à Escola
    const studentsData = [
      { id: uuidv4(), display_name: 'Ana Silva', external_code: 'MAT001', school_id: schoolId },
      { id: uuidv4(), display_name: 'Bruno Costa', external_code: 'MAT002', school_id: schoolId },
      { id: uuidv4(), display_name: 'Carla Souza', external_code: 'MAT003', school_id: schoolId },
      { id: uuidv4(), display_name: 'Daniel Lima', external_code: 'MAT004', school_id: schoolId },
      { id: uuidv4(), display_name: 'Eduarda Rocha', external_code: 'MAT005', school_id: schoolId },
      { id: uuidv4(), display_name: 'Fabio Junior', external_code: 'MAT006', school_id: schoolId }
    ];
    await db('students').insert(studentsData);

    // 5. Matricular Alunos na 6A
    for (const student of studentsData) {
      await db('student_enrollments').insert({
        id: uuidv4(),
        student_id: student.id,
        class_id: class6AId,
        status: 'active'
      });
    }

    // 6. Criar Registros Pedagógicos (Cenário de Teste)
    const records = [
      // Aluno Crítico 1: Daniel Lima (Muitos erros conceituais e alta importância)
      {
        id: uuidv4(), student_id: studentsData[3].id, class_id: class6AId,
        topic: 'Frações', category: 'conceitual', importance: 'alta',
        description: 'Não compreende a relação parte-todo.', action_taken: 'Material manipulativo.'
      },
      {
        id: uuidv4(), student_id: studentsData[3].id, class_id: class6AId,
        topic: 'Números Decimais', category: 'conceitual', importance: 'alta',
        description: 'Dificuldade com a vírgula.', action_taken: 'Reforço extra.'
      },
      // Aluno Crítico 2: Ana Silva
      {
        id: uuidv4(), student_id: studentsData[0].id, class_id: class6AId,
        topic: 'Frações', category: 'operacional', importance: 'media',
        description: 'Erro na simplificação.', action_taken: 'Exercícios de fixação.'
      },
      // Tópico Crítico: Frações (3 registros)
      {
        id: uuidv4(), student_id: studentsData[1].id, class_id: class6AId,
        topic: 'Frações', category: 'interpretativo', importance: 'baixa',
        description: 'Dificuldade em ler o enunciado.', action_taken: 'Leitura dirigida.'
      },
      // Categoria: Estratégico
      {
        id: uuidv4(), student_id: studentsData[4].id, class_id: class6AId,
        topic: 'Geometria', category: 'estrategico', importance: 'media',
        description: 'Não soube escolher a fórmula.', action_taken: 'Dica de estudo.'
      }
    ];
    await db('pedagogical_records').insert(records);

    // 7. Criar Tópicos e Habilidades
    const topicId = uuidv4();
    await db('topics').insert({ id: topicId, name: 'Frações' });

    const skillId = uuidv4();
    await db('skills').insert({
      id: skillId,
      code: 'EF06MA07',
      description: 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão.',
      grade_level: '6º Ano'
    });

    // 7.1 Criar Referencial BNCC (bncc_reference)
    await db('bncc_reference').insert([
      {
        id: uuidv4(),
        level: 'Fundamental',
        grade: '6º Ano',
        code: 'EF06MA07',
        description: 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão.',
        topic: 'Números'
      },
      {
        id: uuidv4(),
        level: 'Fundamental',
        grade: '6º Ano',
        code: 'EF06MA01',
        description: 'Resolver e elaborar problemas com números naturais, envolvendo as quatro operações fundamentais.',
        topic: 'Números'
      }
    ]);

    // 8. Criar Questões
    const questionId = uuidv4();
    await db('questions').insert({
      id: questionId,
      statement: 'Qual a representação decimal de 1/2?',
      option_a: '0,1',
      option_b: '0,2',
      option_c: '0,5',
      option_d: '1,2',
      option_e: '2,0',
      correct_option: 'C',
      topic_id: topicId,
      difficulty: 1,
      created_by: teacherId
    });

    await db('question_skills').insert({ question_id: questionId, skill_id: skillId });

    // 9. Criar Avaliação
    const assessmentId = uuidv4();
    await db('assessments').insert({
      id: assessmentId,
      class_id: class6AId,
      title: 'Avaliação Mensal - Junho',
      date: '2026-06-15',
      status: 'draft'
    });

    const versionId = uuidv4();
    await db('assessment_versions').insert({
      id: versionId,
      assessment_id: assessmentId,
      version_label: 'A',
      seed: 12345
    });

    await db('assessment_questions').insert({
      id: uuidv4(),
      assessment_version_id: versionId,
      question_id: questionId,
      order_index: 1
    });

    // 10. Criar Modelos de Intervenção Pedagógica (Intervention Templates)
    const interventions = [
      {
        id: uuidv4(),
        topic: 'Frações',
        category: 'conceitual',
        skill_code: 'EF06MA07',
        title: 'Uso de Círculos de Frações (Material Concreto)',
        description_plan: 'Trabalhar a representação visual de frações usando círculos ou tiras de papel fracionadas para reforçar o conceito de parte-todo.',
        recommended_resources: 'Círculos de frações impressos, tesoura, lápis de cor.'
      },
      {
        id: uuidv4(),
        topic: 'Frações',
        category: 'operacional',
        skill_code: 'EF06MA07',
        title: 'Prática de Algoritmo de Multiplicação de Frações',
        description_plan: 'Explicar passo a passo a multiplicação de numeradores e denominadores com exemplos simples e exercícios graduais.',
        recommended_resources: 'Folha de exercícios direcionados de multiplicação de frações.'
      },
      {
        id: uuidv4(),
        topic: 'Números Decimais',
        category: 'conceitual',
        skill_code: 'EF06MA01',
        title: 'Quadro de Valor Posicional (QVP) com Decimais',
        description_plan: 'Utilizar o quadro valor de lugar para ilustrar a posição dos décimos, centésimos e milésimos à direita da vírgula.',
        recommended_resources: 'Quadro negro ou cartolina com QVP, fichas numéricas.'
      }
    ];
    await db('intervention_templates').insert(interventions);

    console.log('Semeio concluído com sucesso!');
  } catch (err) {
    console.error('Erro ao semear dados:', err);
  } finally {
    process.exit();
  }
}

seed();
