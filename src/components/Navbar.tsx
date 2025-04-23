import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  X,
  Gauge, 
  Flag,
  Users,
  UsersRound
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useAuth } from '@/contexts/AuthContext'; // Keep import for now

const Navbar = () => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { loading } = useAuth(); // Keep for compatibility

  // Expanded Nav Items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Races', href: '/races', icon: <Flag size={18} /> },
    { name: 'Drivers', href: '/standings/drivers', icon: <Users size={18} /> },
    { name: 'Teams', href: '/standings/teams', icon: <UsersRound size={18} /> },
  ];

  // Loading state while checking auth
  if (loading) {
    return (
       <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-center">
         <span className="text-gray-500 text-sm">Loading...</span>
       </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <Gauge className="h-6 w-6 text-red-500" />
            <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh] bg-gray-950 border-l-gray-800 text-white p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors" onClick={() => setDrawerOpen(false)}>
                    <Gauge className="h-6 w-6 text-red-500" />
                    <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
                  </Link>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </DrawerClose>
                </div>

                {/* Mobile Nav Links */}
                <div className="flex-grow space-y-2 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === '/dashboard'}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 p-3 rounded-md text-base font-medium",
                          isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )
                      }
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
