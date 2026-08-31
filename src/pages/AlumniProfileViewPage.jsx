import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Row = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 w-36 shrink-0 text-sm">{label}</span>
      <span className="text-gray-700 text-sm">{value}</span>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="px-6 py-4 border-t border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
    {children}
  </div>
);

const AlumniProfileViewPage = () => {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const [alumni, setAlumni]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/directory/${userId}`)
      .then(({ data }) => setAlumni(data.data))
      .catch((err) => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-gray-400 text-lg font-medium mb-2">Alumni not found</p>
      <p className="text-sm text-gray-400 mb-6">This profile may have opted out of the directory.</p>
      <button onClick={() => navigate('/directory')} className="text-green-700 text-sm font-medium hover:underline">
        ← Back to Directory
      </button>
    </div>
  );

  const initials = alumni.fullName
    ?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  const hasAcademic     = alumni.schoolRollNumber || alumni.schoolShift || alumni.section || alumni.higherEducation;
  const hasProfessional = alumni.occupation || alumni.organization || alumni.designation;
  const hasFamily       = alumni.spouseName || (Array.isArray(alumni.children) && alumni.children.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        <button onClick={() => navigate('/directory')} className="text-sm text-gray-400 hover:text-gray-600 mb-5">
          ← Back to Directory
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Hero */}
          <div className="bg-green-700 px-6 pt-8 pb-16" />
          <div className="px-6 pb-4 -mt-12">
            <div className="flex items-end gap-4 mb-3">
              {alumni.photoUrl ? (
                <img src={alumni.photoUrl} alt={alumni.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-white shadow flex items-center justify-center text-green-700 font-bold text-3xl">
                  {initials}
                </div>
              )}
              <div className="mb-1">
                <h1 className="text-xl font-bold text-gray-800">{alumni.fullName || alumni.mobileNumber}</h1>
                {alumni.designation && alumni.organization && (
                  <p className="text-sm text-gray-500">{alumni.designation}, {alumni.organization}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <Section title="Contact">
            <Row label="Mobile"   value={alumni.mobileNumber} />
            {alumni.whatsappNumber && alumni.whatsappNumber !== alumni.mobileNumber && (
              <Row label="WhatsApp" value={alumni.whatsappNumber} />
            )}
            {(alumni.facebookUrl || alumni.linkedinUrl) && (
              <div className="flex gap-2 pt-2">
                {alumni.facebookUrl && (
                  <a href={alumni.facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50">
                    Facebook
                  </a>
                )}
                {alumni.linkedinUrl && (
                  <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50">
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </Section>

          {/* Academic & Professional */}
          {(hasAcademic || hasProfessional) && (
            <Section title="Academic & Professional">
              <Row label="School Roll"      value={alumni.schoolRollNumber} />
              <Row label="Shift"            value={alumni.schoolShift} />
              <Row label="Section"          value={alumni.section} />
              <Row label="Higher Education" value={alumni.higherEducation} />
              <Row label="Occupation"       value={alumni.occupation} />
              <Row label="Organization"     value={alumni.organization} />
              <Row label="Designation"      value={alumni.designation} />
            </Section>
          )}

          {/* Family */}
          {hasFamily && (
            <Section title="Family">
              <Row label="Spouse" value={alumni.spouseName} />
              {Array.isArray(alumni.children) && alumni.children.length > 0 && (
                <Row
                  label="Children"
                  value={`${alumni.children.length} — ${alumni.children.map((c) => c.name).join(', ')}`}
                />
              )}
            </Section>
          )}

        </div>
      </div>
    </div>
  );
};

export default AlumniProfileViewPage;
