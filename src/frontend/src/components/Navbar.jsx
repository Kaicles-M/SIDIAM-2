import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Início' },
  { path: '/users', label: 'Professores' },
  { path: '/classes', label: 'Turmas' },
  { path: '/students', label: 'Alunos' }
];

export default function Navbar() {
  return (
    <nav className="navbar">
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
    </nav>
  );
}
