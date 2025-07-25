import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-blood-test.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-background via-accent-soft/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                Private Blood Tests
                <span className="text-accent"> Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get comprehensive health insights with results reviewed by qualified doctors and delivered securely through a secure link. 
                GDPR compliant, private, and professional.
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">Doctor Reviewed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">From 3 working days Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-base px-8 py-3"
                onClick={() => navigate("/booking")}
              >
                Book Your Test Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-3"
                onClick={() => navigate("/blood-tests")}
              >
                View Test Packages
              </Button>
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Trusted by thousands of patients</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-warning rounded-sm"></div>
                ))}
                <span className="ml-2 text-sm font-medium text-primary">4.9/5</span>
                <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-medical">
              <img 
                src={heroImage} 
                alt="Professional blood testing laboratory"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;