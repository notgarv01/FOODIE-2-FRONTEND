import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Star, Heart, ShoppingBag, ChevronLeft, 
  Plus, Minus, MapPin, Phone 
} from 'lucide-react';
import { API_URL } from '../../utils/api';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const fetchFoodDetails = async () => {
    try {
      // Fetch food details
      const foodRes = await fetch(`${API_URL}/api/food/`);
      const foodData = await foodRes.json();
      
      if (foodRes.ok) {
        const foodItem = foodData.foods.find(f => f._id === id);
        if (foodItem) {
          setFood({
            id: foodItem._id,
            name: foodItem.name,
            description: foodItem.description || 'Delicious dish prepared with care',
            price: foodItem.price,
            category: foodItem.category || 'Main Course',
            isVeg: foodItem.isVeg,
            image: foodItem.image,
            videoUrl: foodItem.videoUrl,
            cuisineType: foodItem.cuisineType,
            rating: foodItem.rating || 4.5
          });

          // Fetch restaurant details if foodPartnerId exists
          if (foodItem.foodPartnerId) {
            const restaurantRes = await fetch(`${API_URL}/api/food/restaurants`);
            const restaurantData = await restaurantRes.json();
            
            if (restaurantRes.ok) {
              const restDetails = restaurantData.restaurants.find(r => r._id === foodItem.foodPartnerId._id);
              if (restDetails) {
                setRestaurant({
                  id: restDetails._id,
                  name: restDetails.restaurantName,
                  rating: restDetails.rating || '4.0',
                  time: restDetails.time || '30 min',
                  price: restDetails.price || 'Rs 500 for two',
                  cuisine: Array.isArray(restDetails.cuisine) ? restDetails.cuisine.join(', ') : restDetails.cuisine || 'Multi Cuisine',
                  img: restDetails.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600',
                  address: restDetails.address || '123 Main Street, Jaipur',
                  phone: '+91 98765 43210'
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching food details:', error);
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

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/add-to-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          foodId: food.id,
          quantity: quantity
        })
      });
      if (response.ok) {
        setCartCount(prev => prev + quantity);
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!restaurant) return;
    
    try {
      const response = await fetch(`${API_URL}/api/user/favorite-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ restaurantId: restaurant.id })
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => data.isFavorited ? [...prev, restaurant.id] : prev.filter(rid => rid !== restaurant.id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchFoodDetails();
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-amber-500 rounded-full"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Food item not found</h2>
          <button 
            onClick={() => navigate('/user/home')}
            className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold hover:bg-amber-400 transition-colors"
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
        <div className="aspect-[16/10] md:aspect-[16/9] overflow-hidden">
          <img 
            src={food.image} 
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-3 md:top-4 left-3 md:left-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-3 md:top-4 right-3 md:right-4">
          <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
            food.isVeg 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {food.isVeg ? '🌱 Pure Veg' : '🍖 Non-Veg'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Food Info */}
            <div>
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black mb-2">{food.name}</h1>
                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-amber-500 text-amber-500" />
                      <span className="font-bold">{food.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{food.category}</span>
                    {food.cuisineType && (
                      <>
                        <span>•</span>
                        <span>{food.cuisineType}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-black text-amber-500">₹{food.price}</p>
                  <p className="text-xs md:text-sm text-slate-400">per item</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">{food.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="font-black mb-3 md:mb-4 text-sm md:text-base">Quantity</h3>
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl md:text-2xl font-bold w-12 md:w-16 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus size={20} />
                </button>
                <div className="flex-1 text-right">
                  <p className="text-xs md:text-sm text-slate-400">Total</p>
                  <p className="text-lg md:text-xl font-black text-amber-500">₹{food.price * quantity}</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-amber-500 text-black rounded-xl py-3 md:py-4 font-black hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <ShoppingBag size={20} />
              Add to Cart ({quantity})
            </button>

            {/* Video Preview */}
            {food.videoUrl && (
              <div>
                <h3 className="font-black mb-3 md:mb-4 text-sm md:text-base">Video Preview</h3>
                <div className="aspect-[16/9] bg-neutral-900 rounded-xl overflow-hidden">
                  <video 
                    controls
                    className="w-full h-full object-cover"
                    poster={food.image}
                  >
                    <source src={food.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Restaurant Info */}
            {restaurant && (
              <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-black text-sm md:text-base">Restaurant</h3>
                  <button 
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full border backdrop-blur-md transition-all ${
                      favorites.includes(restaurant.id) 
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                        : 'bg-black/20 border-white/10 text-white'
                    }`}
                  >
                    <Heart size={16} fill={favorites.includes(restaurant.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex gap-3 md:gap-4">
                    <img 
                      src={restaurant.img} 
                      alt={restaurant.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm md:text-base">{restaurant.name}</h4>
                      <div className="flex items-center gap-2 text-xs md:text-sm mt-1">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span>{restaurant.rating}</span>
                        <span>•</span>
                        <span>{restaurant.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" />
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/user/restaurant/${restaurant.id}`)}
                    className="w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-xs md:text-sm font-bold"
                  >
                    View Restaurant
                  </button>
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 md:p-6">
              <h3 className="font-black mb-3 md:mb-4 text-sm md:text-base">Cart Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Items in cart</span>
                  <span className="font-bold">{cartCount}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Current item</span>
                  <span className="font-bold">{quantity} x {food.name}</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-amber-500">₹{food.price * quantity}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/user/cart')}
                className="w-full mt-3 md:mt-4 bg-amber-500 text-black rounded-xl py-2.5 md:py-3 font-bold hover:bg-amber-400 transition-colors text-xs md:text-sm"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
