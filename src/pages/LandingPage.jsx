import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EVENT_DATE = 'January 15, 2027';
const VENUE = 'Kushtia Zilla School Premises, Kushtia';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
        <p className="text-green-300 font-medium tracking-widest text-sm uppercase mb-3">
          Kushtia Zilla School
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          SSC 2002 Batch
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-green-200 mb-6">
          25 Year Reunion
        </h2>
        <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
          After 25 years, let's come together and relive our school memories. Register now to secure your spot.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-green-700 transition-colors"
              >
                Already Registered? Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-semibold text-gray-700 mb-1">Date</h3>
              <p className="text-green-700 font-medium">{EVENT_DATE}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-700 mb-1">Venue</h3>
              <p className="text-green-700 font-medium">{VENUE}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="font-semibold text-gray-700 mb-1">Batch</h3>
              <p className="text-green-700 font-medium">SSC 2002 — KZS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">How to Join</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up with your email address' },
              { step: '2', title: 'Complete Profile', desc: 'Add your current details and photo' },
              { step: '3', title: 'Register for Event', desc: 'Submit your attendance and preferences' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
