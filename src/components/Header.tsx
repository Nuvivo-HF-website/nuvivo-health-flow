import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { AuthModal } from "./auth/AuthModal";
import { UserMenu } from "./auth/UserMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Custom navigation link component to avoid full page reloads
const NavigationLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <Link ref={ref} className={className} {...props}>
    {children}
  </Link>
));
NavigationLink.displayName = "NavigationLink";

const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // NEW: pin/open state
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);
  const headerRef = useRef<HTMLElement | null>(null);

  // Close pinned menu on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!pinnedMenu) return;
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setPinnedMenu(null);
        setActiveMenu(undefined);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pinnedMenu]);

  // Helper to toggle a category pin
  const togglePin = (id: string) => {
    setPinnedMenu(prev => (prev === id ? null : id));
    setActiveMenu(id);
  };

  // Helper: when clicking any sub-link, unpin
  const closePinned = () => {
    setPinnedMenu(null);
    setActiveMenu(undefined);
  };

  // Controlled value for NavigationMenu: pinned wins, else hover/focus active
  const navValue = pinnedMenu ?? activeMenu;

  return (
    <header
      ref={headerRef}
      className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity relative z-20"
              onClick={closePinned}
            >
              <img
                src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png"
                alt="Nuvivo Health Logo"
                className="w-12 h-12 object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu
            className="hidden md:flex"
            value={navValue}
            onValueChange={(v) => {
              // let hover/focus continue to work when not pinned
              if (!pinnedMenu) setActiveMenu(v as string | undefined);
            }}
          >
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavigationLink
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                    onClick={closePinned}
                  >
                    Home
                  </NavigationLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* BLOOD TESTS */}
              <NavigationMenuItem hasDropdown value="blood-tests">
                <NavigationMenuTrigger
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin("blood-tests");
                  }}
                >
                  Blood Tests
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] gap-3 p-4" onClick={closePinned}>
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

              {/* CONSULTATIONS */}
              <NavigationMenuItem hasDropdown value="consultations">
                <NavigationMenuTrigger
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin("consultations");
                  }}
                >
                  Consultations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-4" onClick={closePinned}>
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* 1. General & Specialist Care */}
                      <div className="space-y-2">
                        <div className="px-1 min-h-[40px] flex items-end">
                          <h4 className="text-[15px] font-semibold">General &amp; Specialist Care</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/marketplace" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Doctors &amp; Specialists</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/consultations/second-opinions" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Second Opinions</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/medical-reports" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Medical Reports (Fit Notes, DVLA, Travel Letters)</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      {/* 2. Wellbeing & Lifestyle */}
                      <div className="space-y-2">
                        <div className="px-1 min-h-[20px] flex items-end">
                          <h4 className="text-[15px] font-semibold">Wellbeing &amp; Lifestyle</h4>
                        </div>
                        <div className="h-[14px]" aria-hidden />
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/consultations/nutrition" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Nutrition &amp; Weight</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/consultations/mental-health" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Mental Health &amp; Psychology</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      {/* 3. Specialist Health Areas */}
                      <div className="space-y-2">
                        <div className="px-1 min-h-[20px] flex items-end">
                          <h4 className="text-[15px] font-semibold">Specialist Health Areas</h4>
                        </div>
                        <div className="h-[14px]" aria-hidden />
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/consultations/sexual-health" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Sexual Health</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* TREATMENTS & THERAPIES */}
              <NavigationMenuItem hasDropdown value="treatments">
                <NavigationMenuTrigger
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin("treatments");
                  }}
                >
                  Treatments &amp; Therapies
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[800px] p-4 not-prose" onClick={closePinned}>
                    <div className="grid gap-6 md:grid-cols-4">
                      {/* columns unchanged; links close pinned on click via parent onClick */}
                      <div className="space-y-2">
                        <div className="px-1 h-10 md:h-12 flex items-end">
                          <h4 className="text-[15px] font-semibold">Physical &amp; Sports Therapy</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=physio" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Physiotherapy</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=sports" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Sports Therapy</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      <div className="space-y-2">
                        <div className="px-1 h-10 md:h-12 flex items-end">
                          <h4 className="text-[15px] font-semibold">Wellness &amp; Nutrient Therapy</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=iv-drips" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">IV Vitamin Drips</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=b12-shots" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">B12 Shots</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      <div className="space-y-2">
                        <div className="px-1 h-10 md:h-12 flex items-end">
                          <h4 className="text-[15px] font-semibold">Hormone &amp; Endocrine Support</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=hormones" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">HRT &amp; TRT Support</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=chronic" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Chronic Conditions (Thyroid, Diabetes, PCOS)</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      <div className="space-y-2">
                        <div className="px-1 h-10 md:h-12 flex items-end">
                          <h4 className="text-[15px] font-semibold">Lifestyle Change Support</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/treatments?category=smoking" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Smoking Cessation</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* SCANS & IMAGING */}
              <NavigationMenuItem hasDropdown value="scans">
                <NavigationMenuTrigger
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin("scans");
                  }}
                >
                  Scans &amp; Imaging
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w=[300px] gap-3 p-4" onClick={closePinned}>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/radiology" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Ultrasound & Radiology</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/scans/ecg" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Heart Monitoring & ECG (Home or Clinic)</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavigationLink to="/scans/cancer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Specialist Cancer Screening</div>
                      </NavigationLink>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* MOBILE & ON-SITE */}
              <NavigationMenuItem hasDropdown value="mobile">
                <NavigationMenuTrigger
                  className="text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePin("mobile");
                  }}
                >
                  Mobile &amp; On-Site Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-4" onClick={closePinned}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="px-1 min-h-[20px] flex items-end">
                          <h4 className="text-[15px] font-semibold">At-Home Care</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/mobile/home-collection" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Home Blood Collection</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/mobile/corporate" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Corporate Health Days</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>

                      <div className="space-y-2">
                        <div className="px-1 min-h-[20px] flex items-end">
                          <h4 className="text-[15px] font-semibold">Medical Transport &amp; Support</h4>
                        </div>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/private-ambulance" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Private Ambulance</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <NavigationLink to="/mobile/sample-dropoff" className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Sample Drop-Off Assistance</div>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Find Clinic */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavigationLink
                    to="/clinic-finder"
                    className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                    onClick={closePinned}
                  >
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
              onClick={() => {
                closePinned();
                navigate("/join-professional");
              }}
            >
              Join as a Professional
            </Button>

            {!loading && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => {
                    closePinned();
                    if (user) {
                      navigate("/portal");
                    } else {
                      navigate("/sign-in");
                    }
                  }}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">My Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Button>
                {user && <UserMenu />}
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;
