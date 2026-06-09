import { useEffect, useState } from 'react';

export default function PedagogicalRecordsPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('operacional');
  const [importance, setImportance] = useState('media');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/classes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/classes/${selectedClass}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setStudents(data));
        
      fetch(`/api/classes/${selectedClass}/records`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setRecords(data));
      
      setSelectedStudent(null);
    } else {
      setStudents([]);
      setRecords([]);
    }
  }, [selectedClass, token]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!selectedStudent) return;

    const payload = {
      student_id: selectedStudent.id,
      class_id: selectedClass,
      topic,
      category,
      importance,
      description,
      action_taken: actionTaken
    };

    fetch('/api/pedagogical-records', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((newRecord) => {
        setRecords((prev) => [newRecord, ...prev]);
        setTopic('');
        setDescription('');
        setActionTaken('');
        setSelectedStudent(null);
        alert('Registro salvo com sucesso!');
      });
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Diário Pedagógico</h1>
      
      <div className="card">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Selecione a Turma para trabalhar:</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            <option value="">Escolha uma turma...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* Lista de Alunos da Turma */}
          <div className="card">
            <h3>Alunos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {students.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    border: selectedStudent?.id === s.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: selectedStudent?.id === s.id ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    fontWeight: selectedStudent?.id === s.id ? '700' : '400'
                  }}
                >
                  {s.display_name}
                </button>
              ))}
            </div>
          </div>

          {/* Área de Registro ou Lista de Registros */}
          <div>
            {selectedStudent ? (
              <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                <h3>Novo Registro para: <span style={{ color: 'var(--primary)' }}>{selectedStudent.display_name}</span></h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="field">
                      <label>Tópico / Conteúdo</label>
                      <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Frações" required />
                    </div>
                    <div className="field">
                      <label>Gravidade / Importância</label>
                      <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                        <option value="baixa">Baixa (Observação)</option>
                        <option value="media">Média (Atenção)</option>
                        <option value="alta">Alta (Crítico)</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Categoria da Dificuldade</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['operacional', 'conceitual', 'interpretativo', 'estrategico'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            background: category === cat ? 'var(--primary)' : 'white',
                            color: category === cat ? 'white' : 'var(--text-main)',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label>O que você observou?</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes da dificuldade..." style={{ minHeight: '80px' }} />
                  </div>

                  <div className="field">
                    <label>Ação Tomada (Opcional)</label>
                    <textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} placeholder="Ex: Reforço, material extra..." style={{ minHeight: '60px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-primary">Salvar Registro</button>
                    <button type="button" onClick={() => setSelectedStudent(null)} className="btn-logout" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--secondary)' }}>Cancelar</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card">
                <h3>Registros Recentes da Turma</h3>
                <ul className="list">
                  {records.length === 0 ? <p className="small-text">Nenhum registro nesta turma ainda.</p> : records.map(r => {
                    const student = students.find(s => s.id === r.student_id);
                    return (
                      <li key={r.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <strong>{student?.display_name}</strong>
                          <span className={`badge ${r.importance}`}>{r.importance}</span>
                        </div>
                        <div className="small-text" style={{ marginTop: '4px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{r.topic}</span> • {r.category}
                        </div>
                        {r.description && <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>{r.description}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
