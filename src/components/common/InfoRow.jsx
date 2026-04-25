import React from 'react';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-3">
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold text-slate-200 tracking-tight">{value}</span>
  </div>
);

export default InfoRow;
