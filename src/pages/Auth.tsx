import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Gauge, 
  Lock, 
  ChevronLeft, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  UserPlus,
  Sparkles,
  KeyRound,
  Check
} from 'lucide-react';
import { siGoogle, siGithub } from 'simple-icons/icons';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { AuthError } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { generateRacingUsername } from '@/lib/usernameGenerator';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Helper function to set loading state for specific actions
  const setLoadingState = (key: string, isLoading: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam && (tabParam === 'login' || tabParam === 'signup' || tabParam === 'magic-link')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleGenerateUsername = () => {
    const newUsername = generateRacingUsername();
    setUsername(newUsername);
    
    toast({
      title: "Username Generated",
      description: `Your racing-themed username: ${newUsername}`,
      variant: "default",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState('login', true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast({
        title: "Login Successful!",
        description: "Welcome back to Fastlytics!",
        variant: "default",
      });
      navigate('/dashboard');

    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError.message);
      toast({
        title: "Login Failed",
        description: authError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('login', false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms of service to create an account.",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingState('signup', true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: { 
            first_name: firstName, 
            last_name: lastName,
            username: username || generateRacingUsername(), // Generate username if not provided
            full_name: `${firstName} ${lastName}`.trim() 
          }
        }
      });

      if (error) throw error;

      if (data.session === null && data.user !== null) {
        setSignupSuccess(true);
      } else if (data.session && data.user) {
        navigate('/dashboard');
      } else {
        setSignupSuccess(true);
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
      setLoadingState('signup', false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState('magicLink', true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: magicLinkEmail,
      });
      
      if (error) throw error;
      
      setMagicLinkSent(true);
      
      toast({
        title: "Magic Link Sent!",
        description: "Check your email for a link to sign in.",
        variant: "default",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Failed to Send Magic Link",
        description: authError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('magicLink', false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = async () => {
    if (!loginEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingState('reset', true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo: `${window.location.origin}/profile?tab=security`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
        variant: "default",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Password Reset Failed",
        description: authError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoadingState('reset', false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingState('google', true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      // No need for toast here as we're redirecting to Google
    } catch (error) {
      const authError = error as AuthError;
      console.error("Google sign-in error:", authError.message);
      toast({
        title: "Google Sign-in Failed",
        description: authError.message || "Could not sign in with Google.",
        variant: "destructive",
      });
      setLoadingState('google', false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoadingState('github', true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      // No need for toast here as we're redirecting to GitHub
    } catch (error) {
      const authError = error as AuthError;
      console.error("GitHub sign-in error:", authError.message);
      toast({
        title: "GitHub Sign-in Failed",
        description: authError.message || "Could not sign in with GitHub.",
        variant: "destructive",
      });
      setLoadingState('github', false);
    }
  };

  // Prevent rendering the form while checking auth state or if redirecting
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-4">
            <Gauge className="h-8 w-8 text-red-500" />
            <span className="font-bold text-3xl">Fast<span className="text-red-500">lytics</span></span>
          </Link>
          <p className="text-gray-400 mt-1">Your premium F1 analytics dashboard</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-800 p-1">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded transition-all"
            >
              <KeyRound className="h-4 w-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded transition-all"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger 
              value="magic-link" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded transition-all"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Magic Link
            </TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card className="bg-gray-900/80 border-gray-700 shadow-xl">
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
                        onClick={handlePasswordReset}
                        disabled={isLoading.reset}
                      >
                        {isLoading.reset ? <Loader2 className="h-3 w-3 animate-spin" /> : "Forgot password?"}
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
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading.login}
                  >
                    {isLoading.login ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gray-900 px-2 text-xs text-gray-400">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white flex items-center justify-center"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading.google}
                  >
                    {isLoading.google ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d={siGoogle.path} />
                      </svg>
                    )}
                    {isLoading.google ? "Connecting..." : "Sign in with Google"}
                  </Button>

                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white flex items-center justify-center"
                    onClick={handleGithubSignIn}
                    disabled={isLoading.github}
                  >
                    {isLoading.github ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d={siGithub.path} />
                      </svg>
                    )}
                    {isLoading.github ? "Connecting..." : "Sign in with GitHub"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup">
            <Card className="bg-gray-900/80 border-gray-700 shadow-xl">
              {!signupSuccess ? (
                <form onSubmit={handleSignup}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white">Create Account</CardTitle>
                    <CardDescription className="text-gray-400">
                      Join Fastlytics for premium F1 analytics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-gray-300">First Name</Label>
                        <div className="relative">
                          <Input
                            id="first-name"
                            placeholder="John"
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-gray-300">Last Name</Label>
                        <div className="relative">
                          <Input
                            id="last-name"
                            placeholder="Doe"
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
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
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate Racing Username
                        </Button>
                      </div>
                      <Input
                        id="username"
                        placeholder="Choose a username or generate one"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
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
                          placeholder="Create a secure password"
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
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the <Link to="/terms-of-service" className="text-red-500 hover:underline">Terms of Service</Link> and{" "}
                        <Link to="/privacy-policy" className="text-red-500 hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading.signup}
                    >
                      {isLoading.signup ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <UserPlus className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full bg-gray-700" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-gray-900 px-2 text-xs text-gray-400">
                          OR SIGN UP WITH
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white flex items-center justify-center"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading.google}
                    >
                      {isLoading.google ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d={siGoogle.path} />
                        </svg>
                      )}
                      {isLoading.google ? "Connecting..." : "Sign up with Google"}
                    </Button>

                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white flex items-center justify-center"
                      onClick={handleGithubSignIn}
                      disabled={isLoading.github}
                    >
                      {isLoading.github ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d={siGithub.path} />
                        </svg>
                      )}
                      {isLoading.github ? "Connecting..." : "Sign up with GitHub"}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Account Created!</h3>
                  <p className="text-gray-400">
                    We've sent a verification link to <strong className="text-red-400">{signupEmail}</strong>.<br />
                    Please check your email to verify your account.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* MAGIC LINK TAB */}
          <TabsContent value="magic-link">
            <Card className="bg-gray-900/80 border-gray-700 shadow-xl">
              {!magicLinkSent ? (
                <form onSubmit={handleMagicLinkLogin}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-white">Magic Link Login</CardTitle>
                    <CardDescription className="text-gray-400">
                      Get a special link sent to your email to sign in without a password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-gray-800/70 border-blue-500/30 text-blue-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        We'll send you a special link that you can use to sign in instantly, no password required!
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="magic-email" className="text-gray-300">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500"
                          value={magicLinkEmail}
                          onChange={(e) => setMagicLinkEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading.magicLink}
                    >
                      {isLoading.magicLink ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Magic Link...
                        </>
                      ) : (
                        <>
                          Send Magic Link
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Magic Link Sent!</h3>
                  <p className="text-gray-400 mb-6">
                    We've sent a special login link to <strong className="text-red-400">{magicLinkEmail}</strong>.<br />
                    Check your email and click the link to sign in.
                  </p>
                  <Button
                    variant="outline"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => {
                      setMagicLinkSent(false);
                      setMagicLinkEmail('');
                    }}
                  >
                    Send Another Link
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
