import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../Firebase/AuthProvider';
import { FaUserEdit, FaEnvelope, FaCalendarAlt, FaImages, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function MyProfile() {
  const { user, UpdateUser } = useContext(AuthContext);
  const [uploadCount, setUploadCount] = useState(0);

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    fetch('http://localhost:3000/my-uploads')
      .then(res => res.json())
      .then(data => setUploadCount(data.length))
      .catch(err => console.error('Failed to load upload count', err));
  }, []);

  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : 'N/A';

  // Handle display name update
  const saveName = async () => {
    if (!newName.trim()) return toast.error('Name cannot be empty');

    setUpdating(true);
    try {
      await UpdateUser({ displayName: newName.trim() });
      toast.success('Display name updated');
      setEditName(false);
    } catch (err) {
      toast.error('Failed to update name');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Handle profile image update
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUpdating(true);
      const uploadedUrl = await uploadImage(file); // get temporary blob URL
      await UpdateUser({ photoURL: uploadedUrl });
      toast.success('Profile image updated');
    } catch (err) {
      toast.error('Failed to update profile image');
      console.error(err);
    } finally {
      setUpdating(false);
      fileInputRef.current.value = '';
    }
  };

  // Dummy uploadImage function (returns temp blob URL)
  const uploadImage = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tempURL = URL.createObjectURL(file);
        resolve(tempURL);
      }, 1000);
    });
  };

  return (
    <>
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-background" />

      <div className="min-h-screen py-10 px-4 text-gray-800">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">My Profile</h2>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <img
                src={user?.photoURL || '/assets/user.png'}
                alt="Profile"
                className={`w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow-md ${
                  updating ? 'opacity-60 pointer-events-none' : ''
                }`}
              />
              <button
                onClick={() => !updating && fileInputRef.current.click()}
                disabled={updating}
                className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                title="Change Profile Picture"
                type="button"
              >
                <FaUserEdit size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={updating}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5 text-gray-700">
              {/* Name Edit */}
              <div className="flex items-center gap-4">
                {editName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      disabled={updating}
                      className="input input-bordered flex-1"
                      autoFocus
                    />
                    <button
                      onClick={saveName}
                      disabled={updating}
                      className="btn btn-success btn-sm flex items-center gap-1"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditName(false);
                        setNewName(user?.displayName || '');
                      }}
                      disabled={updating}
                      className="btn btn-warning btn-sm flex items-center gap-1"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold flex-1">
                      {user?.displayName || 'N/A'}
                    </h3>
                    <button
                      onClick={() => setEditName(true)}
                      disabled={updating}
                      className="btn btn-info btn-sm flex items-center gap-1"
                    >
                      <FaUserEdit /> Edit
                    </button>
                  </>
                )}
              </div>

              {/* Email */}
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                <span className="font-semibold">Email:</span> {user?.email}
              </p>

              {/* Joined Date */}
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                <span className="font-semibold">Joined:</span> {joinedDate}
              </p>

              {/* Upload Count */}
              <p className="flex items-center gap-2">
                <FaImages className="text-blue-500" />
                <span className="font-semibold">Uploads:</span> {uploadCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style>{`
        .animate-background {
          background-size: 600% 600%;
          animation: gradientFlow 16s ease infinite;
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
