import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then((res) => res.json())
      .then((user) => {
        setUsers((prev) => [...prev, user]);
        setName('');
        setEmail('');
      });
  }

  return (
    <div>
      <h1 className="page-title">Professores</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do professor" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email do professor" />
          </div>
          <div className="field">
            <button type="submit">Criar professor</button>
          </div>
        </form>
      </div>
      <div className="card">
        {loading ? (
          <p>Carregando professores...</p>
        ) : (
          <div>
            {users.length === 0 ? (
              <p>Nenhum professor cadastrado ainda.</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="list-item">
                  <span>{user.name}</span>
                  <span className="small-text">{user.email}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
