
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flag, Lock, ChevronLeft, User, Mail, Eye, EyeOff } from 'lucide-react';
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
  
  // Test account credentials for development
  const TEST_EMAIL = "test@fastlytics.dev";
  const TEST_PASSWORD = "testpass123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check against test account credentials
    if (loginEmail === TEST_EMAIL && loginPassword === TEST_PASSWORD) {
      // Store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        email: TEST_EMAIL,
        name: 'Test User',
        role: 'admin'
      }));

      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
          variant: "default",
        });
        navigate('/');
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login Failed",
          description: "Please use the test account credentials.",
          variant: "destructive",
        });
      }, 1000);
    }
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
    <div className="min-h-screen bg-background carbon-fiber-bg flex flex-col items-center justify-center p-4">
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
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 animate-pulse-glow">
              <Flag className="h-8 w-8 text-f1-ferrari" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-f1-ferrari via-f1-redbull to-f1-mclaren bg-clip-text text-transparent">Fastlytics</h1>
          <p className="text-muted-foreground mt-2">Your premium F1 analytics dashboard</p>
        </div>
        
        <Card className="bg-card/90 border-border/50 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your premium features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="name@example.com" 
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs" 
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
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square p-0"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full racing-button" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>
                    Join Fastlytics and unlock premium analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="first-name" 
                          className="pl-10"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input 
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="name@example.com" 
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password" 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square p-0"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground border border-border/20 bg-secondary/10 rounded-md p-2">
                    By creating an account, you agree to our <span className="text-primary cursor-pointer">Terms of Service</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full racing-button" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> Create Account
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="mb-2">Premium Features Include:</div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-primary/10 px-3 py-1 rounded-full text-xs border border-primary/20">Telemetry Access</span>
            <span className="bg-primary/10 px-3 py-1 rounded-full text-xs border border-primary/20">Strategy Simulations</span>
            <span className="bg-primary/10 px-3 py-1 rounded-full text-xs border border-primary/20">Driver DNA Analysis</span>
            <span className="bg-primary/10 px-3 py-1 rounded-full text-xs border border-primary/20">Historical Comparisons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
