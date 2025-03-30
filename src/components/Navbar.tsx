
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Flag, 
  BarChart2, 
  User, 
  Car, 
  Timer, 
  Calendar, 
  Gauge, 
  ArrowRightLeft, 
  Cpu, 
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="w-full bg-card border-b border-border/50 py-3 px-6 flex items-center justify-between mb-6">
      <NavLink to="/" className="flex items-center space-x-2">
        <Flag className="h-6 w-6 text-f1-ferrari" />
        <h1 className="text-2xl font-bold">Fast Charts F1</h1>
      </NavLink>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavLink to="/" end>
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "ghost"} className="flex items-center space-x-2">
                    <BarChart2 size={18} />
                    <span>Dashboard</span>
                  </Button>
                )}
              </NavLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Timer size={18} />
                <span>Analysis</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                  <li className="col-span-2">
                    <NavigationMenuLink asChild>
                      <a className="block p-2 rounded-md hover:bg-accent">
                        <div className="font-medium">Session Analysis</div>
                        <p className="text-sm text-muted-foreground">Track evolution, weather impact, and more</p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {sessionFeatures.slice(0, 4).map((feature) => (
                    <ListItem key={feature.title} title={feature.title} href="#">
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavLink to="/drivers">
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "ghost"} className="flex items-center space-x-2">
                    <User size={18} />
                    <span>Drivers</span>
                  </Button>
                )}
              </NavLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Gauge size={18} />
                <span>Telemetry</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                  {telemetryFeatures.slice(0, 4).map((feature) => (
                    <ListItem key={feature.title} title={feature.title} href="#">
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <ArrowRightLeft size={18} />
                <span>Strategy</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                  {strategyFeatures.slice(0, 4).map((feature) => (
                    <ListItem key={feature.title} title={feature.title} href="#">
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>Historical</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] grid-cols-2">
                  {historicalFeatures.slice(0, 4).map((feature) => (
                    <ListItem key={feature.title} title={feature.title} href="#">
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavLink to="/subscription">
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "ghost"} className="flex items-center space-x-2">
                    <CreditCard size={18} />
                    <span>Pricing</span>
                  </Button>
                )}
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Mobile/Tablet Menu Toggle */}
      <div className="flex items-center space-x-4">
        <Button className="racing-button">
          Season 2023
        </Button>
        
        {isMobile && (
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh]">
              <div className="px-4 py-6 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-6 w-6 text-f1-ferrari" />
                    <h2 className="text-xl font-bold">Fast Charts F1</h2>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </DrawerClose>
                </div>
                
                <div className="space-y-2">
                  <NavLink 
                    to="/" 
                    end 
                    className={({ isActive }) => 
                      cn("flex items-center p-3 rounded-md space-x-2", 
                         isActive ? "bg-secondary" : "hover:bg-accent")
                    }
                    onClick={() => setDrawerOpen(false)}
                  >
                    <BarChart2 size={20} />
                    <span className="font-medium">Dashboard</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/drivers" 
                    className={({ isActive }) => 
                      cn("flex items-center p-3 rounded-md space-x-2", 
                         isActive ? "bg-secondary" : "hover:bg-accent")
                    }
                    onClick={() => setDrawerOpen(false)}
                  >
                    <User size={20} />
                    <span className="font-medium">Drivers</span>
                  </NavLink>
                  
                  <MobileNavSection 
                    icon={<Timer size={20} />} 
                    title="Analysis" 
                    features={sessionFeatures} 
                  />
                  
                  <MobileNavSection 
                    icon={<Gauge size={20} />} 
                    title="Telemetry" 
                    features={telemetryFeatures} 
                  />
                  
                  <MobileNavSection 
                    icon={<ArrowRightLeft size={20} />} 
                    title="Strategy" 
                    features={strategyFeatures} 
                  />
                  
                  <MobileNavSection 
                    icon={<Calendar size={20} />} 
                    title="Historical" 
                    features={historicalFeatures} 
                  />
                  
                  <NavLink 
                    to="/subscription" 
                    className={({ isActive }) => 
                      cn("flex items-center p-3 rounded-md space-x-2", 
                         isActive ? "bg-secondary" : "hover:bg-accent")
                    }
                    onClick={() => setDrawerOpen(false)}
                  >
                    <CreditCard size={20} />
                    <span className="font-medium">Pricing</span>
                  </NavLink>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

// Component for mobile menu sections with collapsible content
const MobileNavSection = ({ icon, title, features }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button 
        variant="ghost" 
        className="w-full justify-start p-3 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </div>
          <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </Button>
      
      {isOpen && (
        <div className="pl-9 space-y-1">
          {features.slice(0, 4).map((feature) => (
            <a 
              key={feature.title} 
              href="#" 
              className="block p-2 text-sm rounded-md hover:bg-accent"
            >
              {feature.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

// Feature lists for dropdown menus - reduced number of items to make the navbar less cluttered
const sessionFeatures = [
  { title: "Dynamic Track Evolution", description: "Visualize lap time improvements as track rubbers in." },
  { title: "Weather-Driven Strategy", description: "Correlate rain with intermediate tire pit stops." },
  { title: "Red Flag Forensics", description: "Analyze driver reactions before red flags." },
  { title: "Safety Car Delta", description: "Calculate time impact during safety car periods." },
];

const driverTeamFeatures = [
  { title: "Throttle-Brake Overlap", description: "Identify trail braking techniques into corners." },
  { title: "Gear Shift Consistency", description: "Compare shift points across laps." },
  { title: "ERS Deployment Heatmap", description: "Visualize energy deployment on track." },
  { title: "Tire Whisperer Index", description: "Rank drivers by tire management skills." },
];

const telemetryFeatures = [
  { title: "Aero Efficiency Score", description: "Link G-forces to downforce in high-speed corners." },
  { title: "Brake Glow Simulation", description: "Animate disc temperatures in braking zones." },
  { title: "Drag vs. Downforce", description: "Analyze setup trade-offs by track." },
  { title: "G-Force Zones", description: "Highlight extreme lateral/vertical force corners." },
];

const strategyFeatures = [
  { title: "Undercut/Overcut Sim", description: "Test hypothetical pit windows for strategy." },
  { title: "Tire Degradation", description: "Predict optimal stops using wear models." },
  { title: "Fuel Load Engineering", description: "Estimate starting fuel from lap time patterns." },
  { title: "Pit Stop Battle", description: "Compare teams by median stop time." },
];

const historicalFeatures = [
  { title: "Era vs. Era Speed", description: "Compare different eras at the same circuits." },
  { title: "Rule Change Effect", description: "Model how regulation changes affect racing." },
  { title: "Driver DNA Profiling", description: "Create fingerprints of unique driving styles." },
  { title: "Team Dominance Cycles", description: "Chart periods of constructor dominance." },
];

// Missing import
import { ChevronDown } from 'lucide-react';

export default Navbar;
