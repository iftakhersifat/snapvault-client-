import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Upload() {
  const [type, setType] = useState('image');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFiles.length || !category.trim()) return toast.error('Select file(s) and enter a category.');

    const formData = new FormData();
    mediaFiles.forEach(f => formData.append('media', f));
    formData.append('title', title);
    formData.append('type', type);
    formData.append('isPrivate', isPrivate);
    formData.append('category', category.trim());

    setUploading(true);
    try {
      const res = await fetch('http://localhost:3000/media/multi', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      toast.success('Upload successful!');
      setTitle('');
      setCategory('');
      setType('image');
      setIsPrivate(false);
      setMediaFiles([]);
      setInputKey(Date.now());
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
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

          <input
            type="text"
            placeholder="Enter category (e.g., Movies)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            disabled={uploading}
            className="input input-bordered w-full"
          />

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={uploading}
            className="input input-bordered w-full"
          />

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

          {type === 'folder' ? (
            <input
              key={inputKey}
              type="file"
              multiple
              webkitdirectory="true"
              directory=""
              onChange={e => setMediaFiles([...e.target.files])}
              disabled={uploading}
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

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              disabled={uploading}
              className="checkbox checkbox-primary"
            />
            <span className="text-gray-700 font-semibold">Private</span>
          </label>

          <button
            type="submit"
            disabled={uploading}
            className={`btn btn-primary w-full text-lg font-semibold ${
              uploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
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
