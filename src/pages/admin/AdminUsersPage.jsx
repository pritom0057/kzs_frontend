import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY_CREATE = { fullName: '', mobileNumber: '', password: '', isVerified: false };

const CreateUserModal = ({ onClose, onCreated }) => {
  const [form, setForm]   = useState(EMPTY_CREATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/admin/users', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Create User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Full Name *</label>
            <input
              name="fullName" value={form.fullName} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Md Rahim"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Mobile Number *</label>
            <input
              name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Password *</label>
            <input
              name="password" value={form.password} onChange={handleChange} required
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Min. 4 characters"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" name="isVerified" checked={form.isVerified} onChange={handleChange}
              className="w-4 h-4 text-green-600 rounded"
            />
            <span className="text-sm text-gray-700">Mark as verified immediately</span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminUsersPage = () => {
  const [users, setUsers]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [verified, setVerified]   = useState('');
  const [modal, setModal]         = useState(null); // { type: 'verify'|'toggle', user } | 'create'

  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit, search, ...(verified && { verified }) });
      const { data } = await axiosInstance.get(`/admin/users?${params}`);
      setUsers(data.data);
      setTotal(data.pagination.total);
    } catch {}
    finally { setLoading(false); }
  }, [page, search, verified]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleVerify = async () => {
    await axiosInstance.patch(`/admin/users/${modal.user.id}/verify`);
    setModal(null);
    fetchUsers();
  };

  const handleToggle = async () => {
    await axiosInstance.patch(`/admin/users/${modal.user.id}/toggle-active`);
    setModal(null);
    fetchUsers();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-800">Alumni</h1>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800"
        >
          + Create User
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-5">{total} total</p>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search name or mobile…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
        />
        <select
          value={verified}
          onChange={(e) => { setVerified(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name / Mobile</th>
              <th className="text-left px-4 py-3 font-medium">Roll</th>
              <th className="text-left px-4 py-3 font-medium">Verified</th>
              <th className="text-left px-4 py-3 font-medium">Registration</th>
              <th className="text-left px-4 py-3 font-medium">Payment</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{u.profile?.fullName || '—'}</p>
                  <p className="text-xs text-gray-400">{u.mobileNumber}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.profile?.schoolRollNumber || '—'}</td>
                <td className="px-4 py-3"><StatusBadge value={u.isVerified ? 'VERIFIED' : 'UNVERIFIED'} /></td>
                <td className="px-4 py-3"><StatusBadge value={u.registration?.status || 'NOT_REGISTERED'} /></td>
                <td className="px-4 py-3">{u.registration ? <StatusBadge value={u.registration.paymentStatus} /> : '—'}</td>
                <td className="px-4 py-3"><StatusBadge value={u.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setModal({ type: 'verify', user: u })}
                      className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
                    >
                      {u.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => setModal({ type: 'toggle', user: u })}
                      className={`px-3 py-1 text-xs border rounded-lg ${
                        u.isActive
                          ? 'border-red-300 text-red-600 hover:bg-red-50'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                p === page ? 'bg-green-700 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <CreateUserModal onClose={() => setModal(null)} onCreated={fetchUsers} />
      )}
      {modal?.type === 'verify' && (
        <ConfirmModal
          title={modal.user.isVerified ? 'Remove verification?' : 'Verify this alumni?'}
          message={`${modal.user.profile?.fullName || modal.user.mobileNumber} will be marked as ${modal.user.isVerified ? 'unverified' : 'verified'}.`}
          confirmLabel={modal.user.isVerified ? 'Unverify' : 'Verify'}
          onConfirm={handleVerify}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === 'toggle' && (
        <ConfirmModal
          title={modal.user.isActive ? 'Deactivate account?' : 'Activate account?'}
          message={`${modal.user.profile?.fullName || modal.user.mobileNumber} will ${modal.user.isActive ? 'lose access' : 'regain access'}.`}
          confirmLabel={modal.user.isActive ? 'Deactivate' : 'Activate'}
          danger={modal.user.isActive}
          onConfirm={handleToggle}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
