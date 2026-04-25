import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PartnerSidebar from './PartnerSidebar';
import { Bell } from 'lucide-react';

const PartnerProfile = () => {
    const navigate = useNavigate();
    const [partnerData, setPartnerData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('partnerToken');
        navigate('/partner/login', { replace: true });
    };

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await fetch(`${API_URL}/api/food/profile`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok) setPartnerData(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPartner();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-sm md:text-base">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 py-3 md:py-4 px-4 md:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl md:text-2xl font-black tracking-tighter italic">
                        FOODIE<span className="text-amber-500">PARTNER</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <Bell size={20} className="text-slate-400" />
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-amber-500 text-black flex items-center justify-center font-bold text-xs md:text-sm">
                            {partnerData?.restaurantName?.charAt(0) || "P"}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-12">
                <PartnerSidebar handleLogout={handleLogout} />
                
                <section className="flex-1 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet context={{ partnerData }} />
                </section>
            </main>
        </div>
    );
};

export default PartnerProfile;
