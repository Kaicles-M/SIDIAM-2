import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Tentando login para:', email);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('Resposta do servidor:', res.status);

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
        window.location.reload();
      } else {
        const data = await res.json();
        console.error('Dados do erro:', data);
        setError(data.error || 'Falha no login');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }} className="card">
      <h2>Login SIDIAM</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="field">
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}
