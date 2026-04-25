import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Star, MapPin, ShoppingBag, Leaf, CheckCircle2, Loader2, Check,
  Heart, UserPlus, UserCheck // New Icons
} from 'lucide-react';
import { API_URL } from '../../utils/api';

const UserRestaurantProfile = () => {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('id');
  const foodId = searchParams.get('foodId'); // Get foodId from URL for highlighting
  const [restaurantData, setRestaurantData] = useState(null);
  const [highlightedFoodId, setHighlightedFoodId] = useState(foodId);

  // Fetch restaurant data by ID
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/restaurant/${restaurantId}`);
        const data = await response.json();
        if (response.ok) {
          setRestaurantData(data.restaurant);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };
    
    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  const [selectedCategory, setSelectedCategory] = useState('Recommended');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [addedItems, setAddedItems] = useState({});

  // --- New States for Follow & Favourite ---
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);

  const categories = ['Recommended', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  // Fetch Menu Items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const restaurantId = restaurantData?.id || restaurantData?._id;
        const response = await fetch(`${API_URL}/api/food/menu/${restaurantId}`);
        const data = await response.json();
        if (response.ok) {
          setMenuItems(data.menu || []); 
        }
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (restaurantData) fetchMenu();
  }, [restaurantData]);

  // Scroll to and highlight food item when foodId is present
  useEffect(() => {
    if (highlightedFoodId && menuItems.length > 0) {
      const foodItem = menuItems.find(item => (item._id || item.id) === highlightedFoodId);
      if (foodItem) {
        const element = document.getElementById(`food-${highlightedFoodId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add glow animation
          element.classList.add('glow-effect');
          // Remove glow after 3 seconds
          setTimeout(() => {
            element.classList.remove('glow-effect');
            setHighlightedFoodId(null); // Clear highlight
          }, 3000);
        }
      }
    }
  }, [highlightedFoodId, menuItems]);

  // Fetch Cart logic (remains same)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/cart`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const cartItems = data.cart || [];
          setCart(cartItems.map(item => ({ ...item, cartId: crypto.randomUUID() })));
          const addedItemsMap = {};
          cartItems.forEach(item => { addedItemsMap[item.foodId] = true; });
          setAddedItems(addedItemsMap);
        }
      } catch (error) { console.error("Cart fetch error:", error); }
    };
    fetchCart();
  }, []);

  // Fetch initial follow and favorite state
  useEffect(() => {
    const fetchUserState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          const restaurantId = restaurantData?.id || restaurantData?._id;
          
          if (restaurantId && user) {
            // Check if following
            const following = user.following || [];
            setIsFollowed(following.some(id => id.toString() === restaurantId.toString()));
            
            // Check if favorited
            const favorites = user.favorites || [];
            setIsFavourite(favorites.some(id => id.toString() === restaurantId.toString()));
          }
        }
      } catch (error) {
        console.error('Error fetching user state:', error);
      }
    };
    
    if (restaurantData) {
      fetchUserState();
    }
  }, [restaurantData]);

  const addToCart = async (item) => {
    const itemId = item._id || item.id;
    if (addedItems[itemId]) return;
    setCart([...cart, { ...item, cartId: crypto.randomUUID() }]);
    setAddedItems({ ...addedItems, [itemId]: true });
    setLastAdded(item.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Save to backend
    try {
      const response = await fetch(`${API_URL}/api/user/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          foodId: item._id || item.id,
          quantity: 1
        })
      });
      
      if (!response.ok) {
        console.error('Failed to add to cart:', response.status);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (item) => {
    const itemId = item._id || item.id;
    setCart(cart.filter(cartItem => (cartItem._id || cartItem.id) !== itemId));
    setAddedItems({ ...addedItems, [itemId]: false });

    // Remove from backend
    try {
      const response = await fetch(`${API_URL}/api/user/remove-from-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          foodId: itemId
        })
      });
      
      if (!response.ok) {
        console.error('Failed to remove from cart:', response.status);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
  const filteredItems = menuItems.filter(item => selectedCategory === 'Recommended' ? true : item.category === selectedCategory);

  if (!restaurantData) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Select a restaurant first</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200">
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.2);
            border-color: rgba(245, 158, 11, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.3);
            border-color: rgba(245, 158, 11, 0.8);
          }
        }
        .glow-effect {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
    
    {/* Toast Notification */}
    {showToast && (
      <div className="fixed bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#1A1A1A] border border-emerald-500/30 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-2xl flex items-center gap-2 md:gap-3">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">{lastAdded} Added!</p>
        </div>
      </div>
    )}

    {/* --- Hero Section --- */}
    <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
      <img src={restaurantData.img} className="w-full h-full object-cover opacity-40 scale-105" alt={restaurantData.name} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />
      
      {/* Buttons and Content Overlay */}
      <div className="absolute bottom-0 w-full p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
          
          {/* Left: Info */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="bg-emerald-500 text-black text-[9px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded tracking-widest uppercase">Open Now</span>
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs md:text-sm bg-black/40 backdrop-blur-md px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                <Star size={16} fill="currentColor" /> {restaurantData.rating}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              {restaurantData.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-400 font-medium uppercase tracking-widest text-[9px] md:text-[10px]">
              <span className="flex items-center gap-1.5 md:gap-2"><MapPin size={14} className="text-amber-500"/> {restaurantData.location || "Jaipur"}</span>
              <span className="flex items-center gap-2 border-l border-white/10 pl-4 md:pl-6">{restaurantData.cuisine}</span>
              <span className="flex items-center gap-2 border-l border-white/10 pl-4 md:pl-6">{restaurantData.price?.replace(/Rs(\d)/, 'Rs $1')}</span>
            </div>
          </div>

          {/* Right: Actions (Follow & Favourite) */}
          <div className="flex items-center gap-2 md:gap-3 pb-1 md:pb-2">
            {/* Follow Button */}
            <button 
              onClick={async () => {
                setFollowLoading(true);
                try {
                  const restaurantId = restaurantData?.id || restaurantData?._id;
                  const response = await fetch(`${API_URL}/api/user/follow-restaurant`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ restaurantId })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    setIsFollowed(data.isFollowing);
                  }
                } catch (error) {
                  console.error('Error following restaurant:', error);
                } finally {
                  setFollowLoading(false);
                }
              }}
              disabled={followLoading}
              className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all active:scale-95 border ${
                isFollowed 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-amber-500 border-amber-500 text-black hover:bg-amber-400'
              } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {followLoading ? (
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isFollowed ? (
                <><UserCheck size={16} /> Following</>
              ) : (
                <><UserPlus size={16} /> Follow</>
              )}
            </button>

            {/* Favourite Button */}
            <button 
              onClick={async () => {
                setFavouriteLoading(true);
                try {
                  const restaurantId = restaurantData?.id || restaurantData?._id;
                  const response = await fetch(`${API_URL}/api/user/favorite-restaurant`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ restaurantId })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    setIsFavourite(data.isFavorited);
                  }
                } catch (error) {
                  console.error('Error favoriting restaurant:', error);
                } finally {
                  setFavouriteLoading(false);
                }
              }}
              disabled={favouriteLoading}
              className={`p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all active:scale-90 ${
                isFavourite 
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
              } ${favouriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {favouriteLoading ? (
                <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>

    {/* --- Rest of the component (Sidebar, Menu, Cart) remains the same --- */}
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] xl:grid-cols-[250px_1fr_350px] gap-6 md:gap-8 lg:gap-12">
      {/* Sidebar */}
      <aside className="hidden lg:block space-y-1.5 md:space-y-2 sticky top-20 md:top-24 h-fit">
        <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 md:mb-6 px-3 md:px-4">Categories</p>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>{cat}</button>
        ))}
      </aside>

      {/* Menu Feed */}
      <section className="space-y-8 md:space-y-12">
        <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic">{selectedCategory}</h2>
        {loading ? (
          <div className="flex justify-center py-16 md:py-20"><Loader2 className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item._id || item.id} 
                id={`food-${item._id || item.id}`}
                className={`group bg-[#0F0F0F] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] flex gap-4 md:gap-6 hover:border-amber-500/20 transition-all ${
                  highlightedFoodId === (item._id || item.id) ? 'glow-effect' : ''
                }`}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-800 rounded-2xl md:rounded-3xl overflow-hidden relative shrink-0">
                  <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200"} className="w-full h-full object-cover" alt={item.name} />
                  <button 
                    onClick={() => addedItems[item._id || item.id] ? removeFromCart(item) : addToCart(item)}
                    className={`absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 md:py-1.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-1 ${
                      addedItems[item._id || item.id] ? 'bg-emerald-500 text-white hover:bg-rose-500' : 'bg-white text-black hover:bg-amber-500'
                    }`}
                  >
                    {addedItems[item._id || item.id] ? 'Added' : 'Add'}
                  </button>
                </div>
                <div className="flex-1 space-y-1.5 md:space-y-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {item.isVeg ? <Leaf size={14} className="text-emerald-500" /> : <div className="w-2.5 h-2.5 md:w-3 md:h-3 border border-red-500 flex items-center justify-center"><div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full" /></div>}
                    <h4 className="font-black text-white uppercase italic text-base md:text-lg tracking-tight">{item.name}</h4>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">{item.description}</p>
                  <p className="text-lg md:text-xl font-black text-amber-500 tracking-tighter mt-1 md:mt-2">Rs {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Section */}
      <aside className="hidden xl:block space-y-4 md:space-y-6 sticky top-20 md:top-24 h-fit">
        <div className="bg-[#0F0F0F] border border-white/5 p-5 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] space-y-4 md:space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white uppercase italic tracking-widest text-xs md:text-sm">Your Bag ({cart.length})</h3>
            <ShoppingBag size={18} className="text-amber-500" />
          </div>
          
          <div className="space-y-3 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto no-scrollbar">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-white/5 pb-1.5 md:pb-2">
                  <p className="text-[9px] md:text-[10px] font-bold text-white uppercase truncate w-24 md:w-32">{item.name}</p>
                  <p className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase">Rs {item.price}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 md:py-10 opacity-30">
                <ShoppingBag size={24} className="mx-auto mb-2" />
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Your Cart is Empty</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-3 md:pt-4 border-t border-white/10 space-y-3 md:space-y-4">
              <div className="flex justify-between font-black text-[10px] md:text-xs uppercase tracking-widest">
                <span className="text-slate-500">Total</span>
                <span className="text-white text-base md:text-lg tracking-tighter">Rs {totalPrice}</span>
              </div>
              <Link to="/user/cart" state={{ restaurantData }}>
                <button className="w-full bg-amber-500 text-black py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-amber-400 transition-all active:scale-95">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  </div>
);
};

export default UserRestaurantProfile;