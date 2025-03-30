import React, { useRef, useEffect } from 'react';
import { Calendar, LineChart, BarChart, Gauge, Trophy, Users } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Historical Race Analysis",
    description: "Dive into decades of F1 race data with interactive charts and visualizations",
    icon: <Calendar className="h-12 w-12 text-f1-red" />,
    delay: "0s"
  },
  {
    id: 2,
    title: "Driver Performance Metrics",
    description: "Compare drivers across seasons with detailed performance breakdowns",
    icon: <LineChart className="h-12 w-12 text-f1-red" />,
    delay: "0.1s"
  },
  {
    id: 3,
    title: "Team Strategy Insights",
    description: "Analyze pit stop timing, tire strategies, and race pace comparisons",
    icon: <BarChart className="h-12 w-12 text-f1-red" />,
    delay: "0.2s"
  },
  {
    id: 4,
    title: "Real-time Telemetry",
    description: "Explore throttle, brake, and gear data with synchronized onboard footage",
    icon: <Gauge className="h-12 w-12 text-f1-red" />,
    delay: "0.3s"
  },
  {
    id: 5,
    title: "Championship Scenarios",
    description: "Simulate championship outcomes based on different race results",
    icon: <Trophy className="h-12 w-12 text-f1-red" />,
    delay: "0.4s"
  },
  {
    id: 6,
    title: "Community Insights",
    description: "Share your analysis and discover insights from other F1 enthusiasts",
    icon: <Users className="h-12 w-12 text-f1-red" />,
    delay: "0.5s"
  }
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('.feature-item');
    featureElements.forEach(item => {
      observer.observe(item);
    });

    return () => {
      featureElements.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-f1-black to-f1-gray/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-racing mb-4">Powerful <span className="text-f1-red">Analytics</span> Tools</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive suite of Formula 1 data analysis features designed for fans, analysts, and teams
          </p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="feature-item feature-card opacity-0"
              style={{ animationDelay: feature.delay }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;