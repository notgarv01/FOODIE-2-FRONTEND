import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, Globe, Save, X, Camera, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { formatLocation } from '../../utils/formatUtils';
import { API_URL } from '../../utils/api';

const UserEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    profilePhoto: ""
  });

  const [preview, setPreview] = useState(formData.profilePhoto);

  // Fetch current user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user/profile`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone ? data.user.phone.replace('+91 ', '') : '',
            address: data.user.address || '',
            city: formatLocation(data.user.city, ''),
            state: formatLocation(data.user.state, ''),
            profilePhoto: data.user.profilePhoto || data.user.avatar || ''
          });
          setPreview(data.user.profilePhoto || data.user.avatar || '');
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Capitalize city and state fields
    if (name === 'city' || name === 'state') {
      setFormData({ ...formData, [name]: formatLocation(value, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to backend API
      uploadToBackend(file);
    }
  };

  const uploadToBackend = async (file) => {
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('profilePhoto', file);
      
      // Upload to backend API
      const response = await fetch(`${API_URL}/api/user/upload-profile-photo?email=${encodeURIComponent(formData.email || '')}`, {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Set the uploaded photo URL in form data
        setFormData(prev => ({ ...prev, profilePhoto: result.profilePhoto }));
      } else {
        console.error('Profile photo upload failed:', response.status);
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      // Exclude profilePhoto from JSON payload to avoid 413 error
      // Profile photos are uploaded separately via uploadToBackend function
      const { profilePhoto, ...profileData } = formData;
      
      const response = await fetch(`${API_URL}/api/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        await response.json();
        
        setLoading(false);
        setShowToast(true);
        
        // Navigate immediately to profile page after success
        navigate('/user/profile');
      } else {
        console.error('Failed to update profile:', response.status);
        setLoading(false);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans p-4 md:p-6 lg:p-12">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 md:top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300 px-4">
        <div className="bg-emerald-500 text-black px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest flex items-center gap-2 md:gap-3 shadow-2xl">
          <CheckCircle2 size={18} /> Profile Updated Successfully!
        </div>
      </div>
      )}

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
            <p className="text-xs md:text-sm text-slate-500">Loading profile data...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <button onClick={() => navigate(-1)} className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">
                Edit <span className="text-amber-500">Profile</span>
              </h1>
              <div className="w-8 md:w-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-4xl overflow-hidden border-3 md:border-4 border-white/5 group-hover:border-amber-500/50 transition-all shadow-2xl">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <User size={40} className="text-white/30" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer hover:bg-amber-400 transition-all shadow-xl">
                    <Camera size={20} strokeWidth={2.5} />
                    <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" />
                  </div>
                </div>

                {/* City Field - NEW */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">City</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" placeholder="e.g. Jaipur" />
                  </div>
                </div>

                {/* State Field - NEW */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">State</label>
                  <div className="relative">
                    <Globe className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" placeholder="e.g. Rajasthan" />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-4 outline-none focus:border-amber-500/50 transition-all font-bold text-xs md:text-sm" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-6 md:pt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-amber-500 text-black py-3 md:py-4 lg:py-5 rounded-2xl md:rounded-3xl lg:rounded-4xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 md:gap-3">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Profile
                </button>
                <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-white/5 border border-white/10 text-white py-3 md:py-4 lg:py-5 rounded-2xl md:rounded-3xl lg:rounded-4xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Discard Changes
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserEditProfile;