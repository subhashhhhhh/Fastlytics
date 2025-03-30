import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Award, ChevronRight, CreditCard, HelpCircle, MessageSquare } from 'lucide-react'; // Added HelpCircle, MessageSquare
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils'; // Import cn

const Subscription = () => {
  const navigate = useNavigate();

  const handleAuthNavigate = (tabValue: 'login' | 'signup') => {
    navigate(`/auth?tab=${tabValue}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navbar />

      {/* Use padding instead of container */}
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">Choose Your Fastlytics Plan</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock the level of F1 insight that matches your passion.
          </p>
        </header>

        {/* Tabs for Monthly/Annual */}
        <Tabs defaultValue="monthly" className="w-full mb-12 md:mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-64 bg-gray-800/80 p-1 rounded-lg">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md px-6 py-1.5 text-sm font-medium transition-all">Monthly</TabsTrigger>
              <TabsTrigger value="annual" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md px-6 py-1.5 text-sm font-medium transition-all">
                Annual <span className="ml-1.5 text-xs bg-red-500/40 text-red-200 rounded-full px-2 py-0.5">Save 20%</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Monthly Pricing */}
          <TabsContent value="monthly" className="mt-0 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCardRedesigned
                title="Free"
                description="Essential insights for casual fans"
                price="$0"
                period="/ forever"
                features={[
                  "Basic Race Results (Last 3 Seasons)",
                  "Limited Driver Comparisons",
                  "Standard Chart Exports (1080p)",
                  "Social Sharing Enabled",
                ]}
                limitations={[
                  "No Advanced Telemetry",
                  "No Strategy Simulations",
                  "Ad-Supported Downloads",
                ]}
                buttonText="Get Started"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={false}
              />
              <PricingCardRedesigned
                title="Premium"
                description="Deep analysis for superfans & pros"
                price="$9.99"
                period="/ month"
                features={[
                  "Everything in Free, plus:",
                  "Full Historical Data (2010+)",
                  "Unlimited Comparisons",
                  "Advanced Telemetry & ERS Analysis",
                  "Strategy Simulations (Undercut/Overcut)",
                  "AI Pace Predictions",
                  "4K & Vector Chart Exports",
                  "Ad-Free Experience",
                  "Priority Support",
                ]}
                limitations={[]}
                buttonText="Go Premium"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={true}
              />
            </div>
          </TabsContent>

          {/* Annual Pricing */}
          <TabsContent value="annual" className="mt-0 animate-fade-in">
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCardRedesigned
                title="Free"
                description="Essential insights for casual fans"
                price="$0"
                period="/ forever"
                features={[
                  "Basic Race Results (Last 3 Seasons)",
                  "Limited Driver Comparisons",
                  "Standard Chart Exports (1080p)",
                  "Social Sharing Enabled",
                ]}
                limitations={[
                  "No Advanced Telemetry",
                  "No Strategy Simulations",
                  "Ad-Supported Downloads",
                ]}
                buttonText="Get Started"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={false}
              />
              <PricingCardRedesigned
                title="Premium"
                description="Deep analysis for superfans & pros"
                price="$95.88"
                period="/ year"
                originalPrice="$119.88"
                features={[
                   "Everything in Free, plus:",
                  "Full Historical Data (2010+)",
                  "Unlimited Comparisons",
                  "Advanced Telemetry & ERS Analysis",
                  "Strategy Simulations (Undercut/Overcut)",
                  "AI Pace Predictions",
                  "4K & Vector Chart Exports",
                  "Ad-Free Experience",
                  "Priority Support",
                ]}
                limitations={[]}
                buttonText="Go Premium (Annual)"
                buttonAction={() => handleAuthNavigate('signup')}
                highlighted={true}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Comparison Table Section */}
        <section className="mb-16 md:mb-20 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Detailed Feature Comparison</h2>
          <div className="bg-gray-900/70 border border-gray-700/80 rounded-lg overflow-hidden shadow-lg">
             <FeatureComparisonTableRedesigned />
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-gray-900 via-gray-800/80 to-gray-900 border border-gray-700 rounded-lg p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white flex items-center">
                  <HelpCircle className="w-7 h-7 mr-3 text-red-400"/>
                  Still Have Questions?
                </h2>
                <p className="text-gray-300 mb-6">
                  Our team is ready to help you choose the right plan or answer any questions about Fastlytics features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                    View FAQ
                  </Button>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5"/> Contact Support
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-center items-center">
                 {/* Optional: Add a relevant graphic or icon */}
                 <CreditCard className="w-24 h-24 text-gray-700" strokeWidth={1}/>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Redesigned Pricing Card ---
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

const PricingCardRedesigned = ({
  title, description, price, period, features, limitations,
  buttonText, buttonAction, highlighted, originalPrice
}: PricingCardProps) => {
  return (
    <Card className={cn(
      "border overflow-hidden transition-all duration-300 ease-in-out flex flex-col", // Base styles
      highlighted
        ? "border-red-500/60 shadow-xl shadow-red-500/15 relative bg-gray-900 scale-[1.02]" // Highlighted styles
        : "border-gray-700 bg-gray-900/80 hover:border-gray-600 hover:shadow-lg" // Default styles
    )}>
      {highlighted && (
        <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-red-700 text-white px-4 py-1 rounded-bl-lg text-xs font-semibold tracking-wide">
          RECOMMENDED
        </div>
      )}
      <CardHeader className={cn("pb-6", highlighted ? "pt-8" : "pt-6")}> {/* Adjust padding */}
        <CardTitle className="text-2xl font-semibold flex items-center text-white mb-1">
          {title === "Premium" && <Award className="mr-2 h-5 w-5 text-red-400" />}
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-white">{price}</span>
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm">{originalPrice}</span>
          )}
          <span className="text-gray-400 text-sm">{period}</span>
        </div>
      </CardHeader>
      {/* Use ScrollArea if lists get long */}
      <CardContent className="space-y-5 text-gray-300 text-sm flex-grow">
        <div>
          <h3 className="font-medium mb-3 text-white text-base">Included Features</h3>
          <ul className="space-y-2.5">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2.5 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        {limitations.length > 0 && (
          <div className="pt-5 border-t border-gray-700/50">
            <h3 className="font-medium mb-3 text-white text-base">Limitations</h3>
            <ul className="space-y-2.5">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-4 w-4 text-gray-500 mr-2.5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-4 mt-auto"> {/* Footer for button */}
         <Button
          size="lg"
          className={cn(
            "w-full transition-all duration-200",
            highlighted
              ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
              : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          )}
          variant={highlighted ? "default" : "outline"}
          onClick={buttonAction}
        >
          {buttonText}
          <ChevronRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
};


// --- Redesigned Feature Comparison Table ---
interface ComparisonFeature { name: string; free: boolean | string; premium: boolean | string; }
interface FeatureCategory { title: string; features: ComparisonFeature[]; }

const FeatureComparisonTableRedesigned = () => {
  const featureCategories: FeatureCategory[] = [
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

  const renderCellValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-gray-500 mx-auto" />;
    }
    return <span className="text-sm text-gray-300">{value}</span>;
  };

  const renderPremiumCellValue = (value: boolean | string) => {
     if (typeof value === 'boolean') {
      return value ? <CheckCircle2 className="h-5 w-5 text-red-400 mx-auto" /> : <XCircle className="h-5 w-5 text-gray-500 mx-auto" />;
    }
    return <span className="text-sm text-gray-300">{value}</span>;
  }

  return (
    <div className="overflow-x-auto"> {/* Ensure horizontal scroll on small screens */}
      <table className="w-full min-w-[600px] border-collapse text-gray-300">
        <thead className="bg-gray-800/60">
          <tr>
            <th className="text-left p-3 md:p-4 border-b border-gray-700 text-white font-semibold text-sm sticky left-0 bg-gray-800/60 z-10">Feature</th>
            <th className="p-3 md:p-4 border-b border-gray-700 text-center text-white font-semibold text-sm w-24">Free</th>
            <th className="p-3 md:p-4 border-b border-gray-700 text-center text-white font-semibold text-sm w-24">Premium</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {featureCategories.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              {/* Category Header Row */}
              <tr className="bg-gray-800/40 sticky top-0 z-10"> {/* Make category header sticky */}
                <td colSpan={3} className="p-3 md:p-4 font-semibold text-white text-base sticky left-0 bg-gray-800/40">
                  {category.title}
                </td>
              </tr>
              {/* Feature Rows */}
              {category.features.map((feature, featureIndex) => (
                <tr key={`${categoryIndex}-${featureIndex}`} className="hover:bg-gray-800/40 transition-colors">
                  <td className="p-3 md:p-4 text-sm sticky left-0 bg-inherit group-hover:bg-gray-800/40">{feature.name}</td>
                  <td className="p-3 md:p-4 text-center">
                    {renderCellValue(feature.free)}
                  </td>
                  <td className="p-3 md:p-4 text-center">
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
