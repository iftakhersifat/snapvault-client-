import React, { useState } from 'react';

const Upload = () => {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [isFolderUpload, setIsFolderUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, type, media });
    // You would handle actual file upload logic here
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  };

  return (
    <div className="container mt-20 mx-auto bg-base-100 p-6 shadow rounded-xl max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">📤 Upload Your Media</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Media Type */}
        <div className="flex items-center gap-4">
          <label className="label">
            <span className="label-text">Media Type:</span>
          </label>
          <select
            className="select select-bordered flex-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Folder Upload Toggle */}
        <div className="form-control">
          <label className="cursor-pointer label">
            <span className="label-text">Upload a folder?</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={isFolderUpload}
              onChange={() => setIsFolderUpload(!isFolderUpload)}
            />
          </label>
        </div>

        {/* File or Folder Input */}
        <input
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          className="file-input file-input-bordered w-full"
          multiple
          {...(isFolderUpload && { webkitdirectory: "true", directory: "true" })}
          onChange={handleFileChange}
        />

        {/* Preview */}
        {media.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md border text-sm">
            <strong>Selected {media.length > 1 ? "files" : "file"}:</strong>
            <ul className="mt-1 list-disc list-inside text-gray-600 max-h-32 overflow-y-auto">
              {media.map((file, index) => (
                <li key={index}>{file.webkitRelativePath || file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button className="btn btn-primary w-full">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
