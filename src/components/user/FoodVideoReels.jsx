import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, X, Volume2, VolumeX, Star, ChevronRight } from 'lucide-react';
import { API_URL } from '../../utils/api';

const scrollbarStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const FoodVideoReels = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    let userId = localStorage.getItem('demoUserId');
    if (!userId) {
      // Generate a simple user ID based on browser fingerprint
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('demoUserId', userId);
    }
    return userId;
  };

  // Clean up old localStorage data on component mount
  useEffect(() => {
    // Remove all old shared localStorage data that was causing cross-user contamination
    const keysToRemove = ['likedVideos', 'likedVideos_backup', 'userLikes'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear any sessionStorage data that might be causing issues
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('likedVideos');
    }
  }, []);

  // Fetch food videos from API
  useEffect(() => {
    const fetchFoodVideos = async () => {
      try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/user/food-videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: userId })
        });
        
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        } else {
          console.error('Failed to fetch food videos:', response.status);
        }
      } catch (error) {
        console.error('Error fetching food videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodVideos();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex justify-center items-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-white text-xs md:text-sm">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex justify-center items-center p-4">
        <div className="text-center">
          <ShoppingBag size={48} className="text-white/50 mb-3 md:mb-4 mx-auto" />
          <p className="text-white text-base md:text-lg mb-3 md:mb-4">No food videos available</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 md:px-6 py-2 md:py-3 bg-amber-500 text-black rounded-xl font-bold text-sm md:text-base hover:bg-amber-400 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex justify-center overflow-hidden">
      <style>{scrollbarStyles}</style>
      
      {/* Close Button - More Premium Position */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 md:top-6 left-4 md:left-6 z-[120] p-2 md:p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-white hover:bg-amber-500 hover:text-black transition-all active:scale-90 shadow-2xl"
      >
        <X size={20} />
      </button>

      {/* Vertical Reels Container - Centered Mobile View */}
      <div className="relative w-full max-w-[440px] md:max-w-[500px] lg:max-w-[600px] h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black ring-1 ring-white/10 shadow-[0_0_80px_rgba(0,0,0,1)]">
        {videos.map((video) => (
          <ReelItem 
            key={video.id} 
            video={video} 
            isMuted={isMuted} 
            setIsMuted={setIsMuted} 
          />
        ))}
      </div>
    </div>
  );
};

const ReelItem = ({ video, isMuted, setIsMuted }) => {
  const videoRef = useRef(null);
  
  // Use user-specific like state from API response
  const getInitialLikeState = () => {
    return {
      isLiked: video.isLiked || false,
      likeCount: video.likes || 0
    };
  };
  
  // Check if item is already in cart (use API response first, then fallback to localStorage)
  const getInitialCartState = () => {
    // Use API response if available
    if (video.isInCart !== undefined) {
      return video.isInCart;
    }
    // Fallback to localStorage for immediate display
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
    return cartItems[video.id] || false;
  };
  
  const [isLiked, setIsLiked] = useState(getInitialLikeState().isLiked);
  const [likeCount, setLikeCount] = useState(getInitialLikeState().likeCount);
  const [isInCart, setIsInCart] = useState(getInitialCartState());
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFollowing, setIsFollowing] = useState(video.isFollowing || false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    // Update local state immediately for better UX
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    
    try {
      // Get user ID for demo mode
      const getUserId = () => {
        let userId = localStorage.getItem('demoUserId');
        if (!userId) {
          userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('demoUserId', userId);
        }
        return userId;
      };
      
      // API call to update likes in database
      const response = await fetch(`${API_URL}/api/user/update-likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          foodId: video.id,
          increment: newIsLiked,
          userId: getUserId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update with actual count and like status from database
        setLikeCount(data.likes);
        setIsLiked(data.isLiked);
      } else {
        console.error('Failed to update like:', response.status);
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      // Show loading state
      setIsAddingToCart(true);
      
      let response;
      let action;
      
      if (isInCart) {
        // Remove from cart
        response = await fetch(`${API_URL}/api/user/remove-from-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            foodId: video.id
          })
        });
        action = 'remove';
      } else {
        // Add to cart
        response = await fetch(`${API_URL}/api/user/add-to-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            foodId: video.id,
            quantity: 1
          })
        });
        action = 'add';
      }
      
      if (response.ok) {
        const data = await response.json();
        
        if (action === 'add') {
          // Update state to show item is in cart
          setIsInCart(true);
          
          // Persist to localStorage
          const cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
          cartItems[video.id] = true;
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          
          // Update cart count in localStorage (for cart badge)
          const currentCartCount = parseInt(localStorage.getItem('cartCount') || '0');
          localStorage.setItem('cartCount', (currentCartCount + 1).toString());
          
          // Show toast notification
          if (window.showToast) {
            window.showToast(`${video.dish} added to cart!`, 'success');
          }
        } else {
          // Update state to show item is not in cart
          setIsInCart(false);
          
          // Remove from localStorage
          const cartItems = JSON.parse(localStorage.getItem('cartItems') || '{}');
          delete cartItems[video.id];
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          
          // Update cart count in localStorage (for cart badge)
          const currentCartCount = parseInt(localStorage.getItem('cartCount') || '0');
          localStorage.setItem('cartCount', Math.max(0, currentCartCount - 1).toString());
          
          // Show toast notification
          if (window.showToast) {
            window.showToast(`${video.dish} removed from cart!`, 'info');
          }
        }
      } else {
        console.error(`Failed to ${action} to cart:`, response.status);
        
        if (window.showToast) {
          window.showToast(`Failed to ${action} to cart`, 'error');
        }
      }
    } catch (error) {
      console.error(`Error ${isInCart ? 'removing from' : 'adding to'} cart:`, error);
      
      if (window.showToast) {
        window.showToast(`Error ${isInCart ? 'removing from' : 'adding to'} cart`, 'error');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    
    try {
      setIsFollowingLoading(true);
      
      // Get user ID for demo mode
      const getUserId = () => {
        let userId = localStorage.getItem('demoUserId');
        if (!userId) {
          userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('demoUserId', userId);
        }
        return userId;
      };
      
      // API call to follow/unfollow restaurant
      const response = await fetch(`${API_URL}/api/user/follow-restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurantId: video.restaurantId,
          userId: getUserId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } else {
        console.error('Failed to update follow:', response.status);
      }
    } catch (error) {
      console.error('Error updating follow:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play only when visible
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
            // Remove video src temporarily to stop background data transfer (Extreme optimization)
            // videoRef.current.src = ""; 
          }
        });
      },
      { threshold: 0.6 } // Thoda kam threshold rakho taaki scrolling smooth ho
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [video.id]);

  return (
    <div className="relative w-full h-full snap-start bg-neutral-900 overflow-hidden flex flex-col justify-end">
      {/* Background Video - Darker overlay to make text pop */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />
      
      <video
        ref={videoRef}
        src={video.url}
        loop
        playsInline
        muted={isMuted}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        preload="metadata"
          
        poster={`${video.url}/ik-thumbnail.jpg?tr=so-2,q-30,w-400`}
      />

      {/* Top UI Overlay */}
      <div className="absolute top-0 w-full p-4 md:p-6 pt-12 md:pt-16 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-0.5 md:space-y-1">
            <h3 className="text-white font-black text-lg md:text-xl tracking-tighter uppercase italic drop-shadow-md">{video.restaurant}</h3>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="bg-amber-500 text-black px-1 md:px-1.5 py-0.5 rounded flex items-center gap-0.5 md:gap-1 text-[9px] md:text-[10px] font-black">
                {video.rating} <Star size={8} fill="currentColor" />
              </div>
              <span className="text-white/70 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] drop-shadow-sm">Top Creator</span>
            </div>
          </div>
          <button 
            onClick={handleFollow}
            disabled={isFollowingLoading}
            className={`${
              isFollowing 
                ? 'bg-white text-black' 
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black'
            } text-[9px] md:text-[10px] font-black px-3 md:px-5 py-2 md:py-2.5 rounded-full uppercase tracking-widest transition-all shadow-lg ${
              isFollowingLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isFollowingLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Main Content Overlay (Bottom) */}
      <div className="relative z-30 w-full p-4 md:p-6 pb-8 md:pb-10 flex flex-col md:flex-row md:items-end gap-4 md:gap-5">
        <div className="flex-1 space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="space-y-0.5 md:space-y-1">
            <h4 className="text-2xl md:text-3xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl">
              {video.dish}
            </h4>
            <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-3">
               <p className="text-amber-500 font-black text-xl md:text-2xl tracking-tighter drop-shadow-md">{video.price}</p>
               <span className="text-white/40 text-[9px] md:text-[10px] line-through font-bold tracking-widest italic decoration-amber-500/50">₹1200</span>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-[0.97] shadow-[0_10px_30px_rgba(245,158,11,0.3)] group ${
              isInCart 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : isAddingToCart
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            <ShoppingBag size={14} className={`${!isAddingToCart && 'group-hover:animate-bounce'}`} /> 
            {isAddingToCart ? 'Adding...' : isInCart ? 'Added!' : 'Add to Cart'}
            {!isAddingToCart && !isInCart && <ChevronRight size={12} />}
          </button>
        </div>

        {/* Right Interaction Bar - Floating Effect */}
        <div className="flex flex-row md:flex-col items-center gap-4 md:gap-7 mb-2 md:mb-0">
          <button 
            onClick={handleLike} 
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-2.5 md:p-3.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLiked ? 'bg-rose-500 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-black/20 border-white/10 group-hover:bg-white/10'}`}>
              <Heart size={18} className={`${isLiked ? 'fill-white text-white scale-110' : 'text-white'}`} />
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-white/80 uppercase tracking-widest mt-0.5 md:mt-1">
              {likeCount >= 1000 ? `${(likeCount/1000).toFixed(1)}k` : likeCount}
            </span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
            className={`p-2.5 md:p-3.5 rounded-full backdrop-blur-md border transition-all ${!isMuted ? 'bg-amber-500 border-amber-400 text-black' : 'bg-black/20 border-white/10 text-white'}`}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Slim Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-white/10 w-full z-40">
         <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b] w-1/2" />
      </div>
    </div>
  );
};

export default FoodVideoReels;