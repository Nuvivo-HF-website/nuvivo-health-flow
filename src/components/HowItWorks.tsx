import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";

const HowItWorks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleJoinUsClick = () => {
    if (user) {
      // User is authenticated, navigate to portal
      navigate('/portal');
    } else {
      // User is not authenticated, navigate to sign up/in page
      navigate('/sign-in');
    }
  };
  
  const steps = [
    {
      icon: Search,
      title: "Choose Your Service",
      description: "Browse our comprehensive range of blood tests, consultations, treatments, and scans.",
      step: "01"
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Select your preferred time slot and location - clinic visit, home service, or online consultation.",
      step: "02"
    },
    {
      icon: Users,
      title: "Meet Our Experts",
      description: "Connect with qualified doctors, specialists, or technicians for your chosen service.",
      step: "03"
    },
    {
      icon: FileCheck,
      title: "Get Results & Support",
      description: "Receive professional results, reports, or treatment plans with ongoing health support.",
      step: "04"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            The World's Most Advanced Health Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the global standard in precision health. Four simple steps to access 
            the world's most comprehensive medical platform - trusted by millions worldwide.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 1;
            
            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[calc(100%+1rem)] w-8 h-0.5 bg-border"></div>
                )}
                
                <Card className="text-center hover:shadow-medical transition-all duration-300 hover:scale-[1.02] border-border">
                  <CardContent className="pt-6 space-y-4">
                    {/* Step number */}
                    <div className="relative mb-4">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent-soft/50 to-primary/5 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Take Control of Your Health?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Discover trusted doctors, clinics, and tests in minutes – all in one place. Book appointments, get answers, and start feeling better, faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleJoinUsClick}
                className="bg-primary hover:bg-primary/90"
              >
                Join us
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/clinic-finder')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;