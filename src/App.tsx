
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
import Settings from "./pages/Settings"; // Import Settings page
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Subscription from "./pages/Subscription";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { SeasonProvider } from "./contexts/SeasonContext"; // Import SeasonProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

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
            <Routes>
              {/* Auth routes without footer */}
              <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />

          {/* Landing Page Route (No Footer) */}
          <Route path="/" element={<LandingLayout><Landing /></LandingLayout>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Routes within here require authentication */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/race/:raceId" element={<MainLayout><Race /></MainLayout>} />
            <Route path="/races" element={<MainLayout><Races /></MainLayout>} /> {/* New Races route */}
            {/* Assuming subscription and standings also need auth */}
            <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
            <Route path="/standings/teams" element={<MainLayout><TeamStandings /></MainLayout>} />
            <Route path="/standings/drivers" element={<MainLayout><DriverStandings /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} /> {/* New Profile route */}
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} /> {/* New Settings route */}
          </Route>

          {/* 404 page - Keep outside protected routes or handle within if needed */}
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
