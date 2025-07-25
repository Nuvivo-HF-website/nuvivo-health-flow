import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

const Hero = () => {
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
                Get comprehensive health insights with doctor-reviewed results delivered securely to your home. 
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
                <span className="text-sm text-muted-foreground">24-48h Results</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-base px-8 py-3"
              >
                Book Your Test Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-3"
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
                alt="Professional medical environment"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/10"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-xl shadow-card p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">99.9% Accurate</p>
                  <p className="text-xs text-muted-foreground">Lab certified results</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-background rounded-xl shadow-card p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Secure & Private</p>
                  <p className="text-xs text-muted-foreground">GDPR compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;