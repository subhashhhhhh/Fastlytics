import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Car, Lock, ChevronLeft, User, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { AuthError } from '@supabase/supabase-js'; // Import AuthError type

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get tab value from URL query parameter
  const [activeTab, setActiveTab] = useState<string>('login');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam && (tabParam === 'login' || tabParam === 'signup')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Corrected handleLogin function
  const handleLogin = async (e: React.FormEvent) => { // Make async
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast({
        title: "Login Successful!",
        description: "Welcome back!",
        variant: "default",
      });
      navigate('/dashboard'); // Navigate to dashboard after login

    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError.message);
      toast({
        title: "Login Failed",
        description: authError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Corrected handleSignup function
  const handleSignup = async (e: React.FormEvent) => { // Make async
    e.preventDefault();
    setIsLoading(true);

    try {
       const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          // Pass first and last name to user_metadata
          data: { 
            first_name: firstName, 
            last_name: lastName,
            // Combine for easier access later, ensure your Supabase setup allows this or adjust accordingly
            full_name: `${firstName} ${lastName}`.trim() 
          }
        }
      });

      if (error) throw error;

      // Check if email confirmation is required
      // Note: Supabase v2 might return user data even if confirmation is needed.
      // Check data.session == null and data.user != null for confirmation needed state.
      if (data.session === null && data.user !== null) {
         toast({
           title: "Signup Almost Complete!",
           description: "Please check your email to verify your account.",
           variant: "default",
           duration: 5000, // Keep toast longer
         });
         // Stay on auth page or redirect
      } else if (data.session && data.user) {
         toast({
           title: "Account Created!",
           description: "Welcome to Fastlytics! You are now logged in.",
           variant: "default",
         });
         navigate('/dashboard');
      } else {
          // Fallback/unexpected case
          toast({
           title: "Signup Initiated",
           description: "Please check your email if verification is required.",
           variant: "default",
         });
      }

    } catch (error) {
       const authError = error as AuthError;
       console.error("Signup error:", authError.message);
       toast({
        title: "Signup Failed",
        description: authError.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white" // Adjusted color
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
           <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-4">
              <Car className="h-8 w-8 text-red-500" />
              <span className="font-bold text-3xl">Fast<span className="text-red-500">lytics</span></span>
           </Link>
          <p className="text-gray-400 mt-1">Your premium F1 analytics dashboard</p>
        </div>

        <Card className="bg-gray-900/80 border-gray-700 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2 bg-gray-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your credentials to access your premium features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-red-500 hover:text-red-400"
                        type="button"
                        onClick={() => toast({
                          title: "Password Reset",
                          description: "Check your email for instructions to reset your password.",
                          variant: "default",
                        })}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square p-0 text-gray-400 hover:text-white"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="mr-2 h-4 w-4" /> Login
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white">Create an account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Join Fastlytics and unlock premium analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-gray-300">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="first-name"
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-gray-300">Last name</Label>
                      <Input
                        id="last-name"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square p-0 text-gray-400 hover:text-white"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 border border-gray-700 bg-gray-800/50 rounded-md p-2">
                    By creating an account, you agree to our <span className="text-red-500 hover:text-red-400 cursor-pointer">Terms of Service</span> and <span className="text-red-500 hover:text-red-400 cursor-pointer">Privacy Policy</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <User className="mr-2 h-4 w-4" /> Create Account
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-400">
          <div className="mb-2">Premium Features Include:</div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700 text-gray-300">Telemetry Access</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700 text-gray-300">Strategy Simulations</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700 text-gray-300">Driver DNA Analysis</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700 text-gray-300">Historical Comparisons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
