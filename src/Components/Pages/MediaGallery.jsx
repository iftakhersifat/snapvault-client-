import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRefs = useRef([]);

  // Fetch media from backend
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

  // Initial fetch
  useEffect(() => {
    fetchMedia();
  }, []);

  // Group media by category (or fallback to Uncategorized)
  const groupedMedia = mediaList.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // Scroll listener to show scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle download of media
  const handleDownload = async (item) => {
    try {
      // Notify backend of download
      const res = await fetch('http://localhost:3000/media/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: item._id }),
      });
      if (!res.ok) throw new Error('Failed to notify download');

      // Refresh media list to update download count
      await fetchMedia();

      // Download file
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

  // Pause other videos when one plays
  const handlePlay = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) vid.pause();
    });
  };

  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: 'spring' },
    }),
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

      <div className="relative min-h-screen text-white animated-gradient-bg bg-[length:800%_800%]">
        <div className="max-w-6xl mx-auto p-6 md:px-23 lg:px-0">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold mb-10"
          >
            📁 Snap Gallery
          </motion.h2>

          {loading ? (
            <p className="text-gray-200 text-lg">Loading media...</p>
          ) : mediaList.length === 0 ? (
            <p className="text-gray-300 text-lg">No public media found.</p>
          ) : (
            Object.entries(groupedMedia).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold mb-4 border-b border-indigo-500 pb-2">
                  {category}
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
    </>
  );
}
