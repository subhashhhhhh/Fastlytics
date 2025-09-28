import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, Twitter, Gauge, Heart, ArrowRight,
  ExternalLink, MessageCircle
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

  const featuresLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Race Calendar', href: '/races' },
    { name: 'Driver Standings', href: '/standings/drivers' },
    { name: 'Team Standings', href: '/standings/teams' },
  ];

  const resourcesLinks = [
    { name: 'Discord', href: 'https://discord.gg/bSEGSMwFDn', external: true },
    { name: 'Twitter', href: 'https://x.com/fastlytics', external: true },
    { name: 'GitHub', href: 'https://github.com/subhashhhhhh/Fastlytics', external: true },
    { name: 'Support us', href: 'https://ko-fi.com/fastlytics', external: true },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { name: 'Discord', href: 'https://discord.gg/bSEGSMwFDn', icon: <MessageCircle className="h-4 w-4" /> },
    { name: 'GitHub', href: 'https://github.com/subhashhhhhh/Fastlytics', icon: <Github className="h-4 w-4" /> },
    { name: 'Twitter', href: 'https://x.com/fastlytics', icon: <Twitter className="h-4 w-4" /> },
    { name: 'Support', href: 'https://ko-fi.com/fastlytics', icon: <Heart className="h-4 w-4" /> },
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
      
      <div className="relative z-0">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 md:px-8 py-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {/* Left Column - Logo & Social */}
            <motion.div 
              className="lg:col-span-5"
              variants={fadeInUp}
            >
              <div className="flex flex-col">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 mb-4 w-fit"
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
                
                <p className="text-gray-400 text-sm max-w-sm mb-6">
                  The ultimate analytics platform for Formula 1 fans, with in-depth race data and insights.
                </p>
                
                <div className="flex gap-3 mb-6">
                  {socialLinks.map((link) => (
                    <a 
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 py-2 px-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors border border-gray-700/50 hover:border-red-500/30"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
                
                <Link to="/dashboard" className="md:hidden">
                  <motion.div 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 w-fit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
            
            {/* Features Column */}
            <motion.div 
              className="lg:col-span-2"
              variants={fadeInUp}
            >
              <h3 className="text-base font-semibold mb-4 text-white">
                Features
              </h3>
              <ul className="space-y-3">
                {featuresLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 transform duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Resources Column */}
            <motion.div 
              className="lg:col-span-2"
              variants={fadeInUp}
            >
              <h3 className="text-base font-semibold mb-4 text-white">
                Community
              </h3>
              <ul className="space-y-3">
                {resourcesLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                    >
                      <span className="hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Legal & CTA Column */}
            <motion.div 
              className="lg:col-span-3 flex flex-col" 
              variants={fadeInUp}
            >
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4 text-white">
                  Legal
                </h3>
                <ul className="space-y-2 text-sm">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="hidden lg:block">
                <h3 className="text-base font-semibold mb-4 text-white">
                  Get Started
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