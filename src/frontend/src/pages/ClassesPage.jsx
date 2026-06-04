import { useEffect, useState } from 'react';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState('');
  const [yearGrade, setYearGrade] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, schoolsRes] = await Promise.all([
          fetch('/api/classes', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/schools', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const classesData = await classesRes.json();
        const schoolsData = await schoolsRes.json();
        
        setClasses(classesData);
        setSchools(schoolsData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/api/classes', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        name, 
        year_grade: yearGrade, 
        teacher_id: user.id,
        school_id: schoolId 
      })
    })
      .then((res) => res.json())
      .then((klass) => {
        setClasses((prev) => [...prev, klass]);
        setName('');
        setYearGrade('');
        setSchoolId('');
      });
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Turmas</h1>
      <div className="card">
        <h3>Criar Nova Turma</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome da turma</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: 5º ano A" required />
          </div>
          <div className="field">
            <label>Série / ano</label>
            <input value={yearGrade} onChange={(e) => setYearGrade(e.target.value)} placeholder="Ex.: 5º ano" required />
          </div>
          <div className="field">
            <label>Escola</label>
            <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required>
              <option value="">Selecione uma escola</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <button type="submit">Criar turma</button>
          </div>
        </form>
      </div>
      
      <div className="card">
        <h3>Minhas Turmas</h3>
        {loading ? (
          <p>Carregando turmas...</p>
        ) : (
          <ul className="list">
            {classes.length === 0 ? (
              <p>Nenhuma turma cadastrada ainda.</p>
            ) : (
              classes.map((klass) => {
                const school = schools.find((s) => s.id === klass.school_id);
                return (
                  <li key={klass.id} className="list-item">
                    <div>
                      <strong>{klass.name}</strong>
                      <div className="small-text">{klass.year_grade}</div>
                    </div>
                    <span className="small-text">{school ? school.name : 'Sem escola'}</span>
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
