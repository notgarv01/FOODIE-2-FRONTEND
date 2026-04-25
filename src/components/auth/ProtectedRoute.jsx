import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const location = useLocation();

  // Check authentication state and clear cache if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear browser cache and storage
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        });
      }
      
      // Clear all localStorage data
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the current route
    const isPartnerRoute = location.pathname.startsWith('/food-partner');
    const redirectPath = isPartnerRoute ? '/food-partner/login' : '/user/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated but trying to access wrong user type route
  const isPartnerRoute = location.pathname.startsWith('/food-partner');
  const isUserRoute = location.pathname.startsWith('/user');
  
  if (isPartnerRoute && userType !== 'partner') {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }
  
  if (isUserRoute && userType !== 'user') {
    return <Navigate to="/food-partner/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
