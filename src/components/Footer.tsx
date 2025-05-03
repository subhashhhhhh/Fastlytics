import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, Twitter, Mail, Gauge, Heart, 
  Trophy, ArrowUpRight, Headphones, 
  Calendar, Users, Flag, BookOpen, 
  Shield, ExternalLink, ScrollText,
  Instagram
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };
  
  const featuresLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <Gauge className="w-4 h-4 text-red-400" /> },
    { name: 'Race Calendar', href: '/races', icon: <Calendar className="w-4 h-4 text-red-400" /> },
    { name: 'Driver Standings', href: '/standings/drivers', icon: <Users className="w-4 h-4 text-red-400" /> },
    { name: 'Team Standings', href: '/standings/teams', icon: <Flag className="w-4 h-4 text-red-400" /> },
  ];
  
  const resourcesLinks = [
    { name: 'Blog', href: 'https://subhashh.tech', external: true, icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Support the Project', href: 'https://ko-fi.com/fastlytics', external: true, icon: <Heart className="w-4 h-4" /> },
    { name: 'Discord Community', href: 'https://discord.gg/bSEGSMwFDn', external: true, icon: <Headphones className="w-4 h-4" /> },
    { name: 'FAQ', href: '/faq', icon: <ScrollText className="w-4 h-4" /> },
  ];
  
  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy', icon: <Shield className="w-4 h-4" /> },
    { name: 'Terms of Service', href: '/terms-of-service', icon: <ScrollText className="w-4 h-4" /> },
  ];
  
  const socialLinks = [
    { name: 'Twitter', href: 'https://x.com/fastlytics', icon: <Twitter className="h-5 w-5" /> },
    { name: 'GitHub', href: 'https://github.com/subhashhhhhh', icon: <Github className="h-5 w-5" /> },
    { name: 'Mail', href: 'mailto:contact@fastlytics.app', icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-gray-950 border-t border-gray-800/30 mt-auto text-gray-400 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600/0 via-red-600 to-red-600/0"></div>
      <div className="absolute -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-[300px] h-[300px] rounded-full bg-red-900/5 blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto py-16 px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-4 space-y-6">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-2 w-fit"
            >
              <div className="relative">
                <Gauge className="h-7 w-7 text-red-500" />
                <motion.div 
                  className="absolute inset-0 rounded-full bg-red-500/20" 
                  animate={{ scale: [1, 1.3, 1] }} 
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                />
              </div>
              <span className="font-bold text-2xl tracking-tight">Fast<span className="text-red-500">lytics</span></span>
            </Link>
            
            <p className="text-gray-400 max-w-md leading-relaxed">
              The ultimate analytics platform for Formula 1 fans, providing in-depth race data, 
              team and driver statistics, and performance insights for every race and season.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white p-2 rounded-full bg-gray-900/70 border border-gray-800/50 hover:border-red-500/30 hover:bg-gray-800 transition-all duration-200"
                  aria-label={link.name}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h3 className="font-semibold mb-6 text-white text-base tracking-wide flex items-center">
              <Flag className="w-4 h-4 text-red-500 mr-2" />
              Features
            </h3>
            <ul className="space-y-4">
              {featuresLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold mb-6 text-white text-base tracking-wide flex items-center">
              <BookOpen className="w-4 h-4 text-red-500 mr-2" />
              Resources
            </h3>
            <ul className="space-y-4">
              {resourcesLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.icon}</span>
                      <span>{link.name}</span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-6 text-white text-base tracking-wide flex items-center">
              <Shield className="w-4 h-4 text-red-500 mr-2" />
              Legal
            </h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 sm:mb-0 flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-red-500" />
            <span>&copy; {currentYear} Fastlytics. All rights reserved.</span>
          </p>
          <div className="flex items-center text-gray-500">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 mx-1.5 text-red-500 fill-current animate-pulse" />
            <span>for F1 fans by <a href="https://github.com/subhashhhhhh" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-400 transition-colors">Subhash</a></span>
          </div>
        </div>
        
        {/* F1 Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-800/30 text-xs text-center">
          <p className="text-gray-500 max-w-4xl mx-auto">
            Fastlytics is not affiliated, associated, authorized, endorsed by, or in any way officially connected with 
            Formula 1, Formula One, F1, or any of its subsidiaries or affiliates. The official Formula 1 website is available at <a href="https://www.formula1.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-white transition-colors">formula1.com</a>.
          </p>
          <p className="text-gray-500 mt-3 max-w-4xl mx-auto">
            F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, and related marks are trademarks of Formula One Licensing BV.
            All content, data visualization, and analysis on this site are unofficial and not licensed by Formula 1.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
