import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Brain, Dumbbell, Shield, Clock, CheckCircle, 
  TestTube2, Users, Scan, Zap, ArrowRight, Star,
  Calendar, MapPin, Award
} from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      icon: TestTube2,
      title: "Blood Testing",
      subtitle: "Comprehensive Lab Analysis",
      description: "From basic health checks to advanced wellness panels",
      features: [
        "65+ biomarkers tested",
        "Doctor-reviewed results",
        "Fast 24-48hr turnaround",
        "Home & clinic collection"
      ],
      popular: true,
      startingPrice: "£79",
      link: "/blood-tests",
      services: ["Wellness Panels", "Hormone Testing", "Allergy Testing", "Cancer Markers"]
    },
    {
      icon: Users,
      title: "Doctor Consultations", 
      subtitle: "Expert Medical Advice",
      description: "Connect with verified specialists and GPs",
      features: [
        "200+ verified doctors",
        "Video & in-person consultations",
        "Same-day appointments",
        "Specialist referrals"
      ],
      popular: false,
      startingPrice: "£65",
      link: "/marketplace",
      services: ["General Practice", "Cardiology", "Endocrinology", "Dermatology"]
    },
    {
      icon: Scan,
      title: "Radiology Services",
      subtitle: "Advanced Medical Imaging",
      description: "Professional diagnostic imaging and scans",
      features: [
        "MRI & CT scans",
        "Ultrasound imaging",
        "X-ray services", 
        "Same-day results"
      ],
      popular: false,
      startingPrice: "£150",
      link: "/radiology",
      services: ["MRI Scans", "CT Scans", "Ultrasound", "X-Ray"]
    },
    {
      icon: Zap,
      title: "Treatments",
      subtitle: "Recovery & Performance",
      description: "Advanced wellness and recovery treatments",
      features: [
        "Deep tissue massage",
        "Sports massage therapy", 
        "Injury rehabilitation",
        "Therapeutic treatments"
      ],
      popular: false,
      startingPrice: "£45",
      link: "/treatments",
      services: ["Deep Tissue Massage", "Sports Massage", "Therapeutic Massage", "Injury Treatment"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Tests Completed", icon: TestTube2 },
    { number: "200+", label: "Medical Experts", icon: Users },
    { number: "24hrs", label: "Average Results", icon: Clock },
    { number: "4.9/5", label: "Patient Rating", icon: Star }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Complete Healthcare Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From blood tests to specialist consultations, radiology to treatments - 
            everything you need for optimal health in one place.
          </p>
        </div>

        {/* Service Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className={`relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group ${
                  category.popular ? 'border-accent shadow-accent/20 ring-2 ring-accent/20' : ''
                }`}
              >
                {category.popular && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        category.popular ? 'bg-accent/10' : 'bg-primary/10'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          category.popular ? 'text-accent' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-primary">{category.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Starting from</div>
                      <div className="text-2xl font-bold text-accent">{category.startingPrice}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">{category.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Types */}
                  <div>
                    <h4 className="font-medium text-sm mb-3">Available Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.services.map((service, serviceIndex) => (
                        <Badge key={serviceIndex} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant={category.popular ? "hero" : "default"} 
                    className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    size="lg"
                    onClick={() => window.location.href = category.link}
                  >
                    <div className="flex items-center justify-center gap-2 w-full">
                      Explore {category.title}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-2">Trusted by Thousands</h3>
            <p className="text-muted-foreground">Join our growing community of health-conscious individuals</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
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
            <Award className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">Accredited Labs</h3>
            <p className="text-sm text-muted-foreground">
              All tests processed in fully accredited medical laboratories
            </p>
          </div>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-2">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Book appointments online with flexible scheduling options
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">Ready to Take Control of Your Health?</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Get started with a comprehensive health assessment or book a consultation with one of our specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => window.location.href = "/booking"}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </div>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = "/blood-tests"}
              >
                <div className="flex items-center gap-2">
                  <TestTube2 className="w-5 h-5" />
                  Browse Tests
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;