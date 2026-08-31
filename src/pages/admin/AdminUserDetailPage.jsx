import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm text-gray-800">{value || <span className="text-gray-300">—</span>}</p>
  </div>
);

const EditField = ({ label, name, value, onChange, type = 'text', span = false }) => (
  <div className={span ? 'col-span-2' : ''}>
    <label className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const ChangePasswordModal = ({ userId, userName, onClose }) => {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/password`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{userName}</p>

        {success ? (
          <div className="text-center py-4">
            <p className="text-green-700 font-semibold mb-4">Password updated successfully.</p>
            <button onClick={onClose} className="px-6 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>
            )}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">New Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Min. 4 characters"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Confirm Password</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Repeat password"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50">
                {loading ? 'Saving…' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const EMPTY_FORM = {
  fullName: '', fatherName: '', motherName: '', email: '', mobileNumber: '',
  whatsappNumber: '', occupation: '', organization: '', designation: '',
  schoolRollNumber: '', schoolShift: '', section: '', higherEducation: '',
  presentAddress: '', permanentAddress: '', facebookUrl: '', linkedinUrl: '',
  spouseName: '', spouseContact: '', showInDirectory: true,
};

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pwModal, setPwModal]     = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/users/${id}`);
      setUser(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleVerify = async () => {
    await axiosInstance.patch(`/admin/users/${id}/verify`);
    setModal(null);
    fetchUser();
  };

  const handleToggle = async () => {
    await axiosInstance.patch(`/admin/users/${id}/toggle-active`);
    setModal(null);
    fetchUser();
  };

  const startEditing = () => {
    const p = user?.profile;
    setForm({
      fullName:        p?.fullName        || '',
      fatherName:      p?.fatherName      || '',
      motherName:      p?.motherName      || '',
      email:           p?.email           || '',
      mobileNumber:    p?.mobileNumber    || user?.mobileNumber || '',
      whatsappNumber:  p?.whatsappNumber  || '',
      occupation:      p?.occupation      || '',
      organization:    p?.organization    || '',
      designation:     p?.designation     || '',
      schoolRollNumber: p?.schoolRollNumber || '',
      schoolShift:     p?.schoolShift     || '',
      section:         p?.section         || '',
      higherEducation: p?.higherEducation || '',
      presentAddress:  p?.presentAddress  || '',
      permanentAddress: p?.permanentAddress || '',
      facebookUrl:     p?.facebookUrl     || '',
      linkedinUrl:     p?.linkedinUrl     || '',
      spouseName:      p?.spouseName      || '',
      spouseContact:   p?.spouseContact   || '',
      showInDirectory: p?.showInDirectory ?? true,
    });
    setSaveError('');
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setSaveError('Full name is required.'); return; }
    setSaving(true);
    setSaveError('');
    try {
      await axiosInstance.put(`/admin/users/${id}/profile`, form);
      setEditing(false);
      fetchUser();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <p className="text-gray-500">User not found.</p>;

  const p = user.profile;
  const r = user.registration;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
        ← Back
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {p?.photoUrl ? (
            <img src={p.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
              {p?.fullName?.[0] || '?'}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">{p?.fullName || 'No profile yet'}</h1>
            <p className="text-sm text-gray-500">{user.mobileNumber}</p>
            <div className="flex gap-2 mt-1">
              <StatusBadge value={user.isVerified ? 'VERIFIED' : 'UNVERIFIED'} />
              <StatusBadge value={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => setPwModal(true)}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            Change Password
          </button>
          <button
            onClick={() => setModal('verify')}
            className="px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
          >
            {user.isVerified ? 'Unverify' : 'Verify'}
          </button>
          <button
            onClick={() => setModal('toggle')}
            className={`px-4 py-2 text-sm rounded-lg border ${
              user.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Profile</h2>
          {!editing ? (
            <button
              onClick={startEditing}
              className="text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(false); setSaveError(''); }}
                className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs px-3 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
            {saveError}
          </div>
        )}

        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            <EditField label="Full Name *"       name="fullName"        value={form.fullName}        onChange={handleChange} />
            <EditField label="Father's Name"     name="fatherName"      value={form.fatherName}      onChange={handleChange} />
            <EditField label="Mother's Name"     name="motherName"      value={form.motherName}      onChange={handleChange} />
            <EditField label="Email"             name="email"           value={form.email}           onChange={handleChange} type="email" />
            <EditField label="Mobile (profile)"  name="mobileNumber"    value={form.mobileNumber}    onChange={handleChange} type="tel" />
            <EditField label="WhatsApp"          name="whatsappNumber"  value={form.whatsappNumber}  onChange={handleChange} type="tel" />
            <EditField label="School Roll"       name="schoolRollNumber" value={form.schoolRollNumber} onChange={handleChange} />
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 block">School Shift</label>
              <select
                name="schoolShift"
                value={form.schoolShift}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— select —</option>
                <option value="Morning">Morning</option>
                <option value="Day">Day</option>
              </select>
            </div>
            <EditField label="Section"           name="section"         value={form.section}         onChange={handleChange} />
            <EditField label="Higher Education"  name="higherEducation" value={form.higherEducation} onChange={handleChange} />
            <EditField label="Occupation"        name="occupation"      value={form.occupation}      onChange={handleChange} />
            <EditField label="Organization"      name="organization"    value={form.organization}    onChange={handleChange} />
            <EditField label="Designation"       name="designation"     value={form.designation}     onChange={handleChange} />
            <EditField label="Spouse Name"       name="spouseName"      value={form.spouseName}      onChange={handleChange} />
            <EditField label="Spouse Contact"    name="spouseContact"   value={form.spouseContact}   onChange={handleChange} type="tel" />
            <EditField label="Present Address"   name="presentAddress"  value={form.presentAddress}  onChange={handleChange} span />
            <EditField label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} span />
            <EditField label="Facebook URL"      name="facebookUrl"     value={form.facebookUrl}     onChange={handleChange} span />
            <EditField label="LinkedIn URL"      name="linkedinUrl"     value={form.linkedinUrl}     onChange={handleChange} span />
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="showInDirectory"
                name="showInDirectory"
                checked={form.showInDirectory}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 rounded"
              />
              <label htmlFor="showInDirectory" className="text-sm text-gray-700">Show in alumni directory</label>
            </div>
          </div>
        ) : p ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name"       value={p.fullName} />
            <Field label="Father's Name"   value={p.fatherName} />
            <Field label="Mother's Name"   value={p.motherName} />
            <Field label="Email"           value={p.email} />
            <Field label="Mobile"          value={p.mobileNumber} />
            <Field label="WhatsApp"        value={p.whatsappNumber} />
            <Field label="School Roll"     value={p.schoolRollNumber} />
            <Field label="Shift / Section" value={[p.schoolShift, p.section].filter(Boolean).join(' / ')} />
            <Field label="Higher Education" value={p.higherEducation} />
            <Field label="Occupation"      value={p.occupation} />
            <Field label="Organization"    value={p.organization} />
            <Field label="Designation"     value={p.designation} />
            <div className="col-span-2"><Field label="Present Address"   value={p.presentAddress} /></div>
            <div className="col-span-2"><Field label="Permanent Address" value={p.permanentAddress} /></div>
            <Field label="Spouse"          value={p.spouseName} />
            <Field label="Spouse Contact"  value={p.spouseContact} />
            <Field label="Facebook"        value={p.facebookUrl} />
            <Field label="LinkedIn"        value={p.linkedinUrl} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">In Directory</p>
              <p className="text-sm text-gray-800">{p.showInDirectory ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              No profile created yet.
            </p>
            <button
              onClick={startEditing}
              className="text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Create Profile
            </button>
          </div>
        )}

        {!editing && Array.isArray(p?.children) && p.children.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Children</p>
            <div className="flex flex-wrap gap-2">
              {p.children.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">{c.name}, {c.age} yrs</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration */}
      {r ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Registration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Status</p>
              <StatusBadge value={r.status} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Payment</p>
              <StatusBadge value={r.paymentStatus} />
            </div>
            <Field label="Total Amount"      value={`৳ ${r.totalAmount?.toLocaleString()}`} />
            <Field label="Payment Reference" value={r.paymentReference} />
            <Field label="Meal Preference"   value={r.mealPreference?.replace(/_/g, ' ')} />
            <Field label="T-Shirt Size"      value={r.tshirtSize} />
            <Field label="Spouse Attending"  value={r.bringSpouse ? 'Yes' : 'No'} />
            <Field label="Children Count"    value={Array.isArray(r.children) ? r.children.length : 0} />
            <Field label="Submitted"         value={new Date(r.submittedAt).toLocaleDateString()} />
            <div className="col-span-2"><Field label="Admin Notes" value={r.adminNotes} /></div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-400">
          No registration submitted.
        </div>
      )}

      {pwModal && (
        <ChangePasswordModal
          userId={user.id}
          userName={p?.fullName || user.mobileNumber}
          onClose={() => setPwModal(false)}
        />
      )}

      {modal === 'verify' && (
        <ConfirmModal
          title={user.isVerified ? 'Remove verification?' : 'Verify this alumni?'}
          message={`${p?.fullName || user.mobileNumber} will be marked as ${user.isVerified ? 'unverified' : 'verified'}.`}
          confirmLabel={user.isVerified ? 'Unverify' : 'Verify'}
          onConfirm={handleVerify}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === 'toggle' && (
        <ConfirmModal
          title={user.isActive ? 'Deactivate account?' : 'Activate account?'}
          message={`${p?.fullName || user.mobileNumber} will ${user.isActive ? 'lose access' : 'regain access'}.`}
          confirmLabel={user.isActive ? 'Deactivate' : 'Activate'}
          danger={user.isActive}
          onConfirm={handleToggle}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminUserDetailPage;
