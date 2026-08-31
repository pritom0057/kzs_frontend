import { useState } from 'react';

const PhotoUpload = ({ currentUrl, onChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
        {displayUrl ? (
          <img src={displayUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl text-gray-300">👤</span>
        )}
      </div>
      <label className="cursor-pointer text-sm text-green-700 font-medium hover:underline">
        {displayUrl ? 'Change Photo' : 'Upload Photo'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <p className="text-xs text-gray-400">JPG, PNG or WEBP — max 3MB</p>
    </div>
  );
};

export default PhotoUpload;
