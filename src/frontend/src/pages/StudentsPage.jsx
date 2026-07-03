import { useEffect, useState } from 'react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [externalCode, setExternalCode] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudentRecords, setSelectedStudentRecords] = useState(null);
  const [currentStudentName, setCurrentStudentName] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, schoolsRes, classesRes] = await Promise.all([
          fetch('/api/students', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/schools', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/classes', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const studentsData = await studentsRes.json();
        const schoolsData = await schoolsRes.json();
        const classesData = await classesRes.json();
        
        setStudents(studentsData);
        setSchools(schoolsData);
        setClasses(classesData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  function handleViewRecords(student) {
    setCurrentStudentName(student.display_name);
    fetch(`/api/students/${student.id}/records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setSelectedStudentRecords(data));
  }

  const availableClasses = classes.filter(c => c.school_id === schoolId);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          display_name: displayName, 
          external_code: externalCode,
          school_id: schoolId 
        })
      });
      
      const student = await res.json();
      
      if (classId) {
        await fetch(`/api/classes/${classId}/enroll`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ student_id: student.id })
        });
      }

      setStudents((prev) => [...prev, student]);
      setDisplayName('');
      setExternalCode('');
      setSchoolId('');
      setClassId('');
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      alert('Erro ao cadastrar aluno.');
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Alunos</h1>

      {selectedStudentRecords && (
        <div className="card" style={{ border: '2px solid #007bff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Histórico Pedagógico: {currentStudentName}</h3>
            <button onClick={() => setSelectedStudentRecords(null)}>Fechar</button>
          </div>
          {selectedStudentRecords.length === 0 ? (
            <p>Nenhum registro encontrado para este aluno.</p>
          ) : (
            selectedStudentRecords.map((r) => (
              <div key={r.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderLeft: '4px solid #007bff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>{r.topic}</span>
                  <span className="small-text" style={{ textTransform: 'uppercase' }}>{r.category} • {r.importance}</span>
                </div>
                {r.description && <div style={{ marginBottom: '4px' }}><span className="small-text" style={{ fontWeight: 'bold' }}>Obs:</span> {r.description}</div>}
                {r.action_taken && <div><span className="small-text" style={{ fontWeight: 'bold' }}>Ação:</span> {r.action_taken}</div>}
                <span className="small-text" style={{ marginTop: '8px', opacity: 0.6 }}>{new Date(r.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}

      <div className="card">
        <h3>Cadastrar Novo Aluno</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome do aluno</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex.: Aluno 01"
              required
            />
          </div>
          <div className="field">
            <label>Escola</label>
            <select value={schoolId} onChange={(e) => { setSchoolId(e.target.value); setClassId(''); }} required>
              <option value="">Selecione uma escola</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {schoolId && (
            <div className="field">
              <label>Turma (opcional)</label>
              <select value={classId} onChange={(e) => setClassId(e.target.value)}>
                <option value="">Nenhuma turma</option>
                {availableClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label>Código externo (opcional)</label>
            <input
              value={externalCode}
              onChange={(e) => setExternalCode(e.target.value)}
              placeholder="Número de matrícula ou código"
            />
          </div>
          <div className="field">
            <button type="submit">Criar aluno</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Lista de Alunos</h3>
        {loading ? (
          <p>Carregando alunos...</p>
        ) : (
          <ul className="list">
            {students.length === 0 ? (
              <p>Nenhum aluno cadastrado ainda.</p>
            ) : (
              students.map((student) => {
                const school = schools.find(s => s.id === student.school_id);
                const enrollment = classes.find(c => {
                   // This is inefficient but without an enrollment list we can't easily show the class
                   return false; 
                });
                return (
                  <li key={student.id} className="list-item">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong>{student.display_name}</strong>
                      <span className="small-text">{student.external_code || 'Sem código'} {school ? `• ${school.name}` : ''}</span>
                    </div>
                    <button onClick={() => handleViewRecords(student)} className="small-text" style={{ background: 'none', border: '1px solid #007bff', color: '#007bff', borderRadius: '4px', cursor: 'pointer' }}>Ver Registros</button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
