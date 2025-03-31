import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react'; // Renamed import
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data if needed for settings

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
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Settings</h1>
        </header>

        {/* Settings Content Card */}
        <Card className="bg-gray-900/80 border border-gray-700 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-red-400" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Add settings options here later */}
             <p className="text-gray-400">Account Preferences:</p>
             {/* Example: <Switch id="dark-mode" /> <Label htmlFor="dark-mode">Dark Mode</Label> */}
             <p className="text-gray-400 mt-4">Notification Settings:</p>
             {/* Example: Checkboxes for email notifications */}

             <p className="text-sm text-gray-500 pt-6">
               (This is a placeholder page. Settings controls will be added later.)
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
