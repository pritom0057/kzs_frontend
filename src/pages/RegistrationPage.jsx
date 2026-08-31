import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import RegistrationSummary from '../components/registration/RegistrationSummary';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const SELF_AMOUNT   = 2000;
const SPOUSE_AMOUNT = 1000;
const CHILD_AMOUNT  = 500;

const BKASH_NUMBER = '01717-058286';
const BKASH_NAME   = 'Md Imrul Pervez Mithun';

const MEAL_OPTIONS = [
  { value: 'NO_PREFERENCE',  label: 'No Preference' },
  { value: 'VEGETARIAN',     label: 'Vegetarian' },
  { value: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
  { value: 'VEGAN',          label: 'Vegan' },
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PAYMENT_METHODS = [
  {
    id: 'BKASH',
    label: 'bKash',
    color: 'border-pink-400 bg-pink-50 text-pink-700',
    activeColor: 'border-pink-600 bg-pink-100 ring-2 ring-pink-400',
    icon: '📱',
  },
  {
    id: 'NAGAD',
    label: 'Nagad',
    color: 'border-orange-400 bg-orange-50 text-orange-700',
    activeColor: 'border-orange-600 bg-orange-100 ring-2 ring-orange-400',
    icon: '📱',
  },
  {
    id: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    color: 'border-blue-300 bg-blue-50 text-blue-700',
    activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-400',
    icon: '🏦',
  },
];

const calcTotal = (bringSpouse, childCount) =>
  SELF_AMOUNT + (bringSpouse ? SPOUSE_AMOUNT : 0) + childCount * CHILD_AMOUNT;

// Payment instructions per method
const PaymentInstructions = ({ method, total }) => {
  if (method === 'BKASH') return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm">
      <p className="font-semibold text-pink-800 mb-2">bKash Payment Instructions</p>
      <ol className="list-decimal list-inside space-y-1 text-pink-700">
        <li>Open your bKash app</li>
        <li>Go to <strong>Send Money</strong></li>
        <li>Enter number: <strong>{BKASH_NUMBER}</strong></li>
        <li>Account name: <strong>{BKASH_NAME}</strong></li>
        <li>Amount: <strong>৳ {total.toLocaleString()}</strong></li>
        <li>Complete the payment and copy the <strong>Transaction ID</strong></li>
      </ol>
    </div>
  );

  if (method === 'NAGAD') return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm">
      <p className="font-semibold text-orange-800 mb-2">Nagad Payment Instructions</p>
      <ol className="list-decimal list-inside space-y-1 text-orange-700">
        <li>Open your Nagad app</li>
        <li>Go to <strong>Send Money</strong></li>
        <li>Enter number: <strong>{BKASH_NUMBER}</strong></li>
        <li>Account name: <strong>{BKASH_NAME}</strong></li>
        <li>Amount: <strong>৳ {total.toLocaleString()}</strong></li>
        <li>Complete the payment and copy the <strong>Transaction ID</strong></li>
      </ol>
    </div>
  );

  if (method === 'BANK_TRANSFER') return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
      <p className="font-semibold text-blue-800 mb-2">Bank Transfer Instructions</p>
      <p className="text-blue-700 mb-2">Please contact the committee for bank account details:</p>
      <p className="text-blue-700">
        <strong>{BKASH_NAME}</strong> — <a href="tel:+8801717058286" className="underline">01717-058286</a>
      </p>
      <p className="text-blue-700 mt-1">
        After transfer, enter the bank reference number below.
      </p>
    </div>
  );

  return null;
};

const PaymentSection = ({ registration, onPaymentDone }) => {
  const [method, setMethod]     = useState('');
  const [txnId, setTxnId]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const total = registration.totalAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!method)         { setError('Please select a payment method.'); return; }
    if (!txnId.trim())   { setError('Please enter your Transaction ID / reference.'); return; }
    setLoading(true);
    try {
      const { data } = await axiosInstance.patch('/registration/payment', {
        paymentMethod: method,
        paymentReference: txnId.trim(),
      });
      onPaymentDone(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-semibold text-gray-800 mb-1">Complete Payment</h2>
      <p className="text-sm text-gray-500 mb-4">
        Total due: <span className="font-bold text-green-700 text-base">৳ {total?.toLocaleString()}</span>
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>
      )}

      {/* Method selector */}
      <p className="text-sm text-gray-600 mb-2 font-medium">Choose payment method:</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setMethod(m.id); setError(''); }}
            className={`border rounded-xl py-3 flex flex-col items-center gap-1 text-sm font-semibold transition-all ${
              method === m.id ? m.activeColor : m.color + ' hover:opacity-80'
            }`}
          >
            <span className="text-xl">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      {method && (
        <div className="mb-4">
          <PaymentInstructions method={method} total={total} />
        </div>
      )}

      {/* Transaction ID input */}
      {method && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder={method === 'BANK_TRANSFER' ? 'Bank reference number' : 'e.g. 8A1B2C3D4E'}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit Payment Details'}
          </button>
        </form>
      )}
    </div>
  );
};

