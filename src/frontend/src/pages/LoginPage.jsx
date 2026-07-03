import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setAuthSession } from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Tentando login para:', email);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('Resposta do servidor:', res.status);

      if (res.ok) {
        const data = await res.json();
        setAuthSession(data.token, data.user);
        navigate('/');
      } else {
        const data = await res.json();
        console.error('Dados do erro:', data);
        setError(data.error || 'Falha no login');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SIDIAM 2</h1>
          <p className="text-blue-100">Plataforma de Diagnóstico em Matemática</p>
        </div>

        {/* Card */}
        <div className="card shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
          <p className="text-gray-600 text-sm mb-6">Entre com suas credenciais de professor</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Desenvolvido para educadores em matemática</p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-white text-sm">
            💡 <strong>Demo:</strong> Use qualquer email e senha para testar a plataforma
          </p>
        </div>
      </div>
    </div>
  );
}
