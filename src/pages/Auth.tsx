
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added Link import
import { Car, Lock, ChevronLeft, User, Mail, Eye, EyeOff } from 'lucide-react'; // Changed Flag to Car
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

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
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
        variant: "default",
      });
      navigate('/');
    }, 1500);
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. Welcome to Fastlytics!",
        variant: "default",
      });
      navigate('/');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Apply the landing page background gradient and ensure text is visible
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex flex-col items-center justify-center p-4"> 
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-white" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        {/* Updated Logo */}
        <div className="mb-8 text-center">
           <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-4">
              <Car className="h-8 w-8 text-red-500" />
              <span className="font-bold text-3xl">Fast<span className="text-red-500">lytics</span></span>
           </Link>
          <p className="text-gray-400 mt-1">Your premium F1 analytics dashboard</p> {/* Adjusted text color */}
        </div>
        
        {/* Adjusted Card background and border for dark theme */}
        <Card className="bg-gray-900/80 border-gray-700 shadow-xl"> 
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Adjusted TabsList background */}
            <TabsList className="grid w-full grid-cols-2 mb-2 bg-gray-800"> 
              {/* Adjusted TabsTrigger active state */}
              <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Login</TabsTrigger> 
              <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white">Welcome Back</CardTitle> {/* Adjusted color */}
                  <CardDescription className="text-gray-400"> {/* Adjusted color */}
                    Enter your credentials to access your premium features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">Email</Label> {/* Adjusted color */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" /> {/* Adjusted color */}
                      {/* Adjusted Input style */}
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
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label> {/* Adjusted color */}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-red-500 hover:text-red-400" /* Adjusted color */
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" /> {/* Adjusted color */}
                       {/* Adjusted Input style */}
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required 
                      />
                      {/* Adjusted Button style */}
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
                   {/* Adjusted Button style */}
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
                  <CardTitle className="text-xl text-white">Create an account</CardTitle> {/* Adjusted color */}
                  <CardDescription className="text-gray-400"> {/* Adjusted color */}
                    Join Fastlytics and unlock premium analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-gray-300">First name</Label> {/* Adjusted color */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" /> {/* Adjusted color */}
                         {/* Adjusted Input style */}
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
                      <Label htmlFor="last-name" className="text-gray-300">Last name</Label> {/* Adjusted color */}
                       {/* Adjusted Input style */}
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
                    <Label htmlFor="signup-email" className="text-gray-300">Email</Label> {/* Adjusted color */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" /> {/* Adjusted color */}
                       {/* Adjusted Input style */}
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
                    <Label htmlFor="signup-password" className="text-gray-300">Password</Label> {/* Adjusted color */}
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" /> {/* Adjusted color */}
                       {/* Adjusted Input style */}
                      <Input 
                        id="signup-password" 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500" 
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required 
                      />
                       {/* Adjusted Button style */}
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
                   {/* Adjusted notice style */}
                  <div className="text-xs text-gray-400 border border-gray-700 bg-gray-800/50 rounded-md p-2"> 
                    By creating an account, you agree to our <span className="text-red-500 hover:text-red-400 cursor-pointer">Terms of Service</span> and <span className="text-red-500 hover:text-red-400 cursor-pointer">Privacy Policy</span>
                  </div>
                </CardContent>
                <CardFooter>
                   {/* Adjusted Button style */}
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
        
         {/* Adjusted bottom section style */}
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
