import React, { useEffect, useState } from 'react';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/media') // This route gives all public media
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

  return (
    <div className="max-w-4xl mx-auto p-5 md:px-21 lg:px-0">
      <h2 className="text-2xl font-bold mb-4">📸 Public Uploads</h2>

      {loading ? (
        <p>Loading media...</p>
      ) : mediaList.length === 0 ? (
        <p>No public media found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaList.map((item) => (
            <div key={item._id} className="p-2 border rounded shadow">
              <p className="font-semibold truncate">{item.title}</p>
              {item.type === 'image' ? (
                <img
                  src={`http://localhost:3000${item.url}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <video controls className="w-full h-48 rounded">
                  <source src={`http://localhost:3000${item.url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
