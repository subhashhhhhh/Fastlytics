import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Added Link
import {
  BarChart2,
  User,
  Car, // Changed icon
  CreditCard,
  Menu,
  X,
  LogOut, // Added icon
  Settings, // Added icon
  LayoutDashboard // Added icon
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar imports

const Navbar = () => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Simplified Nav Items for Dashboard
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Drivers', href: '/drivers', icon: <User size={18} /> },
    { name: 'Subscription', href: '/subscription', icon: <CreditCard size={18} /> },
    // Add other core links if needed, but keep it concise
  ];

  // Placeholder function for logout
  const handleLogout = () => {
    console.log("Logout clicked");
    // Add actual logout logic here (e.g., clear auth state, redirect)
  };

  return (
    // Apply styles similar to LandingNavbar
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Match LandingNavbar */}
          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <Car className="h-6 w-6 text-red-500" />
            <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
          </Link>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/dashboard'} // Ensure 'end' prop for root dashboard link
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-700 text-white" // Active style
                      : "text-gray-300 hover:bg-gray-800 hover:text-white" // Inactive style
                  )
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Right side: Account Dropdown & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Account Dropdown (Desktop) */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* Placeholder - Replace with actual user image/initials */}
                      <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Username</p>
                      <p className="text-xs leading-none text-gray-400">user@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-800/80 cursor-pointer text-red-400 hover:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <DrawerContent className="h-[90vh] bg-gray-950 border-l-gray-800 text-white p-4">
                  <div className="flex items-center justify-between mb-6">
                     <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors" onClick={() => setDrawerOpen(false)}>
                        <Car className="h-6 w-6 text-red-500" />
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
                  <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/dashboard'}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center space-x-3 p-3 rounded-md text-base font-medium",
                            isActive
                              ? "bg-gray-700 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          )
                        }
                        onClick={() => setDrawerOpen(false)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                     <DropdownMenuSeparator className="bg-gray-700 my-4" />
                     {/* Mobile Account Links */}
                     <NavLink to="#" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                     </NavLink>
                     <NavLink to="#" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                     </NavLink>
                     <Button variant="ghost" onClick={() => { handleLogout(); setDrawerOpen(false); }} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-800/80 p-3 text-base font-medium">
                        <LogOut className="mr-3 h-5 w-5" />
                        <span>Log out</span>
                     </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
