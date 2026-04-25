import React from 'react';
import { Bell } from 'lucide-react';

const Notification = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="border border-white/10 rounded-2xl md:rounded-[2.5rem] p-8 md:p-12 lg:p-16 max-w-md md:max-w-2xl w-full shadow-[0_0_60px_-15px_rgba(59,130,246,0.15)] shadow-black/50">
        <div className="relative flex flex-col items-center">
          {/* Subtle, thin stroke icon to match the premium minimalist look */}
          <Bell size={48} md:size={64} className="text-zinc-800 mb-4 md:mb-6" strokeWidth={0.5} />
          
          {/* Deep blue cinematic glow - very low opacity to keep it classy */}
          <div className="absolute inset-0 bg-blue-600/[0.03] blur-[100px] rounded-full" />
        </div>
        
        {/* Title with high-contrast White against the black background */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase italic tracking-tighter text-center">
          Signal <span className="text-zinc-700">Restricted</span>
        </h3>
        
        {/* Separator metadata */}
        <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-4 justify-center">
          <div className="h-px w-6 md:w-8 bg-white/[0.03]" />
          <p className="text-zinc-600 text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
            Priority: Offline
          </p>
          <div className="h-px w-6 md:w-8 bg-white/[0.03]" />
        </div>

        {/* Footer text - dimmed out to keep focus on the main title */}
        <p className="text-zinc-800 text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-8 md:mt-12 max-w-[240px] md:max-w-[320px] text-center leading-relaxed mx-auto">
          Real-time push notifications and activity alerts are being calibrated for the next production deployment.
        </p>
      </div>
    </div>
  );
};

export default Notification;
