import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AccountSettings = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-40 px-4 border border-white/5 rounded-2xl md:rounded-[3rem] bg-white/[0.01] animate-in fade-in zoom-in-95 duration-700">
      <div className="relative">
        <ShieldCheck size={64} className="text-neutral-900 mb-4 md:mb-6" strokeWidth={1} />
        {/* Subtle glow effect to match your cinematic theme */}
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />
      </div>
      
      <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
        Module <span className="text-slate-700">Encrypted</span>
      </h3>
      
      <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-4">
        <div className="h-px w-6 md:w-8 bg-white/5" />
        <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
          Access Level: v2.0 Only
        </p>
        <div className="h-px w-6 md:w-8 bg-white/5" />
      </div>

      <p className="text-slate-500/40 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-8 md:mt-12 max-w-xs text-center leading-relaxed">
        Advanced security protocols and two-factor authentication management are currently restricted in this build.
      </p>
    </div>
  );
};

export default AccountSettings;