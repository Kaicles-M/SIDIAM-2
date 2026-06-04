import { useEffect, useState } from 'react';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando diagnóstico...</p>;
  if (!stats) return <p>Erro ao carregar dados do dashboard.</p>;

  return (
    <div className="dashboard">
      <h1 className="page-title">Painel de Diagnóstico Pedagógico</h1>

      {/* Indicadores Rápidos (KPIs) */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', margin: 0 }}>
          <h2 style={{ fontSize: '2.5rem', color: '#007bff', margin: '0.5rem 0' }}>{stats.totalStudents || 0}</h2>
          <p className="small-text">Total de Alunos</p>
        </div>
        <div className="card" style={{ textAlign: 'center', margin: 0 }}>
          <h2 style={{ fontSize: '2.5rem', color: '#28a745', margin: '0.5rem 0' }}>{stats.totalRecords || 0}</h2>
          <p className="small-text">Registros Realizados</p>
        </div>
        <div className="card" style={{ textAlign: 'center', margin: 0 }}>
          <h2 style={{ fontSize: '2.5rem', color: '#dc3545', margin: '0.5rem 0' }}>
            {stats.categoryStats?.find(c => c.category === 'conceitual')?.count || 0}
          </h2>
          <p className="small-text">Erros Conceituais</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Alunos Críticos */}
        <div className="card">
          <h3>Alunos que demandam Atenção</h3>
          <p className="small-text" style={{ marginBottom: '1rem' }}>Prioridade baseada na reincidência e importância dos registros.</p>
          {stats.criticalStudents.length === 0 ? (
            <p>Nenhum aluno crítico identificado.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stats.criticalStudents.map((s, i) => (
                <li key={i} className="list-item" style={{ justifyContent: 'space-between', borderLeft: '4px solid #dc3545' }}>
                  <span>{s.name}</span>
                  <span className="small-text" style={{ fontWeight: 'bold' }}>Peso: {s.weight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tópicos com mais Dificuldades */}
        <div className="card">
          <h3>Conteúdos Críticos (Top Tópicos)</h3>
          <p className="small-text" style={{ marginBottom: '1rem' }}>Assuntos com maior volume de dificuldades registradas.</p>
          {stats.topicStats.length === 0 ? (
            <p>Nenhum tópico registrado ainda.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stats.topicStats.map((t, i) => (
                <li key={i} className="list-item" style={{ justifyContent: 'space-between' }}>
                  <span>{t.topic}</span>
                  <span className="small-text" style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px' }}>{t.count} erros</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Distribuição por Categoria */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Natureza das Dificuldades (Por Categoria)</h3>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {stats.categoryStats.length === 0 ? (
            <p>Sem dados de categoria.</p>
          ) : (
            stats.categoryStats.map((c, i) => (
              <div key={i} style={{ flex: 1, minWidth: '150px', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{c.category}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{c.count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
