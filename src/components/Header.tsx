import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png" 
                alt="Nuvivo Health Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/blood-tests" className="text-muted-foreground hover:text-primary transition-colors">
              Blood Tests
            </a>
            <a href="/treatments" className="text-muted-foreground hover:text-primary transition-colors">
              Treatments
            </a>
            <a href="/clinic-finder" className="text-muted-foreground hover:text-primary transition-colors">
              Find Clinic
            </a>
            <a href="/radiology" className="text-muted-foreground hover:text-primary transition-colors">
              Radiology
            </a>
            <a href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
              Doctors
            </a>
            <a href="/upload-results" className="text-muted-foreground hover:text-primary transition-colors">
              Upload Results
            </a>
            <a href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="/preparation" className="text-muted-foreground hover:text-primary transition-colors">
              Test Prep
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
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