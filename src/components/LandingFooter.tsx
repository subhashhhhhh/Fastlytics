import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, Twitter, Gauge, Heart, ArrowRight,
  Trophy, MessageCircle, Shield, ExternalLink, 
  Zap, Flag, Users, Calendar
} from 'lucide-react';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const footerLinks = [
    { name: 'Dashboard', href: '/dashboard', category: 'app' },
    { name: 'Race Calendar', href: '/races', category: 'app' },
    { name: 'Driver Standings', href: '/standings/drivers', category: 'app' },
    { name: 'Team Standings', href: '/standings/teams', category: 'app' },
    { name: 'Discord', href: 'https://discord.gg/bSEGSMwFDn', external: true, category: 'community' },
    { name: 'Twitter', href: 'https://x.com/fastlytics', external: true, category: 'community' },
    { name: 'GitHub', href: 'https://github.com/subhashhhhhh/Fastlytics', external: true, category: 'community' },
    { name: 'Privacy Policy', href: '/privacy-policy', category: 'legal' },
    { name: 'Terms of Service', href: '/terms-of-service', category: 'legal' },
    { name: 'FAQ', href: '/faq', category: 'legal' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-white relative overflow-hidden">
      {/* Red top border with gradient */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600/0 via-red-600 to-red-600/0"></div>
      
      {/* Blurred background elements */}
      <div className="absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-3xl"></div>
      <div className="absolute top-1/4 -right-32 w-[300px] h-[300px] rounded-full bg-red-900/5 blur-3xl"></div>
      
      {/* Background circuit lines */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/20 to-red-600/0"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-red-600/0 via-red-600/10 to-red-600/0"></div>
      </div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 md:px-8 py-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {/* Left Column - Logo & CTA */}
            <motion.div 
              className="lg:col-span-4"
              variants={fadeInUp}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 mb-3 w-fit"
                  >
                    <div className="relative">
                      <Gauge className="h-6 w-6 text-red-500" />
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-red-500/20" 
                        animate={{ scale: [1, 1.4, 1] }} 
                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                      />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Fast<span className="text-red-500">lytics</span></span>
                  </Link>
                  
                  <p className="text-gray-400 text-sm max-w-sm mb-4">
                    The ultimate analytics platform for Formula 1 fans, with in-depth race data and insights.
                  </p>
                </div>
                
                <Link to="/dashboard" className="hidden md:flex lg:hidden">
                  <motion.div 
                    className="flex items-center gap-1.5 text-sm bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Dashboard
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                </Link>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <a 
                  href="https://discord.gg/bSEGSMwFDn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-red-400" />
                  <span>Discord</span>
                </a>
                <a 
                  href="https://github.com/subhashhhhhh/Fastlytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors"
                >
                  <Github className="h-4 w-4 text-red-400" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://x.com/fastlytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors"
                >
                  <Twitter className="h-4 w-4 text-red-400" />
                  <span>Twitter</span>
                </a>
                <a 
                  href="https://ko-fi.com/fastlytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-800 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors"
                >
                  <Heart className="h-4 w-4 text-red-400" />
                  <span>Support</span>
                </a>
              </div>
            </motion.div>
            
            {/* Middle Column - Navigation Links */}
            <motion.div 
              className="lg:col-span-3 md:col-span-1"
              variants={fadeInUp}
            >
              <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                <Flag className="h-4 w-4 text-red-500 mr-2" />
                Features
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-900 group-hover:bg-red-500/20 transition-colors">
                      <Gauge className="h-4 w-4 text-red-400" />
                    </div>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/races" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-900 group-hover:bg-red-500/20 transition-colors">
                      <Calendar className="h-4 w-4 text-red-400" />
                    </div>
                    Races
                  </Link>
                </li>
                <li>
                  <Link to="/standings/drivers" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-900 group-hover:bg-red-500/20 transition-colors">
                      <Users className="h-4 w-4 text-red-400" />
                    </div>
                    Driver Standings
                  </Link>
                </li>
                <li>
                  <Link to="/standings/teams" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-900 group-hover:bg-red-500/20 transition-colors">
                      <Flag className="h-4 w-4 text-red-400" />
                    </div>
                    Team Standings
                  </Link>
                </li>
              </ul>
            </motion.div>
            
            {/* Right Column - Legal & Call to Action */}
            <motion.div 
              className="lg:col-span-5 flex flex-col md:flex-row lg:justify-around lg:pl-8 gap-8" 
              variants={fadeInUp}
            >
              <div>
                <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                  <Shield className="h-4 w-4 text-red-500 mr-2" />
                  Legal
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="lg:block hidden">
                <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                  <Zap className="h-4 w-4 text-red-500 mr-2" />
                  Start Exploring
                </h3>
                <Link to="/dashboard">
                  <motion.div 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800/40 backdrop-blur-sm bg-black/40">
          <div className="container mx-auto px-4 md:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="flex items-center">
                <Trophy className="h-3.5 w-3.5 text-red-500 mr-2" />
                <span className="text-gray-400 text-sm">&copy; {currentYear} Fastlytics. All rights reserved.</span>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="h-3 w-3 mx-1.5 text-red-500 fill-current animate-pulse" />
                <span>for F1 fans by <a href="https://github.com/subhashhhhhh" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-400 transition-colors">Subhash</a></span>
              </div>
            </div>
            
            {/* F1 Disclaimer */}
            <div className="mt-2 text-[10px] text-center">
              <p className="text-gray-500">
                Fastlytics is not affiliated with Formula 1 or its subsidiaries. F1, FORMULA ONE, and related marks are trademarks of Formula One Licensing BV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter; 