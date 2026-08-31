import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-wide">
          KZS 2002 Reunion
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-green-200 transition-colors">
                Dashboard
              </Link>
              <Link to="/directory" className="hover:text-green-200 transition-colors">
                Directory
              </Link>
              <Link to="/stats" className="hover:text-green-200 transition-colors">
                Event Info
              </Link>
              <span className="text-green-300">|</span>
              <span className="text-green-200">{user.mobileNumber}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-3 py-1 rounded-md font-medium hover:bg-green-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/stats" className="hover:text-green-200 transition-colors">
                Event Info
              </Link>
              <Link to="/login" className="hover:text-green-200 transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-green-700 px-3 py-1 rounded-md font-medium hover:bg-green-50 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
