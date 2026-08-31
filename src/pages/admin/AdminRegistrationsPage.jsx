import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/ui/StatusBadge';

const STATUSES         = ['PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED'];
const PAYMENT_STATUSES = ['UNPAID', 'PENDING', 'PAID', 'REFUNDED'];

const PAYMENT_METHOD_LABELS = { BKASH: 'bKash', NAGAD: 'Nagad', BANK_TRANSFER: 'Bank Transfer' };

const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatusFilter]   = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [editing, setEditing]     = useState(null); // registration being edited
  const [editForm, setEditForm]   = useState({});
  const [saving, setSaving]       = useState(false);

  const limit = 20;

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit,
        ...(statusFilter  && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
      });
      const { data } = await axiosInstance.get(`/admin/registrations?${params}`);
      setRegistrations(data.data);
      setTotal(data.pagination.total);
    } catch {}
    finally { setLoading(false); }
  }, [page, statusFilter, paymentFilter]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const openEdit = (r) => {
    setEditing(r);
    setEditForm({
      status:           r.status,
      paymentStatus:    r.paymentStatus,
      paymentReference: r.paymentReference || '',
      adminNotes:       r.adminNotes || '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/admin/registrations/${editing.id}/status`, editForm);
      setEditing(null);
      fetchRegistrations();
    } catch {}
    finally { setSaving(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Registrations</h1>
      <p className="text-sm text-gray-500 mb-5">{total} total</p>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Payments</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Alumni</th>
              <th className="text-left px-4 py-3 font-medium">Roll</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Payment</th>
              <th className="text-left px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading…</td></tr>
            ) : registrations.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No registrations found</td></tr>
            ) : registrations.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/users/${r.user.id}`} className="font-medium text-gray-800 hover:text-green-700">
                    {r.user.profile?.fullName || '—'}
                  </Link>
                  <p className="text-xs text-gray-400">{r.user.mobileNumber}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{r.user.profile?.schoolRollNumber || '—'}</td>
                <td className="px-4 py-3 font-medium text-gray-800">৳ {r.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge value={r.status} /></td>
                <td className="px-4 py-3">
                  <StatusBadge value={r.paymentStatus} />
                  {r.paymentReference && (
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{r.paymentReference}</p>
                  )}
                  {r.paymentMethod && (
                    <p className="text-xs text-gray-400">{PAYMENT_METHOD_LABELS[r.paymentMethod] || r.paymentMethod}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(r)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
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

      {/* Edit panel (slide-in style modal) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Update Registration
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {editing.user.profile?.fullName || editing.user.mobileNumber}
            </p>

            {editing.paymentReference && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">User's Payment Submission</p>
                <p className="text-sm text-yellow-800">
                  Method: <strong>{PAYMENT_METHOD_LABELS[editing.paymentMethod] || editing.paymentMethod || '—'}</strong>
                </p>
                <p className="text-sm text-yellow-800 font-mono mt-0.5">
                  Txn ID: <strong>{editing.paymentReference}</strong>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Status</label>
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm((p) => ({ ...p, paymentStatus: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Reference</label>
                <input
                  type="text"
                  value={editForm.paymentReference}
                  onChange={(e) => setEditForm((p) => ({ ...p, paymentReference: e.target.value }))}
                  placeholder="Transaction ID / bKash ref"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Admin Notes</label>
                <textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm((p) => ({ ...p, adminNotes: e.target.value }))}
                  rows={3}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;
