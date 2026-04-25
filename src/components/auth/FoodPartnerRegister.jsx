import React, { useState } from 'react';
import { Store, User, Mail, Lock, ArrowRight, Zap, UserPlus, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../utils/api";

const FoodPartnerRegister = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    restaurantName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific field errors when user starts typing again
    setFieldErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({ email: '', restaurantName: '' });

    try {
      const response = await fetch(`${API_URL}/api/auth/food-partner/register`, {
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
        navigate('/food-partner/home');
      } else {
        // Logic matches your requirement: specific UI messages for taken values
        if (data.message === 'Email already registered') {
          setFieldErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else if (data.message === 'Restaurant name already taken') {
          setFieldErrors(prev => ({ ...prev, restaurantName: 'Restaurant name is already taken' }));
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Scale your brand with the first video-first network.">
      <div className="w-full max-w-sm md:max-w-md space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="space-y-3 md:space-y-4">
          <span className="bg-emerald-500/10 text-emerald-500 text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20 flex items-center gap-2 w-fit">
            <Zap size={12}/> Join Partner Network
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight italic">Register Kitchen</h2>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Showcase your skills to thousands of local diners.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Restaurant Name Field */}
          <div className="relative group">
            <Store size={18} className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.restaurantName ? 'text-red-500' : 'text-slate-600 group-focus-within:text-amber-500'}`} />
            <input 
              type="text" 
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Restaurant Name" 
              className={`w-full bg-white/5 border rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none transition-all placeholder:text-slate-800 font-bold text-sm md:text-base ${
                fieldErrors.restaurantName 
                  ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                  : 'border-white/10 focus:border-amber-500'
              }`}
              required
            />
            {fieldErrors.restaurantName && (
              <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {fieldErrors.restaurantName}
              </p>
            )}
          </div>

          <div className="relative group">
            <User size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner Full Name" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800 font-bold text-sm md:text-base" 
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Mail size={18} className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-slate-600 group-focus-within:text-amber-500'}`} />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Business Email" 
              className={`w-full bg-white/5 border rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none transition-all placeholder:text-slate-800 font-bold text-sm md:text-base ${
                fieldErrors.email 
                  ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                  : 'border-white/10 focus:border-amber-500'
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 ml-2 flex items-center gap-1">
                <AlertCircle size={10} /> {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create Password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-800 font-bold text-sm md:text-base" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black py-3 md:py-4 rounded-2xl hover:bg-amber-400 hover:-translate-y-1 active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] md:text-xs mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Submit Application'} <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <div className="space-y-4 md:space-y-6 pt-4 border-t border-white/5">
          <p className="text-center text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            Already a partner?{" "}
            <Link to="/food-partner/login" className="text-white hover:text-amber-500 transition-colors font-bold">
              Portal Login
            </Link>
          </p>

          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Individual Account?</span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>
            
            <Link 
              to="/user/register" 
              className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all group"
            >
              <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
              Just want to eat?{" "}
              <span className="text-white underline underline-offset-4 decoration-white/20">
                Register as User
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default FoodPartnerRegister;