import { NavLink } from 'react-router-dom';
import { clearAuthSession } from '../utils/api';

const navItems = [
  { path: '/', label: 'Painel Geral' },
  { path: '/schools', label: 'Gestão Pedagógica' },
  { path: '/questions', label: 'Questões' },
  { path: '/assessments', label: 'Avaliações' },
  { path: '/bncc', label: 'BNCC' }
];

export default function Navbar() {
  const handleLogout = () => {
    clearAuthSession();
    window.location.assign('/login');
  };

  return (
    <nav className="navbar">
      <h1>SIDIAM</h1>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to={item.path} end>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} className="btn-logout">
        Sair do Sistema
      </button>
    </nav>
  );
}
