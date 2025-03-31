import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  // Optional: Add props if you need role-based access later
  // allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: Show a global loading spinner or a simple loading text
    // You might want a more sophisticated loading UI integrated into your layout
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
        Loading authentication...
      </div>
    );
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location to redirect back after login (optional)
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is logged in, render the child route component
  return <Outlet />; // Renders the nested route component
};

export default ProtectedRoute;
