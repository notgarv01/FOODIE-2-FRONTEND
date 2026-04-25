import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit3, Camera, Star, Users } from 'lucide-react';

const StatItem = ({ value, label, isPoints, isFollowing }) => (
  <div className="text-center">
    <p className={`text-xl md:text-2xl font-black ${isPoints ? 'text-amber-500' : isFollowing ? 'text-emerald-500' : 'text-white'} tracking-tighter flex items-center justify-center gap-1`}>
      {value} {isPoints && <Star size={16} fill="currentColor" />}
      {isFollowing && <Users size={16} />}
    </p>
    <p className="text-[9px] md:text-[10px] text-slate-600 uppercase tracking-widest font-black mt-0.5 md:mt-1">{label}</p>
  </div>
);

const ProfileHeader = ({ userData }) => {
  return (
    <div className="bg-neutral-900/40 rounded-2xl md:rounded-[2.5rem] border border-white/5 p-4 md:p-6 lg:p-8 relative overflow-hidden group shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8 relative z-10">
        {/* Avatar with Camera Icon */}
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] bg-neutral-800 border-2 border-white/10 overflow-hidden shadow-2xl">
            {userData?.profilePhoto ? (
              <img src={userData.profilePhoto} alt={userData?.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <img src={userData?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Garv"} alt={userData?.name || "User"} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 p-2 md:p-2.5 rounded-xl text-black cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-[#0A0A0A]">
            <Camera size={18} />
          </div>
        </div>

        {/* Name and Bio */}
        <div className="text-center md:text-left space-y-1.5 md:space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic">{userData?.name || 'User Name'}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={14} className="text-amber-500" /> {userData?.location || 'Location'}</span>
            <span className="h-1 w-1 bg-slate-700 rounded-full" />
            <span>Joined {userData?.joinDate || 'Recently'}</span>
          </div>
          <Link to="/user/edit-profile">
            <button className="mt-3 md:mt-4 flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-slate-300">
              <Edit3 size={14} /> Edit Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-10 pt-6 md:pt-10 border-t border-white/5 relative z-10">
        <StatItem value={userData?.orders || 0} label="Orders" />
        <StatItem value={userData?.favorites?.length || 0} label="Favorites" />
        <StatItem value={userData?.following?.length || 0} label="Following" isFollowing />
      </div>
    </div>
  );
};

export default ProfileHeader;
