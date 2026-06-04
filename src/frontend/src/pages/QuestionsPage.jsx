import { useEffect, useState } from 'react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch('/api/questions').then(res => res.json()).then(setQuestions);
    fetch('/api/topics').then(res => res.json()).then(setTopics);
    fetch('/api/skills').then(res => res.json()).then(setSkills);
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Banco de Questões</h1>
      
      <div className="card">
        <h3>Lista de Questões</h3>
        <ul className="list">
          {questions.map(q => (
            <li key={q.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 'bold' }}>{q.statement}</div>
              <div className="small-text">Dificuldade: {q.difficulty} | Alternativa Correta: {q.correct_option}</div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div className="card">
          <h3>Tópicos</h3>
          <ul>
            {topics.map(t => <li key={t.id}>{t.name}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Habilidades (BNCC)</h3>
          <ul>
            {skills.map(s => <li key={s.id}>{s.code} - {s.description.substring(0, 50)}...</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
