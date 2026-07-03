import { useEffect, useState } from 'react';

export default function BNCCPage() {
  const [activeTab, setActiveTab] = useState('database'); // 'database' or 'pdf'
  const [bncc, setBncc] = useState([]);
  const [level, setLevel] = useState('Fundamental');
  const [grade, setGrade] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const getPdfName = () => {
    return level === 'Fundamental' 
      ? 'BNCC EF-Matetmática-Pernambuco.pdf' 
      : 'BNCC EM-Matetmática-Pernambuco.pdf';
  };

  const grades = level === 'Fundamental' 
    ? ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano']
    : ['1ª Série', '2ª Série', '3ª Série'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/bncc?level=${level}&grade=${grade}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setBncc(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar dados da BNCC:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [level, grade]);

  const filteredBncc = bncc.filter(item => 
    item.code.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>BNCC Matemática</h1>
        <div style={{ display: 'flex', background: 'var(--border)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
          <button 
            onClick={() => setActiveTab('database')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none', 
              background: activeTab === 'database' ? 'white' : 'transparent',
              boxShadow: activeTab === 'database' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'database' ? 'bold' : 'normal'
            }}
          >
            Base de Dados
          </button>
          <button 
            onClick={() => setActiveTab('pdf')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none', 
              background: activeTab === 'pdf' ? 'white' : 'transparent',
              boxShadow: activeTab === 'pdf' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'pdf' ? 'bold' : 'normal'
            }}
          >
            Documento PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'database' ? '1fr 1fr 2fr' : '1fr', gap: '20px' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Nível de Ensino</label>
            <select value={level} onChange={(e) => { setLevel(e.target.value); setGrade(''); }}>
              <option value="Fundamental">Ensino Fundamental</option>
              <option value="Medio">Ensino Médio</option>
            </select>
          </div>
          
          {activeTab === 'database' && (
            <>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Ano/Série</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="">Todos</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Pesquisar Código ou Descrição</label>
                <input 
                  type="text" 
                  placeholder="Ex: EF06MA01 ou frações..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {activeTab === 'database' ? (
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
      ) : (
        <div className="card" style={{ padding: 0, height: 'calc(100vh - 280px)', minHeight: '600px', overflow: 'hidden' }}>
          <iframe 
            src={`/${getPdfName()}`} 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Visualizador BNCC PDF"
          />
        </div>
      )}
    </div>
  );
}
