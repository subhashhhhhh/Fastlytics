import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Key, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { siGoogle, siApple, siFacebook } from 'simple-icons/icons';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateRacingUsername } from '@/lib/usernameGenerator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  
  // Profile form state
  const [username, setUsername] = useState(user?.user_metadata?.username || '');
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  
  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Helper function to set loading state for specific actions
  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  // Handle logout
  const handleLogout = async () => {
    setLoadingState('logout', true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('logout', false);
    }
  };

  // Update profile information
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState('profile', true);
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim()
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
        variant: "default",
      });
      
      // Update local user state if context provides a setter
      if (setUser && data.user) {
        setUser(data.user);
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile information.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('profile', false);
    }
  };

  // Generate a random racing-themed username
  const handleGenerateUsername = () => {
    const newUsername = generateRacingUsername();
    setUsername(newUsername);
    
    toast({
      title: "Username Generated",
      description: `Your new racing-themed username: ${newUsername}`,
      variant: "default",
    });
  };

  // Update email address
  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState('email', true);
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPasswordForEmail,
      });
      
      if (signInError) throw signInError;
      
      // Then update the email
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;
      
      setNewEmail('');
      setCurrentPasswordForEmail('');
      
      toast({
        title: "Email Update Initiated",
        description: "Check your new email address for a confirmation link.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Email Update Failed",
        description: error.message || "Failed to update email.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('email', false);
    }
  };

  // Update password
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState('password', true);
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      setLoadingState('password', false);
      return;
    }
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) throw signInError;
      
      // Then update the password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('password', false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex items-center justify-center">
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />
      <div className="container py-8 px-4 max-w-4xl mx-auto">
        {/* Header with Back Button and Logout */}
        <header className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-3 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">My Profile</h1>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-red-400 hover:text-red-300 hover:bg-red-800/80"
            disabled={loading.logout}
          >
            {loading.logout ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            Log out
          </Button>
        </header>

        {/* Profile Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-800 mb-8">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab Content */}
          <TabsContent value="profile" className="space-y-6">
            {/* User Profile Card */}
            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-red-400" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and how others see you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                    <Avatar className="h-20 w-20 border-2 border-gray-700">
                      <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-gray-800 text-white text-lg">
                        {firstName && lastName 
                          ? `${firstName[0]}${lastName[0]}`
                          : user.email?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1 flex-1">
                      <h3 className="font-medium text-white">{user.user_metadata?.full_name || user.email}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <Label htmlFor="username" className="text-gray-300">Username</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateUsername}
                        className="h-8 text-xs bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                      >
                        Generate Racing Username
                      </Button>
                    </div>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      placeholder="Your unique username"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 mt-2 w-full"
                    disabled={loading.profile}
                  >
                    {loading.profile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Social Connections Card */}
            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d={siGoogle.path} />
                  </svg>
                  Social Connections
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your account with social providers for easier sign-in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 -mx-6 -mb-6 p-6 mt-2">
                  <Alert className="bg-gray-800/80 border-yellow-600/30 text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Social login options are coming soon! Stay tuned for updates.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d={siGoogle.path} />
                        </svg>
                        <span className="text-gray-300">Google</span>
                      </div>
                      <Button variant="outline" disabled className="bg-gray-800 border-gray-700 text-gray-400">
                        Coming Soon
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d={siApple.path} />
                        </svg>
                        <span className="text-gray-300">Apple</span>
                      </div>
                      <Button variant="outline" disabled className="bg-gray-800 border-gray-700 text-gray-400">
                        Coming Soon
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d={siFacebook.path} />
                        </svg>
                        <span className="text-gray-300">Facebook</span>
                      </div>
                      <Button variant="outline" disabled className="bg-gray-800 border-gray-700 text-gray-400">
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab Content */}
          <TabsContent value="security" className="space-y-6">
            {/* Change Email Card */}
            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  Change Email
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update the email address associated with your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentEmail" className="text-gray-300">Current Email</Label>
                    <Input
                      id="currentEmail"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newEmail" className="text-gray-300">New Email</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordForEmail" className="text-gray-300">Current Password</Label>
                    <Input
                      id="currentPasswordForEmail"
                      type="password"
                      value={currentPasswordForEmail}
                      onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 w-full"
                    disabled={loading.email}
                  >
                    {loading.email && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Email
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-gray-900/80 border border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-red-400" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-red-500"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 w-full"
                    disabled={loading.password}
                  >
                    {loading.password && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
                
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
