import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/admin',               label: 'Dashboard',     end: true },
  { to: '/admin/users',         label: 'Alumni'                   },
  { to: '/admin/registrations', label: 'Registrations'            },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-52 bg-green-800 text-white flex flex-col shrink-0">

        {/* Logo / site name */}
        <Link
          to="/"
          className="px-5 py-5 border-b border-green-700 hover:bg-green-700 transition-colors"
        >
          <p className="text-xs text-green-300 uppercase tracking-widest mb-0.5">KZS 2002 Reunion</p>
          <p className="text-sm font-bold text-white">Admin Panel</p>
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: back to site + logout */}
        <div className="px-2 py-4 border-t border-green-700 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-green-200 hover:bg-green-700 hover:text-white transition-colors"
          >
            ← Main Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm text-green-200 hover:bg-red-700 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
