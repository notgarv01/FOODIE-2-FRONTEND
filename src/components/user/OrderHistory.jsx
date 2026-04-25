import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { API_URL } from '../../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user/orders`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrders(data.orders || []);
          } else {
            setError('Failed to load orders');
          }
        } else {
          setError('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      case 'confirmed':
        return <Clock className="text-yellow-500" size={20} />;
      case 'preparing':
        return <AlertCircle className="text-blue-500" size={20} />;
      case 'on the way':
        return <Package className="text-amber-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-500 bg-green-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      case 'confirmed':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'preparing':
        return 'text-blue-500 bg-blue-500/10';
      case 'on the way':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 md:py-20">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-xs md:text-sm text-slate-500">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4">
        <Package size={64} className="text-slate-600 mb-3 md:mb-4" />
        <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-2">Error Loading Orders</h3>
        <p className="text-slate-500 text-center max-w-md mb-3 md:mb-4 text-sm md:text-base">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 md:px-4 py-2 md:py-2.5 bg-amber-500 text-black rounded-lg font-bold text-xs md:text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4">
        <Package size={64} className="text-slate-600 mb-3 md:mb-4" />
        <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-2">No Orders Yet</h3>
        <p className="text-slate-500 text-center max-w-md text-sm md:text-base">
          You haven't placed any orders yet. Start exploring and order your favorite food!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Order History</h2>
        <p className="text-slate-500 text-xs md:text-sm">{orders.length} orders</p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-neutral-900/40 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-white/10 transition-all hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                  <Package size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white">Order #{order.orderId || 'N/A'}</h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {new Date(order.orderDate || order.createdAt || '2024-01-01').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status || 'Unknown'}
                </span>
                {getStatusIcon(order.status)}
              </div>
            </div>

            <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-slate-400">{item.quantity || 1}x</span>
                    <span className="text-white font-medium">{item.name || 'Item'}</span>
                  </div>
                  <span className="text-slate-400">₹{(item.price || 0).toFixed(2)}</span>
                </div>
              )) || (
                <p className="text-slate-500 text-xs md:text-sm">No items found</p>
              )}
            </div>

            <div className="border-t border-white/5 pt-3 md:pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-600 uppercase tracking-widest font-black mb-0.5 md:mb-1">Total Amount</p>
                  <p className="text-base md:text-lg font-bold text-white">₹{(order.totalAmount || 0).toFixed(2)}</p>
                </div>
                {order.deliveryAddress && (
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-600 uppercase tracking-widest font-black mb-0.5 md:mb-1">Delivery</p>
                    <p className="text-xs md:text-sm text-slate-400 line-clamp-1">{order.deliveryAddress}</p>
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors text-xs md:text-sm">
                View Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
