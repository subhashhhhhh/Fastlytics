import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Gauge, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'; // Replaced Car with Gauge, Added LayoutDashboard
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown

const LandingNavbar: React.FC = () => {
  const { user, signOut, loading } = useAuth(); // Get auth state
  const [drawerOpen, setDrawerOpen] = useState(false); // Add state for mobile drawer
  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Showcase', href: '#showcase' },
  ];

  // Basic smooth scroll handler
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove '#'
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      {/* Removed max-w-7xl and mx-auto to make content full width */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <Gauge className="h-6 w-6 text-red-500" />
            <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            {/* Conditional Auth Buttons/Dropdown */}
            {loading ? (
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div> // Loading placeholder
            ) : user ? (
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
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
                      {user.email && <p className="text-xs leading-none text-gray-400">{user.email}</p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
                    <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
                    <Link to="/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
                     <Link to="/settings"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={signOut} className="hover:bg-red-800/80 cursor-pointer text-red-400 hover:text-red-300 focus:bg-red-800/80 focus:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/dashboard">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Explore Dashboard</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Sheet */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-gray-950 border-l-gray-800 text-white p-4 flex flex-col"> {/* Use flex-col */}
                 {/* Top section for nav items */}
                 <div className="flex-grow space-y-2 overflow-y-auto">
                   {navItems.map((item) => (
                     <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)} // Add scroll handler here too if needed inside Sheet
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                 </div>
                 {/* Bottom section for auth state */}
                 <div className="mt-auto pt-4 border-t border-gray-700">
                    {loading ? (
                       <div className="text-center text-gray-500 text-sm">Loading...</div>
                    ) : user ? (
                       <div className="space-y-2">
                         <div className="px-3 py-2 text-sm text-gray-400">Logged in as: {user.email}</div>
                         {/* Pass setDrawerOpen to onClick handlers */}
                         <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                            <LayoutDashboard className="h-5 w-5" /><span>Dashboard</span>
                         </Link>
                         <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                            <User className="h-5 w-5" /><span>Profile</span>
                         </Link>
                         <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white" onClick={() => setDrawerOpen(false)}>
                            <Settings className="h-5 w-5" /><span>Settings</span>
                         </Link>
                         <Button variant="ghost" onClick={() => { signOut(); setDrawerOpen(false); }} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-800/80 p-3 text-base font-medium">
                            <LogOut className="mr-3 h-5 w-5" /><span>Log out</span>
                         </Button>
                       </div>
                     ) : (
                       <div className="flex flex-col space-y-2">
                          <Link to="/auth?tab=login" onClick={() => setDrawerOpen(false)}>
                             <Button variant="ghost" className="w-full justify-center text-gray-300 hover:text-white hover:bg-gray-800 p-3 text-base font-medium">Log In</Button>
                          </Link>
                          <Link to="/auth?tab=signup" onClick={() => setDrawerOpen(false)}>
                             <Button className="w-full bg-red-600 hover:bg-red-700 text-white p-3 text-base font-medium">Sign Up</Button>
                          </Link>
                       </div>
                     )}
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
