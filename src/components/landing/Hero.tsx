import React, { useEffect, useRef } from 'react';
import { ArrowRight, Gauge, ChartBar, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.race-line').forEach(line => {
            line.classList.add('animate-race-line');
          });
        }
      },
      { threshold: 0.1 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => {
      if (svgRef.current) {
        observer.unobserve(svgRef.current);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-f1-black overflow-hidden">
      {/* Background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-f1-black z-0"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-hero-pattern bg-cover bg-center z-0"
        style={{ backgroundBlendMode: 'overlay' }}
      />
      
      {/* Racing line animation SVG */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full z-0" 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
      >
        <path 
          className="race-line" 
          d="M-100,700 C250,600 350,900 500,800 S750,600 1100,800" 
        />
        <path 
          className="race-line" 
          d="M-100,500 C200,400 400,700 600,600 S800,400 1100,600"
          style={{ animationDelay: '0.3s' }}
        />
        <path 
          className="race-line" 
          d="M-100,300 C150,200 450,500 700,400 S850,200 1100,400" 
          style={{ animationDelay: '0.6s' }}
        />
      </svg>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-32 md:pt-40 pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="inline-block bg-f1-red px-4 py-1 rounded-full text-sm font-medium text-white mb-4"
            >
              Formula 1 Analytics Platform
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-racing font-bold text-white leading-tight"
            >
              Unlock <span className="text-f1-red">data-driven</span> insights for Formula 1
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-lg"
            >
              Explore historical race data, compare driver performance, and visualize key metrics through interactive charts and simulations.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.a 
                href="/auth?tab=signup" 
                className="racing-button inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
              <motion.button 
                onClick={() => navigate('/auth?tab=login')} 
                className="bg-transparent border-2 border-white/20 hover:border-white/80 text-white px-6 py-3 rounded-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Dashboard
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.div 
                variants={featureVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-f1-red/20 flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-f1-red" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Real-time Telemetry</h3>
                </div>
              </motion.div>
              <motion.div 
                variants={featureVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-f1-red/20 flex items-center justify-center">
                  <ChartBar className="h-6 w-6 text-f1-red" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Advanced Analytics</h3>
                </div>
              </motion.div>
              <motion.div 
                variants={featureVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-f1-red/20 flex items-center justify-center">
                  <History className="h-6 w-6 text-f1-red" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Historical Data</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;