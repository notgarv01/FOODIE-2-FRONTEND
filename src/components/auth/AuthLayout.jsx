import React from 'react';
import { Star, Clock, Video } from 'lucide-react';

const AuthLayout = ({ children, tagline }) => (
  <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row font-sans">
    {/* Mobile Header - Only visible on small screens */}
    <div className="lg:hidden flex items-center justify-center p-6 md:p-8 border-b border-white/5 bg-[#050505]">
      <div className="text-3xl md:text-4xl font-black tracking-tighter text-white">FOODIE<span className="text-amber-500">.</span></div>
    </div>
    
    {/* Left Side: Branding */}
    <div className="hidden lg:flex w-1/2 relative bg-[#050505] items-center justify-center p-8 md:p-12 overflow-hidden border-r border-white/5">
      <div className="absolute top-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="relative z-10 w-full max-w-sm md:max-w-md space-y-6 md:space-y-8">
        <div className="text-3xl md:text-4xl font-black tracking-tighter text-white">FOODIE<span className="text-amber-500">.</span></div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tighter uppercase italic">Watch.<br />Order.<br /><span className="text-amber-500 text-5xl md:text-6xl lg:text-7xl">Eat.</span></h1>
        <p className="text-slate-400 text-base md:text-lg font-medium">{tagline}</p>
        <div className="space-y-3 md:space-y-4 pt-4 md:pt-6">
          <Badge icon={<Star size={18}/>} label="4.9★ Rated" sub="Global Choice" />
          <Badge icon={<Clock size={18}/>} label="30 Min Delivery" sub="Turbo Logistics" className="ml-6 md:ml-8" />
          <Badge icon={<Video size={18}/>} label="Live Kitchens" sub="Watch it cooked" />
        </div>
      </div>
    </div>
    {/* Right Side: Forms */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-16">
      {children}
    </div>
  </div>
);

const Badge = ({ icon, label, sub, className = "" }) => (
  <div className={`flex items-center gap-3 md:gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit hover:translate-x-2 transition-transform duration-500 ${className}`}>
    <div className="bg-amber-500/20 p-1.5 md:p-2 rounded-lg text-amber-500">{icon}</div>
    <div>
      <p className="text-white font-bold text-xs md:text-sm">{label}</p>
      <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{sub}</p>
    </div>
  </div>
);

export default AuthLayout;