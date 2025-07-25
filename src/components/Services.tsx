import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Dumbbell, Shield, Clock, CheckCircle } from "lucide-react";

const Services = () => {
  const testPackages = [
    {
      icon: Heart,
      title: "Essential Health",
      price: "£79",
      description: "Complete overview of your health fundamentals",
      features: [
        "Full Blood Count",
        "Cholesterol Profile", 
        "Blood Sugar Levels",
        "Kidney Function",
        "Liver Function"
      ],
      popular: false
    },
    {
      icon: Brain,
      title: "Advanced Wellness",
      price: "£149",
      description: "Comprehensive health insights and nutritional analysis",
      features: [
        "Everything in Essential",
        "Hormone Panel",
        "Vitamin & Mineral Profile",
        "Inflammation Markers",
        "Thyroid Function",
        "Heart Disease Risk"
      ],
      popular: true
    },
    {
      icon: Dumbbell,
      title: "Performance Plus",
      price: "£229",
      description: "Elite health optimization for peak performance",
      features: [
        "Everything in Advanced",
        "Sports Performance Markers",
        "Stress Hormone Analysis",
        "Advanced Nutrient Testing",
        "Metabolic Health Profile",
        "Recovery Indicators"
      ],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Choose Your Health Package
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive blood testing packages designed by medical professionals 
            to give you the insights you need.
          </p>
        </div>

        {/* Test Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testPackages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            return (
              <Card 
                key={index} 
                className={`relative transition-all duration-300 hover:shadow-medical hover:scale-[1.02] ${
                  pkg.popular ? 'border-accent shadow-accent ring-2 ring-accent/20' : 'hover:border-accent/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    pkg.popular ? 'bg-accent/10' : 'bg-primary/10'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      pkg.popular ? 'text-accent' : 'text-primary'
                    }`} />
                  </div>
                  <CardTitle className="text-xl text-primary">{pkg.title}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={pkg.popular ? "hero" : "default"} 
                    className="w-full"
                    size="lg"
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">GDPR Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Your health data is encrypted and stored securely in the EU
            </p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">Quick Results</h3>
            <p className="text-sm text-muted-foreground">
              Get your doctor-reviewed results within 24-48 hours
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">Certified Labs</h3>
            <p className="text-sm text-muted-foreground">
              All tests processed in accredited medical laboratories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;