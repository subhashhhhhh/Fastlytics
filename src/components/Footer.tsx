
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Flag, Heart, CreditCard } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card/80 border-t border-border/50 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-f1-ferrari" />
              <h3 className="text-lg font-bold">Fastlytics</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              The ultimate analytics platform for Formula 1 fans and professionals.
              Access deep insights into race data, driver performance, and historical trends.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:info@fastchartsf1.com" 
                className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Session Analysis</Link></li>
              <li><Link to="/drivers" className="hover:text-primary transition-colors">Driver Performance</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Telemetry Physics</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Strategy & Pit Stops</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Historical Analysis</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/subscription" className="hover:text-primary transition-colors flex items-center">
                <CreditCard className="h-3.5 w-3.5 mr-2" />Subscription Plans
              </Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Licensing</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
            &copy; {currentYear} Fastlytics. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 mx-1 text-f1-ferrari" />
            <span>for F1 fans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
