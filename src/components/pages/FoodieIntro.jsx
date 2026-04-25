import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  MapPin,
  PlayCircle,
  Star,
  ArrowRight,
  Heart,
  Zap,
  Clock,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const FoodieIntro = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "All",
    "Trending",
    "Healthy",
    "Burgers",
    "Pizza",
    "Sushi",
    "Desserts",
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans selection:bg-amber-500/30 overflow-x-hidden">
      {/* --- Dynamic Navbar --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-4 ${
          isScrolled
            ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1">
            FOODIE<span className="h-2 w-2 bg-amber-500 rounded-full"></span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#home" className="text-amber-500">Home</a>
            <a href="#discover" className="hover:text-white transition-colors">Discover</a>
            <a href="#trending" className="hover:text-white transition-colors">Trending</a>
            <a href="#near-me" className="hover:text-white transition-colors">Near Me</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-slate-400 hover:text-white">
              <Search size={20} />
            </button>
            <Link to="/user/register">
              <button className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-lg shadow-white/5">
                JOIN
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-24 md:pt-40 pb-16 px-4 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8 md:space-y-10 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
              Live: 1,240 chefs cooking now
            </span>
          </div>

          {/* Changed: Responsive font size (text-5xl to text-7xl to 100px) */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black leading-[0.9] md:leading-[0.85] tracking-tighter text-white">
            DON'T JUST <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">
              ORDER.
            </span>{" "}
            <br />
            WATCH.
          </h1>

          <p className="text-slate-400 text-base md:text-xl max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            The first video-first food app. See exactly what’s cooking before
            you hit order. Real food, real videos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5">
            <Link to="/user/register" className="w-full sm:w-auto">
              <button className="w-full group bg-amber-500 hover:bg-amber-400 text-black px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20">
                Start Browsing{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/user/register" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 md:py-4 rounded-2xl md:rounded-[2rem] font-bold text-base md:text-lg transition-all">
                  <PlayCircle className="text-amber-500" />
                  Watch Highlights
                </button>
            </Link>
          </div>
        </div>

        {/* --- Visual Bento Grid --- */}
        <div className="relative mt-12 lg:mt-0">
          <div className="absolute -top-10 -right-10 w-40 md:w-80 h-40 md:h-80 bg-amber-500/10 rounded-full blur-[60px] md:blur-[100px]"></div>
          
          {/* Changed: Custom Grid for Mobile (stacked) vs Desktop */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3 md:space-y-4">
              <div className="h-48 md:h-64 bg-neutral-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 group relative">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500"
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition duration-700"
                  alt="Pizza"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                  <Heart size={14} className="text-rose-500" />
                </div>
              </div>
              <div className="h-32 md:h-40 bg-amber-500 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col justify-between text-black">
                <Zap fill="black" size={20} />
                <p className="font-black text-base md:text-xl leading-none italic uppercase">
                  Fastest <br /> Delivery
                </p>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
              <div className="h-32 md:h-40 bg-neutral-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500"
                  className="w-full h-full object-cover"
                  alt="Sushi"
                />
                <p className="absolute bottom-4 left-4 z-20 font-bold text-[10px] md:text-xs flex items-center gap-1 italic uppercase">
                  <Star size={12} className="fill-amber-500 text-amber-500" />{" "}
                  Top Rated
                </p>
              </div>
              <div className="h-48 md:h-64 bg-neutral-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 relative">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500"
                  className="w-full h-full object-cover"
                  alt="Burger"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition duration-500">
                  <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/30">
                    <PlayCircle size={24} md:size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Interactive Category Strip --- */}
      <section className="py-6 md:py-10 border-y border-white/5 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto flex gap-3 md:gap-4 no-scrollbar">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full border text-[11px] md:text-sm font-bold transition-all whitespace-nowrap ${
                cat === "Trending"
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- Why Foodie? Section --- */}
      <section className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: <PlayCircle size={30} />,
              title: "Video Menus",
              desc: "Short 15s clips of every dish.",
            },
            {
              icon: <Clock size={30} />,
              title: "No Latency",
              desc: "Real-time order tracking from pan to porch.",
            },
            {
              icon: <MapPin size={30} />,
              title: "Local Gems",
              desc: "Discover the best hidden street food spots.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-neutral-900/50 border border-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer / CTA --- */}
      <footer className="bg-neutral-900/80 py-12 md:py-20 px-4 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
            Join the <span className="text-amber-500">Food Revolution.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button className="bg-white text-black font-black px-8 py-4 rounded-xl md:rounded-2xl hover:bg-amber-500 transition-all uppercase tracking-widest text-[11px] md:text-xs">
              App Store
            </button>
            <button className="bg-white text-black font-black px-8 py-4 rounded-xl md:rounded-2xl hover:bg-amber-500 transition-all uppercase tracking-widest text-[11px] md:text-xs">
              Play Store
            </button>
          </div>
          <p className="text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-widest pt-4">
            © 2026 FOODIE. DESIGNED FOR THE HUNGRY.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FoodieIntro;