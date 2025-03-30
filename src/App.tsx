
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Renamed from Index
import Landing from "./pages/Landing"; // New Landing page
import Race from "./pages/Race";
import Drivers from "./pages/Drivers";
import TeamStandings from "./pages/TeamStandings"; // Import new page
import DriverStandings from "./pages/DriverStandings"; // Import new page
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Subscription from "./pages/Subscription";
import Footer from "./components/Footer";

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes without footer */}
          <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />

          {/* Landing Page Route (No Footer) */}
          <Route path="/" element={<LandingLayout><Landing /></LandingLayout>} />

          {/* Main App Routes (with Footer) */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} /> {/* Moved Dashboard route */}
          <Route path="/race/:raceId" element={<MainLayout><Race /></MainLayout>} />
          <Route path="/drivers" element={<MainLayout><Drivers /></MainLayout>} />
          <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
          <Route path="/standings/teams" element={<MainLayout><TeamStandings /></MainLayout>} /> {/* New route */}
          <Route path="/standings/drivers" element={<MainLayout><DriverStandings /></MainLayout>} /> {/* New route */}
          
          {/* 404 page with footer */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
