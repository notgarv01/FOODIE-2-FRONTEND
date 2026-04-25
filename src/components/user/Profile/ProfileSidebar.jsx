import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Package, Heart, CreditCard, ShieldCheck, LogOut, ChevronRight, Users } from 'lucide-react';

const ProfileSidebar = ({ handleLogout }) => {
  const sidebarItems = [
    { id: 'Profile', icon: <User size={18} />, label: 'My Profile', path: '' },
    { id: 'Orders', icon: <Package size={18} />, label: 'Order History', path: 'orders' },
    { id: 'Favorites', icon: <Heart size={18} />, label: 'Favorites', path: 'favorites' },
    { id: 'Following', icon: <Users size={18} />, label: 'Following', path: 'following' },
    { id: 'Payments', icon: <CreditCard size={18} />, label: 'Payments', path: 'payments' },
    { id: 'Security', icon: <ShieldCheck size={18} />, label: 'Security', path: 'security' },
  ];

  return (
    <aside className="w-full lg:w-72 space-y-1.5 md:space-y-2">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.id === 'Profile'}
          className={({ isActive }) => `w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm tracking-tight transition-all ${
            isActive 
            ? 'bg-white text-black shadow-xl shadow-white/5' 
            : 'text-slate-500 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3 md:gap-4">
            {item.icon} {item.label}
          </div>
          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </NavLink>
      ))}
      <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-rose-500 hover:bg-rose-500/5 transition-all"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;