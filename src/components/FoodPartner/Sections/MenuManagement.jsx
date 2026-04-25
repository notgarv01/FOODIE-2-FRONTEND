import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Rows3, Play, Leaf, Edit, Trash2 } from 'lucide-react';
import { API_URL } from '../../../utils/api';

const MenuManagement = () => {
  const navigate = useNavigate();
  const [topVideos, setTopVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/food/dashboard`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok) {
          setTopVideos(data.menuItems || []);
        } else {
          setTopVideos([]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const handleDelete = async (foodId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/food/${foodId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTopVideos(prev => prev.filter(item => item.id !== foodId));
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    navigate(`/food-partner/menu/edit/${item.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 md:py-20">
        <Loader2 className="animate-spin text-white" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg md:text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
        <Rows3 size={18} className="text-amber-500" /> Your Menu Items
      </h2>
      <div className="space-y-3 md:space-y-4">
        {topVideos.length > 0 ? (
          topVideos.map((item) => (
            <div key={item.id} className="flex items-center gap-3 md:gap-4 bg-neutral-900/30 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/5 group hover:bg-neutral-900 transition-all">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-neutral-800 shrink-0">
                <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200"} className="w-full h-full object-cover opacity-40" alt="dish" />
                {item.hasVideo && (
                  <Play size={16} fill="white" className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-white text-xs md:text-sm uppercase italic truncate">{item.name}</h4>
                  {item.isVeg && <Leaf size={12} className="text-emerald-500" />}
                </div>
                <p className="text-[9px] md:text-[10px] text-slate-600 font-bold uppercase mt-1 truncate">
                  Rs{item.price} · {item.category}
                  {item.hasVideo && " · Has Video"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-600 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                  title="Edit food item"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                  title="Delete food item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 md:py-12">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Rows3 size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium text-xs md:text-sm">No menu items yet</p>
            <p className="text-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2">Add your first dish to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
