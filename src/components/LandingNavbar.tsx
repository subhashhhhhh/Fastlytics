import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu
import { Menu, Car } from 'lucide-react'; // Icons

const LandingNavbar: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <Car className="h-6 w-6 text-red-500" />
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
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Dashboard
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-gray-950 border-l-gray-800 text-white p-4">
                <div className="flex flex-col space-y-4 pt-6">
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
                  <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/auth">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Sign Up / Log In
                    </Button>
                  </Link>
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
