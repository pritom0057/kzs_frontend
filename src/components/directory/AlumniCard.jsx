import { Link } from 'react-router-dom';

const AlumniCard = ({ alumni }) => {
  const name     = alumni.fullName || alumni.mobileNumber;
  const initials = alumni.fullName
    ? alumni.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <Link
      to={`/directory/${alumni.userId}`}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md hover:border-green-200 transition-all"
    >
      {alumni.photoUrl ? (
        <img
          src={alumni.photoUrl}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl mb-3">
          {initials}
        </div>
      )}

      <p className="font-semibold text-gray-800 text-sm leading-snug">{name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{alumni.mobileNumber}</p>

      {alumni.designation && alumni.organization ? (
        <p className="text-xs text-gray-500 mt-1">{alumni.designation}, {alumni.organization}</p>
      ) : alumni.occupation ? (
        <p className="text-xs text-gray-500 mt-1">{alumni.occupation}</p>
      ) : !alumni.fullName ? (
        <p className="text-xs text-yellow-500 mt-1">Profile not filled yet</p>
      ) : null}

      {alumni.higherEducation && (
        <p className="text-xs text-green-600 mt-1">{alumni.higherEducation}</p>
      )}
    </Link>
  );
};

export default AlumniCard;
