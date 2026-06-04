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

  if (loading) return <p>Carregando escolas...</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">Minhas Escolas</h1>
      
      <div className="card">
        <h3>Adicionar Nova Escola</h3>
        <form onSubmit={handleAddSchool} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Nome da Escola</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Cidade</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="field" style={{ width: 'auto', marginBottom: 0 }}>
            <button type="submit">Adicionar</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Lista de Escolas</h3>
        <ul className="list">
          {schools.length === 0 ? <p>Nenhuma escola vinculada.</p> : schools.map(s => (
            <li key={s.id} className="list-item">
              <div>
                <strong>{s.name}</strong>
                <div className="small-text">{s.city}</div>
              </div>
              <span className="badge active">{s.role_in_school}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
