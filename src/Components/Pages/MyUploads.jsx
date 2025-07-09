import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function MyUploads() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', type: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/my-uploads');
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this item?')) return;
    try {
      const res = await fetch(`http://localhost:3000/media/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMediaList(mediaList.filter((item) => item._id !== id));
        toast.success('Deleted successfully!');
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
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
        setMediaList(
          mediaList.map((item) =>
            item._id === id ? { ...item, isPrivate: !currentPrivacy } : item
          )
        );
        toast.success(currentPrivacy ? 'Made public' : 'Made private');
      } else {
        toast.error('Privacy update failed');
      }
    } catch {
      toast.error('Error updating privacy');
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
        setMediaList(
          mediaList.map((item) =>
            item._id === id ? { ...item, ...editData } : item
          )
        );
        cancelEdit();
        toast.success('Updated successfully');
      } else {
        toast.error('Edit failed');
      }
    } catch {
      toast.error('Error during update');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <style>{`
        /* Animated gradient background */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-bg {
          background: linear-gradient(270deg, #1e3a8a, #6366f1, #ec4899, #f59e0b);
          background-size: 800% 800%;
          animation: gradientShift 20s ease infinite;
        }
      `}</style>

      <div className="relative min-h-screen text-white animated-gradient-bg bg-[length:800%_800%] px-4 py-6">
        <Toaster position="top-right" />
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6 text-center"
          >
            📁 My Uploads
          </motion.h2>

          {loading ? (
            <p className="text-center text-gray-300">Loading...</p>
          ) : mediaList.length === 0 ? (
            <p className="text-center text-gray-400">No uploads found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mediaList.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white text-black rounded-lg p-4 shadow-md border hover:shadow-xl transition duration-300 flex flex-col"
                >
                  {editingId === item._id ? (
                    <>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="input input-bordered w-full mb-2 px-2 py-1 border rounded"
                      />
                      <select
                        value={editData.type}
                        onChange={(e) =>
                          setEditData({ ...editData, type: e.target.value })
                        }
                        className="select select-bordered w-full mb-2 px-2 py-1 border rounded"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold truncate mb-2">{item.title}</h3>
                      {item.type === 'image' ? (
                        <img
                          src={`http://localhost:3000${item.url}`}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      ) : (
                        <video
                          controls
                          className="w-full h-40 rounded bg-black"
                          preload="metadata"
                        >
                          <source
                            src={`http://localhost:3000${item.url}`}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    </>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {editingId === item._id ? (
                      <>
                        <button
                          className="btn btn-sm bg-green-600 text-white"
                          onClick={() => saveEdit(item._id)}
                          disabled={updatingId === item._id}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm bg-yellow-500 text-white"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm bg-blue-600 text-white"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm bg-red-600 text-white"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-sm bg-gray-700 text-white"
                          onClick={() => togglePrivacy(item._id, item.isPrivate)}
                          disabled={updatingId === item._id}
                        >
                          {item.isPrivate ? 'Make Public' : 'Make Private'}
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {showScroll && (
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            title="Back to Top"
          >
            ↑
          </motion.button>
        )}
      </div>
    </>
  );
}
