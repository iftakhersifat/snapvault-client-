import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/media');
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = async (item) => {
    try {
      const res = await fetch('http://localhost:3000/media/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: item._id }),
      });

      if (!res.ok) throw new Error('Failed to notify download');

      await fetchMedia();

      const response = await fetch(`http://localhost:3000${item.url}`);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const extension = item.type === 'image' ? 'jpg' : 'mp4';
      link.download = item.title ? `${item.title}.${extension}` : `download.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
      },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:px-12 lg:px-0">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-8 text-gray-900"
      >
        📸 Snap Gallery
      </motion.h2>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading media...</p>
      ) : mediaList.length === 0 ? (
        <p className="text-gray-500 text-lg">No public media found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mediaList.map((item, i) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden"
              title={item.title || 'Untitled'}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring' }}
            >
              <div className="relative h-56 bg-gray-100">
                {item.type === 'image' ? (
                  <img
                    src={`http://localhost:3000${item.url}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    controls
                    preload="metadata"
                    className="w-full h-full bg-black"
                    ref={(el) => (videoRefs.current[i] = el)}
                    onPlay={() => handlePlay(i)}
                  >
                    <source src={`http://localhost:3000${item.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-1 truncate">{item.title || 'Untitled'}</h3>

                <p className="text-gray-500 text-xs mb-1">{formatDate(item.createdAt)}</p>

                <p className="text-gray-600 text-xs mb-3">Downloads: {item.downloadCount || 0}</p>

                <button
                  onClick={() => handleDownload(item)}
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  title="Download"
                >
                  ⬇️ Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
