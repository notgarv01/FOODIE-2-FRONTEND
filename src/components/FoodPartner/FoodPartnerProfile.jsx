import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import PartnerSidebar from './PartnerSidebar';
import PartnerHeader from './PartnerHeader';
import { LayoutDashboard, Video, Rows3, BarChart3, Settings } from 'lucide-react';

const FoodPartnerProfile = () => {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-slate-200">
      <PartnerSidebar />
      
      <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        <PartnerHeader />
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto flex-1 pb-20 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 z-[100]">
        <div className="flex items-center justify-around py-2">
          <MobileNavItem to="/food-partner/home" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <MobileNavItem to="/food-partner/videos" icon={<Video size={20} />} label="Videos" />
          <MobileNavItem to="/food-partner/menu" icon={<Rows3 size={20} />} label="Menu" />
          <MobileNavItem to="/food-partner/sales" icon={<BarChart3 size={20} />} label="Sales" />
          <MobileNavItem to="/food-partner/edit-profile" icon={<Settings size={20} />} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

const MobileNavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${
        isActive ? "text-amber-500" : "text-slate-500 hover:text-slate-300"
      }`
    }
  >
    {icon}
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </NavLink>
);

export default FoodPartnerProfile;
