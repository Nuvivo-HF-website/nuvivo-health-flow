import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Clock } from "lucide-react";
const heroImage = "/lovable-uploads/7dd44878-80ba-4e6e-a5d2-87f1dbc79346.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-24 bg-background">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-normal text-primary leading-[1.1] tracking-tight">
                The World's Most
                <br />
                <em className="text-accent not-italic">Advanced Health Platform.</em>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed font-inter max-w-lg">
                Join millions who trust the global leader in precision health. Access world-class doctors, advanced diagnostics, and breakthrough treatments—all in one revolutionary platform.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-8 py-4">
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs text-muted-foreground font-inter uppercase tracking-wide">GDPR Compliant</span>
              </div>
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs text-muted-foreground font-inter uppercase tracking-wide">Doctor Reviewed</span>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-xs text-muted-foreground font-inter uppercase tracking-wide">3 Day Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                variant="default" 
                size="lg" 
                className="text-lg px-12 py-4 font-inter"
                onClick={() => navigate("/booking")}
              >
                Book Your Test
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-4 font-inter"
                onClick={() => navigate("/blood-tests")}
              >
                View Tests
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up lg:justify-self-end">
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <img 
                src={heroImage} 
                alt="Blood test vials and laboratory analysis"
                className="w-full h-auto object-cover rounded-sm shadow-card"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;