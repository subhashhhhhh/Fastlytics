import React from 'react';
import { ArrowRight, Users, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedDiscordBannerProps {
  className?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const EnhancedDiscordBanner: React.FC<EnhancedDiscordBannerProps> = ({
  className
}) => {
  return (
    <motion.div 
      className={cn(
        "bg-[#5865F2]/10 backdrop-blur-lg border border-[#5865F2]/20 rounded-2xl p-8 mb-8 relative overflow-hidden",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      {/* Background glow effect */}
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[#5865F2]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-[#5865F2]/5 rounded-full blur-2xl"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
        {/* Discord logo SVG */}
        <div className="flex-shrink-0">
          <svg width="80" height="60" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60.1 5C55.5 2.9 50.5 1.3 45.3 0.3C45.2 0.3 45.1 0.3 45.1 0.4C44.5 1.5 43.8 2.9 43.3 4C37.6 3.1 32 3.1 26.4 4C25.9 2.9 25.2 1.5 24.6 0.4C24.6 0.3 24.5 0.3 24.4 0.3C19.2 1.3 14.2 2.9 9.6 5C9.6 5 9.5 5.1 9.5 5.1C1.4 17.5 -0.9 29.6 0.3 41.5C0.3 41.6 0.3 41.7 0.4 41.7C6.1 45.9 11.6 48.4 17 50.1C17.1 50.1 17.2 50.1 17.3 50C18.6 48.2 19.8 46.3 20.8 44.3C20.9 44.1 20.8 43.9 20.6 43.8C18.8 43.1 17.1 42.3 15.4 41.4C15.2 41.3 15.2 41 15.4 40.9C15.7 40.7 16.1 40.4 16.4 40.2C16.5 40.1 16.6 40.1 16.7 40.2C27.7 45.2 39.6 45.2 50.5 40.2C50.6 40.1 50.7 40.1 50.8 40.2C51.1 40.4 51.5 40.7 51.8 40.9C52 41 52 41.3 51.8 41.4C50.1 42.3 48.4 43.1 46.6 43.8C46.4 43.9 46.3 44.1 46.4 44.3C47.4 46.3 48.6 48.2 49.9 50C50 50.1 50.1 50.1 50.2 50.1C55.7 48.4 61.2 45.9 66.9 41.7C67 41.7 67 41.6 67 41.5C68.4 27.8 64.8 15.8 60.2 5.1C60.2 5.1 60.1 5 60.1 5ZM22.4 34.5C19.1 34.5 16.4 31.5 16.4 27.8C16.4 24.1 19.1 21.1 22.4 21.1C25.8 21.1 28.5 24.2 28.4 27.8C28.4 31.5 25.7 34.5 22.4 34.5ZM47.4 34.5C44.1 34.5 41.4 31.5 41.4 27.8C41.4 24.1 44.1 21.1 47.4 21.1C50.8 21.1 53.5 24.2 53.4 27.8C53.4 31.5 50.8 34.5 47.4 34.5Z" fill="#5865F2"/>
          </svg>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-semibold mb-3 text-white">Join Our Discord Community</h3>
          <p className="text-gray-300 mb-5">
            Connect with F1 enthusiasts, discuss races, share insights, and get updates from the Fastlytics team.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-5">
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700/50">
              <Users className="h-4 w-4 text-[#5865F2]" />
              <span className="text-gray-200 text-sm">100+ Members</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700/50">
              <MessageCircle className="h-4 w-4 text-[#5865F2]" />
              <span className="text-gray-200 text-sm">Active Discussions</span>
            </div>
          </div>
          
          <a 
            href="https://discord.gg/bSEGSMwFDn" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#5865F2] hover:bg-[#4752c4] text-white py-3 px-6 rounded-xl shadow-lg font-medium transition-colors duration-200"
          >
            Join our Discord
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedDiscordBanner; 