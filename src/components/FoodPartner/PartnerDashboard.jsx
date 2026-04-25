import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Users, ShoppingCart, DollarSign, Clock, Star, ChevronRight } from 'lucide-react';

const PartnerDashboard = () => {
    const { partnerData } = useOutletContext();

    const stats = [
        { label: 'Total Orders', value: '1,234', icon: <ShoppingCart size={20} />, change: '+12%', positive: true },
        { label: 'Total Revenue', value: '₹45,678', icon: <DollarSign size={20} />, change: '+8%', positive: true },
        { label: 'Active Customers', value: '892', icon: <Users size={20} />, change: '+5%', positive: true },
        { label: 'Avg. Rating', value: '4.8', icon: <Star size={20} />, change: '+0.2', positive: true },
    ];

    const recentOrders = [
        { id: '#1234', customer: 'John Doe', items: '2x Burger, 1x Fries', total: '₹450', status: 'Delivered', time: '2 mins ago' },
        { id: '#1235', customer: 'Jane Smith', items: '1x Pizza, 2x Coke', total: '₹680', status: 'Preparing', time: '5 mins ago' },
        { id: '#1236', customer: 'Mike Johnson', items: '3x Pasta', total: '₹890', status: 'Pending', time: '8 mins ago' },
    ];

    return (
        <div className="space-y-6 md:space-y-10 px-1 sm:px-0">
            
            {/* Welcome Section - Stacked on mobile, side-by-side on tablet+ */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Welcome, <span className="text-amber-500">{partnerData?.restaurantName?.split(' ')[0] || 'Partner'}</span>
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium mt-2 uppercase tracking-widest">
                        Kitchen Operational Status: <span className="text-emerald-500 animate-pulse">Live</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl w-fit">
                    <TrendingUp size={18} className="text-amber-500" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-500">+24% performance</span>
                </div>
            </div>

            {/* Stats Grid - 1 col (mobile), 2 col (tablet), 4 col (desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 hover:border-amber-500/20 transition-all group shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl md:rounded-2xl ${stat.positive ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${stat.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-white tracking-tighter italic leading-none">{stat.value}</div>
                        <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-2">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Orders - Scrollable or Stacked List */}
            <div className="bg-[#0F0F0F] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter">Incoming <span className="text-amber-500">Transmissions</span></h2>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 hover:text-amber-400 transition-all border-b border-amber-500/20 pb-1">
                        Review All
                    </button>
                </div>
                <div className="space-y-3 md:space-y-4">
                    {recentOrders.map((order, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl hover:border-white/10 transition-all gap-4">
                            <div className="flex items-center gap-4">
                                <div className="hidden xs:flex w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 items-center justify-center shrink-0">
                                    <ShoppingCart size={18} className="text-amber-500" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-black text-white text-xs md:text-sm italic uppercase tracking-tight">{order.id}</div>
                                    <div className="text-slate-500 text-[10px] font-bold uppercase truncate">{order.customer}</div>
                                </div>
                            </div>
                            
                            {/* Middle section hidden on very small phones, visible from 'sm' up */}
                            <div className="hidden sm:block text-center flex-1 px-4">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1">{order.items}</div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/5 sm:border-none pt-3 sm:pt-0">
                                <div className="text-left sm:text-right">
                                    <div className="font-black text-amber-500 text-sm italic">{order.total}</div>
                                    <div className="sm:hidden text-slate-600 text-[8px] font-black uppercase tracking-widest">{order.items}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'Preparing' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-slate-500/10 text-slate-400'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <span className="text-slate-600 text-[9px] flex items-center gap-1 font-bold">
                                        <Clock size={10} /> {order.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions - 1 col to 3 col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <ActionButton icon={<ShoppingCart size={20} />} title="New Order" sub="Manual Entry" primary />
                <ActionButton icon={<Users size={20} />} title="Customers" sub="Loyalty Database" />
                <ActionButton icon={<Star size={20} />} title="Reviews" sub="Field Feedback" />
            </div>
        </div>
    );
};

// Sub-component for Quick Actions
const ActionButton = ({ icon, title, sub, primary }) => (
    <button className={`w-full rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 font-black transition-all flex items-center gap-4 active:scale-95 group border ${
        primary 
        ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20 hover:bg-amber-400' 
        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
    }`}>
        <div className={`p-3 rounded-xl ${primary ? 'bg-black/10' : 'bg-white/5 group-hover:bg-amber-500/20 group-hover:text-amber-500'}`}>
            {icon}
        </div>
        <div className="text-left">
            <div className="text-sm md:text-base uppercase italic tracking-tighter leading-none">{title}</div>
            <div className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] mt-1 ${primary ? 'text-black/60' : 'text-slate-500'}`}>{sub}</div>
        </div>
        <ChevronRight size={16} className="ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
);

export default PartnerDashboard;