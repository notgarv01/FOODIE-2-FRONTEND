import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../utils/api";

const FoodPartnerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Enhanced back button prevention
  useEffect(() => {
    const preventBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.href);
      
      // If user tries to go back, keep them on login page
      if (window.location.pathname === '/food-partner/login') {
        window.history.pushState(null, null, '/food-partner/login');
        navigate('/food-partner/login', { replace: true });
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
      const response = await fetch(`${API_URL}/api/auth/food-partner/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.partner, 'partner');
        // Redirect to the page they were trying to access, or home by default
        const from = location.state?.from?.pathname || '/food-partner/home';
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Manage your kitchen, videos, and growth.">
      <div className="w-full max-w-sm md:max-w-md space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="space-y-3 md:space-y-4">
          <span className="bg-amber-500/10 text-amber-500 text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-amber-500/20 flex items-center gap-2 w-fit">
            <ShieldCheck size={12}/> Partner Portal
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight italic">Partner Login</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Access your professional dashboard and live highlights.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs md:text-sm text-center">
              {error}
            </div>
          )}
          <div className="relative group">
            <Mail size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Business Email" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800 font-bold text-sm md:text-base" 
              required
            />
          </div>
          <div className="relative group">
            <Lock size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800 font-bold text-sm md:text-base" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-3 md:py-4 rounded-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entering...' : 'Enter Portal'} <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <div className="space-y-4 md:space-y-6 pt-4 border-t border-white/5">
          <p className="text-center text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            Need to join?{" "}
            <Link to="/food-partner/register" className="text-white hover:text-amber-500 transition-colors font-bold">
              Become a Partner
            </Link>
          </p>

          {/* --- Switch to User Login Section --- */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Not a Business?</span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>
            
            <Link 
              to="/user/login" 
              className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all group"
            >
              <UserCircle size={14} className="group-hover:scale-110 transition-transform" />
              Looking for food?{" "}
              <span className="text-white underline underline-offset-4 decoration-white/20">
                Login as User
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default FoodPartnerLogin;