import { useEffect, useState } from 'react';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [yearGrade, setYearGrade] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/classes').then((res) => res.json()),
      fetch('/api/users').then((res) => res.json())
    ])
      .then(([classesData, usersData]) => {
        setClasses(classesData);
        setTeachers(usersData);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, year_grade: yearGrade, teacher_id: teacherId || undefined })
    })
      .then((res) => res.json())
      .then((klass) => {
        setClasses((prev) => [...prev, klass]);
        setName('');
        setYearGrade('');
        setTeacherId('');
      });
  }

  return (
    <div>
      <h1 className="page-title">Turmas</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome da turma</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: 5º ano A" />
          </div>
          <div className="field">
            <label>Série / ano</label>
            <input value={yearGrade} onChange={(e) => setYearGrade(e.target.value)} placeholder="Ex.: 5º ano" />
          </div>
          <div className="field">
            <label>Professor responsável (opcional)</label>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Selecione um professor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
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
        {loading ? (
          <p>Carregando turmas...</p>
        ) : (
          <div>
            {classes.length === 0 ? (
              <p>Nenhuma turma cadastrada ainda.</p>
            ) : (
              classes.map((klass) => {
                const teacher = teachers.find((t) => t.id === klass.teacher_id);
                return (
                  <div key={klass.id} className="list-item">
                    <span>{klass.name}</span>
                    <span className="small-text">
                      {klass.year_grade} {teacher ? `• professor ${teacher.name}` : ''}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
