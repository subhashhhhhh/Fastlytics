import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Gauge,
  ChevronRight,
  LayoutDashboard,
  Flag,
  Users,
  UsersRound,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface EnhancedNavbarProps {
  transparent?: boolean;
}

const EnhancedNavbar: React.FC<EnhancedNavbarProps> = ({ 
  transparent = false 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Races', href: '/races', icon: <Flag size={18} /> },
    { name: 'Drivers', href: '/standings/drivers', icon: <Users size={18} /> },
    { name: 'Teams', href: '/standings/teams', icon: <UsersRound size={18} /> },
  ];

  // Track scroll position for background opacity changes
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate background opacity based on scroll position
  const backgroundOpacity = transparent 
    ? Math.min(scrollPosition / 300, 0.95) // Gradually increase opacity as user scrolls
    : 0.95; // Default opacity

  // Calculate blur based on scroll position
  const blurAmount = transparent
    ? Math.min(scrollPosition / 100, 10) // Gradually increase blur as user scrolls
    : 10;

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div 
        className="w-full h-16 md:h-20"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          borderBottom: scrollPosition > 50 ? '1px solid rgba(75, 75, 75, 0.2)' : 'none',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Gauge className="h-7 w-7 text-red-500" />
            </motion.div>
            <motion.span 
              className="font-bold text-lg md:text-xl text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Fast<span className="text-red-500">lytics</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <motion.li key={item.name} whileHover={{ scale: 1.05 }}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/dashboard'}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                        isActive ? "text-white" : "text-gray-300 hover:text-white"
                      )
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full" 
                      transition={{ duration: 0.3 }}
                    />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="default" 
                size="sm" 
                className="ml-4 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.open('https://discord.gg/bSEGSMwFDn', '_blank')}
              >
                Join Discord
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-gray-900/95 backdrop-blur-md border-l-gray-800 text-white p-0">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-6 w-6 text-red-500" />
                      <span className="font-bold text-lg">Fast<span className="text-red-500">lytics</span></span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 mt-6">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/dashboard'}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium",
                            isActive ? "bg-red-600/20 text-white" : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                          )
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-800">
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        window.open('https://discord.gg/bSEGSMwFDn', '_blank');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Join Discord
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default EnhancedNavbar; 