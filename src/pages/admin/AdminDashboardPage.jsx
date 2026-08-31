import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExport = (type) => {
    window.open(`/api/admin/export/${type}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">KZS 2002 Reunion — overview</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('users')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Export Alumni CSV
          </button>
          <button
            onClick={() => handleExport('registrations')}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            Export Registrations CSV
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Alumni" value={stats.totalUsers} />
          <StatCard label="Verified" value={stats.verifiedUsers} sub={`${stats.unverifiedUsers} pending`} />
          <StatCard label="Registrations" value={stats.totalRegistrations} sub={`${stats.confirmedRegistrations} confirmed`} />
          <StatCard label="Paid" value={stats.paidRegistrations} sub={`৳ ${(stats.totalRevenue || 0).toLocaleString()} collected`} />
          <StatCard label="Pending Review" value={stats.pendingRegistrations} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
