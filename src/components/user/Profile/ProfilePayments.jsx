import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowUpRight, 
  ChevronRight, 
  Wallet, 
  Receipt,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { API_URL } from '../../../utils/api';

const ProfilePayments = () => {
  const [transactions, setTransactions] = useState([]);
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
            // Transform order data to payment format
            const paymentData = (data.orders || []).map(order => {
              const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
              return {
                id: order.orderId || order._id || 'N/A',
                date: orderDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                amount: `₹${(order.totalAmount || 0).toFixed(2)}`,
                method: order.paymentMethod || 'UPI (Google Pay)',
                status: order.status === 'Delivered' ? 'Success' : order.status || 'Processing',
                restaurant: order.restaurant?.restaurantName || order.restaurant?.name || 'Restaurant',
                items: order.items?.length || 0
              };
            });
            setTransactions(paymentData);
          } else {
            setError('Failed to load payment history');
          }
        } else {
          setError('Failed to load payment history');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">
            Payment <span className="text-amber-500 ml-2">Vault</span>
          </h3>
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Transaction Registry & Security
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 bg-white/[0.03] border border-white/10 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl backdrop-blur-md">
          <ShieldCheck size={18} className="text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">Secure Billing</span>
            <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Level 1 PCI Compliant</span>
          </div>
        </div>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1 group relative bg-gradient-to-br from-amber-500 to-orange-600 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden transition-transform hover:scale-[1.02]">
          <Wallet className="text-white/90 mb-4 md:mb-6" size={32} strokeWidth={2.5} />
          <h4 className="text-white font-black text-lg md:text-xl uppercase italic leading-none">Default<br/>Method</h4>
          <p className="text-white/80 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-3 md:mt-4 italic">Visa •• 4242</p>
          <CreditCard className="absolute -right-4 md:-right-6 -bottom-4 md:-bottom-6 text-white/10" size={120} />
        </div>

        <div className="md:col-span-2 bg-[#121212] border border-white/5 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col justify-center relative">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Quick Links</p>
            <button className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase hover:text-white transition-colors">Manage All</button>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {['G-Pay', 'Apple Pay', 'Net Banking', 'Credit Card'].map((mode) => (
              <div key={mode} className="px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/[0.03] border border-white/5 text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest hover:border-amber-500/50 transition-colors cursor-pointer">
                {mode}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Transaction History */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl md:rounded-[3rem] overflow-hidden">
        <div className="px-4 md:px-8 py-4 md:py-7 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Receipt size={18} className="text-amber-500" />
            <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">Order History</h4>
          </div>
          <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase">{transactions.length} Transactions</span>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16 md:py-20">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
              <p className="text-xs md:text-sm text-slate-500">Loading payment history...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4">
            <CreditCard size={64} className="text-slate-600 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-2">Error Loading Payments</h3>
            <p className="text-slate-500 text-center max-w-md mb-3 md:mb-4 text-xs md:text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-amber-500 text-black rounded-lg font-bold text-xs md:text-sm"
            >
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4">
            <CreditCard size={64} className="text-slate-600 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-2">No Payment History</h3>
            <p className="text-slate-500 text-center max-w-md text-xs md:text-sm">
              You haven't made any payments yet. Start ordering to see your payment history here!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#121212] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-3 md:mb-4 hover:bg-white/[0.02] transition-all">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="bg-neutral-800 p-2 md:p-3 rounded-lg md:rounded-xl">
                      <CreditCard className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm md:text-base">{tx.id}</h4>
                      <p className="text-slate-500 text-[10px] md:text-xs">{tx.date}, {tx.time}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase ${
                    tx.status === 'Success' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
                  }`}>
                    Payment {tx.status}
                  </span>
                </div>

                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
                  <div>
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest">Amount Paid</p>
                    <p className="text-white text-lg md:text-xl font-black">{tx.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-black tracking-widest">Method</p>
                    <p className="text-amber-500 font-bold text-xs md:text-sm italic">{tx.method}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <p className="text-center text-slate-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
        End-to-End Encrypted • Secured by Stripe & Razorpay
      </p>
    </div>
  );
};

export default ProfilePayments;