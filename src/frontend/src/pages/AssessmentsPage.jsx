import { useEffect, useState } from 'react';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('/api/assessments').then(res => res.json()).then(setAssessments);
    fetch('/api/classes').then(res => res.json()).then(setClasses);
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Avaliações</h1>
      
      <div className="card">
        <h3>Minhas Avaliações</h3>
        <ul className="list">
          {assessments.map(a => (
            <li key={a.id} className="list-item" style={{ justifyContent: 'space-between' }}>
              <div>
                <strong>{a.title}</strong>
                <div className="small-text">Turma: {classes.find(c => c.id === a.class_id)?.name || 'N/A'}</div>
              </div>
              <span className={`badge ${a.status}`}>{a.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
