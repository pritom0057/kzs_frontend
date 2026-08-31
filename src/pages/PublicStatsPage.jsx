import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      done: false,
    };
  };

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return time;
};

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-green-200 text-xs uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
    <p className="text-3xl font-bold text-green-700">{value ?? '—'}</p>
    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{label}</p>
  </div>
);

const PublicStatsPage = () => {
  const [stats, setStats]     = useState(null);
  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/public/stats'),
      axiosInstance.get('/public/event-info'),
    ]).then(([s, e]) => {
      setStats(s.data.data);
      setEvent(e.data.data);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const countdown = useCountdown(event?.date || new Date());

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero / countdown */}
      <div className="bg-green-700 text-white px-4 py-16 text-center">
        <p className="text-green-200 text-sm uppercase tracking-widest mb-2">KZS 2002 SSC Batch</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">{event?.name || '25 Year Reunion'}</h1>
        {event?.venue && <p className="text-green-200 text-sm mb-8">{event.venue}</p>}

        {!countdown.done ? (
          <div>
            <p className="text-green-300 text-sm mb-5">Event begins in</p>
            <div className="flex gap-6 sm:gap-10 justify-center">
              <CountdownUnit value={countdown.days}    label="Days"    />
              <CountdownUnit value={countdown.hours}   label="Hours"   />
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        ) : (
          <p className="text-2xl font-semibold text-green-200">The reunion is here!</p>
        )}

        {event?.date && (
          <p className="text-green-300 text-sm mt-6">
            {new Date(event.date).toLocaleDateString('en-BD', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-center mb-5">
          By the numbers
        </h2>
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard label="Alumni joined"       value={stats.totalAlumni} />
            <StatCard label="Verified"            value={stats.verifiedAlumni} />
            <StatCard label="Registrations"       value={stats.totalRegistrations} />
            <StatCard label="Confirmed"           value={stats.confirmedRegistrations} />
            <StatCard label="Payments done"       value={stats.paidRegistrations} />
          </div>
        )}

        {/* Event info */}
        {event && (
          <div className="mt-10 bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-sm space-y-3">
            <h2 className="font-semibold text-gray-700 mb-3">Event Details</h2>
            <div className="flex gap-3 text-gray-600">
              <span className="text-gray-400 w-32 shrink-0">Date</span>
              <span>{new Date(event.date).toLocaleDateString('en-BD', { dateStyle: 'full' })}</span>
            </div>
            <div className="flex gap-3 text-gray-600">
              <span className="text-gray-400 w-32 shrink-0">Venue</span>
              <span>{event.venue}</span>
            </div>
            <div className="flex gap-3 text-gray-600">
              <span className="text-gray-400 w-32 shrink-0">Registration closes</span>
              <span>{new Date(event.registrationDeadline).toLocaleDateString('en-BD', { dateStyle: 'long' })}</span>
            </div>
            <div className="flex gap-3 text-gray-600">
              <span className="text-gray-400 w-32 shrink-0">Contact</span>
              <div>
                <p>{event.contactName}</p>
                <p>{event.contactPhone}</p>
                {event.contactEmail && (
                  <a href={`mailto:${event.contactEmail}`} className="text-green-700 hover:underline">
                    {event.contactEmail}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicStatsPage;
