import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Heart, Star, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { API_URL } from '../../../utils/api';

const ProfileFavorites = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user/favorites`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 md:py-32">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fetching your favorites...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 bg-white/[0.02] rounded-2xl md:rounded-[3rem] border border-white/5 border-dashed">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-2xl">
          <Heart size={32} className="text-slate-700" />
        </div>
        <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Your Heart is Empty</h3>
        <p className="text-slate-500 text-center max-w-xs mt-2 text-xs md:text-sm font-medium">
          Start adding your favorite cinematic dishes to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">
          Favorites <span className="text-amber-500 ml-2">({favorites.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {favorites.map((item) => (
          <div 
            key={item._id} 
            onClick={() => navigate(`/user/restaurant-profile?id=${item._id}`)}
            className="group relative bg-[#121212] border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-amber-500/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-3 md:top-5 right-3 md:right-5 z-10">
                <div className="bg-black/40 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-1.5 border border-white/10">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  <span className="text-[10px] md:text-xs font-black text-white">{item.rating || '4.0'}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div>
                <h4 className="text-base md:text-xl font-black text-white group-hover:text-amber-500 transition-colors truncate">
                  {item.name}
                </h4>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-0.5 md:mt-1">
                  {item.cuisine || 'Multi Cuisine'}
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-4 py-1.5 md:py-2 border-y border-white/5">
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Clock size={14} className="text-amber-500" />
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400">{item.time || '30 min'}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-400">{item.distance || '2.4 km'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 md:pt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-600 tracking-tighter">Price for two</span>
                  <span className="text-base md:text-lg font-black text-white">{item.price || '₹500'}</span>
                </div>
                <button 
                  onClick={() => navigate(`/user/restaurant-profile?id=${item._id}`)}
                  className="bg-white text-black h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFavorites;
