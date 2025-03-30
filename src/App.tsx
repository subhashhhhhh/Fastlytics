
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Race from "./pages/Race";
import Drivers from "./pages/Drivers";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Subscription from "./pages/Subscription";
import Footer from "./components/Footer";

// Check if we're on the landing page domain
const isLandingDomain = window.location.hostname === 'fastlytics.app' || 
                       window.location.hostname === 'localhost';

const queryClient = new QueryClient();

// Layout component to add footer to all pages except Auth
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    {children}
    <Footer />
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
          {isLandingDomain ? (
            // Landing page routes
            <>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            // Dashboard routes
            <>
              <Route path="/auth" element={<AuthLayout><Auth /></AuthLayout>} />
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/race/:raceId" element={<MainLayout><Race /></MainLayout>} />
              <Route path="/drivers" element={<MainLayout><Drivers /></MainLayout>} />
              <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
