import React from 'react';
import { Filter, X } from 'lucide-react';

const FilterSection = ({ 
  activeFilters, 
  availableCuisines, 
  showCuisineModal, 
  setShowCuisineModal, 
  handleFilterToggle, 
  handleCuisineToggle,
  setActiveFilters 
}) => {
  return (
    <>
      {/* --- Filter Chips --- */}
      <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto no-scrollbar pb-2">
        <button className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-neutral-900 border border-white/10 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:border-amber-500/50 transition-colors">
          <Filter size={14}/> Filters
        </button>
        
        {/* Pure Veg Filter */}
        <button 
          onClick={() => handleFilterToggle('pureVeg')}
          className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeFilters.pureVeg 
              ? 'bg-emerald-500 text-black border-emerald-500' 
              : 'bg-neutral-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          Pure Veg
        </button>
        
        {/* Rating 4.0+ Filter */}
        <button 
          onClick={() => handleFilterToggle('rating4Plus')}
          className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeFilters.rating4Plus 
              ? 'bg-amber-500 text-black border-amber-500' 
              : 'bg-neutral-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          Rating 4.0+
        </button>
        
        {/* Fast Delivery Filter */}
        <button 
          onClick={() => handleFilterToggle('fastDelivery')}
          className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors ${
            activeFilters.fastDelivery 
              ? 'bg-blue-500 text-black border-blue-500' 
              : 'bg-neutral-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          Fast Delivery
        </button>
        
        {/* Cuisines Filter */}
        <button 
          onClick={() => setShowCuisineModal(true)}
          className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors relative ${
            activeFilters.cuisines.length > 0 
              ? 'bg-purple-500 text-black border-purple-500' 
              : 'bg-neutral-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          Cuisines
          {activeFilters.cuisines.length > 0 && (
            <span className="ml-2 bg-black/20 px-1.5 py-0.5 rounded text-[9px] md:text-[10px]">
              {activeFilters.cuisines.length}
            </span>
          )}
        </button>
      </div>

      {/* Cuisine Modal */}
      {showCuisineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-neutral-900 rounded-2xl border border-white/10 p-4 md:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-black">Select Cuisines</h3>
              <button 
                onClick={() => setShowCuisineModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              {availableCuisines.map(cuisine => (
                <label key={cuisine} className="flex items-center gap-3 cursor-pointer p-2.5 md:p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={activeFilters.cuisines.includes(cuisine)}
                    onChange={() => handleCuisineToggle(cuisine)}
                    className="w-4 h-4 rounded border-white/20 bg-neutral-800 text-amber-500 focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-xs md:text-sm font-medium">{cuisine}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, cuisines: [] }))}
                className="flex-1 py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowCuisineModal(false)}
                className="flex-1 py-2.5 md:py-3 bg-amber-500 text-black rounded-xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-amber-400 transition-colors"
              >
                Apply ({activeFilters.cuisines.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSection;
