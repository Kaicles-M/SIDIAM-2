import { useEffect, useState } from 'react';

export default function PedagogicalRecordsPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
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
    } else {
      setStudents([]);
      setRecords([]);
    }
  }, [selectedClass, token]);

  function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      student_id: selectedStudent,
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
        // Reset form partially
        setSelectedStudent('');
        setTopic('');
        setDescription('');
        setActionTaken('');
      });
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Registros Pedagógicos</h1>
      
      <div className="card">
        <h3>Novo Registro</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Turma</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
              <option value="">Selecione a turma</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <>
              <div className="field">
                <label>Aluno</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                  <option value="">Selecione o aluno</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.display_name}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Tópico / Conteúdo</label>
                <input 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  placeholder="Ex: Frações, Equações..." 
                  required 
                />
              </div>

              <div className="field">
                <label>Categoria de Erro</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="operacional">Operacional</option>
                  <option value="conceitual">Conceitual</option>
                  <option value="interpretativo">Interpretativo</option>
                  <option value="estrategico">Estratégico</option>
                </select>
              </div>

              <div className="field">
                <label>Importância</label>
                <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="field">
                <label>Descrição / Observação</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Descreva a dificuldade ou ponto forte..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="field">
                <label>Ação Pedagógica</label>
                <textarea 
                  value={actionTaken} 
                  onChange={(e) => setActionTaken(e.target.value)} 
                  placeholder="O que foi feito para intervir?"
                  style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="field">
                <button type="submit">Salvar Registro</button>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Registros da Turma</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {!selectedClass ? (
              <p>Selecione uma turma para ver os registros.</p>
            ) : (
              <ul className="list" style={{ listStyle: 'none', padding: 0 }}>
                {records.length === 0 ? (
                  <p>Nenhum registro encontrado para esta turma.</p>
                ) : (
                  records.map((r) => {
                    const student = students.find((s) => s.id === r.student_id);
                    return (
                      <li key={r.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold' }}>{student?.display_name || 'Aluno desconhecido'}</span>
                          <span className={`badge ${r.importance}`} style={{ 
                            background: r.importance === 'alta' ? '#fee2e2' : r.importance === 'media' ? '#fef9c3' : '#f1f5f9',
                            color: r.importance === 'alta' ? '#991b1b' : r.importance === 'media' ? '#854d0e' : '#475569'
                          }}>
                            {r.category} • {r.importance}
                          </span>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <span className="small-text" style={{ fontWeight: 'bold' }}>Tópico:</span> {r.topic}
                        </div>
                        {r.description && (
                          <div style={{ marginBottom: '4px' }}>
                            <span className="small-text" style={{ fontWeight: 'bold' }}>Obs:</span> {r.description}
                          </div>
                        )}
                        {r.action_taken && (
                          <div>
                            <span className="small-text" style={{ fontWeight: 'bold' }}>Ação:</span> {r.action_taken}
                          </div>
                        )}
                        <span className="small-text" style={{ marginTop: '8px', opacity: 0.6 }}>
                          {new Date(r.created_at).toLocaleString()}
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
