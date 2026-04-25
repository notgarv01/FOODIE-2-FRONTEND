import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatLocation } from '../../../utils/formatUtils';

const FollowingTab = ({ following = [], onUnfollow }) => {
  if (following.length === 0) {
    return (
      <div className="text-center py-12 md:py-20 px-4 bg-neutral-900/20 rounded-2xl md:rounded-[2.5rem] border border-dashed border-white/10">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">You aren't following any restaurants yet</p>
        <Link to="/user/home" className="text-amber-500 text-[10px] md:text-xs font-black uppercase mt-3 md:mt-4 inline-block hover:underline">Explore Kitchens</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {following.map((restaurant) => (
        <div key={restaurant._id} className="bg-neutral-900/40 border border-white/5 p-3 md:p-5 rounded-xl md:rounded-[2rem] flex items-center gap-3 md:gap-4 group hover:border-amber-500/30 transition-all">
          <img 
            src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop'} 
            alt={restaurant.restaurantName} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border border-white/10 bg-neutral-800"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop';
            }}
          />
          <div className="flex-1">
            <h3 className="font-black italic text-white uppercase tracking-tighter text-base md:text-lg leading-tight">
              {restaurant.restaurantName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
              <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-amber-500">
                <Star size={12} fill="currentColor" /> {restaurant.rating || '4.5'}
              </span>
              <span className="text-slate-600 text-[9px] md:text-[10px] font-bold uppercase flex items-center gap-1">
                <MapPin size={12} /> {formatLocation(restaurant.city, 'Jaipur')}
              </span>
            </div>
            <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-3">
               <Link 
                to={`/user/restaurant-profile?id=${restaurant._id}`}
                className="bg-white/5 hover:bg-white/10 p-1.5 md:p-2 rounded-lg text-white transition-colors"
               >
                 <ExternalLink size={14} />
               </Link>
               <button 
                onClick={() => onUnfollow(restaurant._id)}
                className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400"
               >
                 Unfollow
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingTab;