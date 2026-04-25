import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

const RestaurantCard = ({ 
  restaurant, 
  favorites, 
  favoriteLoading, 
  favoriteMessage, 
  handleFavoriteToggle 
}) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/user/restaurant-profile?id=${restaurant.id || restaurant._id}`)} 
      className="group cursor-pointer"
    >
      <div className="relative aspect-[16/10] md:aspect-video rounded-2xl md:rounded-4xl overflow-hidden mb-4 md:mb-5 bg-neutral-900">
        <img 
          src={restaurant.img} 
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100" 
        />
        <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {restaurant.isDineOutAvailable && (
              <span className="text-[9px] md:text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg backdrop-blur-md">
                Dine Out
              </span>
            )}
            {favoriteMessage[restaurant.id] && <span className="text-[9px] md:text-[10px] bg-black/60 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg font-bold">{favoriteMessage[restaurant.id]}</span>}
            <button 
              onClick={(e) => handleFavoriteToggle(e, restaurant.id)}
              disabled={favoriteLoading[restaurant.id]}
              className={`p-2 md:p-2.5 rounded-full border backdrop-blur-md transition-all ${
                favorites.includes(restaurant.id) 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                  : 'bg-black/20 border-white/10 text-white'
              } ${favoriteLoading[restaurant.id] ? 'opacity-50' : ''}`}
            >
              {favoriteLoading[restaurant.id] ? (
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart size={18} fill={favorites.includes(restaurant.id) ? "currentColor" : "none"} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg md:text-xl font-black">{restaurant.name}</h3>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg flex items-center gap-1">
            <span className="text-emerald-500 font-black text-xs md:text-sm">{restaurant.rating}</span>
            <Star size={12} className="fill-emerald-500 text-emerald-500" />
          </div>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <p className="text-slate-500 font-bold">{restaurant.cuisine}</p>
          <p className="text-slate-400 font-black">{restaurant.price}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
