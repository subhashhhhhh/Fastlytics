import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="signup" className="py-20 bg-f1-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-racing opacity-20 rounded-full blur-3xl"></div>
        <svg className="absolute bottom-0 left-0 h-32 w-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path 
            fill="#e10600" 
            fillOpacity="0.05" 
            d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,165.3C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-f1-gray to-f1-black rounded-2xl p-8 md:p-12 shadow-2xl border border-f1-light-gray/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-racing font-bold text-white">
                Unlock Premium F1 Analytics
              </h2>
              <p className="text-gray-300">
                Sign up to access all 50+ advanced features including telemetry analysis, strategy simulations, and historical comparisons.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-f1-red/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-f1-red" />
                    </div>
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <a href="#signup" className="racing-button inline-flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <p className="text-sm text-gray-400 mt-3">
                  No credit card required. Start with our free plan.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-radial from-f1-red/20 to-transparent rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-radial from-f1-red/20 to-transparent rounded-full"></div>
              
              <div className="bg-f1-gray rounded-xl p-8 border border-f1-light-gray/30 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-block bg-f1-red/20 px-3 py-1 rounded-full text-sm font-medium text-f1-red mb-2">
                    Premium Plan
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-racing text-white">$9</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  {planFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-f1-red/20 flex items-center justify-center mr-3">
                        <Check className="h-3 w-3 text-f1-red" />
                      </div>
                      <p className="text-gray-300 text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  "Tire Strategy Optimization",
  "Live Telemetry Access",
  "AI Pace Predictions",
  "Driver Style Analysis",
  "Custom Dashboards"
];

const planFeatures = [
  "All 50+ premium features",
  "Unlimited chart exports",
  "Priority support",
  "Custom dashboard",
  "Early access to new features",
  "No advertisements"
];

export default CTASection;