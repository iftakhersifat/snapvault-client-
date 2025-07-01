import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../Firebase/AuthProvider';
import { FaUserEdit, FaEnvelope, FaCalendarAlt, FaImages, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function MyProfile() {
  const { user, updateUserProfile } = useContext(AuthContext);
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
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setUpdating(true);
    try {
      await updateUserProfile({ displayName: newName.trim() });
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

    // Optionally, add image validation here (size/type)

    // Upload image to your server or storage here,
    // Then get the URL and update the user profile photoURL.

    // For demo, assume you have a function uploadImage(file) that returns URL

    try {
      setUpdating(true);
      const uploadedUrl = await uploadImage(file); // You implement this upload logic
      await updateUserProfile({ photoURL: uploadedUrl });
      toast.success('Profile image updated');
    } catch (err) {
      toast.error('Failed to update profile image');
      console.error(err);
    } finally {
      setUpdating(false);
      fileInputRef.current.value = ''; // reset input
    }
  };

  // Dummy uploadImage function for demo, replace with real logic
  const uploadImage = async (file) => {
    // Example: upload to your server or Firebase Storage, then return URL
    // For now just return a placeholder URL after a delay
    return new Promise((res) =>
      setTimeout(() => res(URL.createObjectURL(file)), 1500)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">My Profile</h2>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <img
              src={user?.photoURL || '/assets/user.png'}
              alt="Profile"
              className={`w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-md ${
                updating ? 'opacity-60 pointer-events-none' : ''
              }`}
            />
            {/* Edit Icon overlay */}
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

          {/* User Info */}
          <div className="flex-1 space-y-5 text-gray-700">
            {/* Display Name */}
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
                    onClick={() => { setEditName(false); setNewName(user?.displayName || ''); }}
                    disabled={updating}
                    className="btn btn-warning btn-sm flex items-center gap-1"
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold flex-1">{user?.displayName || 'N/A'}</h3>
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
              <FaEnvelope className="text-blue-500" /> <span className="font-semibold">Email:</span> {user?.email}
            </p>

            {/* Joined Date */}
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> <span className="font-semibold">Joined:</span> {joinedDate}
            </p>

            {/* Uploads Count */}
            <p className="flex items-center gap-2">
              <FaImages className="text-blue-500" /> <span className="font-semibold">Uploads:</span> {uploadCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
