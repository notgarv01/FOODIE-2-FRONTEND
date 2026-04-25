import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RatingForm from './RatingForm';
import { CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../utils/api';

const RateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, orderId } = location.state || {};
  const [showPopup, setShowPopup] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handleSubmit = async (data) => {
    console.log("Sending to MongoDB:", data);
    console.log("Order ID:", orderId);
    
    if (!orderId) {
      setShowPopup(true);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/user/home");
      }, 2000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/orders/${orderId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rating: data.rating })
      });

      if (response.ok) {
        console.log("Rating successful");
        setRatingSubmitted(true);
        setShowPopup(true);
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/user/home");
        }, 2000);
      } else {
        const result = await response.json();
        console.error("Rating failed:", result);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 relative">
      {!ratingSubmitted && (
        <RatingForm
          restaurantName={restaurant?.name}
          onSubmit={handleSubmit}
        />
      )}
      
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl flex flex-col items-center gap-3 md:gap-4 animate-in zoom-in-95 duration-300 max-w-sm w-full">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            {orderId ? (
              <>
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest text-center">Rating Done!</h3>
                <p className="text-slate-400 text-xs md:text-sm text-center">Redirecting to home...</p>
              </>
            ) : (
              <>
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest text-center">Error!</h3>
                <p className="text-slate-400 text-xs md:text-sm text-center">Order ID not found. Cannot submit rating.</p>
              </>
            )}
            {!orderId && (
              <p className="text-slate-400 text-xs md:text-sm text-center">Redirecting to home...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RateOrder;