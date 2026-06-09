import { useEffect, useState } from 'react';

export default function BNCCPage() {
  const [bncc, setBncc] = useState([]);
  const [level, setLevel] = useState('Fundamental');
  const [grade, setGrade] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const grades = level === 'Fundamental' 
    ? ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano']
    : ['1ª Série', '2ª Série', '3ª Série'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bncc?level=${level}&grade=${grade}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBncc(data);
      setLoading(false);
    };
    fetchData();
  }, [level, grade]);

  const filteredBncc = bncc.filter(item => 
    item.code.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Referencial BNCC (Matemática)</h1>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px' }}>
          <div className="field">
            <label>Nível de Ensino</label>
            <select value={level} onChange={(e) => { setLevel(e.target.value); setGrade(''); }}>
              <option value="Fundamental">Ensino Fundamental</option>
              <option value="Medio">Ensino Médio</option>
            </select>
          </div>
          <div className="field">
            <label>Ano/Série</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Todos</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Pesquisar Código ou Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: EF06MA01 ou frações..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? <p>Carregando dados da BNCC...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px' }}>Código</th>
                  <th style={{ padding: '12px' }}>Descrição</th>
                  <th style={{ padding: '12px' }}>Unidade Temática</th>
                </tr>
              </thead>
              <tbody>
                {filteredBncc.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Nenhuma habilidade encontrada.</td></tr>
                ) : filteredBncc.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <span className="badge active" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{item.code}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.95rem' }}>{item.description}</td>
                    <td style={{ padding: '12px', color: 'var(--secondary)', fontSize: '0.85rem' }}>{item.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
