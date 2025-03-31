import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      <div className="container py-8 px-4 max-w-2xl mx-auto"> {/* Centered content */}
        {/* Header with Back Button */}
        <header className="flex items-center mb-8 md:mb-10">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Profile</h1>
        </header>

        {/* Profile Content Card */}
        <Card className="bg-gray-900/80 border border-gray-700 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-red-400" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                {/* Display Full Name if available */}
                {user.user_metadata?.full_name && (
                   <p>
                     <span className="font-semibold text-gray-400">Name:</span> {user.user_metadata.full_name}
                   </p>
                )}
                <p>
                  <span className="font-semibold text-gray-400">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">User ID:</span> {user.id}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">Joined:</span> {new Date(user.created_at).toLocaleDateString()}
                </p>
                {/* Add more profile fields here as needed */}
                <p className="text-sm text-gray-500 pt-4">
                  (This is a placeholder page. Profile editing functionality will be added later.)
                </p>
              </>
            ) : (
              <p className="text-gray-500">Loading user data or not logged in.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
