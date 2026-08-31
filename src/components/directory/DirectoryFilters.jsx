import { useState, useEffect } from 'react';

const SHIFTS   = ['', 'Morning', 'Day'];
const SECTIONS = ['', 'A', 'B'];

const DirectoryFilters = ({ onFilter }) => {
  const [search, setSearch]   = useState('');
  const [shift, setShift]     = useState('');
  const [section, setSection] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => onFilter({ search, shift, section }), 350);
    return () => clearTimeout(t);
  }, [search, shift, section]);

  return (
    <div className="flex gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
      />
      <select
        value={shift}
        onChange={(e) => setShift(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Shifts</option>
        {SHIFTS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Sections</option>
        {SECTIONS.filter(Boolean).map((s) => <option key={s} value={s}>Section {s}</option>)}
      </select>
    </div>
  );
};

export default DirectoryFilters;
