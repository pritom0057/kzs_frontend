import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-500 mb-6">{user?.email}</p>

        {!user?.isVerified && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-3 text-sm mb-6">
            Your account is <strong>pending verification</strong> by the admin. You'll be notified once approved.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/profile" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">👤</div>
            <h2 className="font-semibold text-gray-800">My Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Add your personal and professional details</p>
          </Link>

          <Link to="/register-event" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">🎟️</div>
            <h2 className="font-semibold text-gray-800">Event Registration</h2>
            <p className="text-sm text-gray-500 mt-1">Register your attendance for the reunion</p>
          </Link>

          <Link to="/directory" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📖</div>
            <h2 className="font-semibold text-gray-800">Alumni Directory</h2>
            <p className="text-sm text-gray-500 mt-1">Browse classmates who are attending</p>
          </Link>

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="bg-green-700 text-white rounded-xl shadow-sm p-6 hover:bg-green-800 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <h2 className="font-semibold">Admin Panel</h2>
              <p className="text-sm text-green-200 mt-1">Manage registrations and alumni</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
