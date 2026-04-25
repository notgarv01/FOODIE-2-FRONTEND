import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Video, Play, Heart, MessageCircle, Volume2, VolumeX, Eye } from 'lucide-react';
import { API_URL } from '../../utils/api';

const VideosView = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Add a small delay to avoid rapid requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch(`${API_URL}/api/food/videos`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setVideos(data.videos || []);
        } else {
          setError(data.message || 'Failed to fetch videos');
        }
      } catch (error) {
        setError('Network error while fetching videos');
        console.error('Video fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-24 md:py-40 gap-3 md:gap-4">
      <Loader2 className="animate-spin text-amber-500" size={40} strokeWidth={1} />
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Loading Cinema...</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic flex items-center gap-2 md:gap-3">
            <span className="text-amber-500">Video</span> Highlights
          </h2>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mt-2">Cinematic Menu Feed</p>
        </div>
        <div className="text-right hidden md:block">
            <span className="text-2xl md:text-3xl font-black italic text-white/10 select-none">LIVE FEED</span>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} isMuted={isMuted} setIsMuted={setIsMuted} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// Sub-component for individual cards to handle local hover state
const VideoCard = ({ video, isMuted, setIsMuted }) => {
  const videoRef = useRef(null);
  const [viewCounted, setViewCounted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const incrementViewCount = async (videoId) => {
    if (viewCounted) return; // Prevent multiple increments
    
    try {
      await fetch(`${API_URL}/api/food/increment-view/${videoId}`, {
        method: 'POST',
        credentials: 'include'
      });
      setViewCounted(true);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleMouseEnter = () => {
    if (!videoError && videoRef.current) {
      // Only load video when user hovers for bandwidth optimization
      if (videoRef.current.readyState === 0) {
        videoRef.current.load();
      }
      videoRef.current.play().catch(error => {
        console.error('Video play error:', error);
        if (error.name === 'NotSupportedError' || error.message.includes('429')) {
          setVideoError(true);
        }
      });
      incrementViewCount(video.id);
    }
  };
  
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    console.error('Video loading error for:', video.url);
    setVideoError(true);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#0F0F0F] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2"
    >
      {/* Video Container */}
      <div className="relative aspect-square md:aspect-video overflow-hidden">
        {/* Thumbnail Image - always shown as fallback */}
        <img 
          src={video.thumbnailUrl || ''}
          alt={video.dish}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoError ? 'opacity-100' : 'group-hover:opacity-0'}`}
        />
        
        {/* Video - shown on hover if no error */}
        {!videoError && (
          <video
            ref={videoRef}
            src={video.url}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110"
            muted={isMuted}
            loop
            playsInline
            preload="none"
            onError={handleVideoError}
          />
        )}
        
        {/* Overlay Over Video */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        
        {/* Floating Interactions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>

        {/* Info on Video */}
        <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Featured</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    <Eye size={10} /> {video.views || 0} Views
                </span>
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{video.dish}</h3>
        </div>
      </div>

      {/* Bottom Data Bar */}
      <div className="p-6 bg-[#0F0F0F] flex items-center justify-between">
        <div className="flex gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase">Likes</span>
                <span className="font-black text-white flex items-center gap-1">{video.likes || 0} <Heart size={14} className="text-rose-500 fill-rose-500" /></span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase">Discussions</span>
                <span className="font-black text-white flex items-center gap-1">{video.comments || 0} <MessageCircle size={14} className="text-sky-500" /></span>
            </div>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black text-slate-600 uppercase block">Price</span>
            <span className="text-xl font-black text-amber-500 italic">{video.price}</span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
    <div className="text-center py-20 md:py-32 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
        <Video size={32} className="text-slate-600" />
      </div>
      <h3 className="text-lg md:text-xl font-black uppercase italic text-white">The Screen is Dark</h3>
      <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[.3em] mt-2">Upload cinematically shot food videos to attract partners</p>
    </div>
);

export default VideosView;