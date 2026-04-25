import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowingTab from './FollowingTab';
import { API_URL } from '../../../utils/api';

const ProfileFollowing = () => {
  const { userData } = useOutletContext();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user/following`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setFollowing(data.following || []);
        }
      } catch (error) {
        console.error('Error fetching following:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const handleUnfollow = async (restaurantId) => {
    try {
      const response = await fetch(`${API_URL}/api/user/follow-restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ restaurantId })
      });

      if (response.ok) {
        setFollowing(following.filter(r => r._id !== restaurantId));
      }
    } catch (error) {
      console.error('Error unfollowing restaurant:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 md:py-32">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fetching your following...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">
          Following <span className="text-amber-500 ml-2">({following.length})</span>
        </h3>
      </div>
      <FollowingTab following={following} onUnfollow={handleUnfollow} />
    </div>
  );
};

export default ProfileFollowing;
