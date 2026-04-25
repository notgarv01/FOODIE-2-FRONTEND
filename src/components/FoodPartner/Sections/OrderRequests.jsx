import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '../../../utils/api';

const OrderRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/orders`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderAction = async (orderId, action) => {
    try {
      const response = await fetch(`${API_URL}/api/food/orders/${orderId}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: action === 'accept' ? 'Accepted' : 'Rejected' }
            : order
        ));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <Loader2 className="animate-spin text-white" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
        <ShoppingBag size={18} className="text-amber-500" /> Order Requests
      </h2>
      <div className="space-y-3 md:space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-neutral-900/30 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-white font-black text-xs md:text-sm uppercase italic">Order #{order.id}</h3>
                  <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase ${
                  order.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                  order.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-3 md:mb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-slate-300">{item.name} x {item.quantity}</span>
                    <span className="text-amber-500 font-bold">Rs{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-white/10">
                <div>
                  <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase">Total</p>
                  <p className="text-white font-black text-base md:text-lg">Rs{order.totalAmount}</p>
                </div>
                
                {order.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOrderAction(order.id, 'reject')}
                      className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                      <XCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleOrderAction(order.id, 'accept')}
                      className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500/20 transition-all"
                    >
                      <CheckCircle size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 md:py-12">
            <ShoppingBag size={48} className="mx-auto text-slate-600 mb-3 md:mb-4" />
            <p className="text-slate-500 font-medium text-xs md:text-sm">No order requests yet</p>
            <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2">New orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRequests;
