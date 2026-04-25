import React, { useState } from 'react';
import { X, CheckCircle2, Utensils, IndianRupee, Film, Loader2, Play, Info, Leaf, Drumstick, Clock, Star } from 'lucide-react';

const UploadVideo = ({ onBack }) => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [foodType, setFoodType] = useState('veg');
  const [isDineOut, setIsDineOut] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-4 md:p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic">
              Partner <span className="text-amber-500">Studio</span>
            </h2>
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Upload. Detail. Sell.</p>
          </div>
          <button onClick={onBack} className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 flex-1">
          
          {/* --- LEFT SIDE: Video & Preview --- */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 flex flex-col items-center justify-center space-y-4 md:space-y-6 shadow-2xl">
            <div className="relative w-full max-w-[240px] md:max-w-[280px] aspect-9/16 bg-black rounded-4xl border-2 border-dashed border-white/10 overflow-hidden group shadow-2xl">
              {videoPreview ? (
                <>
                  <video src={videoPreview} className="w-full h-full object-cover" autoPlay loop muted />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                      Change Video
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer h-full flex flex-col items-center justify-center gap-4 md:gap-6 p-6 md:p-8 text-center group">
                  <div className="p-4 md:p-6 bg-amber-500/10 rounded-full text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500 shadow-xl shadow-amber-500/5">
                    <Film size={32} />
                  </div>
                  <p className="text-white font-black text-base md:text-lg uppercase tracking-tighter italic">Select Dish Video</p>
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                </label>
              )}
            </div>
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">9:16 Vertical • Sizzling Sounds Preferred</p>
          </div>

          {/* --- RIGHT SIDE: Detailed Form --- */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between shadow-2xl">
            {/* no-scrollbar class index.css se uthayega */}
            <div className="space-y-4 md:space-y-6 overflow-y-auto no-scrollbar pr-2">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3 md:pb-4 mb-3 md:mb-4">
                <Utensils size={18} className="text-amber-500"/>
                <h3 className="font-black text-sm md:text-base text-white uppercase italic tracking-tight">Dish Specifications</h3>
              </div>

              {/* Veg / Non-Veg Toggle */}
              <div className="flex gap-3 md:gap-4">
                <button 
                  type="button"
                  onClick={() => setFoodType('veg')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-xl border font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${foodType === 'veg' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  <Leaf size={14} /> Pure Veg
                </button>
                <button 
                  type="button"
                  onClick={() => setFoodType('non-veg')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-xl border font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${foodType === 'non-veg' ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  <Drumstick size={14} /> Non-Veg
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {/* Dish Name */}
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dish Name</label>
                  <input type="text" placeholder="E.G. TRUFFLE BUTTER CHICKEN" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 text-white focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm placeholder:text-slate-800 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {/* Delivery/Base Price */}
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Base Price</label>
                    <div className="relative group">
                      <IndianRupee size={14} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                      {/* Global CSS se number arrows gayab ho jayenge */}
                      <input type="number" placeholder="499" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 pl-8 md:pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm transition-all" />
                    </div>
                  </div>
                  {/* Cuisine */}
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cuisine</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 md:py-4 px-4 text-slate-400 focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm appearance-none cursor-pointer">
                      <option>Select Type</option>
                      <option>North Indian</option>
                      <option>Italian</option>
                      <option>Chinese</option>
                      <option>Continental</option>
                    </select>
                  </div>
                </div>

                {/* Dine-out Availability Toggle */}
                <div className={`flex items-center justify-between p-3 md:p-4 bg-white/5 border rounded-xl transition-all duration-300 ${isDineOut ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Clock size={16} className={isDineOut ? "text-amber-500" : "text-slate-500"} />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Available for Dine-out?</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isDineOut}
                    onChange={(e) => setIsDineOut(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 accent-amber-500 bg-transparent border-white/10 cursor-pointer" 
                  />
                </div>

                {/* Dynamic Dine-out Price Field (Appears only if checked) */}
                {isDineOut && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Star size={10} fill="currentColor"/> Dine-out Special Price
                    </label>
                    <div className="relative group">
                      <IndianRupee size={14} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-amber-500 transition-colors" />
                      <input 
                        type="number" 
                        placeholder="Enter dine-in price" 
                        className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl py-3 md:py-4 pl-8 md:pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dish Story</label>
                  <textarea rows="3" placeholder="Briefly describe the taste and vibe..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 text-white focus:outline-none focus:border-amber-500 transition-all resize-none text-xs md:text-sm placeholder:text-slate-800" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 md:gap-4 pt-4 md:pt-6 mt-3 md:mt-4">
              <button className="flex-1 bg-amber-500 text-black py-3 md:py-4 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle2 size={16} strokeWidth={3} /> Post Video
              </button>
              <button onClick={onBack} className="px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:text-white transition-all active:scale-95">
                Discard
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadVideo;