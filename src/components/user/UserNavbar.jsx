import React from 'react';
import { 
  MapPin, Search, Bell, User, ChevronDown, Menu, X, 
  ChevronRight, Star, Heart, Settings, LogOut, ShoppingBag 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatLocation } from '../../utils/formatUtils';

const UserNavbar = ({ 
  userData, cartCount, searchQuery, searchResults, 
  isSearching, showSearchResults, handleSearchInputChange, 
  handleSearchResultClick, isDropdownOpen, setIsDropdownOpen, 
  dropdownRef, handleLogout, setShowSearchResults 
}) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/5 py-3 md:py-4 px-4 md:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6">
        
        {/* --- Logo --- */}
        <div onClick={() => navigate('/user/home')} className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 cursor-pointer group">
          FOODIE<span className="h-2 w-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform"></span>
        </div>

        {/* --- Search Container */}
        <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 w-full group search-container relative transition-all focus-within:border-amber-500/50 focus-within:bg-white/10">
          <div className="flex items-center gap-2 border-r border-white/10 pr-3 md:pr-4 cursor-pointer">
            <MapPin size={18} className="text-amber-500" />
            <span className="text-xs md:text-sm font-bold text-slate-200 hidden sm:inline">{formatLocation(userData?.city, 'Jaipur')}</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 flex-1">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search for restaurant, cuisine or a dish" 
              className="bg-transparent w-full text-xs md:text-sm outline-none placeholder:text-slate-600 text-white"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
            />
          </div>

          {/* --- PREMIUM SEARCH DROPDOWN --- */}
          {showSearchResults && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#121212] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-[350px] md:max-h-[400px] overflow-y-auto no-scrollbar py-3 md:py-4 px-2 md:px-3">
                {isSearching ? (
                  <div className="py-10 md:py-12 flex flex-col items-center justify-center space-y-3 md:space-y-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Curating the best for you...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Top Recommendations</p>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleSearchResultClick(result)}
                        className="group flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/5"
                      >
                        <div className="relative h-12 w-12 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-lg md:rounded-xl bg-neutral-800">
                          <img src={result.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'} alt={result.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs md:text-sm text-slate-100 truncate group-hover:text-amber-500 transition-colors">{result.name}</h4>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${result.type === 'restaurant' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'}`}>
                              {result.type?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] md:text-xs text-slate-500 truncate mt-0.5">{result.cuisine}</p>
                          <div className="flex items-center gap-2 md:gap-3 mt-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] md:text-[10px] font-black text-emerald-500">{result.rating || '4.0'}</span>
                              <Star size={10} className="fill-emerald-500 text-emerald-500" />
                            </div>
                            <span className="h-0.5 w-0.5 bg-slate-700 rounded-full" />
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-500">{result.time}</span>
                            <span className="h-0.5 w-0.5 bg-slate-700 rounded-full" />
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-500">{result.price}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 md:py-12 text-center text-slate-500 italic text-xs md:text-sm">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- Right Actions (Cart & Profile) --- */}
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate('/user/notifications')} className="relative p-2 md:p-2.5 text-slate-400 hover:text-amber-500 transition-colors hover:bg-white/5 rounded-xl">
            <Bell size={24} />
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
              3
            </span>
          </button>
          <button onClick={() => navigate('/user/cart')} className="relative p-2 md:p-2.5 text-slate-400 hover:text-amber-500 transition-colors hover:bg-white/5 rounded-xl">
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 cursor-pointer group p-1 pr-2 md:pr-3 rounded-full hover:bg-white/5 transition-all">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-amber-500 transition-all">
                <img src={userData?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name}`} alt="User" className="w-full h-full object-cover" />
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* --- PREMIUM PROFILE DROPDOWN --- */}
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+15px)] right-0 w-56 md:w-64 bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-4 md:px-6 py-4 md:py-5 bg-white/[0.02] border-b border-white/5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Authenticated</p>
                  <h4 className="font-black text-slate-100 truncate text-xs md:text-sm uppercase italic">{userData?.name || 'User'}</h4>
                  <p className="text-[10px] md:text-[11px] text-slate-500 truncate mt-0.5">{userData?.email || 'user@foodie.com'}</p>
                </div>

                <div className="p-2">
                  <DropdownItem icon={<User size={18} />} label="My Profile" onClick={() => {navigate('/user/profile'); setIsDropdownOpen(false);}} />
                  <DropdownItem icon={<ShoppingBag size={18} />} label="My Orders" onClick={() => {navigate('/user/profile', { state: { activeTab: 'Orders' } }); setIsDropdownOpen(false);}} />
                  <DropdownItem icon={<Heart size={18} />} label="Favorites" onClick={() => {navigate('/user/profile', { state: { activeTab: 'Favorites' } }); setIsDropdownOpen(false);}} />
                  <div className="h-px bg-white/5 my-2 mx-4" />
                  <DropdownItem icon={<Settings size={18} />} label="Settings" onClick={() => {navigate('/user/profile/security'); setIsDropdownOpen(false);}} />
                </div>

                <div className="p-2 bg-rose-500/5 border-t border-white/5">
                  <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper Component for Dropdown Items
const DropdownItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
    <div className="flex items-center gap-2 md:gap-3">
      <span className="text-slate-500 group-hover:text-amber-500 transition-colors">{icon}</span>
      <span className="text-[10px] md:text-xs font-bold tracking-tight">{label}</span>
    </div>
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
  </button>
);

export default UserNavbar;