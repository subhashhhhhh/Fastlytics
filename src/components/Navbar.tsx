import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  User,
  Car,
  CreditCard,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook

const Navbar = () => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut, loading } = useAuth(); // Get user and signOut from context

  // Simplified Nav Items for Dashboard
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Drivers', href: '/drivers', icon: <User size={18} /> },
    { name: 'Subscription', href: '/subscription', icon: <CreditCard size={18} /> },
  ];

  // Corrected handleLogout function (make it async)
  const handleLogout = async () => {
    console.log("Logout clicked");
    await signOut(); // Call signOut from context
    // AuthProvider listener handles state update
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <Car className="h-6 w-6 text-red-500" />
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

          {/* Right side: Account/Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Account Dropdown or Login/Signup */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-gray-700">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email?.charAt(0).toUpperCase()} />
                        <AvatarFallback className="bg-gray-700 text-gray-300">
                          {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        {user.email && <p className="text-xs leading-none text-gray-400">{user.email}</p>}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    {/* Use asChild with Link for navigation */}
                    <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-800/80 cursor-pointer text-red-400 hover:text-red-300 focus:bg-red-800/80 focus:text-red-300">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/auth?tab=login">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth?tab=signup">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
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
                <DrawerContent className="h-[90vh] bg-gray-950 border-l-gray-800 text-white p-4 flex flex-col"> {/* Use flex-col */}
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
                  <div className="flex-grow space-y-2 overflow-y-auto"> {/* Allow scrolling for nav items */}
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

                  {/* Mobile Account Section (at the bottom) */}
                  <div className="mt-auto pt-4 border-t border-gray-700">
                     {user ? (
                       <div className="space-y-2">
                         {/* Display basic user info */}
                         <div className="px-3 py-2 text-sm text-gray-400">
                           Logged in as: {user.email}
                         </div>
                         {/* Use Link component for navigation */}
                         <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                         </Link>
                         <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                         </Link>
                         <Button variant="ghost" onClick={() => { handleLogout(); setDrawerOpen(false); }} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-800/80 p-3 text-base font-medium">
                            <LogOut className="mr-3 h-5 w-5" />
                            <span>Log out</span>
                         </Button>
                       </div>
                     ) : (
                       <div className="flex flex-col space-y-2">
                          <Link to="/auth?tab=login" onClick={() => setDrawerOpen(false)}>
                             <Button variant="ghost" className="w-full justify-center text-gray-300 hover:text-white hover:bg-gray-800 p-3 text-base font-medium">
                               Log In
                             </Button>
                          </Link>
                          <Link to="/auth?tab=signup" onClick={() => setDrawerOpen(false)}>
                             <Button className="w-full bg-red-600 hover:bg-red-700 text-white p-3 text-base font-medium">
                               Sign Up
                             </Button>
                          </Link>
                       </div>
                     )}
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
