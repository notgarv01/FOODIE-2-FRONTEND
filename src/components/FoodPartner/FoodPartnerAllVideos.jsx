import React from 'react';
import {
  Play,
  Plus,
  Eye,
  Heart,
  ShoppingBag,
  MoreVertical,
  Trash2,
  BarChart2
} from 'lucide-react';

const FoodPartnerAllVideos = () => {
  const myVideos = [
    {
      id: 1,
      title: "Sizzling Paneer Tikka",
      views: "12.5k",
      likes: "840",
      orders: "124",
      status: "Live",
      thumbnail: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400"
    },
    {
      id: 2,
      title: "Handi Biryani Highlight",
      views: "45.2k",
      likes: "3.2k",
      orders: "512",
      status: "Live",
      thumbnail: "https://images.unsplash.com/photo-1589187151032-573a91317445?q=80&w=400"
    },
    {
      id: 3,
      title: "Behind the Scenes: Kitchen",
      views: "2.1k",
      likes: "150",
      orders: "0",
      status: "Review",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-4 md:p-8 space-y-6 md:space-y-10 min-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic">
            Video Highlights
          </h2>
          <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1">
            Manage your visual menu and storytelling
          </p>
        </div>

        <button className="bg-amber-500 text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2 md:gap-3 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          Upload New Video
        </button>
      </div>

      {/* Analytics */}
      <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2">
        <div className="bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-2xl min-w-[160px] md:min-w-[200px]">
          <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Total Highlights
          </p>
          <p className="text-xl md:text-2xl font-black text-amber-500">14</p>
        </div>

        <div className="bg-white/5 border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-2xl min-w-[160px] md:min-w-[200px]">
          <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Total Conversions
          </p>
          <p className="text-xl md:text-2xl font-black text-amber-500">2,410 Orders</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">

        {myVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:border-amber-500/30 transition-all duration-500"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-neutral-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/10">
                  <Play fill="white" size={24} />
                </div>
              </div>

              <div className="absolute top-3 md:top-4 left-3 md:left-4">
                <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                  video.status === 'Live'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {video.status}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-base md:text-xl font-bold text-white leading-tight">
                  {video.title}
                </h3>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl">
                  <Eye size={14} className="mx-auto mb-1 text-slate-500" />
                  <p className="text-xs md:text-sm font-black text-white">{video.views}</p>
                </div>

                <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl">
                  <Heart size={14} className="mx-auto mb-1 text-rose-400" />
                  <p className="text-xs md:text-sm font-black text-white">{video.likes}</p>
                </div>

                <div className="text-center p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl border border-amber-500/10">
                  <ShoppingBag size={14} className="mx-auto mb-1 text-amber-400" />
                  <p className="text-xs md:text-sm font-black text-amber-400">
                    {video.orders}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:gap-3 pt-2">
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <BarChart2 size={14} />
                  Analytics
                </button>

                <button className="px-3 md:px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <div className="border-2 border-dashed border-white/10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center p-8 md:p-12 space-y-3 md:space-y-4 hover:border-amber-500/20 transition-all cursor-pointer group">
          <div className="p-3 md:p-4 bg-white/5 rounded-full group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all">
            <Plus size={32} />
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Add another highlight
          </p>
        </div>

      </div>
    </div>
  );
};

export default FoodPartnerAllVideos;