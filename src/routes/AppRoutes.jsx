import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import React from 'react'
import FoodieIntro from '../components/pages/FoodieIntro'
import UserLogin from '../components/auth/UserLogin'
import UserRegister from '../components/auth/UserRegister'
import FoodPartnerLogin from '../components/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../components/auth/FoodPartnerRegister'
import UserHome from '../components/user/UserHome'
import UserProfile from '../components/user/UserProfile'
import FoodVideoReels from '../components/user/FoodVideoReels'
import FoodPartnerProfile from '../components/FoodPartner/FoodPartnerProfile'
import PartnerProfile from '../components/FoodPartner/PartnerProfile'
import PartnerDashboard from '../components/FoodPartner/PartnerDashboard'
import FoodPartnerEditProfileUpdated from '../components/FoodPartner/FoodPartnerEditProfileUpdated'
import DashboardView from '../components/FoodPartner/DashboardView'
import MenuView from '../components/FoodPartner/MenuView'
import VideosView from '../components/FoodPartner/VideosView'
import SalesView from '../components/FoodPartner/SalesView'
import DashboardSection from '../components/FoodPartner/Sections/Dashboard'
import MenuManagement from '../components/FoodPartner/Sections/MenuManagement'
import OrderRequests from '../components/FoodPartner/Sections/OrderRequests'
import PartnerPayments from '../components/FoodPartner/Sections/PartnerPayments'
import FoodPartnerAllVideos from '../components/FoodPartner/FoodPartnerAllVideos'
import UpladVideo from '../components/FoodPartner/UploadVideo'
import UserRestaurantProfile from '../components/user/User-RestaurantProfile'
import RestaurantDetails from '../components/user/RestaurantDetails'
import FoodDetails from '../components/user/FoodDetails'
import Checkout from '../components/user/CheckOut'
import UserCart from '../components/user/UserCart'
import CreateFood from '../components/FoodPartner/CreateFood'
import MenuManagementForm from '../components/FoodPartner/MenuManagementForm'
import OrderPlaced from '../components/user/OrderPlaced'
import UserEditProfile from '../components/user/UserEditProfile'
import RateOrder from '../components/user/RateOrder'
import Notification from '../components/user/Notifications'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'
import ProfileOrders from '../components/user/Profile/ProfileOrders'
import ProfileFavorites from '../components/user/Profile/ProfileFavorites'
import ProfileFollowing from '../components/user/Profile/ProfileFollowing'
import ProfilePayments from '../components/user/Profile/ProfilePayments'
import AccountSettings from '../components/user/Profile/AccountSettings'
import Profile from '../components/user/Profile/Profile'

const AppRoutes = () => {
  const { isAuthenticated, userType } = useAuth()

  return (
    <Router>
      <Routes>
        {/* Public routes */} 
        <Route path="/" element={<FoodieIntro />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        
        {/* Food Partner login with protection - redirect to dashboard if already logged in as partner */}
        <Route 
          path="/food-partner/login" 
          element={
            isAuthenticated && userType === 'partner' 
              ? <Navigate to="/food-partner/home" replace /> 
              : <FoodPartnerLogin />
          } 
        />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />

        {/* New partner profile routes with nested layout */}
        <Route path="/partner/profile" element={<ProtectedRoute><PartnerProfile /></ProtectedRoute>}>
          <Route index element={<PartnerDashboard />} />
          <Route path="menu" element={<MenuView />} />
          <Route path="orders" element={<OrderRequests />} />
          <Route path="earnings" element={<PartnerPayments />} />
        </Route>
        
        {/* Protected user routes */}
        <Route path="/user/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="favorites" element={<ProfileFavorites />} />
          <Route path="following" element={<ProfileFollowing />} />
          <Route path="payments" element={<ProfilePayments />} />
          <Route path="security" element={<AccountSettings />} />
        </Route>
        <Route path="/user/videos" element={<ProtectedRoute><FoodVideoReels /></ProtectedRoute>} />
        <Route path="/user/restaurant-profile" element={<ProtectedRoute><UserRestaurantProfile /></ProtectedRoute>} />
        <Route path="/user/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
        <Route path="/user/food/:id" element={<ProtectedRoute><FoodDetails /></ProtectedRoute>} />
        <Route path="/user/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/user/cart" element={<ProtectedRoute><UserCart /></ProtectedRoute>} />
        <Route path="/user/order-placed" element={<ProtectedRoute><OrderPlaced /></ProtectedRoute>} />
        <Route path="/user/rate-order" element={<ProtectedRoute><RateOrder /></ProtectedRoute>} />
        <Route path="/user/edit-profile" element={<ProtectedRoute><UserEditProfile /></ProtectedRoute>} />
        <Route path="/user/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        
        {/* Protected food partner routes with nested layout */}
        <Route path="/food-partner" element={<ProtectedRoute><FoodPartnerProfile /></ProtectedRoute>}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardView />} />
          <Route path="dashboard" element={<Navigate to="home" replace />} />
          <Route path="dashboard/videos" element={<Navigate to="videos" replace />} />
          <Route path="dashboard/menu" element={<Navigate to="menu" replace />} />
          <Route path="dashboard/sales" element={<Navigate to="sales" replace />} />
          <Route path="menu" element={<MenuView />} />
          <Route path="menu/add" element={<MenuManagementForm />} />
          <Route path="menu/edit/:foodId" element={<MenuManagementForm />} />
          <Route path="orders" element={<OrderRequests />} />
          <Route path="payments" element={<PartnerPayments />} />
          <Route path="videos" element={<VideosView />} />
          <Route path="sales" element={<SalesView />} />
          <Route path="create-food" element={<CreateFood />} />
          <Route path="edit-profile" element={<FoodPartnerEditProfileUpdated />} />
        </Route>
        
        {/* Legacy food partner routes for backward compatibility */}
        <Route path="/food-partner/all-videos" element={<ProtectedRoute><FoodPartnerAllVideos /></ProtectedRoute>} />
        <Route path="/food-partner/upload" element={<ProtectedRoute><UpladVideo /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes