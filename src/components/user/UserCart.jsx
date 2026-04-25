import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Ticket, 
  ChevronRight, ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { API_URL } from '../../utils/api';

const UserCart = ({ onCheckout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantData } = location.state || {};
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/cart`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedItems = (data.cart || []).map((item, index) => ({
            id: index + 1,
            name: item.name,
            price: item.price,
            qty: item.quantity || 1,
            image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300",
            type: item.isVeg ? "veg" : "non-veg",
            foodId: item.foodId,
            restaurantId: item.restaurantId,
            restaurant: item.restaurant
          }));
          setItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState("");

  const updateQty = async (id, delta) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    
    setItems(items.map(item => item.id === id ? { ...item, qty: newQty } : item));
    
    try {
      await fetch(`${API_URL}/api/user/update-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ foodId: item.foodId, quantity: newQty })
      });
    } catch (error) { console.error(error); }
  };

  const removeItem = async (id) => {
    const itemToRemove = items.find(item => item.id === id);
    if (!itemToRemove) return;
    
    try {
      const response = await fetch(`${API_URL}/api/user/remove-from-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ foodId: itemToRemove.foodId })
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        if (window.showToast) window.showToast(`${itemToRemove.name} removed`, 'info');
      }
    } catch (error) { console.error(error); }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = 45;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "FOODIE60") {
      setDiscount(Math.round(subtotal * 0.6));
      setIsApplied(true);
      setError("");
    } else {
      setError("Invalid Code");
      setIsApplied(false);
      setTimeout(() => setError(""), 3000);
    }
  };

  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 py-4 md:py-6 lg:py-12 px-3 md:px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-5 mb-6 md:mb-8 lg:mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 md:p-2.5 lg:p-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all active:scale-90"
          >
            <ArrowLeft size={16} md:size={18} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
              Review <span className="text-amber-500">Bag</span>
            </h1>
            <p className="text-slate-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mt-1 italic">
              {restaurantData?.name || 'Your Order'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3 md:mb-4"></div>
            <p className="text-xs md:text-sm text-slate-500">Loading...</p>
          </div>
        ) : items.length > 0 ? (
          /* Responsive Grid: 1 column on mobile, 2 on Large Desktop */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 md:gap-8 lg:gap-10 items-start">
            
            {/* --- Left: Cart Items --- */}
            <div className="space-y-3 md:space-y-4 order-2 lg:order-1">
              {items.map((item) => (
                <div key={item.id} className="group bg-[#0F0F0F] border border-white/5 p-3 md:p-4 lg:p-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-3 md:gap-4 lg:gap-6 hover:border-amber-500/20 transition-all duration-300">
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-white/5">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 border ${item.type === 'veg' ? 'border-emerald-500' : 'border-rose-500'} flex items-center justify-center p-0.5 rounded-sm`}>
                        <div className={`w-full h-full ${item.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full`} />
                      </div>
                      <h3 className="text-xs md:text-sm lg:text-base font-black text-white uppercase italic tracking-tight truncate">{item.name}</h3>
                    </div>
                    <p className="text-sm md:text-base lg:text-lg font-black text-amber-500 tracking-tighter leading-none">Rs {item.price}</p>
                  </div>

                  {/* Quantity Controls: Responsive sizing */}
                  <div className="flex items-center gap-2 md:gap-3 lg:gap-4 bg-black/40 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/5">
                    <button onClick={() => updateQty(item.id, -1)} className="text-slate-500 hover:text-white p-1"><Minus size={12}/></button>
                    <span className="text-xs md:text-sm font-black text-white w-3 md:w-4 text-center italic">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-slate-500 hover:text-white p-1"><Plus size={12}/></button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-1 md:p-2 text-slate-700 hover:text-rose-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* --- Right: Billing & Coupons --- */}
            <div className="space-y-4 md:space-y-6 lg:sticky lg:top-10 order-1 lg:order-2">
              
              {/* Promo Section */}
              <div className="bg-[#0F0F0F] border border-white/5 p-4 md:p-5 lg:p-6 rounded-[1.5rem] md:rounded-[2rem] space-y-3 md:space-y-4">
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-amber-500" />
                  <p className="text-[9px] font-black text-white uppercase tracking-widest italic">Promo Code</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="E.G. FOODIE60"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-2.5 text-[10px] font-black uppercase focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-800 w-full"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className={`px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                      isApplied ? 'bg-emerald-500 text-black' : 'bg-white text-black hover:bg-amber-500 active:scale-95'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {isApplied && <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">₹{discount} Discount Applied</p>}
                {error && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest animate-pulse">{error}</p>}
              </div>

              {/* Bill Details */}
              <div className="bg-[#0F0F0F] border border-white/5 p-5 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] space-y-4 md:space-y-6 shadow-2xl">
                <h3 className="font-black text-white uppercase italic tracking-widest text-[10px] md:text-[11px] border-b border-white/5 pb-3 md:pb-4">Bill Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-white">Rs {subtotal}</span>
                  </div>
                  {isApplied && (
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">
                      <span>Discount</span>
                      <span>- Rs {discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-500 italic">Rs {deliveryFee}</span>
                  </div>
                  
                  <div className="pt-4 md:pt-6 border-t border-white/10 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Total Pay</p>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-black text-amber-500 tracking-tighter italic leading-none">
                        Rs {total}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/user/checkout', { state: { cart: items, restaurantData } })}
                  className="w-full py-3 md:py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 bg-amber-500 text-black hover:bg-amber-400"
                >
                  Checkout <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[40vh] md:h-[50vh] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 opacity-40">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Bag is empty</p>
            <button onClick={() => navigate('/user/home')} className="text-xs font-black text-amber-500 border-b border-amber-500 pb-1">
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCart;