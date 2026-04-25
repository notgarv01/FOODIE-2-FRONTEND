import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import {
  LayoutDashboard,
  Video,
  Rows3,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const PartnerSidebar = () => {
  const [restaurantName, setRestaurantName] = useState("Loading...");

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/profile`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.restaurantName) {
            setRestaurantName(data.data.restaurantName);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant name:', error);
        setRestaurantName("Kitchen");
      }
    };

    fetchRestaurantName();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/food-partner/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) window.location.href = '/food-partner/login';
    } catch (error) {
      window.location.href = '/food-partner/login';
    }
  };

  return (
    <aside className="w-56 md:w-64 border-r border-white/5 bg-[#050505] flex flex-col p-4 md:p-6 hidden lg:flex shrink-0">
      <div className="text-lg md:text-xl font-black tracking-tighter mb-8 md:mb-12 px-3 md:px-4 italic">
        FOODIE<span className="text-amber-500">.</span>PARTNER
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem to="/food-partner/home" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/food-partner/videos" icon={<Video size={18} />} label="Video Highlights" />
        <NavItem to="/food-partner/menu" icon={<Rows3 size={18} />} label="Menu Management" />
        <NavItem to="/food-partner/sales" icon={<BarChart3 size={18} />} label="Sales Reports" />
        <NavItem to="/food-partner/edit-profile" icon={<Settings size={18} />} label="Kitchen Settings" />
      </nav>

      <div className="mt-auto mb-3 md:mb-4">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-bold text-[9px] md:text-[10px] tracking-widest uppercase text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 group">
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Logout
        </button>
      </div>

      <div className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5">
        <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Kitchen</p>
        <p className="text-xs md:text-sm font-bold text-white truncate italic">{restaurantName || 'Loading...'}</p>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl font-bold text-[10px] md:text-xs tracking-widest uppercase transition-all ${
        isActive ? "bg-amber-500 text-black shadow-xl shadow-amber-500/20 italic" : "text-slate-500 hover:bg-white/5 hover:text-white"
      }`
    }
  >
    {icon} {label}
  </NavLink>
);

export default PartnerSidebar;
