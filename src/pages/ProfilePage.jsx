import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import PhotoUpload from '../components/profile/PhotoUpload';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const SHIFTS   = ['Morning', 'Day'];
const SECTIONS = ['A', 'B'];


const emptyChild = () => ({ name: '', age: '' });

const ProfilePage = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: '', fatherName: '', motherName: '',
    email: '', whatsappNumber: user?.mobileNumber || '',
    presentAddress: '', permanentAddress: '',
    occupation: '', organization: '', designation: '',
    schoolRollNumber: '', schoolShift: '', section: '', higherEducation: '',
    facebookUrl: '', linkedinUrl: '',
    spouseName: '', spouseContact: '',
  });
  const [children, setChildren]         = useState([]);
  const [photo, setPhoto]               = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [isEdit, setIsEdit]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [alert, setAlert]               = useState({ type: '', message: '' });

  useEffect(() => {
    axiosInstance.get('/profile/me')
      .then(({ data }) => {
        if (data.data) {
          setIsEdit(true);
          const p = data.data;
          setForm({
            fullName: p.fullName || '', fatherName: p.fatherName || '',
            motherName: p.motherName || '',
            email: p.email || '', whatsappNumber: p.whatsappNumber || user?.mobileNumber || '',
            presentAddress: p.presentAddress || '',
            permanentAddress: p.permanentAddress || '', occupation: p.occupation || '',
            organization: p.organization || '', designation: p.designation || '',
            schoolRollNumber: p.schoolRollNumber || '', schoolShift: p.schoolShift || '',
            section: p.section || '', higherEducation: p.higherEducation || '',
            facebookUrl: p.facebookUrl || '', linkedinUrl: p.linkedinUrl || '',
            spouseName: p.spouseName || '', spouseContact: p.spouseContact || '',
          });
          setChildren(p.children || []);
          setCurrentPhotoUrl(p.photoUrl || '');
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Children table helpers
  const addChild    = () => setChildren((prev) => [...prev, emptyChild()]);
  const removeChild = (idx) => setChildren((prev) => prev.filter((_, i) => i !== idx));
  const updateChild = (idx, field, value) =>
    setChildren((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName) {
      return setAlert({ type: 'error', message: 'Full name is required.' });
    }

    // Validate children rows
    for (const child of children) {
      if (!child.name.trim()) return setAlert({ type: 'error', message: 'Please enter a name for each child.' });
      if (!child.age || parseInt(child.age) < 1) return setAlert({ type: 'error', message: 'Please enter a valid age for each child.' });
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      let photoUrl = currentPhotoUrl;

      if (photo) {
        const { data: urlData } = await axiosInstance.get('/profile/upload-url', {
          params: { filename: photo.name, contentType: photo.type },
        });
        const s3Res = await fetch(urlData.data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': photo.type },
          body: photo,
        });
        if (!s3Res.ok) throw new Error(`Photo upload failed: ${s3Res.status}`);
        photoUrl = urlData.data.fileUrl;
      }

      const payload = {
        ...form,
        mobileNumber: user.mobileNumber,
        children: children.map((c) => ({ name: c.name.trim(), age: parseInt(c.age) })),
        photoUrl,
      };

      const method = isEdit ? 'put' : 'post';
      await axiosInstance[method]('/profile', payload);
      setCurrentPhotoUrl(photoUrl);
      setPhoto(null);
      setIsEdit(true);
      setAlert({ type: 'success', message: 'Profile saved successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to save profile.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {isEdit ? 'Edit Profile' : 'Create Profile'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit ? 'Update your information below.' : 'Complete your profile to register for the event.'}
        </p>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">

          {/* Photo */}
          <div className="flex justify-center">
            <PhotoUpload currentUrl={currentPhotoUrl} onChange={setPhoto} />
          </div>

          {/* Personal Info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name *" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
              <InputField label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's full name" />
              <InputField label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's full name" />
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
              Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  value={user?.mobileNumber || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">Registered number — cannot be changed</p>
              </div>
              <InputField label="WhatsApp Number (optional)" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="01XXXXXXXXX (if different)" />
              <InputField label="Email (optional)" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
              <div className="sm:col-span-2">
                <InputField label="Present Address" name="presentAddress" value={form.presentAddress} onChange={handleChange} placeholder="Current city / address" />
              </div>
              <div className="sm:col-span-2">
                <InputField label="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Hometown / permanent address" />
              </div>
            </div>
          </section>

          {/* Academic / Professional */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
              Academic & Professional
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="School Roll Number" name="schoolRollNumber" value={form.schoolRollNumber} onChange={handleChange} placeholder="Your 2002 school roll" />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">School Shift</label>
                <select name="schoolShift" value={form.schoolShift} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select shift</option>
                  {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Section</label>
                <select name="section" value={form.section} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select section</option>
                  {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <InputField label="Higher Education" name="higherEducation" value={form.higherEducation} onChange={handleChange} placeholder="e.g. MBBS, B.Sc Eng, MBA" />
              <InputField label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} placeholder="e.g. Engineer, Doctor" />
              <InputField label="Organization" name="organization" value={form.organization} onChange={handleChange} placeholder="Company / Institution" />
              <InputField label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Senior Manager" />
            </div>
          </section>

          {/* Family */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
              Family <span className="text-gray-400 font-normal normal-case">(optional — used for event pre-fill)</span>
            </h2>

            {/* Spouse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <InputField label="Spouse Name" name="spouseName" value={form.spouseName} onChange={handleChange} placeholder="Spouse's full name" />
              <InputField label="Spouse Contact" name="spouseContact" value={form.spouseContact} onChange={handleChange} placeholder="Spouse's mobile number" />
            </div>

            {/* Children table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Children</label>
                <button type="button" onClick={addChild}
                  className="text-sm text-green-700 font-medium hover:underline">
                  + Add Child
                </button>
              </div>

              {children.length === 0 ? (
                <p className="text-sm text-gray-400 py-2">No children added.</p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium">#</th>
                        <th className="text-left px-4 py-2 font-medium">Name</th>
                        <th className="text-left px-4 py-2 font-medium">Age</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((child, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-2">
                            <input
                              type="text" value={child.name}
                              onChange={(e) => updateChild(idx, 'name', e.target.value)}
                              placeholder="Child's name"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number" value={child.age} min="1" max="25"
                              onChange={(e) => updateChild(idx, 'age', e.target.value)}
                              placeholder="Age"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button type="button" onClick={() => removeChild(idx)}
                              className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Social */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-1">
              Social Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Facebook URL" name="facebookUrl" value={form.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
              <InputField label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
          </section>

          <Button type="submit" loading={loading} className="w-full">
            {isEdit ? 'Update Profile' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
