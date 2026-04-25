import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';

import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Truck, 
  ShoppingBag, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: cartFromState, restaurantData } = location.state || {};
  const [cart, setCart] = useState(cartFromState || []);
  const [cartLoading, setCartLoading] = useState(!cartFromState || cartFromState.length === 0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch cart from backend if not passed via navigation state
  useEffect(() => {
    const fetchCart = async () => {
      if (cartFromState && cartFromState.length > 0) {
        setCartLoading(false);
        return;
      }
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
          setCart(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, [cartFromState]);

  // Fetch user profile to get real address
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Calculate real totals from cart data
  const subtotal = cart?.reduce((acc, item) => acc + (item.price * (item.qty || item.quantity || 1)), 0) || 0;
  const deliveryFee = 45;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-4 md:p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <button onClick={() => navigate(-1)} className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic">Checkout</h1>
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">{restaurantData?.name || 'Restaurant'} / {restaurantData?.location || 'Location'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 md:gap-8 lg:gap-12">
          
          {/* --- Left Side: Details --- */}
          <div className="space-y-8">
            
            {/* 1. Delivery Address Card */}
            <div className="bg-[#0F0F0F] border border-white/5 p-5 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] space-y-4 md:space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><MapPin size={18}/></div>
                  <h3 className="font-black text-white uppercase italic tracking-widest text-xs md:text-sm">Delivery Address</h3>
                </div>
                <button className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest hover:underline">Change</button>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-tight text-base md:text-lg">Home</p>
                {profileLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 md:h-4 bg-white/10 rounded w-48 md:w-64 mb-1"></div>
                    <div className="h-3 md:h-4 bg-white/10 rounded w-36 md:w-48"></div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed italic">
                    {userProfile?.address || 'No address saved'}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Payment Methods */}
            <div className="bg-[#0F0F0F] border border-white/5 p-5 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-3 border-b border-white/5 pb-4 md:pb-6 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><CreditCard size={18}/></div>
                <h3 className="font-black text-white uppercase italic tracking-widest text-xs md:text-sm">Payment Method</h3>
              </div>
              
              <div className="grid gap-3 md:gap-4">
                <PaymentOption 
                  id="upi" label="UPI (PhonePe / GPay)" 
                  active={paymentMethod === 'upi'} 
                  onClick={() => setPaymentMethod('upi')} 
                  icon={<Wallet size={18}/>} 
                />
                <PaymentOption 
                  id="card" label="Credit / Debit Card" 
                  active={paymentMethod === 'card'} 
                  onClick={() => setPaymentMethod('card')} 
                  icon={<CreditCard size={18}/>} 
                />
                <PaymentOption 
                  id="cod" label="Cash on Delivery" 
                  active={paymentMethod === 'cod'} 
                  onClick={() => setPaymentMethod('cod')} 
                  icon={<Truck size={18}/>} 
                />
              </div>
            </div>
          </div>

          {/* --- Right Side: Order Summary --- */}
          <div className="space-y-4 md:space-y-6 sticky top-8 md:top-12 h-fit order-first lg:order-last">
            <div className="bg-[#0F0F0F] border border-white/5 p-6 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] space-y-6 md:space-y-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6">
                <h3 className="font-black text-white uppercase italic tracking-widest text-xs md:text-sm">Order Summary</h3>
                <ShoppingBag size={18} className="text-amber-500" />
              </div>

              {/* Items List */}
              <div className="space-y-3 md:space-y-4 max-h-[180px] md:max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                {cart?.map((item, index) => {
                  const quantity = item.qty || item.quantity || 1;
                  return (
                    <div key={item.cartId || index} className="flex justify-between items-center text-[10px] md:text-[11px] font-bold">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="bg-white/5 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-slate-400">x{quantity}</span>
                        <p className="text-white uppercase tracking-tight w-28 md:w-40 truncate italic">{item.name}</p>
                      </div>
                      <p className="text-white font-black">Rs {item.price * quantity}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-white/5">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-white">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-500 italic">Rs {deliveryFee}</span>
                </div>
                <div className="flex justify-between pt-3 md:pt-4 border-t border-white/10">
                  <span className="font-black text-white uppercase italic text-xs md:text-sm">Total Pay</span>
                  <span className="text-2xl md:text-3xl font-black text-amber-500 tracking-tighter leading-none">Rs {total}</span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  setIsPlacingOrder(true);
                  try {
                    const firstCartItem = cart?.[0];
                    const rId = firstCartItem?.restaurantId || restaurantData?._id || restaurantData?.id;

                    if (!rId) {
                      alert("Critical Error: Restaurant ID not found. Please try adding items to cart again.");
                      setIsPlacingOrder(false);
                      return;
                    }

                    const orderData = {
                      orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                      user: userProfile?._id, 
                      restaurant: {
                        restaurantId: rId,
                        name: restaurantData?.name || firstCartItem?.restaurant || 'Restaurant',
                        address: restaurantData?.address || firstCartItem?.address || 'Restaurant Address'
                      },
                      items: cart.map(item => ({
                        name: item.name,
                        quantity: item.qty || item.quantity || 1,
                        price: item.price,
                        image: item.image || ''
                      })),
                      totalAmount: total,
                      deliveryAddress: userProfile?.address || 'Home Address',
                      paymentMethod: paymentMethod.toUpperCase() 
                    };

                    const orderResponse = await fetch(`${API_URL}/api/user/orders`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify(orderData)
                    });

                    const result = await orderResponse.json();
                    
                    if (orderResponse.ok) {
                      await fetch(`${API_URL}/api/user/update-stats`, {
                        method: 'POST',
                        credentials: 'include'
                      });
                      
                      await fetch(`${API_URL}/api/user/clear-cart`, {
                        method: 'POST',
                        credentials: 'include'
                      });
                      
                      localStorage.removeItem('cartItems');
                      localStorage.setItem('cartCount', '0');
                      
                      navigate('/user/order-placed', {
                        state: { restaurant: orderData.restaurant, items: cart, total: total, orderId: orderData.orderId }
                      });
                    } else {
                      alert(`Order Failed: ${result.message || 'Validation Error'}`);
                    }
                  } catch (e) {
                    console.error('Order creation error:', e);
                  } finally {
                    setIsPlacingOrder(false);
                  }
                }}
                disabled={isPlacingOrder || cartLoading}
                className={`w-full bg-amber-500 text-black py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 ${
                  isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Placing...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} strokeWidth={3} /> Place Order
                  </>
                )}
              </button>
              
              <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest text-center px-4 md:px-6 leading-relaxed">
                By placing the order, you agree to FOODIE.'s terms and cinematic policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Component
const PaymentOption = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
      active ? 'bg-amber-500/5 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'bg-white/5 border-white/10 hover:border-white/20'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${active ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'}`}>
        {icon}
      </div>
      <p className={`text-xs font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500'}`}>
        {label}
      </p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-amber-500' : 'border-slate-800'}`}>
      {active && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
    </div>
  </button>
);

export default Checkout;