const RegistrationPage = () => {
  const [registration, setRegistration] = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [loading, setLoading]           = useState(false);
  const [alert, setAlert]               = useState({ type: '', message: '' });

  const [form, setForm] = useState({
    bringSpouse:         false,
    childCount:          0,
    mealPreference:      'NO_PREFERENCE',
    tshirtSize:          '',
    specialRequirements: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/registration/me');
        if (data.data) {
          const r = data.data;
          setRegistration(r);
          setForm({
            bringSpouse:         r.bringSpouse,
            childCount:          (r.children || []).length,
            mealPreference:      r.mealPreference,
            tshirtSize:          r.tshirtSize || '',
            specialRequirements: r.specialRequirements || '',
          });
        } else {
          const profileRes = await axiosInstance.get('/profile/me');
          if (!profileRes.data.data) setProfileMissing(true);
          else setShowForm(true);
        }
      } catch {
        setShowForm(true);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const total = calcTotal(form.bringSpouse, parseInt(form.childCount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    const children = Array.from({ length: parseInt(form.childCount) || 0 }, () => ({ name: '', age: 0 }));

    const payload = {
      bringSpouse:         form.bringSpouse,
      children,
      mealPreference:      form.mealPreference,
      tshirtSize:          form.tshirtSize,
      specialRequirements: form.specialRequirements,
    };

    try {
      const isEdit = !!registration;
      const { data } = await axiosInstance[isEdit ? 'put' : 'post']('/registration', payload);
      setRegistration(data.data);
      setShowForm(false);
      setAlert({ type: 'success', message: isEdit ? 'Registration updated!' : 'Registration submitted! Please complete payment below.' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit registration.';
      if (msg.toLowerCase().includes('profile')) {
        setProfileMissing(true);
        setShowForm(false);
      } else {
        setAlert({ type: 'error', message: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const needsPayment = registration && registration.paymentStatus === 'UNPAID';
  const paymentPending = registration && registration.paymentStatus === 'PENDING';
  const paymentDone    = registration && registration.paymentStatus === 'PAID';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Event Registration</h1>
        <p className="text-sm text-gray-500 mb-6">KZS 2002 SSC Batch — 25 Year Reunion</p>

        <Alert type={alert.type} message={alert.message} />

        {profileMissing && (
          <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-xl p-5 text-sm text-yellow-800">
            <p className="font-semibold mb-1">Profile not complete</p>
            <p>You need to fill in your profile before registering for the event.</p>
            <Link to="/profile"
              className="inline-block mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800">
              Go to My Profile →
            </Link>
          </div>
        )}

        {/* Existing registration summary */}
        {registration && !showForm && (
          <div className="mt-4">
            <RegistrationSummary registration={registration} onEdit={() => setShowForm(true)} />
          </div>
        )}

        {/* Payment section — show if registered but not paid */}
        {needsPayment && !showForm && (
          <PaymentSection
            registration={registration}
            onPaymentDone={(updated) => {
              setRegistration(updated);
              setAlert({ type: 'success', message: 'Payment details submitted! Admin will verify and confirm shortly.' });
            }}
          />
        )}

        {/* Payment pending notice */}
        {paymentPending && !showForm && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800">
            <p className="font-semibold mb-1">Payment Verification Pending</p>
            <p>Your transaction ID has been received. Admin will verify and update your payment status shortly.</p>
            <p className="mt-1 text-xs text-yellow-600">
              Reference: <strong>{registration.paymentReference}</strong> via <strong>{registration.paymentMethod}</strong>
            </p>
          </div>
        )}

        {/* Payment confirmed notice */}
        {paymentDone && !showForm && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800">
            <p className="font-semibold">Payment Confirmed!</p>
            <p className="mt-1">Your registration is complete. See you at the reunion!</p>
          </div>
        )}

        {/* Registration form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">

            {/* Live fee breakdown */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-green-800 mb-3">Registration Fee</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Self</span>
                  <span className="font-medium">৳ {SELF_AMOUNT.toLocaleString()}</span>
                </div>
                {form.bringSpouse && (
                  <div className="flex justify-between text-gray-700">
                    <span>Spouse</span>
                    <span className="font-medium">৳ {SPOUSE_AMOUNT.toLocaleString()}</span>
                  </div>
                )}
                {parseInt(form.childCount) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>{form.childCount} × Child</span>
                    <span className="font-medium">৳ {(parseInt(form.childCount) * CHILD_AMOUNT).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-green-300 pt-2 mt-2 font-bold text-green-800 text-base">
                  <span>Total</span>
                  <span>৳ {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Attendance</h2>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" name="bringSpouse" checked={form.bringSpouse} onChange={handleChange}
                  className="w-4 h-4 accent-green-700" />
                Bringing Spouse
                <span className="text-gray-400">(+৳ {SPOUSE_AMOUNT.toLocaleString()})</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 flex-shrink-0">
                  Number of Children
                  <span className="text-gray-400 ml-1">(৳ {CHILD_AMOUNT.toLocaleString()} each)</span>
                </label>
                <input type="number" name="childCount" min="0" max="10"
                  value={form.childCount} onChange={handleChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Preferences</h2>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Meal Preference</label>
                <select name="mealPreference" value={form.mealPreference} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {MEAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">T-Shirt Size</label>
                <div className="flex gap-2 flex-wrap">
                  {TSHIRT_SIZES.map((size) => (
                    <button key={size} type="button"
                      onClick={() => setForm((prev) => ({ ...prev, tshirtSize: size }))}
                      className={`px-3 py-1 border rounded-lg text-sm font-medium transition-colors ${
                        form.tshirtSize === size
                          ? 'bg-green-700 text-white border-green-700'
                          : 'border-gray-300 text-gray-600 hover:border-green-400'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Special Requirements</label>
                <textarea name="specialRequirements" value={form.specialRequirements} onChange={handleChange}
                  rows={2} placeholder="Any dietary restrictions, accessibility needs, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
            </div>

            {/* Total + Submit */}
            <div className="bg-green-700 rounded-xl p-4 flex items-center justify-between text-white">
              <div>
                <p className="text-green-200 text-xs">Total Amount</p>
                <p className="text-2xl font-bold">৳ {total.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {registration && (
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                )}
                <button type="submit" disabled={loading}
                  className="bg-white text-green-700 font-semibold px-6 py-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50">
                  {loading ? 'Submitting...' : registration ? 'Update' : 'Submit Registration'}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
