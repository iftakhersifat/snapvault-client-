import React, { useEffect, useState } from 'react';

export default function MyUploads() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', type: '' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/my-uploads') // Fetch all uploads (private + public)
      .then(res => res.json())
      .then(data => {
        setMediaList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load media:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this item?')) return;
    try {
      const res = await fetch(`http://localhost:3000/media/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMediaList(mediaList.filter(item => item._id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePrivacy = async (id, currentPrivacy) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:3000/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrivate: !currentPrivacy }),
      });
      if (res.ok) {
        setMediaList(mediaList.map(item =>
          item._id === id ? { ...item, isPrivate: !currentPrivacy } : item
        ));
      } else {
        alert('Privacy update failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditData({ title: item.title, type: item.type });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', type: '' });
  };

  const saveEdit = async (id) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:3000/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setMediaList(mediaList.map(item =>
          item._id === id ? { ...item, ...editData } : item
        ));
        cancelEdit();
      } else {
        alert('Edit failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 md:px-21 lg:px-0">
      <h2 className="text-2xl font-bold mb-4">My Uploads</h2>
      {loading ? (
        <p>Loading...</p>
      ) : mediaList.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaList.map(item => (
            <div key={item._id} className="p-3 border rounded shadow relative">
              {editingId === item._id ? (
                <>
                  <input
                    type="text"
                    className="input input-bordered w-full mb-2"
                    value={editData.title}
                    onChange={e => setEditData({ ...editData, title: e.target.value })}
                  />
                  <select
                    className="select select-bordered w-full mb-2"
                    value={editData.type}
                    onChange={e => setEditData({ ...editData, type: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </>
              ) : (
                <>
                  <p className="font-semibold truncate mb-1">{item.title}</p>
                  {item.type === 'image' ? (
                    <img
                      src={`http://localhost:3000${item.url}`}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  ) : (
                    <video controls className="w-full h-40 rounded">
                      <source src={`http://localhost:3000${item.url}`} type="video/mp4" />
                    </video>
                  )}
                </>
              )}

              <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
                {editingId === item._id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => saveEdit(item._id)}
                      disabled={updatingId === item._id}
                    >
                      Save
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => togglePrivacy(item._id, item.isPrivate)}
                      disabled={updatingId === item._id}
                    >
                      {item.isPrivate ? 'Make Public' : 'Make Private'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
