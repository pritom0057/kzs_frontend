const STATUS_STYLES = {
  PENDING:    'bg-yellow-100 text-yellow-800',
  CONFIRMED:  'bg-green-100 text-green-800',
  WAITLISTED: 'bg-blue-100 text-blue-800',
  CANCELLED:  'bg-red-100 text-red-800',
};

const PAYMENT_STYLES = {
  UNPAID:   'bg-red-100 text-red-700',
  PENDING:  'bg-yellow-100 text-yellow-700',
  PAID:     'bg-green-100 text-green-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

const PAYMENT_LABELS = {
  BKASH:         'bKash',
  NAGAD:         'Nagad',
  BANK_TRANSFER: 'Bank Transfer',
};

const Row = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 text-sm last:border-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium">{value || '—'}</span>
  </div>
);

const RegistrationSummary = ({ registration, onEdit }) => {
  if (!registration) return null;

  const children = registration.children || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Your Registration</h2>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[registration.status]}`}>
            {registration.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_STYLES[registration.paymentStatus]}`}>
            {registration.paymentStatus}
          </span>
        </div>
      </div>

      <Row label="Spouse" value={registration.bringSpouse ? (registration.spouseName || 'Yes') : 'No'} />
      <Row
        label="Children"
        value={children.length === 0 ? 'None' : children.map((c) => `${c.name} (Age ${c.age})`).join(', ')}
      />
      <Row label="Meal Preference" value={registration.mealPreference?.replace('_', ' ')} />
      <Row label="T-Shirt Size"    value={registration.tshirtSize} />
      <Row label="Special Requirements" value={registration.specialRequirements} />

      <div className="flex justify-between py-2 text-sm font-bold text-green-700 border-t border-gray-100 mt-1">
        <span>Total Amount</span>
        <span>৳ {registration.totalAmount?.toLocaleString()}</span>
      </div>

      {registration.paymentMethod && (
        <Row label="Payment Via" value={PAYMENT_LABELS[registration.paymentMethod] || registration.paymentMethod} />
      )}
      {registration.paymentReference && (
        <Row label="Transaction ID" value={registration.paymentReference} />
      )}

      <Row label="Submitted" value={new Date(registration.submittedAt).toLocaleDateString()} />

      {registration.status === 'PENDING' && (
        <button
          onClick={onEdit}
          className="mt-4 w-full text-sm text-green-700 border border-green-700 py-2 rounded-lg hover:bg-green-50 transition-colors"
        >
          Edit Registration
        </button>
      )}
    </div>
  );
};

export default RegistrationSummary;
