import React, { useState } from 'react';

export default function Upload() {
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [isPrivate, setIsPrivate] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) return alert('Select a file');

    const formData = new FormData();
    formData.append('media', mediaFile);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('isPrivate', isPrivate);

    setUploading(true);

    try {
      const res = await fetch('http://localhost:3000/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      alert('Upload successful');
      setTitle('');
      setType('image');
      setMediaFile(null);
      setIsPrivate(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mt-16 mx-auto p-6 bg-base-100 rounded-xl shadow space-y-4">
      <input
        type="text"
        placeholder="Title (optional)"
        className="input input-bordered w-full"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <select value={type} onChange={e => setType(e.target.value)} className="select select-bordered w-full">
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
      <input
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        className="file-input file-input-bordered w-full"
        onChange={e => setMediaFile(e.target.files[0])}
      />
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={e => setIsPrivate(e.target.checked)}
          className="checkbox"
        />
        <span className="label-text ml-2">Make Private</span>
      </label>
      <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
