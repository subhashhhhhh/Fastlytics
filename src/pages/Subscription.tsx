import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Award, ChevronRight, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Subscription = () => {
  const navigate = useNavigate();

  const handleAuthNavigate = (tabValue: 'login' | 'signup') => {
    navigate(`/auth?tab=${tabValue}`);
  };

  return (
    // Apply the landing page background gradient and text color
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />

      <div className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Unlock the Full Power of F1 Analytics</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your passion for Formula 1 data and insights
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full mb-12">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-2 w-64 bg-gray-800">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Monthly</TabsTrigger>
              <TabsTrigger value="annual" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">
                Annual <span className="ml-1 text-xs bg-red-500/30 text-red-300 rounded-full px-2 py-0.5">Save 20%</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <PricingCard
                title="Free"
                description="Perfect for casual fans"
                price="$0"
                period="forever"
                features={[
                  "Basic safety car delta analysis",
                  "Session timelines (flags/pit stops)",
                  "Gear shift visualization (1 driver/session)",
                  "Basic overtake aggression scores",
                  "Pit stop leaderboards (time only)",
                  "Race results for past 3 seasons",
                  "2D telemetry track maps",
                  "Export charts in 1080p",
                  "Share to social media"
                ]}
                limitations={[
                  "Limited to 5 driver comparisons/month",
                  "No fuel-adjusted pace analysis",
                  "No tire degradation models",
                  "Ads on download/sharing screens"
                ]}
                buttonText="Get Started"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={false}
              />

              <PricingCard
                title="Premium"
                description="For analysts & superfans"
                price="$9.99"
                period="per month"
                features={[
                  "Everything in Free, plus:",
                  "Red flag forensics & VSC simulations",
                  "Dynamic track evolution analysis",
                  "Throttle-brake overlap & ERS heatmaps",
                  "Driver DNA profiling & radio sentiment",
                  "Undercut/overcut simulations",
                  "Fuel load reverse engineering",
                  "3D interactive track maps",
                  "Full telemetry archives (2010–present)",
                  "Neural pace prediction & AI strategy",
                  "Team workspaces & collaboration tools",
                  "4K/vector exports",
                  "Ad-free experience",
                  "Priority support"
                ]}
                limitations={[]}
                buttonText="Upgrade Now"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="annual" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <PricingCard
                title="Free"
                description="Perfect for casual fans"
                price="$0"
                period="forever"
                features={[
                  "Basic safety car delta analysis",
                  "Session timelines (flags/pit stops)",
                  "Gear shift visualization (1 driver/session)",
                  "Basic overtake aggression scores",
                  "Pit stop leaderboards (time only)",
                  "Race results for past 3 seasons",
                  "2D telemetry track maps",
                  "Export charts in 1080p",
                  "Share to social media"
                ]}
                limitations={[
                  "Limited to 5 driver comparisons/month",
                  "No fuel-adjusted pace analysis",
                  "No tire degradation models",
                  "Ads on download/sharing screens"
                ]}
                buttonText="Get Started"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={false}
              />

              <PricingCard
                title="Premium"
                description="For analysts & superfans"
                price="$95.88"
                period="per year"
                originalPrice="$119.88"
                features={[
                  "Everything in Free, plus:",
                  "Red flag forensics & VSC simulations",
                  "Dynamic track evolution analysis",
                  "Throttle-brake overlap & ERS heatmaps",
                  "Driver DNA profiling & radio sentiment",
                  "Undercut/overcut simulations",
                  "Fuel load reverse engineering",
                  "3D interactive track maps",
                  "Full telemetry archives (2010–present)",
                  "Neural pace prediction & AI strategy",
                  "Team workspaces & collaboration tools",
                  "4K/vector exports",
                  "Ad-free experience",
                  "Priority support"
                ]}
                limitations={[]}
                buttonText="Upgrade Now"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={true}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Feature Comparison</h2>
          <FeatureComparisonTable />
        </div>

        <div className="bg-gray-900/80 rounded-lg p-8 border border-gray-700 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Still have questions?</h2>
              <p className="text-gray-400 mb-4">
                Our team is ready to help you choose the right plan for your F1 analytics needs.
              </p>
              <Button variant="outline" className="mr-4 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                View FAQ
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Contact Support
              </Button>
            </div>
            <div className="flex-shrink-0 bg-red-500/10 p-6 rounded-lg border border-red-500/30">
              <h3 className="font-semibold mb-2 text-white">Pro Tip</h3>
              <p className="text-sm text-red-300">
                Try the free plan first and upgrade anytime. <br />
                Your data and preferences will carry over seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  buttonAction: () => void;
  highlighted: boolean;
  originalPrice?: string;
}

const PricingCard = ({
  title,
  description,
  price,
  period,
  features,
  limitations,
  buttonText,
  buttonAction,
  highlighted,
  originalPrice
}: PricingCardProps) => {
  return (
    <Card className={`border overflow-hidden ${
      highlighted ?
      "border-red-500/50 shadow-lg shadow-red-500/10 relative bg-gray-900" :
      "border-gray-700 bg-gray-900/80"
    }`}>
      {highlighted && (
        <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
          Recommended
        </div>
      )}
      <CardHeader className={`pb-8 ${highlighted ? "bg-red-500/5" : ""}`}>
        <CardTitle className="text-2xl flex items-center text-white">
          {title === "Premium" ? <Award className="mr-2 h-5 w-5 text-red-500" /> : null}
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          {originalPrice && (
            <span className="ml-2 text-gray-500 line-through text-sm">{originalPrice}</span>
          )}
          <span className="text-gray-400"> {period}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-300">
        <div>
          <h3 className="font-medium mb-4 text-white">Included Features</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {limitations.length > 0 && (
          <div>
            <h3 className="font-medium mb-4 text-white">Limitations</h3>
            <ul className="space-y-3">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className={`w-full ${highlighted ? "bg-red-600 hover:bg-red-700 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"}`}
          variant={highlighted ? "default" : "outline"}
          onClick={buttonAction}
        >
          {buttonText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Define the type for a feature in the comparison table
interface ComparisonFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

// Define the type for a feature category
interface FeatureCategory {
  title: string;
  features: ComparisonFeature[];
}

const FeatureComparisonTable = () => {
  const featureCategories: FeatureCategory[] = [ // Add type annotation
    {
      title: "Session & Event Analysis",
      features: [
        { name: "Safety car delta analysis", free: "Basic", premium: "Advanced" },
        { name: "Session timelines (flags/pit stops)", free: true, premium: true },
        { name: "Red flag forensics", free: false, premium: true },
        { name: "Dynamic track evolution", free: false, premium: true },
        { name: "VSC simulations", free: false, premium: true },
      ]
    },
    {
      title: "Driver Performance",
      features: [
        { name: "Gear shift visualization", free: "1 driver/session", premium: "Multiple drivers" },
        { name: "Overtake aggression scores", free: "Basic", premium: "Advanced" },
        { name: "Throttle-brake overlap", free: false, premium: true },
        { name: "ERS deployment heatmaps", free: false, premium: true },
        { name: "Driver DNA profiling", free: false, premium: true },
        { name: "Radio sentiment analysis", free: false, premium: true },
      ]
    },
    {
      title: "Strategy & Telemetry",
      features: [
        { name: "Pit stop battle leaderboards", free: "Time only", premium: "Advanced metrics" },
        { name: "Undercut/overcut simulations", free: false, premium: true },
        { name: "Stint length optimizer", free: false, premium: true },
        { name: "Fuel load analysis", free: false, premium: true },
        { name: "Tire degradation models", free: false, premium: true },
        { name: "3D interactive track maps", free: false, premium: true },
      ]
    },
    {
      title: "Historical & AI Features",
      features: [
        { name: "Race results history", free: "Past 3 seasons", premium: "2010-present" },
        { name: "Full telemetry archives", free: false, premium: "2010-present" },
        { name: "Team dominance cycles", free: false, premium: true },
        { name: "Neural pace prediction", free: false, premium: true },
        { name: "AI strategy simulator", free: false, premium: true },
        { name: "Team workspaces", free: false, premium: true },
      ]
    },
    {
      title: "Export & Experience",
      features: [
        { name: "Chart exports", free: "1080p", premium: "4K/vector" },
        { name: "Social media sharing", free: true, premium: true },
        { name: "Ad-free experience", free: false, premium: true },
        { name: "Driver comparisons per month", free: "5", premium: "Unlimited" },
        { name: "Priority support", free: false, premium: true },
      ]
    },
  ];

  // Helper function to render the check/cross icon or text
  const renderCellValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-gray-500 mx-auto" />;
    }
    return <span className="text-sm">{value}</span>;
  };

  // Helper function to render the premium check/cross icon or text
  const renderPremiumCellValue = (value: boolean | string) => {
     if (typeof value === 'boolean') {
      return value ? <CheckCircle2 className="h-5 w-5 text-red-500 mx-auto" /> : <XCircle className="h-5 w-5 text-gray-500 mx-auto" />;
    }
    return <span className="text-sm">{value}</span>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-gray-300">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="text-left p-4 border-b border-gray-700 text-white font-semibold">Feature</th>
            <th className="p-4 border-b border-gray-700 text-center text-white font-semibold">Free</th>
            <th className="p-4 border-b border-gray-700 text-center text-white font-semibold">Premium</th>
          </tr>
        </thead>
        <tbody>
          {featureCategories.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              <tr className="bg-gray-800/30">
                <td colSpan={3} className="p-4 font-semibold text-white">
                  {category.title}
                </td>
              </tr>
              {category.features.map((feature, featureIndex) => (
                <tr key={`${categoryIndex}-${featureIndex}`} className="border-b border-gray-700/50">
                  <td className="p-4">{feature.name}</td>
                  <td className="p-4 text-center">
                    {renderCellValue(feature.free)}
                  </td>
                  <td className="p-4 text-center">
                    {renderPremiumCellValue(feature.premium)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subscription;
