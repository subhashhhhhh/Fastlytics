import { useEffect } from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Teams from '@/components/landing/Teams';
import RaceResults from '@/components/landing/RaceResults';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/Footer';

const Landing = () => {
  useEffect(() => {
    // Smooth scroll functionality for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Offset for fixed header
              behavior: 'smooth'
            });
          }
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function () {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-f1-black text-white overflow-x-hidden">
      <LandingNavbar />
      <Hero />
      <Features />
      <Teams />
      <RaceResults />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;