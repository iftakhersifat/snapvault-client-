import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Upload() {
  const [type, setType] = useState('image');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFiles.length) return toast.error('Please select at least one file.');

    const formData = new FormData();

    mediaFiles.forEach(file => {
      formData.append('media', file);
    });

    // Append other fields
    formData.append('title', title);
    formData.append('type', type);
    formData.append('isPrivate', isPrivate);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:3000/media/multi', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      toast.success('Upload successful!');
      setTitle('');
      setType('image');
      setIsPrivate(false);
      setMediaFiles([]);
      setInputKey(Date.now());
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 animate-gradient-x">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full mx-4 p-10 bg-white bg-opacity-90 rounded-xl shadow-xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-800">Upload Media</h2>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={uploading}
              placeholder="Enter media title"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              disabled={uploading}
              className="select select-bordered w-full"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="folder">Folder</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {type === 'folder' ? 'Select Folder' : 'Select File'}
            </label>
            {type === 'folder' ? (
              <input
                key={inputKey}
                type="file"
                multiple
                onChange={e => setMediaFiles([...e.target.files])}
                disabled={uploading}
                webkitdirectory="true"
                directory=""
                className="file-input file-input-bordered w-full"
              />
            ) : (
              <input
                key={inputKey}
                type="file"
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={e => setMediaFiles([e.target.files[0]])}
                disabled={uploading}
                className="file-input file-input-bordered w-full"
              />
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              disabled={uploading}
              className="checkbox checkbox-primary"
            />
            <span className="font-semibold text-gray-700">Make Private</span>
          </label>

          <button
            type="submit"
            disabled={uploading}
            className={`btn btn-primary w-full text-lg font-semibold ${
              uploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </motion.form>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% {background-position: 0% 50%}
          50% {background-position: 100% 50%}
          100% {background-position: 0% 50%}
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </>
  );
}
