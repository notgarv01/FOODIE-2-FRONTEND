import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../utils/api';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const response = await fetch(`${API_URL}/api/auth/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful registration
        login(data.user);
        navigate('/user/home');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Join the revolution of video-first dining.">
      <div className="w-full max-w-sm md:max-w-md space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="space-y-2 md:space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Create Account</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Start your journey with premium local tastes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs md:text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="relative group">
            <User size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-600 font-bold text-sm md:text-base" 
              required
            />
          </div>
          
          <div className="relative group">
            <Mail size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
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
            <Lock size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
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
            className="w-full bg-amber-500 text-black font-black py-3 md:py-4 rounded-2xl hover:bg-amber-400 hover:-translate-y-1 active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <div className="space-y-4 md:space-y-6 pt-4 border-t border-white/5">
          <p className="text-center text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            Already have an account?{" "}
            <Link to="/user/login" className="text-white hover:text-amber-500 transition-colors">
              Login
            </Link>
          </p>

          {/* --- Partner Register Section --- */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Business Growth</span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>
            
            {/* Partner Register Link Added */}
            <Link 
              to="/food-partner/register" 
              className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500/60 hover:text-amber-500 transition-all group"
            >
              <Briefcase size={14} className="group-hover:scale-110 transition-transform" />
              Want to sell on Foodie?{" "}
              <span className="text-white underline underline-offset-4 decoration-amber-500/30">
                Register as Partner
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UserRegister;