import { Button } from "@/components/ui/button";
import { Shield, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary">Nuvivo Health</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/blood-tests" className="text-muted-foreground hover:text-primary transition-colors">
              Blood Tests
            </a>
            <a href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
              Doctors
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
            <Button variant="hero" size="sm">
              Book Test
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;