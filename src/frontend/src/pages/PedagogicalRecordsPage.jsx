import { useEffect, useState } from 'react';

export default function PedagogicalRecordsPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [bnccList, setBnccList] = useState([]);
  const [interventions, setInterventions] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isClassObservation, setIsClassObservation] = useState(false);

  // Form Fields
  const [recordType, setRecordType] = useState('dificuldade'); // dificuldade, ponto_forte, obs_turma
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('operacional');
  const [importance, setImportance] = useState('media');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [skillCode, setSkillCode] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch classes on mount
  useEffect(() => {
    fetch('/api/classes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [token]);

  // Fetch students, records, and BNCC when selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/classes/${selectedClass}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setStudents(Array.isArray(data) ? data : []));

      fetch(`/api/classes/${selectedClass}/records`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setRecords(Array.isArray(data) ? data : []));

      // Load BNCC reference for current class grade
      const currentClass = classes.find(c => c.id === selectedClass);
      if (currentClass) {
        const grade = currentClass.year_grade || '';
        fetch(`/api/bncc?grade=${encodeURIComponent(grade)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => res.json())
          .then((data) => setBnccList(Array.isArray(data) ? data : []))
          .catch((err) => console.error('Erro ao buscar BNCC:', err));
      }

      setSelectedStudent(null);
      setIsClassObservation(false);
      setRecordType('dificuldade');
    } else {
      setStudents([]);
      setRecords([]);
      setBnccList([]);
    }
  }, [selectedClass, classes, token]);

  // Load recommended interventions matching topic, category, or skillCode
  useEffect(() => {
    if (recordType === 'dificuldade' && (topic || skillCode)) {
      const queryParams = new URLSearchParams();
      if (topic) queryParams.append('topic', topic);
      if (category) queryParams.append('category', category);
      if (skillCode) queryParams.append('skill_code', skillCode);

      fetch(`/api/intervention-templates?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setInterventions(Array.isArray(data) ? data : []))
        .catch((err) => console.error('Erro ao carregar intervenções:', err));
    } else {
      setInterventions([]);
    }
  }, [topic, category, skillCode, recordType, token]);

  // Auto-fill topic if BNCC skill is selected
  const handleSkillChange = (e) => {
    const code = e.target.value;
    setSkillCode(code);
    if (code) {
      const selectedSkill = bnccList.find(item => item.code === code);
      if (selectedSkill && selectedSkill.topic && !topic) {
        setTopic(selectedSkill.topic);
      }
    }
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setIsClassObservation(false);
    setRecordType('dificuldade');
  };

  const selectClassObservation = () => {
    setSelectedStudent(null);
    setIsClassObservation(true);
    setRecordType('obs_turma');
  };

  const cancelSelection = () => {
    setSelectedStudent(null);
    setIsClassObservation(false);
    setRecordType('dificuldade');
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!isClassObservation && !selectedStudent) return;

    const payload = {
      student_id: isClassObservation ? null : selectedStudent.id,
      class_id: selectedClass,
      topic,
      category: recordType === 'dificuldade' ? category : 'geral',
      importance,
      description,
      action_taken: actionTaken,
      record_type: recordType,
      skill_code: skillCode || null,
      event_date: eventDate ? new Date(eventDate).toISOString() : new Date().toISOString()
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
        // Reset form fields
        setTopic('');
        setDescription('');
        setActionTaken('');
        setSkillCode('');
        setRecordType('dificuldade');
        setSelectedStudent(null);
        setIsClassObservation(false);
        setEventDate(new Date().toISOString().split('T')[0]);
        alert('Registro salvo com sucesso!');
      });
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Diário Pedagógico</h1>

      <div className="card">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Selecione a Turma para trabalhar:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            <option value="">Escolha uma turma...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Carregando dados do Diário Pedagógico...</p>
      ) : selectedClass && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>

          {/* Left Column: Students List & Class General Option */}
          <div className="card">
            <h3>Alunos e Contexto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={selectClassObservation}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  border: isClassObservation ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isClassObservation ? 'var(--primary-light)' : 'white',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: isClassObservation ? '700' : '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📢</span> Observação Geral da Turma
              </button>

              <div style={{ margin: '12px 0 4px 0', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <span className="small-text" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Alunos individuais</span>
              </div>

              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectStudent(s)}
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

          {/* Right Column: New Record Form OR Recent Records List */}
          <div>
            {selectedStudent || isClassObservation ? (
              <div className="card" style={{ borderTop: `4px solid ${recordType === 'ponto_forte' ? 'var(--success)' : recordType === 'obs_turma' ? 'var(--primary)' : 'var(--danger)'}` }}>
                <h3>
                  Novo Registro para:{' '}
                  <span style={{ color: recordType === 'ponto_forte' ? 'var(--success)' : recordType === 'obs_turma' ? 'var(--primary)' : 'var(--danger)' }}>
                    {isClassObservation ? 'Toda a Turma' : selectedStudent?.display_name}
                  </span>
                </h3>

                <form onSubmit={handleSubmit}>
                  {/* Record Type Selector */}
                  <div className="field">
                    <label>Tipo de Registro</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {!isClassObservation ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setRecordType('dificuldade')}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              border: '1px solid var(--border)',
                              background: recordType === 'dificuldade' ? 'var(--danger)' : 'white',
                              color: recordType === 'dificuldade' ? 'white' : 'var(--text-main)',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.2s'
                            }}
                          >
                            ❌ Dificuldade
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecordType('ponto_forte')}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              border: '1px solid var(--border)',
                              background: recordType === 'ponto_forte' ? 'var(--success)' : 'white',
                              color: recordType === 'ponto_forte' ? 'white' : 'var(--text-main)',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.2s'
                            }}
                          >
                            ⭐ Ponto Forte
                          </button>
                        </>
                      ) : (
                        <span className="badge active" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                          📢 Observação Geral da Turma
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date & Topic Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="field">
                      <label>Data do Evento (Retroativa se necessário)</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Tópico / Conteúdo</label>
                      <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ex: Frações"
                        required
                      />
                    </div>
                  </div>

                  {/* BNCC Selector */}
                  {bnccList.length > 0 && (
                    <div className="field">
                      <label>Habilidade BNCC Relacionada (Opcional)</label>
                      <select value={skillCode} onChange={handleSkillChange}>
                        <option value="">Nenhuma habilidade selecionada</option>
                        {bnccList.map((item) => (
                          <option key={item.id} value={item.code}>
                            {item.code} - {item.description.substring(0, 80)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Category Selector (Only for Dificuldade) */}
                  {recordType === 'dificuldade' && (
                    <div className="field">
                      <label>Categoria/Natureza da Dificuldade</label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {['operacional', 'conceitual', 'interpretativo', 'estrategico'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '20px',
                              border: '1px solid var(--border)',
                              background: category === cat ? 'var(--danger)' : 'white',
                              color: category === cat ? 'white' : 'var(--text-main)',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                              fontWeight: category === cat ? '600' : '400',
                              transition: 'all 0.2s'
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Importance Selector */}
                  <div className="field">
                    <label>Importância / Gravidade</label>
                    <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                      <option value="baixa">Baixa (Observação)</option>
                      <option value="media">Média (Atenção)</option>
                      <option value="alta">Alta (Crítico)</option>
                    </select>
                  </div>

                  {/* Observation description */}
                  <div className="field">
                    <label>O que você observou?</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detalhes ou anotações livres..."
                      style={{ minHeight: '80px' }}
                    />
                  </div>

                  {/* Intervention suggestions (Only for Dificuldade with matching templates) */}
                  {recordType === 'dificuldade' && interventions.length > 0 && (
                    <div style={{
                      marginTop: '20px',
                      marginBottom: '20px',
                      padding: '16px',
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                        💡 Planos Pedagógicos Recomendados ({interventions.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {interventions.map((t) => (
                          <div key={t.id} style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e0f2fe',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <strong style={{ fontSize: '0.9rem', color: '#0369a1' }}>{t.title}</strong>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedAction = t.description_plan + (t.recommended_resources ? `\n\nRecursos recomendados: ${t.recommended_resources}` : '');
                                  setActionTaken(updatedAction);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  border: 'none',
                                  background: '#0284c7',
                                  color: 'white',
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  transition: 'background 0.2s'
                                }}
                              >
                                📋 Aplicar Plano
                              </button>
                            </div>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--secondary)' }}>{t.description_plan}</p>
                            {t.recommended_resources && (
                              <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#0369a1' }}>
                                <strong>Recursos:</strong> {t.recommended_resources}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Taken (Intervention) */}
                  <div className="field">
                    <label>Ação Tomada / Plano Pedagógico Aplicado (Opcional)</label>
                    <textarea
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="Ex: Material manipulativo extra, reforço dirigido..."
                      style={{ minHeight: '60px' }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-primary">Salvar Registro</button>
                    <button
                      type="button"
                      onClick={cancelSelection}
                      className="btn-logout"
                      style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--secondary)' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card">
                <h3>Registros Recentes da Turma</h3>
                <ul className="list">
                  {records.length === 0 ? (
                    <p className="small-text">Nenhum registro nesta turma ainda.</p>
                  ) : (
                    records.map((r) => {
                      const student = students.find((s) => s.id === r.student_id);
                      const dateFormatted = r.event_date
                        ? new Date(r.event_date).toLocaleDateString('pt-BR')
                        : new Date(r.created_at).toLocaleDateString('pt-BR');

                      let title = student ? student.display_name : '📢 Toda a Turma (Observação Geral)';
                      let typeBadge = null;
                      let borderStyle = {};

                      if (r.record_type === 'ponto_forte') {
                        typeBadge = <span className="badge active" style={{ background: 'var(--color-success-100)', color: 'var(--color-success-900)' }}>⭐ Ponto Forte</span>;
                        borderStyle = { borderLeft: '4px solid var(--success)' };
                      } else if (r.record_type === 'obs_turma') {
                        typeBadge = <span className="badge active" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>📢 Observação</span>;
                        borderStyle = { borderLeft: '4px solid var(--primary)' };
                      } else {
                        typeBadge = <span className={`badge ${r.importance}`}>{r.importance}</span>;
                        borderStyle = { borderLeft: '4px solid var(--danger)' };
                      }

                      return (
                        <li key={r.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', ...borderStyle, paddingLeft: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <strong>{title}</strong>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {typeBadge}
                              <span className="small-text">{dateFormatted}</span>
                            </div>
                          </div>
                          <div className="small-text" style={{ marginTop: '4px' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{r.topic}</span>
                            {r.skill_code && ` • Habilidade: ${r.skill_code}`}
                            {r.record_type === 'dificuldade' && ` • Natureza: ${r.category}`}
                          </div>
                          {r.description && <p style={{ margin: '8px 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>{r.description}</p>}
                          {r.action_taken && (
                            <div style={{
                              marginTop: '6px',
                              padding: '8px 12px',
                              background: '#f8fafc',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              width: '100%'
                            }}>
                              <strong style={{ color: r.record_type === 'ponto_forte' ? 'var(--success)' : 'var(--primary)' }}>Ação/Plano Aplicado:</strong> {r.action_taken}
                            </div>
                          )}
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

