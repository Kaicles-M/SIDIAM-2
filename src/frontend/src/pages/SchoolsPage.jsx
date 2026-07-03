import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const initialRecordForm = {
  topic: '',
  category: 'conceitual',
  importance: 'media',
  description: '',
  action_taken: ''
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [className, setClassName] = useState('');
  const [yearGrade, setYearGrade] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [recordForm, setRecordForm] = useState(initialRecordForm);

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const fetchSchools = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/schools');
      if (!res.ok) {
        throw new Error('Não foi possível carregar as escolas.');
      }
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar escolas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSelectSchool = async (school) => {
    setSelectedSchool(school);
    setSelectedClass(null);
    setSelectedStudent(null);
    setRecords([]);
    setClasses([]);
    setStudents([]);

    try {
      const res = await apiFetch(`/api/classes?school_id=${school.id}`);
      if (!res.ok) throw new Error('Não foi possível carregar as turmas.');
      setClasses(await res.json());
    } catch (err) {
      setError(err.message || 'Erro ao carregar turmas.');
    }
  };

  const handleSelectClass = async (klass) => {
    setSelectedClass(klass);
    setSelectedStudent(null);
    setRecords([]);
    setStudents([]);

    try {
      const res = await apiFetch(`/api/classes/${klass.id}/students`);
      if (!res.ok) throw new Error('Não foi possível carregar os alunos.');
      setStudents(await res.json());
    } catch (err) {
      setError(err.message || 'Erro ao carregar alunos.');
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setRecords([]);

    try {
      const res = await apiFetch(`/api/students/${student.id}/records`);
      if (!res.ok) throw new Error('Não foi possível carregar os registros.');
      setRecords(await res.json());
    } catch (err) {
      setError(err.message || 'Erro ao carregar registros.');
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await apiFetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: schoolName, city: schoolCity })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível cadastrar a escola.');
      }

      setSchoolName('');
      setSchoolCity('');
      await fetchSchools();
    } catch (err) {
      setError(err.message || 'Erro ao criar escola.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!selectedSchool) {
      setError('Selecione uma escola antes de criar uma turma.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await apiFetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: className,
          year_grade: yearGrade,
          teacher_id: currentUser.id || null,
          school_id: selectedSchool.id
        })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível criar a turma.');
      }

      setClassName('');
      setYearGrade('');
      const refresh = await apiFetch(`/api/classes?school_id=${selectedSchool.id}`);
      if (refresh.ok) {
        setClasses(await refresh.json());
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar turma.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedSchool || !selectedClass) {
      setError('Selecione uma escola e uma turma antes de cadastrar o aluno.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const studentRes = await apiFetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: studentName,
          external_code: studentCode,
          school_id: selectedSchool.id
        })
      });

      if (!studentRes.ok) {
        const payload = await studentRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível criar o aluno.');
      }

      const student = await studentRes.json();
      const enrollRes = await apiFetch(`/api/classes/${selectedClass.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: student.id, start_date: new Date().toISOString() })
      });

      if (!enrollRes.ok) {
        const payload = await enrollRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível matricular o aluno na turma.');
      }

      setStudentName('');
      setStudentCode('');
      const refresh = await apiFetch(`/api/classes/${selectedClass.id}/students`);
      if (refresh.ok) {
        setStudents(await refresh.json());
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar aluno.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) {
      setError('Selecione um aluno antes de registrar o acompanhamento.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await apiFetch('/api/pedagogical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          class_id: selectedClass.id,
          topic: recordForm.topic,
          category: recordForm.category,
          description: recordForm.description,
          importance: recordForm.importance,
          action_taken: recordForm.action_taken
        })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível salvar o registro.');
      }

      const createdRecord = await res.json();
      setRecords((prev) => [createdRecord, ...prev]);
      setRecordForm(initialRecordForm);
    } catch (err) {
      setError(err.message || 'Erro ao salvar registro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    const label = type === 'school' ? 'escola' : type === 'class' ? 'turma' : 'aluno';
    if (!window.confirm(`Deseja remover esta ${label}?`)) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await apiFetch(`/api/${type === 'school' ? 'schools' : type === 'class' ? 'classes' : 'students'}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Não foi possível remover a ${label}.`);
      }

      if (type === 'school') {
        setSchools((prev) => prev.filter((item) => item.id !== id));
        if (selectedSchool?.id === id) {
          setSelectedSchool(null);
          setSelectedClass(null);
          setSelectedStudent(null);
          setClasses([]);
          setStudents([]);
          setRecords([]);
        }
      } else if (type === 'class') {
        setClasses((prev) => prev.filter((item) => item.id !== id));
        if (selectedClass?.id === id) {
          setSelectedClass(null);
          setSelectedStudent(null);
          setStudents([]);
          setRecords([]);
        }
      } else {
        setStudents((prev) => prev.filter((item) => item.id !== id));
        if (selectedStudent?.id === id) {
          setSelectedStudent(null);
          setRecords([]);
        }
      }
    } catch (err) {
      setError(err.message || `Erro ao remover ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container"><p>Carregando gestão pedagógica...</p></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Gestão Pedagógica</h1>
      <p className="small-text" style={{ marginBottom: '24px' }}>Navegue por escola, turma, aluno e registros em um único fluxo.</p>

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', marginBottom: '24px' }}>
          <p style={{ color: 'var(--danger)', margin: 0 }}>{error}</p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Nova Escola</h3>
        <form onSubmit={handleAddSchool}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Nome da Instituição</label>
              <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required placeholder="Ex: Escola Estadual..." />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Cidade</label>
              <input type="text" value={schoolCity} onChange={(e) => setSchoolCity(e.target.value)} placeholder="Ex: São Paulo" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={saving}>
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="card">
          <h3>Escolas</h3>
          <ul className="list">
            {schools.length === 0 ? (
              <p className="small-text">Nenhuma escola cadastrada ainda.</p>
            ) : (
              schools.map((school) => (
                <li key={school.id} className="list-item" style={{ alignItems: 'center' }}>
                  <button onClick={() => handleSelectSchool(school)} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', flex: 1, cursor: 'pointer' }}>
                    <div>
                      <strong>{school.name}</strong>
                      <div className="small-text">{school.city || 'Cidade não informada'}</div>
                    </div>
                  </button>
                  <button onClick={() => handleDelete('school', school.id)} className="btn-logout" style={{ padding: '6px 10px', width: 'auto' }} aria-label={`Excluir ${school.name}`}>
                    🗑️
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="card">
          <h3>Turmas</h3>
          {!selectedSchool ? (
            <p className="small-text">Selecione uma escola para ver as turmas.</p>
          ) : (
            <>
              <form onSubmit={handleAddClass} style={{ marginBottom: '16px' }}>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label>Nome da turma</label>
                  <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Ex: 6º Ano A" required />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label>Ano/Série</label>
                  <input value={yearGrade} onChange={(e) => setYearGrade(e.target.value)} placeholder="Ex: 6º Ano" required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
                  {saving ? 'Salvando...' : 'Adicionar turma'}
                </button>
              </form>
              <ul className="list">
                {classes.length === 0 ? (
                  <p className="small-text">Nenhuma turma cadastrada para esta escola.</p>
                ) : (
                  classes.map((klass) => (
                    <li key={klass.id} className="list-item" style={{ alignItems: 'center' }}>
                      <button onClick={() => handleSelectClass(klass)} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', flex: 1, cursor: 'pointer' }}>
                        <strong>{klass.name}</strong>
                        <div className="small-text">{klass.year_grade}</div>
                      </button>
                      <button onClick={() => handleDelete('class', klass.id)} className="btn-logout" style={{ padding: '6px 10px', width: 'auto' }} aria-label={`Excluir ${klass.name}`}>
                        🗑️
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>

        <div className="card">
          <h3>Alunos e Registros</h3>
          {!selectedClass ? (
            <p className="small-text">Selecione uma turma para ver os alunos.</p>
          ) : (
            <>
              <form onSubmit={handleAddStudent} style={{ marginBottom: '16px' }}>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label>Nome do aluno</label>
                  <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Ex: João Silva" required />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label>Código externo</label>
                  <input value={studentCode} onChange={(e) => setStudentCode(e.target.value)} placeholder="Número de matrícula" />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
                  {saving ? 'Salvando...' : 'Adicionar aluno'}
                </button>
              </form>
              <ul className="list" style={{ marginBottom: '20px' }}>
                {students.length === 0 ? (
                  <p className="small-text">Nenhum aluno matriculado nesta turma.</p>
                ) : (
                  students.map((student) => (
                    <li key={student.id} className="list-item" style={{ alignItems: 'center' }}>
                      <button onClick={() => handleSelectStudent(student)} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', flex: 1, cursor: 'pointer' }}>
                        <strong>{student.display_name}</strong>
                        <div className="small-text">{student.external_code || 'Sem código'}</div>
                      </button>
                      <button onClick={() => handleDelete('student', student.id)} className="btn-logout" style={{ padding: '6px 10px', width: 'auto' }} aria-label={`Excluir ${student.display_name}`}>
                        🗑️
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {selectedStudent && (
                <div>
                  <h4>Registros de {selectedStudent.display_name}</h4>
                  <form onSubmit={handleAddRecord} style={{ marginTop: '12px' }}>
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label>Tópico</label>
                      <input value={recordForm.topic} onChange={(e) => setRecordForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="Ex: Frações" required />
                    </div>
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label>Categoria</label>
                      <select value={recordForm.category} onChange={(e) => setRecordForm((prev) => ({ ...prev, category: e.target.value }))}>
                        <option value="conceitual">Conceitual</option>
                        <option value="operacional">Operacional</option>
                        <option value="estrategico">Estratégico</option>
                        <option value="interpretativo">Interpretativo</option>
                      </select>
                    </div>
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label>Importância</label>
                      <select value={recordForm.importance} onChange={(e) => setRecordForm((prev) => ({ ...prev, importance: e.target.value }))}>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label>Descrição</label>
                      <textarea value={recordForm.description} onChange={(e) => setRecordForm((prev) => ({ ...prev, description: e.target.value }))} rows="3" />
                    </div>
                    <div className="field" style={{ marginBottom: '8px' }}>
                      <label>Ação tomada</label>
                      <textarea value={recordForm.action_taken} onChange={(e) => setRecordForm((prev) => ({ ...prev, action_taken: e.target.value }))} rows="3" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar registro'}
                    </button>
                  </form>

                  <div style={{ marginTop: '16px' }}>
                    {records.length === 0 ? (
                      <p className="small-text">Nenhum registro para este aluno ainda.</p>
                    ) : (
                      records.map((record) => (
                        <div key={record.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <strong>{record.topic}</strong>
                          <div className="small-text">{record.category} • {record.importance}</div>
                          {record.description && <div>{record.description}</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
