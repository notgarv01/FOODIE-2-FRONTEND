import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { API_URL } from '../../../utils/api';

const PartnerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/payments`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
          setPayments(data.payments || []);
          setTotalEarnings(data.totalEarnings || 0);
        } else {
          setPayments([]);
          setTotalEarnings(0);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <Loader2 className="animate-spin text-white" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 md:p-6 bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-amber-500 rounded-xl md:rounded-2xl text-black">
              <DollarSign size={20} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500">Total Earnings</span>
          </div>
          <p className="text-2xl md:text-4xl font-black text-white tracking-tighter italic">Rs{totalEarnings.toLocaleString()}</p>
        </div>

        <div className="p-4 md:p-6 bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl md:rounded-2xl text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">This Month</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">Rs{(totalEarnings * 0.3).toLocaleString()}</p>
        </div>

        <div className="p-4 md:p-6 bg-neutral-900/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl md:rounded-2xl text-blue-500">
              <CreditCard size={20} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Transactions</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">{payments.length}</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
          <CreditCard size={18} className="text-amber-500" /> Payment History
        </h2>
        <div className="bg-neutral-900/30 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden">
          {payments.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id} className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/2'}`}>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="text-slate-300 text-[10px] md:text-xs">{new Date(payment.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-white font-black text-[10px] md:text-xs uppercase">#{payment.orderId}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-amber-500 font-black text-xs md:text-sm">Rs{payment.amount}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                        payment.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        payment.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 md:p-12 text-center">
              <CreditCard size={48} className="mx-auto text-slate-600 mb-3 md:mb-4" />
              <p className="text-slate-500 font-medium text-xs md:text-sm">No payments yet</p>
              <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2">Payment history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerPayments;
