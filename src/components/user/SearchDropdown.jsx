import React, { useEffect } from 'react';

const SearchDropdown = ({ 
  searchResults, 
  isSearching, 
  showSearchResults, 
  handleSearchResultClick, 
  setShowSearchResults 
}) => {
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearchResults]);

  if (!showSearchResults) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl md:rounded-2xl shadow-2xl max-h-80 md:max-h-96 overflow-y-auto z-50">
      {isSearching ? (
        <div className="p-3 md:p-4 text-center">
          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-400 text-xs md:text-sm">Searching...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="p-1.5 md:p-2">
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSearchResultClick(result)}
              className="p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-2 md:gap-3"
            >
              <img 
                src={result.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600'} 
                alt={result.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-xs md:text-sm">{result.name}</h4>
                <p className="text-slate-400 text-[10px] md:text-xs">{result.cuisine}</p>
                <div className="flex items-center gap-1.5 md:gap-2 mt-1">
                  <span className="text-amber-500 font-bold text-[10px] md:text-xs">{result.rating || '4.0'}</span>
                  <span className="text-slate-500 text-[10px] md:text-xs">•</span>
                  <span className="text-slate-400 text-[10px] md:text-xs">{result.price}</span>
                  <span className="text-slate-500 text-[10px] md:text-xs">•</span>
                  <span className="text-slate-400 text-[10px] md:text-xs">{result.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {result.type === 'restaurant' && (
                  <span className="text-[9px] md:text-[10px] bg-amber-500/20 text-amber-400 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                    Restaurant
                  </span>
                )}
                {result.type === 'food' && (
                  <span className="text-[9px] md:text-[10px] bg-blue-500/20 text-blue-400 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                    Dish
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 md:p-4 text-center">
          <p className="text-slate-400 text-xs md:text-sm">No results found</p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
