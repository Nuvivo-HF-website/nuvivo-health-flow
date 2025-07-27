import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Users, FileCheck } from "lucide-react";

const HowItWorks = () => {
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
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive healthcare services in four simple steps. 
            From blood tests to specialist consultations - we make healthcare convenient.
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
              Ready to Start Your Health Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands who trust Nuvivo Health for comprehensive healthcare services - 
              from preventive testing to specialist treatments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-hero text-primary-foreground hover:shadow-accent transform hover:scale-[1.02] shadow-medical font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8">
                Browse All Services
              </button>
              <button className="border border-border bg-background hover:bg-secondary hover:text-secondary-foreground shadow-card hover:shadow-medical inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;