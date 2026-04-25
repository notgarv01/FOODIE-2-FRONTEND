import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

const RatingForm = ({ onSubmit, restaurantName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating!");
    onSubmit({ rating, comment });
  };

  return (
    <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700 px-2">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-black italic uppercase text-white">
          Rate <span className="text-amber-500">{restaurantName || 'the Meal'}</span>
        </h2>
        <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
          Your feedback keeps us cooking
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="bg-[#0F0F0F] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] p-5 md:p-6 lg:p-8 space-y-4 md:space-y-6 shadow-2xl"
      >
        {/* Star Rating System */}
        <div className="flex justify-center gap-2 md:gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform active:scale-90"
            >
              <Star
                size={32}
                className={`transition-all ${
                  (hover || rating) >= star ? "text-amber-500 scale-110" : "text-white/10"
                }`}
                fill={(hover || rating) >= star ? "#f59e0b" : "none"}
              />
            </button>
          ))}
        </div>

        {/* Comment Box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was the food and delivery?"
          className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none h-24 md:h-28 transition-colors"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-amber-500 text-black py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Submit Review <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default RatingForm;