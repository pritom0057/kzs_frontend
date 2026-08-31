const variants = {
  primary: 'bg-green-700 hover:bg-green-800 text-white',
  secondary: 'bg-white hover:bg-gray-50 text-green-700 border border-green-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-gray-100 text-gray-700',
};

const Button = ({ children, variant = 'primary', className = '', disabled, loading, ...props }) => {
  return (
    <button
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
