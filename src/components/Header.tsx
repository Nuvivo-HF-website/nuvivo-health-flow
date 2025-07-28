import { Button } from "@/components/ui/button";
import { User, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

// Custom navigation link component to avoid full page reloads
const NavigationLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <Link
    ref={ref}
    className={className}
    {...props}
  >
    {children}
  </Link>
));
NavigationLink.displayName = "NavigationLink";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png" 
                alt="Nuvivo Health Logo" 
                className="w-12 h-12 object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavigationLink to="/" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2">
                    Home
                  </NavigationLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary">
                  Blood Tests
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">All Blood Test Packages</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=womens-health" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Women's Health Panels</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=mens-health" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Men's Health Panels</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=hormones" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Hormones & Fertility</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=energy-sleep" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Energy, Sleep & Mood</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=vitamins" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Vitamin & Nutrition</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=immunity" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Inflammation & Immunity</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=sports" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Sports Performance</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/blood-tests?category=cancer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Cancer Screening</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary">
                  Consultations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/marketplace" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Doctors & Specialists</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/consultations/mental-health" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Mental Health & Psychology</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/consultations/nutrition" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Nutrition & Weight</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/consultations/sexual-health" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Sexual Health</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/consultations/second-opinions" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Second Opinions</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/medical-reports" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Medical Reports (Fit Notes, DVLA, Travel Letters)</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary">
                  Treatments
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/treatments?category=physio" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Physiotherapy & Sports Therapy</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/treatments?category=iv-drips" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">IV Vitamin Drips & B12 Shots</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/treatments?category=hormones" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">HRT & TRT Support</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/treatments?category=chronic" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Chronic Conditions (Thyroid, Diabetes, PCOS)</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/treatments?category=smoking" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Smoking Cessation</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary">
                  Scans & Imaging
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/radiology" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Radiology & Ultrasound</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/scans/ecg" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Home ECG & Monitoring</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/scans/cancer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Cancer Scans</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-primary">
                  Mobile Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/mobile/home-collection" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Home Blood Collection</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/private-ambulance" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Private Ambulance</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/mobile/sample-dropoff" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Sample Drop-Off Support</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/mobile/corporate" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Corporate Health Days</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavigationLink to="/clinic-finder" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2">
                    Find Clinic
                  </NavigationLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => navigate("/join-professional")}
            >
              Join as a Professional
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center space-x-1"
              onClick={() => navigate("/sign-in")}
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate("/booking")}
            >
              Book Test
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;