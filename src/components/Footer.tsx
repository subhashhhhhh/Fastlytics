
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Car, Heart, CreditCard } from 'lucide-react'; // Changed Flag to Car

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black/90 border-t border-gray-800 mt-auto text-gray-300"> {/* Updated background and text color */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            {/* Updated Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-2">
              <Car className="h-6 w-6 text-red-500" />
              <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
            </Link>
            <p className="text-sm text-gray-400"> {/* Adjusted text color */}
              The ultimate analytics platform for Formula 1 fans and professionals.
              Access deep insights into race data, driver performance, and historical trends.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"> {/* Adjusted colors */}
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"> {/* Adjusted colors */}
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:info@fastchartsf1.com" 
                className="text-gray-400 hover:text-white transition-colors"> {/* Adjusted colors */}
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Features</h3> {/* Adjusted color */}
            <ul className="space-y-2 text-sm text-gray-400"> {/* Adjusted color */}
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Session Analysis</Link></li> {/* Link to dashboard */}
              <li><Link to="/drivers" className="hover:text-white transition-colors">Driver Performance</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Telemetry Physics</Link></li> {/* Link to dashboard */}
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Strategy & Pit Stops</Link></li> {/* Link to dashboard */}
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Historical Analysis</Link></li> {/* Link to dashboard */}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3> {/* Adjusted color */}
            <ul className="space-y-2 text-sm text-gray-400"> {/* Adjusted color */}
              <li><Link to="/subscription" className="hover:text-white transition-colors flex items-center">
                <CreditCard className="h-3.5 w-3.5 mr-2" />Subscription Plans
              </Link></li>
              <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3> {/* Adjusted color */}
            <ul className="space-y-2 text-sm text-gray-400"> {/* Adjusted color */}
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Licensing</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center"> {/* Adjusted border color */}
          <p className="text-sm text-gray-400 mb-2 sm:mb-0"> {/* Adjusted color */}
            &copy; {currentYear} Fastlytics. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-gray-400"> {/* Adjusted color */}
            <span>Made with</span>
            <Heart className="h-3 w-3 mx-1 text-red-500" /> {/* Adjusted heart color */}
            <span>for F1 fans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
