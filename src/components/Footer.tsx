import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Gauge, Heart } from 'lucide-react'; // Replaced Car with Gauge

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Features', links: [ { name: 'Dashboard', href: '/dashboard'}, { name: 'Drivers', href: '/drivers'}, { name: 'Races', href: '/dashboard'} ] }, // Simplified links
    // Updated 'Support' link to be external and renamed, linked FAQ
    { title: 'Resources', links: [ { name: 'Blog', href: 'https://subhashh.tech'}, { name: 'Support the Project', href: 'https://buymeacoffee.com/subhashh', external: true }, { name: 'FAQ', href: '/faq'} ] },
    // Linked Legal pages
    { title: 'Legal', links: [ { name: 'Privacy Policy', href: '/privacy-policy'}, { name: 'Terms of Service', href: '/terms-of-service'} ] },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://x.com/ferrari4lifee', icon: <Twitter className="h-5 w-5" /> },
    { name: 'GitHub', href: 'https://github.com/subhashhhhhh', icon: <Github className="h-5 w-5" /> },
    { name: 'Mail', href: 'mailto:contact@fastlytics.app', icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-black/90 border-t border-gray-800 mt-auto text-gray-400">
      <div className="container mx-auto py-10 px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors mb-2 w-fit">
              <Gauge className="h-6 w-6 text-red-500" />
              <span className="font-bold text-xl">Fast<span className="text-red-500">lytics</span></span>
            </Link>
            <p className="text-sm max-w-xs">
              The ultimate analytics platform for Formula 1 fans.
            </p>
             <div className="flex space-x-4 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-white text-sm tracking-wider uppercase">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href} // Use href directly
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        className="hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.href} className="hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 mb-2 sm:mb-0">
            &copy; {currentYear} Fastlytics. All rights reserved. Not affiliated with Formula 1 companies.
          </p>
          <div className="flex items-center text-gray-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 mx-1.5 text-red-500 fill-current" />
            <span>for F1 fans by Subhash Gottumukkala</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
