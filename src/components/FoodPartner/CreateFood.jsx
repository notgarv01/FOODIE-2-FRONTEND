import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../utils/api';
import {
  ArrowLeft,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Flame,
  Leaf,
  IndianRupee,
  UploadCloud,
  X,
  FastForward,
  Loader2,
  AlertCircle,
} from "lucide-react";

const CreateFood = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isVeg: true,
    category: "Main Course",
    cuisineType: "",
    isReel: false,
    image: null,
    videoFile: null,
  });

  const [preview, setPreview] = useState({ image: null, video: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, videoFile: file }));
    setPreview((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError("Dish name is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return;
    }
    if (!formData.image) {
      setError("Image is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // The backend uses httpOnly cookies for authentication, so no need to manually handle tokens
      // The browser will automatically include the cookie in the request

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("isVeg", formData.isVeg);
      payload.append("category", formData.category);
      payload.append("cuisineType", formData.cuisineType);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (formData.videoFile) {
        payload.append("videoFile", formData.videoFile);
      }

      const response = await fetch(`${API_URL}/api/food/create`, {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/food-partner/home");
        }, 2000);
      } else {
        setError(data.message || "Failed to create dish. Please try again.");
      }
    } catch (error) {
      console.error("Error creating dish:", error);
      setError(error.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 lg:py-16">
        {/* TOP NAVIGATION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-8 md:mb-16">
          <button
            onClick={() => navigate("/food-partner/home")}
            className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em]"
          >
            <div className="p-2 rounded-full border border-white/5 group-hover:border-white/20 group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Kitchen
          </button>

          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
              ADD{" "}
              <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                DISH
              </span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em] mt-2">
              Haute Cuisine Portal
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-12">
          {/* LEFT: PRIMARY DETAILS */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <section className="bg-neutral-900/30 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl space-y-6 md:space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1 opacity-80">Dish Identity</label>
                <input
                  name="name"
                  placeholder="e.g. Truffle Glazed Salmon"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 px-6 md:px-8 text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-bold italic text-base md:text-lg"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Composition & Story</label>
                <textarea
                  name="description"
                  placeholder="Describe the flavors, textures, and soul of this dish..."
                  rows="4"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 px-6 md:px-8 text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all font-medium italic text-xs md:text-sm resize-none"
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valuation (INR)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-amber-500/50 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-6 md:pr-8 text-white focus:outline-none focus:border-amber-500/50 transition-all font-black text-lg md:text-xl"
                      onChange={handleChange}
                      value={formData.price}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dietary Philosophy</label>
                  <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 gap-2">
                    <button
                      onClick={() => setFormData(p => ({ ...p, isVeg: true }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black transition-all ${formData.isVeg ? "bg-green-500/20 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "text-slate-600 hover:text-white"}`}
                    >
                      <Leaf size={14} /> VEGETARIAN
                    </button>
                    <button
                      onClick={() => setFormData(p => ({ ...p, isVeg: false }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black transition-all ${!formData.isVeg ? "bg-red-500/20 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "text-slate-600 hover:text-white"}`}
                    >
                      <Flame size={14} /> NON-VEG
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                  <select
                    name="category"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 px-6 md:px-8 text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer font-bold italic text-sm md:text-base"
                    onChange={handleChange}
                    value={formData.category}
                  >
                    <option className="bg-neutral-900">Main Course</option>
                    <option className="bg-neutral-900">Starters</option>
                    <option className="bg-neutral-900">Beverages</option>
                    <option className="bg-neutral-900">Desserts</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cuisine Origin</label>
                  <input
                    name="cuisineType"
                    placeholder="e.g. Japanese-Peruvian"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 md:py-5 px-6 md:px-8 text-white focus:outline-none focus:border-amber-500/50 transition-all font-bold italic text-sm md:text-base"
                    onChange={handleChange}
                    value={formData.cuisineType}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: ASSETS & PUBLISH */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {/* MEDIA UPLOADS */}
            <div className="grid gap-4 md:gap-6">
              {/* IMAGE UPLOAD */}
              <div className="relative group">
                <input
                  type="file"
                  id="imageInput"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />
                <label
                  htmlFor="imageInput"
                  className={`block w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] transition-all cursor-pointer border-2 border-dashed ${
                    preview.image
                      ? "border-transparent"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/30"
                  }`}
                >
                  {preview.image ? (
                    <div className="relative aspect-video">
                      <img
                        src={preview.image}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <ImageIcon className="text-white" size={32} />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center gap-3 md:gap-4">
                      <div className="p-3 md:p-4 rounded-full bg-amber-500/10 text-amber-500">
                        <ImageIcon size={28} />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[.2em] text-slate-400">
                        Hero Photograph
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* VIDEO REEL UPLOAD */}
              <div className="relative group">
                <input
                  type="file"
                  id="videoInput"
                  hidden
                  accept="video/*"
                  onChange={handleVideo}
                />
                <label
                  htmlFor="videoInput"
                  className={`block w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] transition-all cursor-pointer border-2 border-dashed ${
                    preview.video
                      ? "border-transparent"
                      : "border-amber-500/5 bg-amber-500/[0.02] hover:bg-amber-500/[0.05] hover:border-amber-500/20"
                  }`}
                >
                  {preview.video ? (
                    <div className="relative aspect-[9/12] max-h-[300px] md:max-h-[400px]">
                      <video
                        src={preview.video}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 p-2 md:p-3 bg-black/60 rounded-full text-white backdrop-blur-md">
                        <FastForward size={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex flex-col items-center justify-center gap-3 md:gap-4">
                      <div className="p-3 md:p-4 rounded-full bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        <Video size={24} />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[.2em] text-amber-500/80">
                        Cinematic Reel (MP4)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 md:p-4 flex items-center gap-3">
                <AlertCircle size={18} className="text-red-400" />
                <p className="text-red-400 text-xs md:text-sm font-medium">{error}</p>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 md:p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <p className="text-emerald-400 text-xs md:text-sm font-medium">
                  Dish created successfully! Redirecting...
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full group relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-black py-6 md:py-8 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all hover:-translate-y-1 active:scale-[0.98] shadow-[0_20px_40px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                  {loading ? (
                    <>
                      <Loader2 size={22} strokeWidth={3} className="animate-spin" />
                      PUBLISHING...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={22} strokeWidth={3} />
                      PUBLISH MASTERPIECE
                    </>
                  )}
                </div>
                {/* Subtle Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <p className="text-center text-[8px] md:text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-4 md:mt-6">
                All ingredients and media will be live instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFood;