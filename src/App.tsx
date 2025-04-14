import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Renamed from Index
import Landing from "./pages/Landing"; // New Landing page
import Race from "./pages/Race";
import TeamStandings from "./pages/TeamStandings";
import DriverStandings from "./pages/DriverStandings";
import Races from "./pages/Races"; // Import Races page
import Profile from "./pages/Profile"; // Import Profile page
// Import NotFound page
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import Privacy Policy page
import TermsOfService from "./pages/TermsOfService"; // Import Terms of Service page
import FAQ from "./pages/FAQ"; // Import FAQ page
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { SeasonProvider } from "./contexts/SeasonContext"; // Import SeasonProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { useState, useEffect } from "react"; // Import useState and useEffect
import ScrollToTop from "@/components/ScrollToTop"; // Import the new component

const queryClient = new QueryClient();

// Donation Thank You Banner Component
const DonationThankYouBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Set a cookie to track if the banner has been shown
    const hasSeenBanner = localStorage.getItem('donationThankYouSeen');
    if (hasSeenBanner) {
      setIsVisible(false);
    } else {
      // Set the cookie after 7 days
      const timeout = setTimeout(() => {
        localStorage.setItem('donationThankYouSeen', 'true');
      }, 7 * 24 * 60 * 60 * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-red-500 text-white py-2 text-center relative">
      <p className="text-sm md:text-base">
        Special thanks to <a href="https://instagram.com/sf1club" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">sf1club</a> for the €50 donation! Your support helps keep Fastlytics running for the F1 community. ❤️
      </p>
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

// Layout component to add footer to all pages except Auth
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    {children}
    <Footer />
  </div>
);

// Landing layout without footer
const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    {children}
    {/* No Footer here */}
  </div>
);

// Auth layout without footer
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Toaster />
        <Sonner />
        <SeasonProvider> {/* Wrap with SeasonProvider */}
          <BrowserRouter>
            <ScrollToTop /> {/* Add ScrollToTop here */}
            <Routes>
              {/* Auth routes without footer */}
              <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />

              {/* Landing Page Route (No Footer) */}
              <Route path="/" element={<LandingLayout><Landing /></LandingLayout>} />

              {/* Public Info Pages (No Footer, Navbar included in page) */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/faq" element={<FAQ />} />


              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
            {/* Routes within here require authentication */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/race/:raceId" element={<MainLayout><Race /></MainLayout>} />
            <Route path="/races" element={<MainLayout><Races /></MainLayout>} /> {/* New Races route */}
            {/* Assuming standings also need auth */}
            <Route path="/standings/teams" element={<MainLayout><TeamStandings /></MainLayout>} />
            <Route path="/standings/drivers" element={<MainLayout><DriverStandings /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} /> {/* New Profile route */}
          </Route>

          {/* 404 page - Keep outside protected routes or handle within if needed */}
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </SeasonProvider> {/* Close SeasonProvider */}
      </AuthProvider> {/* Close AuthProvider */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
