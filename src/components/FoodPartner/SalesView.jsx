import React, { useState, useEffect } from 'react';
import { Loader2, BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign, Users, ShoppingCart } from 'lucide-react';

const SalesView = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState('7d');

  // Helper function to process orders into sales data
  const processOrdersToSalesData = (orders) => {
    if (!orders.length) return [];
    
    // Group orders by date
    const ordersByDate = {};
    orders.forEach(order => {
      const date = new Date(order.orderDate || Date.now()).toISOString().split('T')[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = [];
      }
      ordersByDate[date].push(order);
    });
    
    // Convert to sales data format
    return Object.keys(ordersByDate).map(date => {
      const dayOrders = ordersByDate[date];
      const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const uniqueCustomers = new Set(dayOrders.map(order => order.user)).size;
      
      return {
        date,
        revenue,
        orders: dayOrders.length,
        customers: uniqueCustomers
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Use existing dashboard endpoint since sales endpoint doesn't exist
        const response = await fetch(`${API_URL}/api/food/dashboard`, {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Process orders to create sales data
          const orders = data.recentOrders || [];
          const salesData = processOrdersToSalesData(orders);
          setSalesData(salesData);
        } else {
          setError('Failed to fetch sales data');
          setSalesData([]);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Network error while fetching sales data');
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalesData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <Loader2 className="animate-spin text-white" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-20">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
          <BarChart3 size={24} className="text-red-400" />
        </div>
        <p className="text-red-400 font-medium text-xs md:text-sm mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-3 md:px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-red-500/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  
  // Calculate average order value correctly (sum of daily averages divided by number of days)
  const avgOrderValue = salesData.length > 0 && salesData.some(day => day.orders > 0)
    ? Math.round(
        salesData
          .filter(day => day.orders > 0)
          .reduce((sum, day) => sum + (day.revenue / day.orders), 0) / 
        salesData.filter(day => day.orders > 0).length
      )
    : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
          <BarChart3 size={18} className="text-amber-500" /> Sales Reports
        </h2>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                timeRange === range
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 md:p-3 bg-amber-500/10 rounded-xl md:rounded-2xl text-amber-500">
              <DollarSign size={20} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md bg-green-500/20 text-green-400 uppercase tracking-widest">
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">Rs {totalRevenue.toLocaleString()}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Revenue</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl md:rounded-2xl text-blue-500">
              <ShoppingCart size={20} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md bg-green-500/20 text-green-400 uppercase tracking-widest">
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">{totalOrders}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Orders</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl md:rounded-2xl text-purple-500">
              <Users size={20} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md bg-red-500/20 text-red-400 uppercase tracking-widest">
              -2.1%
            </span>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">{totalCustomers}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Customers</p>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl md:rounded-2xl text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md bg-green-500/20 text-green-400 uppercase tracking-widest">
              +5.7%
            </span>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">Rs {avgOrderValue}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Avg Order Value</p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-neutral-900/40 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h3 className="text-base md:text-lg font-black text-white uppercase italic">Daily Breakdown</h3>
        </div>
        
        {salesData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Orders</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Customers</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Order</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((day, index) => {
                  const prevDay = salesData[index - 1];
                  const revenueChange = prevDay ? ((day.revenue - prevDay.revenue) / prevDay.revenue * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={day.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-white font-black text-[10px] md:text-xs uppercase">{day.date}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-amber-500 font-bold text-xs md:text-sm">Rs {day.revenue.toLocaleString()}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-slate-300 text-xs md:text-sm font-bold">{day.orders}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-slate-300 text-xs md:text-sm font-bold">{day.customers}</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-slate-400 text-xs md:text-sm">
                          Rs {day.orders > 0 ? Math.round(day.revenue / day.orders) : 0}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <span className={`flex items-center justify-end gap-1 text-[9px] md:text-[10px] font-black ${
                          revenueChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {revenueChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {Math.abs(revenueChange)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 md:p-12 text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <BarChart3 size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium text-xs md:text-sm">No sales data available</p>
            <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2">Start taking orders to see sales reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesView;
