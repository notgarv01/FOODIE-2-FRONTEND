import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';
import { TrendingUp, Video, Star } from 'lucide-react';
import { API_URL } from '../../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/dashboard`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
          setStats(data.stats || []);
          setRecentOrders(data.recentOrders || []);
        } else {
          setStats([
            { label: "Total Revenue", value: "Rs42,500", icon: "TrendingUp", change: "+12.5%" },
            { label: "Live Orders", value: "08", icon: "ShoppingBag", change: "Active" },
            { label: "Total Views", value: "0", icon: "Video", change: "No views yet" },
            { label: "Avg Rating", value: "4.8", icon: "Star", change: "Top 5%" }
          ]);
          setRecentOrders([]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      TrendingUp: <TrendingUp size={20} />,
      ShoppingBag: <ShoppingBag size={20} />,
      Video: <Video size={20} />,
      Star: <Star size={20} />
    };
    return icons[iconName] || <TrendingUp size={20} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <Loader2 className="animate-spin text-white" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 md:p-6 bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4 hover:border-amber-500/20 transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-2 md:p-3 bg-amber-500/10 rounded-xl md:rounded-2xl text-amber-500">{getIcon(stat.icon)}</div>
              <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md bg-white/5 text-slate-400 uppercase tracking-widest">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">{stat.value}</p>
              <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 md:space-y-6">
        <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
          <ShoppingBag size={18} className="text-amber-500" /> Recent Orders
        </h2>
        <div className="bg-neutral-900/30 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Customer</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/2'}`}>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-white font-black text-[10px] md:text-xs uppercase">{order.id}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase">{order.items}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                        order.status === 'On the way' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-amber-500 font-black text-xs md:text-sm">Rs{order.totalAmount}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden md:table-cell">
                      <span className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase">{order.customer}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 md:p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-slate-600 mb-3 md:mb-4" />
              <p className="text-slate-500 font-medium text-xs md:text-sm">No orders yet</p>
              <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2">Start taking orders to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
