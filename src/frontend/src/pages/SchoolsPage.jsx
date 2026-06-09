import { useEffect, useState } from 'react';

export default function SchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    const res = await fetch('/api/schools', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setSchools(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAddSchool = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, city })
    });
    if (res.ok) {
      setName('');
      setCity('');
      fetchSchools();
    }
  };

  if (loading) return <div className="page-container"><p>Carregando escolas...</p></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Escolas</h1>
      
      <div className="card">
        <h3>Nova Escola</h3>
        <form onSubmit={handleAddSchool}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Nome da Instituição</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Escola Estadual..." />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Cidade</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: São Paulo" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Adicionar</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Instituições Vinculadas</h3>
        <ul className="list">
          {schools.length === 0 ? (
            <p className="small-text">Nenhuma escola cadastrada ainda.</p>
          ) : (
            schools.map(s => (
              <li key={s.id} className="list-item">
                <div>
                  <strong style={{ fontSize: '1.05rem' }}>{s.name}</strong>
                  <div className="small-text">{s.city || 'Cidade não informada'}</div>
                </div>
                <span className="badge active">{s.role_in_school}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
