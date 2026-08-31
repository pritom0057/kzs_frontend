const COLORS = {
  // Registration status
  PENDING:      'bg-yellow-100 text-yellow-800',
  CONFIRMED:    'bg-green-100 text-green-800',
  WAITLISTED:   'bg-blue-100 text-blue-800',
  CANCELLED:    'bg-red-100 text-red-800',
  // Payment status
  UNPAID:       'bg-gray-100 text-gray-600',
  PAID:         'bg-emerald-100 text-emerald-800',
  REFUNDED:     'bg-purple-100 text-purple-800',
  // User status
  VERIFIED:     'bg-green-100 text-green-800',
  UNVERIFIED:   'bg-yellow-100 text-yellow-800',
  ACTIVE:       'bg-green-100 text-green-800',
  INACTIVE:     'bg-red-100 text-red-800',
  NOT_REGISTERED: 'bg-gray-100 text-gray-500',
};

const StatusBadge = ({ value }) => {
  const color = COLORS[value] || 'bg-gray-100 text-gray-600';
  const label = value?.replace(/_/g, ' ') || '—';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
