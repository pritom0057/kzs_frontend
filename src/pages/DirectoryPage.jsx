import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AlumniCard from '../components/directory/AlumniCard';
import DirectoryFilters from '../components/directory/DirectoryFilters';
import Pagination from '../components/ui/Pagination';
import { useAuth } from '../contexts/AuthContext';

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const AlumniListRow = ({ alumni }) => {
  const name     = alumni.fullName || alumni.mobileNumber;
  const initials = alumni.fullName
    ? alumni.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <Link
      to={`/directory/${alumni.userId}`}
      className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 hover:shadow-sm hover:border-green-200 transition-all"
    >
      {alumni.photoUrl ? (
        <img src={alumni.photoUrl} alt={name} className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg shrink-0">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{name}</p>
        {alumni.designation && alumni.organization ? (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{alumni.designation}, {alumni.organization}</p>
        ) : alumni.occupation ? (
          <p className="text-xs text-gray-500 mt-0.5">{alumni.occupation}</p>
        ) : !alumni.fullName ? (
          <p className="text-xs text-yellow-500 mt-0.5">Profile not filled yet</p>
        ) : null}
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-gray-400">{alumni.mobileNumber}</p>
        {alumni.higherEducation && (
          <p className="text-xs text-green-600 mt-0.5">{alumni.higherEducation}</p>
        )}
      </div>
    </Link>
  );
};

const DirectoryPage = () => {
  const { user } = useAuth();
  const [alumni, setAlumni]       = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({ search: '', shift: '', section: '' });
  const [showInDir, setShowInDir] = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [view, setView]           = useState('grid'); // 'grid' | 'list'

  const limit = 24;

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit,
        ...(filters.search  && { search: filters.search }),
        ...(filters.shift   && { shift: filters.shift }),
        ...(filters.section && { section: filters.section }),
      });
      const { data } = await axiosInstance.get(`/directory?${params}`);
      setAlumni(data.data);
      setTotal(data.pagination.total);
    } catch {}
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => {
    axiosInstance.get('/profile/me')
      .then(({ data }) => { if (data.data) setShowInDir(data.data.showInDirectory); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchAlumni(); }, [fetchAlumni]);

  const handleFilter = (newFilters) => { setFilters(newFilters); setPage(1); };

  const handleTogglePreference = async () => {
    setToggling(true);
    try {
      const { data } = await axiosInstance.patch('/directory/preferences');
      setShowInDir(data.data.showInDirectory);
    } catch {}
    finally { setToggling(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Alumni Directory</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} alumni listed</p>
          </div>
          <button
            onClick={handleTogglePreference}
            disabled={toggling}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              showInDir
                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                : 'border-green-300 text-green-700 hover:bg-green-50'
            }`}
          >
            {toggling ? '…' : showInDir ? 'Hide me from directory' : 'Show me in directory'}
          </button>
        </div>

        {!user?.isVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-sm text-yellow-800">
            Your account is pending verification. The directory will be fully visible once an admin verifies you.
          </div>
        )}

        {/* Filters + view toggle */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <DirectoryFilters onFilter={handleFilter} />

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              title="Grid view"
              className={`px-3 py-2 transition-colors ${
                view === 'grid' ? 'bg-green-700 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <GridIcon />
            </button>
            <button
              onClick={() => setView('list')}
              title="List view"
              className={`px-3 py-2 border-l border-gray-300 transition-colors ${
                view === 'list' ? 'bg-green-700 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No alumni found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {alumni.map((a) => <AlumniCard key={a.userId} alumni={a} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alumni.map((a) => <AlumniListRow key={a.userId} alumni={a} />)}
          </div>
        )}

        <Pagination page={page} totalPages={Math.ceil(total / limit)} onChange={setPage} />
      </div>
    </div>
  );
};

export default DirectoryPage;
