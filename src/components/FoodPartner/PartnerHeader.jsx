import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { API_URL } from '../../utils/api';

const PartnerHeader = () => {
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 shrink-0">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">Dashboard</h1>
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">Operational Overview</p>
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto md:hidden bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 px-3 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
      <NavLink 
        to="/food-partner/menu/add"
        className="w-full md:w-auto bg-amber-500 text-black px-4 md:px-6 py-2 md:py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
      >
        <Plus size={18} strokeWidth={3} /> Add New Food
      </NavLink>
    </header>
  );
};

export default PartnerHeader;
