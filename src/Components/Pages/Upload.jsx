import React, { useState } from 'react';

export default function Upload() {
  const [type, setType] = useState('image');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFiles.length) return alert('Select at least one file');

    const formData = new FormData();

    mediaFiles.forEach(file => {
      formData.append('media', file);
    });

    // Send relative paths of each file as JSON string
    const relativePaths = mediaFiles.map(f => f.webkitRelativePath || f.name);
    formData.append('relativePaths', JSON.stringify(relativePaths));

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
      alert('✅ Upload successful!');
      setTitle('');
      setType('image');
      setIsPrivate(false);
      setMediaFiles([]);
      setInputKey(Date.now());
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-16 p-8 bg-white rounded-xl space-y-6 shadow-lg">
      <h2 className="text-3xl font-bold text-center">Upload Media</h2>

      <input
        type="text"
        placeholder="Title (optional)"
        className="input input-bordered w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
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
          className="file-input file-input-bordered w-full"
          onChange={(e) => setMediaFiles([...e.target.files])}
          webkitdirectory="true"
          directory=""
        />
      ) : (
        <input
          key={inputKey}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          className="file-input file-input-bordered w-full"
          onChange={(e) => setMediaFiles([e.target.files[0]])}
        />
      )}

      <label className="label cursor-pointer flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="checkbox"
        />
        <span className="label-text">Make Private</span>
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="btn btn-primary w-full"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
