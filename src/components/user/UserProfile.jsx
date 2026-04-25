import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import ProfileSidebar from './Profile/ProfileSidebar';
import ProfileHeader from './Profile/ProfileHeader';
import AccountDetails from './Profile/AccountDetails';
import { API_URL } from '../../utils/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // 1. Clear local state immediately
        setUserData(null);
        
        // 2. Clear all storage and cache
        localStorage.clear();
        sessionStorage.clear();
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => caches.delete(cacheName))
            );
          });
        }
        
        // 3. Clear browser history completely
        window.history.pushState(null, null, '/user/login');
        window.history.pushState(null, null, '/user/login');
        
        // 4. Use React Router navigate to prevent page refresh
        navigate('/user/login', { replace: true });
        
        // 5. Additional history clearing to prevent back navigation
        setTimeout(() => {
          window.history.pushState(null, null, '/');
          window.history.back();
        }, 100);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even on error, clear state and redirect
      setUserData(null);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/user/login', { replace: true });
    }
  };

  // Get user ID for demo mode
  const getUserId = () => {
    let userId = localStorage.getItem('demoUserId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('demoUserId', userId);
    }
    return userId;
  };

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/user/profile?userId=${userId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Refresh data when component gains focus (coming back from edit profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userData) {
        fetchUserData();
      }
    };

    const fetchUserData = async () => {
      try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/api/user/profile?userId=${userId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-xs md:text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-slate-200 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 text-sm md:text-base mb-3 md:mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 md:px-4 py-2 md:py-2.5 bg-amber-500 text-black rounded-lg font-bold text-xs md:text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* --- Top Navbar --- */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 py-3 md:py-4 px-4 md:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 cursor-pointer">
            FOODIE<span className="h-1 md:h-1.5 w-1 md:w-1.5 bg-amber-500 rounded-full"></span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
             <button onClick={() => navigate('/user/notifications')} className="text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
             </button>
             <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-neutral-800 border border-white/10 overflow-hidden">
                {userData?.profilePhoto ? (
                  <img src={userData.profilePhoto} alt={userData?.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <img src={userData?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Garv"} alt={userData?.name || "User"} className="w-full h-full object-cover" />
                )}
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
        
        {/* --- Left Sidebar Navigation --- */}
        <ProfileSidebar 
          handleLogout={handleLogout}
        />

        {/* --- Right Content Area --- */}
        <section className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet context={{ userData, handleLogout }} />
        </section>
      </main>
    </div>
  );
};

export default UserProfile;