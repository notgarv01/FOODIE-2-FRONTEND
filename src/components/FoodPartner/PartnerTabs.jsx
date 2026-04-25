import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Rows3,
  BarChart3,
  Settings,
  ShoppingBag,
  CreditCard
} from 'lucide-react';

const PartnerTabs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/food-partner/home' },
    { id: 'videos', label: 'Video Highlights', icon: Video, path: '/food-partner/videos' },
    { id: 'menu', label: 'Menu Management', icon: Rows3, path: '/food-partner/menu' },
    { id: 'orders', label: 'Order Requests', icon: ShoppingBag, path: '/food-partner/orders' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/food-partner/payments' },
    { id: 'sales', label: 'Sales Reports', icon: BarChart3, path: '/food-partner/sales' },
    { id: 'settings', label: 'Kitchen Settings', icon: Settings, path: '/food-partner/edit-profile' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            onClick={() => setActiveTab(tab.id)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                  : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default PartnerTabs;
