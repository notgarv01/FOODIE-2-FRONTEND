import React from 'react';
import { Mail, Phone, MapPin, Calendar, User, Edit3 } from 'lucide-react';
import { formatLocation } from '../../../utils/formatUtils';
import InfoRow from '../../common/InfoRow';

const AccountDetails = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-neutral-900/20 border border-white/5 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-[2rem] space-y-4 md:space-y-6">
        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-amber-500">Account Details</h3>
        <div className="space-y-3 md:space-y-5">
          <InfoRow label="Email" value={userData?.email || 'user@example.com'} />
          <InfoRow label="Phone" value={userData?.phone || '+91 XXXXX XXXXX'} />
          <InfoRow label="City" value={formatLocation(userData?.city, 'Not specified')} />
          <InfoRow label="State" value={formatLocation(userData?.state, 'Not specified')} />
          <InfoRow label="Address" value={userData?.address || 'Not specified'} />
        </div>
      </div>

      <div className="bg-neutral-900/20 border border-white/5 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-[2rem] space-y-4 md:space-y-6">
        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-amber-500">Saved Addresses</h3>
        <div className="space-y-3 md:space-y-4">
          {userData?.addresses?.map((address) => (
            <div key={address.id} className="p-3 md:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-white tracking-widest bg-white/10 px-1.5 md:px-2 py-0.5 rounded">{address.type}</p>
                <Edit3 size={12} className="text-slate-600 cursor-pointer" />
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed italic">
                {address.address}
              </p>
            </div>
          )) || (
            <p className="text-slate-500 text-xs md:text-sm">No saved addresses</p>
          )}
          <button className="w-full py-3 md:py-4 border-2 border-dashed border-white/5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-slate-600 hover:border-amber-500/30 hover:text-amber-500 transition-all uppercase tracking-widest">
            + Add New Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
