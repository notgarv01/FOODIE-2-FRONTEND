import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import UserNavbar from './UserNavbar';
import FilterSection from './FilterSection';
import RestaurantCard from './RestaurantCard';
import { API_URL } from '../../utils/api';

const UserHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Delivery');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [favoriteMessage, setFavoriteMessage] = useState({});
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    pureVeg: false, rating4Plus: false, fastDelivery: false, cuisines: []
  });
  const [showCuisineModal, setShowCuisineModal] = useState(false);

  // --- Logic Hooks (Fetching Restaurants, User, Cart) ---
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/restaurants`);
        const data = await response.json();
        if (response.ok) {
          const transformed = data.restaurants.map((res, index) => ({
            id: res._id || index + 1,
            name: res.restaurantName,
            rating: res.rating?.toString() || '4.0',
            time: res.time || '30 min',
            price: res.price || 'Rs 500 for two',
            cuisine: res.cuisine || 'Multi Cuisine',
            img: res.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            isDineOutAvailable: res.isDineOutAvailable || false,
            isPureVeg: res.isPureVeg || false
          }));
          setRestaurants(transformed);
        }
      } catch (e) { } finally { setLoading(false); }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${API_URL}/api/user/profile`, { credentials: 'include' });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setUserData(data.user);
          setFavorites(data.user.favorites || []);
        }
        const cartRes = await fetch(`${API_URL}/api/user/cart`, { credentials: 'include' });
        if (cartRes.ok) {
          const data = await cartRes.json();
          setCartCount(data.cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0);
        }
      } catch (err) { }
    };
    fetchData();
  }, []);

  // --- Handlers ---
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]); setShowSearchResults(false); return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`${API_URL}/api/food/search?query=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchResults(data.results); setShowSearchResults(true);
      }
    } catch (e) { } finally { setIsSearching(false); }
  };

  const handleSearchResultClick = (result) => {
    if (result.type === 'restaurant') {
      navigate(`/user/restaurant-profile?id=${result.id}`);
    } else if (result.type === 'food') {
      navigate(`/user/restaurant-profile?id=${result.foodPartnerId}&foodId=${result.id}`);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Filter Logic (useMemo)
  const availableCuisines = useMemo(() => {
    const cuisines = new Set();
    restaurants.forEach(res => {
      if (Array.isArray(res.cuisine)) res.cuisine.forEach(c => cuisines.add(c));
      else if (res.cuisine) cuisines.add(res.cuisine);
    });
    return Array.from(cuisines).sort();
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;
    if (activeTab === 'Dining Out') filtered = filtered.filter(res => res.isDineOutAvailable);
    if (activeFilters.pureVeg) filtered = filtered.filter(res => res.isPureVeg);
    if (activeFilters.rating4Plus) filtered = filtered.filter(res => parseFloat(res.rating) >= 4.0);
    // ... baaki filters
    return filtered;
  }, [restaurants, activeTab, activeFilters]);

  const handleFavoriteToggle = async (e, restaurantId) => {
    e.stopPropagation();
    setFavoriteLoading(prev => ({ ...prev, [restaurantId]: true }));
    try {
      const response = await fetch(`${API_URL}/api/user/favorite-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ restaurantId })
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => data.isFavorited ? [...prev, restaurantId] : prev.filter(id => id !== restaurantId));
        setFavoriteMessage(prev => ({ ...prev, [restaurantId]: data.isFavorited ? 'Added' : 'Removed' }));
        setTimeout(() => setFavoriteMessage(prev => ({ ...prev, [restaurantId]: null })), 1000);
      }
    } catch (e) { } finally { setFavoriteLoading(prev => ({ ...prev, [restaurantId]: false })); }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('demoUserId');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');

        // Use React Router navigate instead of window.location to prevent page refresh
        navigate('/user/login', { replace: true });
      }
    } catch (error) {
      // Clear local storage even on error
      localStorage.removeItem('demoUserId');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');

      // Clear browser navigation history completely
      window.history.pushState(null, null, '/user/login');
      window.history.pushState(null, null, '/user/login');

      // Additional history clearing
      setTimeout(() => {
        window.history.pushState(null, null, '/');
        window.history.back();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans selection:bg-amber-500/30">
      
      <UserNavbar
        userData={userData}
        cartCount={cartCount}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        handleSearchInputChange={(e) => handleSearch(e.target.value)}
        handleSearchResultClick={handleSearchResultClick}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        dropdownRef={dropdownRef}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 md:gap-10 border-b border-white/5 mb-6 md:mb-8 overflow-x-auto no-scrollbar">
          {['Delivery', 'Dining Out', 'Nightlife'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`pb-3 md:pb-4 text-base md:text-lg font-black tracking-tighter transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-slate-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-500 rounded-full"></div>}
            </button>
          ))}
        </div>

        <FilterSection
          activeFilters={activeFilters}
          availableCuisines={availableCuisines}
          showCuisineModal={showCuisineModal}
          setShowCuisineModal={setShowCuisineModal}
          handleFilterToggle={(type) => setActiveFilters(p => ({...p, [type]: !p[type]}))}
        />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
          {filteredRestaurants.map((res) => (
            <RestaurantCard
              key={res.id}
              restaurant={res}
              favorites={favorites}
              favoriteLoading={favoriteLoading}
              favoriteMessage={favoriteMessage}
              handleFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>

        {/* Watch Video Floating Button */}
        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Link to="/user/videos">
            <button className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-xs md:text-sm tracking-widest uppercase flex items-center gap-2 md:gap-3 shadow-2xl hover:bg-amber-500 transition-all hover:-translate-y-1">
              <Smartphone size={18} /> Watch Video Menus
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default UserHome;