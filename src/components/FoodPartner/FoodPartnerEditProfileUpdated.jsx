import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Globe, 
  Clock, 
  Save, 
  X,
  Camera,
  Upload,
  Store
} from 'lucide-react';
import { formatLocation } from '../../utils/formatUtils';

const FoodPartnerEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    image: "",
    isNightOpen: false,
    isDineOutAvailable: true,
    isDeliveryAvailable: true,
    isPureVeg: false,
    cuisine: [],
  });

  // Fetch existing profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/food/profile`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const profileData = result.data;
            setFormData({
              restaurantName: profileData.restaurantName || "",
              ownerName: profileData.ownerName || "",
              email: profileData.email || "",
              phone: profileData.phone?.toString() || "",
              address: profileData.address || "",
              city: formatLocation(profileData.city, ""),
              state: formatLocation(profileData.state, ""),
              image: profileData.image || "",
              isNightOpen: profileData.isNightOpen || false,
              isDineOutAvailable:
                profileData.isDineOutAvailable !== undefined
                  ? profileData.isDineOutAvailable
                  : true,
              isDeliveryAvailable:
                profileData.isDeliveryAvailable !== undefined
                  ? profileData.isDeliveryAvailable
                  : true,
              isPureVeg: profileData.isPureVeg || false,
              cuisine: profileData.cuisine || [],
            });
          }
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Network error while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addCuisine = () => {
    if (
      cuisineInput.trim() &&
      !formData.cuisine.includes(cuisineInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        cuisine: [...prev.cuisine, cuisineInput.trim()],
      }));
      setCuisineInput("");
    }
  };

  const removeCuisine = (tag) => {
    setFormData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((c) => c !== tag),
    }));
  };

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit");
      return;
    }

    try {
      setLoading(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error converting image:", error);
      setError("Failed to convert image");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/food/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/food-partner/home");
        }, 2000);
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-lg md:text-xl font-black italic text-white">EDIT KITCHEN</h2>
        <div className="w-8 md:w-10" /> {/* Spacer for balance */}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-xs md:text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12 max-w-4xl">
        {/* --- Section 1: Branding --- */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-1 bg-amber-500 w-10 md:w-12 rounded-full" />
            <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Branding & Identity
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Fixed Logo Icon Layout */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 relative group">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                    <Camera size={32} />
                    <span className="text-[9px] md:text-[10px] mt-2 font-bold uppercase">
                      Logo
                    </span>
                  </div>
                )}

                {/* Input field stays on top for clicking */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />

                {/* Floating Icon Badge - Positioned at bottom right corner */}
                <div className="absolute bottom-2 right-2 bg-amber-500 p-2 rounded-xl text-black shadow-lg z-10 border-4 border-[#0f1115] pointer-events-none group-hover:scale-110 transition-transform">
                  <Camera size={14} strokeWidth={3} />
                </div>
              </div>
            </div>

            <div className="flex-1 w-full space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <InputGroup label="Restaurant Name" icon={<Store size={18} />}>
                  <input
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="form-input-style"
                    placeholder="Name"
                  />
                </InputGroup>
                <InputGroup label="Owner Name" icon={<User size={18} />}>
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="form-input-style"
                    placeholder="Owner"
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 2: Contact --- */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-1 bg-amber-500 w-10 md:w-12 rounded-full" />
            <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Contact Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InputGroup label="Email" icon={<Mail size={18} />}>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input-style"
              />
            </InputGroup>
            <InputGroup label="Phone" icon={<Phone size={18} />}>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input-style"
              />
            </InputGroup>
          </div>
        </section>

        {/* --- Section 3: Toggles --- */}
        <section className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
            <ToggleButton
              id="isNightOpen"
              label="Night"
              checked={formData.isNightOpen}
              onChange={handleChange}
            />
            <ToggleButton
              id="isDineOutAvailable"
              label="Dine-In"
              checked={formData.isDineOutAvailable}
              onChange={handleChange}
            />
            <ToggleButton
              id="isDeliveryAvailable"
              label="Delivery"
              checked={formData.isDeliveryAvailable}
              onChange={handleChange}
            />
            <ToggleButton
              id="isPureVeg"
              label="Pure Veg"
              checked={formData.isPureVeg}
              onChange={handleChange}
            />
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/5">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3 md:mb-4">
              Cuisines
            </label>
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {formData.cuisine.map((c) => (
                <span
                  key={c}
                  className="bg-amber-500 text-black px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold flex items-center gap-2"
                >
                  {c}{" "}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => removeCuisine(c)}
                  />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                className="form-input-style flex-1"
                placeholder="Add Cuisine..."
              />
              <button
                type="button"
                onClick={addCuisine}
                className="bg-white text-black px-3 md:px-4 rounded-xl font-bold text-sm md:text-base"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* --- Submit --- */}
        <div className="flex flex-col items-center gap-3 md:gap-4 pb-8 md:pb-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-64 bg-amber-500 text-black py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all text-xs md:text-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {success && (
            <p className="text-emerald-500 font-bold text-[10px] md:text-xs">
              Successfully Updated!
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

// Small Helper Components to keep code clean
const InputGroup = ({ label, icon, children }) => (
  <div className="space-y-2">
    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-3 md:left-4 text-slate-500">{icon}</div>
      {React.cloneElement(children, {
        className:
          "w-full bg-white/5 border border-white/10 rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm",
      })}
    </div>
  </div>
);

const ToggleButton = ({ id, label, checked, onChange }) => (
  <label className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer">
    <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-500">
      {label}
    </span>
    <div className="relative">
      <input
        type="checkbox"
        name={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-10 md:w-12 h-6 md:h-7 rounded-full transition-colors ${checked ? "bg-amber-500" : "bg-neutral-800"}`}
      >
        <div
          className={`absolute top-1 w-4 md:w-5 h-4 md:h-5 rounded-full bg-white transition-all ${checked ? "left-5 md:left-6" : "left-1"}`}
        />
      </div>
    </div>
  </label>
);

export default FoodPartnerEditProfile;
