import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Briefcase } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../utils/api";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Prevent back navigation when on login page
  useEffect(() => {
    const preventBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener('popstate', preventBack);

    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('userData');
      const userToken = localStorage.getItem('userToken');
      
      if (userData && userToken) {
        // User is already logged in, redirect to home
        navigate('/user/home');
        return true;
      }
      return false;
    };

    // Check immediately on mount
    if (checkAuthStatus()) {
      return;
    }

    // Also check periodically (optional)
    const interval = setInterval(checkAuthStatus, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  // Enhanced back button prevention
  useEffect(() => {
    const preventBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.href);
      
      // If user tries to go back, keep them on login page
      if (window.location.pathname === '/user/login') {
        window.history.pushState(null, null, '/user/login');
        navigate('/user/login', { replace: true });
      }
    };

    window.addEventListener('popstate', preventBack);

    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Store user data in localStorage for demo
        localStorage.setItem('demoUserId', data.user._id || data.user.email);
        
        // Update AuthContext
        login(data.user);
        
        // Navigate to user home
        navigate('/user/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout tagline="Access the world's finest food experience.">
      <div className="w-full max-w-sm md:max-w-md space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="space-y-2 md:space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
            Welcome Back
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Log in to your diner account to start watching.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs md:text-sm text-center">
              {error}
            </div>
          )}
          <div className="relative group">
            <Mail
              size={18}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-600 font-bold text-sm md:text-base"
              required
            />
          </div>
          <div className="relative group">
            <Lock
              size={18}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-600 font-bold text-sm md:text-base"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black py-3 md:py-4 rounded-2xl hover:bg-amber-400 hover:-translate-y-1 active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <div className="space-y-4 md:space-y-6 pt-4 border-t border-white/5">
          <Link to="/user/register">
            <p className="text-center text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
              New to Foodie?{" "}
              <span className="text-white hover:text-amber-500 cursor-pointer transition-colors">
                Create Account
              </span>
            </p>
          </Link>

          {/* --- Partner Login Option --- */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                Business Access
              </span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>

            <Link 
              to="/food-partner/login" 
              className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500/60 hover:text-amber-500 transition-all group"
            >
              <Briefcase
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              Are you a restaurant?{" "}
              <span className="text-white underline underline-offset-4 decoration-amber-500/30">
                Login as Partner
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
