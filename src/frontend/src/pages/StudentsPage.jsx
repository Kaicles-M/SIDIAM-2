import { useEffect, useState } from 'react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [externalCode, setExternalCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName, external_code: externalCode })
    })
      .then((res) => res.json())
      .then((student) => {
        setStudents((prev) => [...prev, student]);
        setDisplayName('');
        setExternalCode('');
      });
  }

  return (
    <div>
      <h1 className="page-title">Alunos</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome do aluno</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex.: Aluno 01"
            />
          </div>
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
        {loading ? (
          <p>Carregando alunos...</p>
        ) : (
          <div>
            {students.length === 0 ? (
              <p>Nenhum aluno cadastrado ainda.</p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="list-item">
                  <span>{student.display_name}</span>
                  <span className="small-text">{student.external_code || 'Sem código'}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
