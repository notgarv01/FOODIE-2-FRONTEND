import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';

const OrderPlaced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, orderId } = location.state || {};
  
  const [step, setStep] = useState('placed'); 
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (step === 'delivering' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStep('delivered');
    }
  }, [countdown, step]);

  const handleRateOrder = () => {
    navigate('/user/rate-order', { state: { restaurant, orderId } });
  };

  const handleReturnHome = () => {
    navigate('/user/home');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      
      {/* 1. Placed View */}
      {step === 'placed' && (
        <div className="text-center space-y-4 md:space-y-6">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto" strokeWidth={1.5} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase">Order <span className="text-amber-500">Placed!</span></h1>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button 
              onClick={handleReturnHome}
              className="bg-transparent border border-white/20 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs hover:bg-white/10 transition-colors"
            >
              Return to Home
            </button>
            <button 
              onClick={() => setStep('delivering')}
              className="group relative bg-white text-black px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest overflow-hidden transition-all duration-300 hover:bg-amber-500 hover:text-white active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              {/* Subtle shine effect on hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              
              <span className="relative z-10 flex items-center gap-2">
                Track My Order
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Delivering View (Countdown) */}
      {step === 'delivering' && (
        <div className="text-center space-y-4 md:space-y-6">
          <div className="relative inline-block">
            <Clock size={80} className="text-amber-500 animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center font-black text-2xl md:text-3xl">{countdown}</span>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Food Arriving in <span className="text-amber-500 underline">{countdown}s</span></h2>
        </div>
      )}

      {/* 3. Delivered View */}
      {step === 'delivered' && (
        <div className="text-center space-y-4 md:space-y-6">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto" strokeWidth={1.5} />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black italic uppercase">Order <span className="text-amber-500">Delivered!</span></h1>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button 
              onClick={handleReturnHome}
              className="bg-transparent border border-white/20 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs hover:bg-white/10 transition-colors"
            >
              Return to Home
            </button>
            <button 
              onClick={handleRateOrder}
              className="bg-amber-500 text-black px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs hover:bg-amber-400 transition-colors"
            >
              Rate Your Order
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderPlaced;