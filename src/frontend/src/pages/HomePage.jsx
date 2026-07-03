import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, clearAuthSession, getStoredToken } from '../utils/api';

const emptyStats = {
  totalStudents: 0,
  totalRecords: 0,
  criticalStudents: [],
  topicStats: [],
  categoryStats: []
};

export default function HomePage() {
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const token = getStoredToken();

    if (!token) {
      setStats(emptyStats);
      setError('Faça login para visualizar o dashboard.');
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await apiFetch('/api/dashboard/stats');

        if (cancelled) {
          return;
        }

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));

          if (res.status === 401 || res.status === 403) {
            clearAuthSession();
            setStats(emptyStats);
            setError('Sua sessão expirou. Faça login novamente.');
            navigate('/login');
            return;
          }

          throw new Error(payload.error || 'Não foi possível carregar os dados do dashboard.');
        }

        const data = await res.json();

        if (!cancelled) {
          setStats({
            totalStudents: data?.totalStudents ?? 0,
            totalRecords: data?.totalRecords ?? 0,
            criticalStudents: Array.isArray(data?.criticalStudents) ? data.criticalStudents : [],
            topicStats: Array.isArray(data?.topicStats) ? data.topicStats : [],
            categoryStats: Array.isArray(data?.categoryStats) ? data.categoryStats : []
          });
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching dashboard stats:', err);
          setStats(emptyStats);
          setError(err.message || 'Erro ao carregar dados do dashboard.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) return <div className="page-container"><p>Carregando diagnóstico...</p></div>;
  if (error) return <div className="page-container"><div className="card" style={{ maxWidth: '560px' }}><p>{error}</p></div></div>;

  return (
    <div className="page-container dashboard">
      <h1 className="page-title">Painel de Diagnóstico Pedagógico</h1>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Total de Alunos</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats.totalStudents}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Registros Realizados</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.totalRecords}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Erros Conceituais</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {stats.categoryStats.find(c => c.category === 'conceitual')?.count || 0}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        <div className="card">
          <h3>Alunos que demandam Atenção</h3>
          <p className="small-text" style={{ marginBottom: '20px' }}>Prioridade baseada na reincidência e importância dos registros.</p>
          {stats.criticalStudents.length === 0 ? (
            <p className="small-text">Nenhum aluno crítico identificado.</p>
          ) : (
            <ul className="list">
              {stats.criticalStudents.map((s, i) => (
                <li key={i} className="list-item" style={{ borderLeft: '4px solid var(--danger)', paddingLeft: '20px' }}>
                  <span style={{ fontWeight: '600' }}>{s.name}</span>
                  <span className="badge alta">Peso: {s.weight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Conteúdos Críticos</h3>
          <p className="small-text" style={{ marginBottom: '20px' }}>Assuntos com maior volume de dificuldades registradas.</p>
          {stats.topicStats.length === 0 ? (
            <p className="small-text">Nenhum tópico registrado ainda.</p>
          ) : (
            <ul className="list">
              {stats.topicStats.map((t, i) => (
                <li key={i} className="list-item">
                  <span style={{ fontWeight: '500' }}>{t.topic}</span>
                  <span className="badge media">{t.count} erros</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '32px' }}>
        <h3>Distribuição por Natureza da Dificuldade</h3>
        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          {stats.categoryStats.length === 0 ? (
            <p className="small-text">Sem dados de categoria.</p>
          ) : (
            stats.categoryStats.map((c, i) => (
              <div key={i} style={{ 
                flex: 1, 
                minWidth: '200px', 
                background: '#f1f5f9', 
                padding: '20px', 
                borderRadius: '12px', 
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
                  {c.category}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>{c.count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
