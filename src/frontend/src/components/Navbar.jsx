import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/schools', label: 'Escolas' },
  { path: '/classes', label: 'Turmas' },
  { path: '/students', label: 'Alunos' },
  { path: '/records', label: 'Registros' },
  { path: '/questions', label: 'Questões' },
  { path: '/assessments', label: 'Avaliações' }
];

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <nav className="navbar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h1>SIDIAM</h1>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to={item.path} end>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <button 
        onClick={handleLogout} 
        style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid white', 
          color: 'white', 
          padding: '8px', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        Sair
      </button>
    </nav>
  );
}
