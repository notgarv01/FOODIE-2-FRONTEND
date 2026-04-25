import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Star, Heart, ShoppingBag, ChevronLeft, 
  Phone, Globe 
} from 'lucide-react';
import { API_URL } from '../../utils/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchRestaurantDetails = async () => {
    try {
      // Fetch restaurant details
      const restaurantRes = await fetch(`${API_URL}/api/food/restaurants`);
      const restaurantData = await restaurantRes.json();
      
      if (restaurantRes.ok) {
        const restaurant = restaurantData.restaurants.find(r => r._id === id);
        if (restaurant) {
          setRestaurant({
            id: restaurant._id,
            name: restaurant.restaurantName,
            rating: restaurant.rating || '4.0',
            time: restaurant.time || '30 min',
            price: restaurant.price || 'Rs 500 for two',
            cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine || 'Multi Cuisine',
            img: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600',
            isDineOutAvailable: restaurant.isDineOutAvailable || false,
            isDeliveryAvailable: restaurant.isDeliveryAvailable || false,
            isPureVeg: restaurant.isPureVeg || false,
            address: restaurant.address || '123 Main Street, Jaipur',
            phone: '+91 98765 43210',
            email: 'info@restaurant.com'
          });
        }
      }

      // Fetch restaurant menu
      const menuRes = await fetch(`${API_URL}/api/food/menu/${id}`);
      const menuData = await menuRes.json();
      
      if (menuRes.ok) {
        setMenu(menuData.menu || []);
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const profileRes = await fetch(`${API_URL}/api/user/profile`, { credentials: 'include' });
      if (profileRes.ok) {
        const data = await profileRes.json();
        setFavorites(data.user.favorites || []);
      }
      const cartRes = await fetch(`${API_URL}/api/user/cart`, { credentials: 'include' });
      if (cartRes.ok) {
        const data = await cartRes.json();
        setCartCount(data.cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0);
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/api/user/favorite-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ restaurantId: id })
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => data.isFavorited ? [...prev, id] : prev.filter(rid => rid !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCart = async (foodItem) => {
    try {
      const response = await fetch(`${API_URL}/api/user/add-to-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          foodId: foodItem.id,
          quantity: 1
        })
      });
      if (response.ok) {
        setCartCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex justify-center items-center p-4">
        <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-b-2 border-amber-500 rounded-full"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex justify-center items-center p-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Restaurant not found</h2>
          <button 
            onClick={() => navigate('/user/home')}
            className="px-4 md:px-6 py-2 md:py-3 bg-amber-500 text-black rounded-xl font-bold text-sm md:text-base hover:bg-amber-400 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100">
      {/* Header */}
      <div className="relative">
        <div className="aspect-[16/8] md:aspect-[16/9] overflow-hidden">
          <img 
            src={restaurant.img} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-3 md:top-4 left-3 md:left-4 p-2 md:p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-500 text-amber-500" />
                    <span className="font-bold">{restaurant.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{restaurant.cuisine}</span>
                  <span>•</span>
                  <span>{restaurant.price}</span>
                </div>
              </div>
              
              <button 
                onClick={handleFavoriteToggle}
                className={`p-2 md:p-3 rounded-full border backdrop-blur-md transition-all ${
                  favorites.includes(id) 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                    : 'bg-black/20 border-white/10 text-white'
                }`}
              >
                <Heart size={24} fill={favorites.includes(id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-neutral-900 border border-white/10 rounded-xl p-3 md:p-4">
                <Clock size={20} className="text-amber-500 mb-1 md:mb-2" />
                <p className="text-[10px] md:text-sm text-slate-400">Delivery Time</p>
                <p className="font-bold text-xs md:text-sm">{restaurant.time}</p>
              </div>
              <div className="bg-neutral-900 border border-white/10 rounded-xl p-3 md:p-4">
                <ShoppingBag size={20} className="text-amber-500 mb-1 md:mb-2" />
                <p className="text-[10px] md:text-sm text-slate-400">Price for two</p>
                <p className="font-bold text-xs md:text-sm">{restaurant.price}</p>
              </div>
              {restaurant.isPureVeg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 md:p-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full mb-1 md:mb-2"></div>
                  <p className="text-[10px] md:text-sm text-emerald-400">Pure Veg</p>
                </div>
              )}
              {restaurant.isDineOutAvailable && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 md:p-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500 rounded-full mb-1 md:mb-2"></div>
                  <p className="text-[10px] md:text-sm text-amber-400">Dine Out</p>
                </div>
              )}
            </div>

            {/* Menu */}
            <div>
              <h2 className="text-xl md:text-2xl font-black mb-4 md:mb-6">Menu</h2>
              {menu.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {menu.map((item) => (
                    <div key={item.id} className="bg-neutral-900 border border-white/10 rounded-xl p-3 md:p-4 flex gap-3 md:gap-4">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600'} 
                        alt={item.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-sm md:text-base">{item.name}</h3>
                        <p className="text-xs md:text-sm text-slate-400 mb-1 md:mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-500 text-sm md:text-base">₹{item.price}</span>
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-amber-500 text-black rounded-lg text-xs md:text-sm font-bold hover:bg-amber-400 transition-colors"
                          >
                            Add +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-slate-400">
                  <p className="text-sm md:text-base">No menu items available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Contact Info */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="font-black mb-3 md:mb-4 text-sm md:text-base">Contact Information</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-xs md:text-sm">{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <span className="text-xs md:text-sm">{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Globe size={18} className="text-slate-400" />
                  <span className="text-xs md:text-sm">{restaurant.email}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="font-black mb-3 md:mb-4 text-sm md:text-base">Connect With Us</h3>
              <div className="flex gap-2 md:gap-3">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Globe size={18} />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <MapPin size={18} />
                </button>
              </div>
            </div>

            {/* Cart Button */}
            <button 
              onClick={() => navigate('/user/cart')}
              className="w-full bg-amber-500 text-black rounded-xl py-3 md:py-4 font-black text-xs md:text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              View Cart ({cartCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
