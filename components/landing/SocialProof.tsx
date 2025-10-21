'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Instagram, Music2 } from 'lucide-react';

const videos = [
  { id: '1', src: '/videos/1.mp4', platform: 'instagram' },
  { id: '2', src: '/videos/2.mp4', platform: 'tiktok' },
  { id: '3', src: '/videos/3.mp4', platform: 'instagram' },
  { id: '4', src: '/videos/4.mp4', platform: 'tiktok' },
  { id: '5', src: '/videos/5.mp4', platform: 'instagram' },
  { id: '6', src: '/videos/6.mp4', platform: 'tiktok' },
  { id: '7', src: '/videos/7.mp4', platform: 'instagram' },
  { id: '8', src: '/videos/8.mp4', platform: 'tiktok' },
  { id: '9', src: '/videos/9.mp4', platform: 'instagram' },
  { id: '10', src: '/videos/10.mp4', platform: 'tiktok' },
  { id: '11', src: '/videos/11.mp4', platform: 'instagram' },
];

function VideoCard({ video, index }: { video: typeof videos[0]; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-64 md:w-72"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer">
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-cover"
          playsInline
          loop={false}
          muted={false}
        />

        {/* Platform Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-2">
          {video.platform === 'tiktok' ? (
            <Music2 className="w-4 h-4 text-white" />
          ) : (
            <Instagram className="w-4 h-4 text-white" />
          )}
          <span className="text-white text-xs font-semibold uppercase">
            {video.platform}
          </span>
        </div>

        {/* Play/Pause Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-gray-900 ml-0.5" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Gradient Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">As Seen On</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Featured by</span>{' '}
            <span className="gradient-text">Fashion Influencers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See what popular creators are saying about FitCheck on Instagram & TikTok
          </p>
        </motion.div>

        {/* Scrolling Video Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {/* Gradient Fades on Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-lg">
            Join <span className="font-bold gradient-text">50,000+</span> fashion lovers using FitCheck
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
