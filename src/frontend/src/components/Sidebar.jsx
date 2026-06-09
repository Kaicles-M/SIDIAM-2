import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const menuItems = [
  { path: '/', label: 'Visão Geral', icon: '🏠' },
  { path: '/classes', label: 'Minhas Turmas', icon: '👥' },
  { path: '/assessments', label: 'Avaliações', icon: '📋' },
  { path: '/records', label: 'Relatórios', icon: '📊' },
  { path: '/students', label: 'Alunos', icon: '👨‍🎓' },
  { path: '/questions', label: 'Nivelamento', icon: '📈' },
  { path: '/schools', label: 'Escolas', icon: '🏫' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm">{isCollapsed ? '→' : '←'}</span>
      </button>

      {/* Menu */}
      <nav className="pt-6 px-3 h-full overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg w-6">⚙️</span>
          {!isCollapsed && <span className="text-sm">Configurações</span>}
        </NavLink>
      </div>
    </aside>
  );
}
