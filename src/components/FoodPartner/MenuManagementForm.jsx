import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  Film, 
  IndianRupee, 
  Leaf, 
  Image as ImageIcon,
  CheckCircle2,
  X,
  ArrowLeft
} from 'lucide-react';

const MenuManagementForm = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!foodId;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isVeg: true,
    isReel: false,
    cuisineType: '',
    category: 'Main Course',
    foodPartnerId: 'PARTNER_ID_HERE'
  });

  // Separate state for files to handle previews
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);

  const fetchFoodItem = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/food/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok && data.food) {
        setFormData({
          name: data.food.name || '',
          description: data.food.description || '',
          price: data.food.price || '',
          isVeg: data.food.isVeg !== undefined ? data.food.isVeg : true,
          isReel: data.food.isReel || false,
          cuisineType: data.food.cuisineType || '',
          category: data.food.category || 'Main Course',
          foodPartnerId: 'PARTNER_ID_HERE'
        });
        setExistingImage(data.food.image || null);
        setExistingVideo(data.food.videoUrl || null);
      }
    } catch (error) {
      console.error('Error fetching food item:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foodId) {
      fetchFoodItem(foodId);
    }
  }, [foodId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'image') setImageFile(files[0]);
      if (name === 'videoUrl') setVideoFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Using FormData for Multi-part file upload
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'foodPartnerId') {
        data.append(key, formData[key]);
      }
    });
    
    if (imageFile) data.append('image', imageFile);
    if (videoFile) data.append('videoFile', videoFile);

    try {
      const url = isEditMode 
        ? `${API_URL}/api/food/${foodId}`
        : `${API_URL}/api/food/create`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: data
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(isEditMode ? 'Dish updated successfully!' : 'Dish added successfully!');
        navigate('/food-partner/menu');
      } else {
        alert(result.message || 'Failed to save dish');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => navigate('/food-partner/menu')}
            className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Plus size={24} className="text-black stroke-[3]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
              {isEditMode ? 'Edit' : 'Add New'} <span className="text-amber-500">Dish</span>
            </h2>
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Menu Creator Studio</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Dish Name</label>
            <input 
              name="name"
              value={formData.name}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all text-xs md:text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all resize-none text-xs md:text-sm"
              onChange={handleChange}
              rows="3"
              placeholder="Describe your dish..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Price (INR)</label>
            <div className="relative text-white">
              <IndianRupee className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
              <input 
                name="price"
                type="number"
                value={formData.price}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 focus:outline-none focus:border-amber-500/50 transition-all text-xs md:text-sm"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Cuisine Type</label>
            <input 
              name="cuisineType"
              value={formData.cuisineType}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all text-xs md:text-sm"
              onChange={handleChange}
              placeholder="e.g., Indian, Chinese, Italian"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Category</label>
            <select 
              name="category"
              value={formData.category}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all text-xs md:text-sm"
              onChange={handleChange}
            >
              <option value="Main Course">Main Course</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div className="flex gap-3 md:gap-4 pt-4">
            <label className={`flex-1 flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border cursor-pointer transition-all ${formData.isVeg ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>
              <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} className="hidden" />
              <Leaf size={16} />
              <span className="text-[9px] md:text-[10px] font-black uppercase">Veg</span>
            </label>

            <label className={`flex-1 flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border cursor-pointer transition-all ${formData.isReel ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/5 text-slate-500'}`}>
              <input type="checkbox" name="isReel" checked={formData.isReel} onChange={handleChange} className="hidden" />
              <Film size={16} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Enable Reel</span>
            </label>
          </div>
        </div>

        {/* Right Column: Media Uploads */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-3 md:ml-4">Dish Media</label>
            
            {/* Image Upload Box */}
            <div className="relative group">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full h-28 md:h-32 border-2 border-dashed rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center transition-all overflow-hidden ${imageFile || existingImage ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02] group-hover:border-amber-500/30'}`}>
                {imageFile ? (
                  <div className="flex items-center gap-2 md:gap-3">
                    <ImageIcon className="text-emerald-500" size={20} />
                    <span className="text-[10px] md:text-xs text-white font-bold truncate max-w-[120px] md:max-w-[150px]">{imageFile.name}</span>
                    <X className="text-slate-500 cursor-pointer hover:text-white" size={14} onClick={(e) => {e.preventDefault(); setImageFile(null);}}/>
                  </div>
                ) : existingImage ? (
                  <div className="relative w-full h-full">
                    <img src={existingImage} alt="Existing" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white mb-1" size={20} />
                      <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-tighter">Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="text-slate-600 mb-2" size={24} />
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-tighter">Upload Cover Photo</span>
                  </>
                )}
              </div>
            </div>

            {/* Video Upload Box (Conditional) */}
            {formData.isReel && (
              <div className="relative group animate-in slide-in-from-top-4 duration-300">
                <input 
                  type="file" 
                  name="videoUrl" 
                  accept="video/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full h-28 md:h-32 border-2 border-dashed rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center transition-all ${videoFile ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-white/[0.02] group-hover:border-amber-500/30'}`}>
                  {videoFile ? (
                    <div className="flex items-center gap-2 md:gap-3">
                      <Film className="text-amber-500" size={20} />
                      <span className="text-[10px] md:text-xs text-white font-bold truncate max-w-[120px] md:max-w-[150px]">{videoFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Film className="text-slate-600 mb-2" size={24} />
                      <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-tighter">Upload Cinematic Reel</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-white text-black font-black uppercase italic py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-2 md:gap-3 hover:bg-amber-500 transition-all duration-500 shadow-xl disabled:opacity-50 text-xs md:text-sm"
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Dish' : 'Publish to Menu')}
            <CheckCircle2 size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuManagementForm;
