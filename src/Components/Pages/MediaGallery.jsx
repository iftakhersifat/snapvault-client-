import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRefs = useRef([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/my-uploads');
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      const fileRes = await fetch(`http://localhost:3000${item.url}`);
      const blob = await fileRes.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const ext = item.type === 'image' ? 'jpg' : 'mp4';
      link.download = `${item.title || 'download'}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  const handlePlay = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) vid.pause();
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: 'spring' },
    }),
  };

  const groupedMedia = mediaList.reduce((acc, item) => {
    const folder = item.folder || 'Others';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(item);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#1e293b] animate-gradient-slow bg-[length:400%_400%] text-white">
      <div className="max-w-6xl mx-auto p-6 md:px-12 lg:px-0">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold mb-10"
        >
          📁 Snap Gallery by Folders
        </motion.h2>

        {loading ? (
          <p className="text-gray-200 text-lg">Loading media...</p>
        ) : mediaList.length === 0 ? (
          <p className="text-gray-300 text-lg">No public media found.</p>
        ) : (
          Object.entries(groupedMedia).map(([folder, items]) => (
            <div key={folder} className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 border-b border-indigo-500 pb-2">
                {folder}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    className="bg-white text-black rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative h-56 bg-gray-100">
                      {item.type === 'image' ? (
                        <img
                          src={`http://localhost:3000${item.url}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          controls
                          className="w-full h-full bg-black"
                          ref={(el) => (videoRefs.current[i] = el)}
                          onPlay={() => handlePlay(i)}
                        >
                          <source
                            src={`http://localhost:3000${item.url}`}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-1">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="text-gray-700 text-xs mb-3">
                        Downloads: {item.downloadCount || 0}
                      </p>
                      <button
                        onClick={() => handleDownload(item)}
                        className="mt-auto btn btn-sm btn-primary"
                      >
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 p-3 rounded-full shadow-lg text-white hover:bg-indigo-700 transition"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
