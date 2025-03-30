import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Flag, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Flag className="h-8 w-8 text-f1-red" />
            </motion.div>
            <span className="text-2xl font-racing font-bold text-white group-hover:text-f1-red transition-colors">
              Fastlytics
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="#features" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Features
            </NavLink>
            <NavLink 
              to="#teams" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Teams
            </NavLink>
            <NavLink 
              to="#analysis" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Analysis
            </NavLink>
            <NavLink 
              to="#pricing" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Pricing
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Log in
            </Button>
            <Button 
              className="bg-f1-red hover:bg-f1-red/90 text-white font-medium px-6"
            >
              <span>Get Started</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;