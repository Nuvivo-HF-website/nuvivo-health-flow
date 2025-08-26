import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, Droplets, Dumbbell, Shield, Clock, CheckCircle, 
  TestTube2, Users, Scan, Zap, ArrowRight, Star,
  Calendar, MapPin, Award, X, Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  
  const treatmentDetails = {
    "Deep Tissue Massage": {
      description: "Intensive massage targeting deeper layers of muscle and connective tissue to relieve chronic tension and pain.",
      duration: "60-90 minutes",
      price: "£85",
      benefits: [
        "Reduces chronic muscle tension",
        "Improves blood circulation", 
        "Relieves pain and stiffness",
        "Enhances athletic recovery"
      ],
      process: "Our certified therapists use firm pressure and slow strokes to target knots and adhesions in muscle tissue.",
      suitable: "Athletes, office workers, those with chronic pain or muscle tension"
    },
    "Sports Massage": {
      description: "Specialised massage therapy designed for athletes and active individuals to enhance performance and prevent injury.",
      duration: "45-75 minutes",
      price: "£75",
      benefits: [
        "Prevents sports injuries",
        "Improves flexibility and range of motion",
        "Accelerates recovery time",
        "Enhances athletic performance"
      ],
      process: "Combines techniques like effleurage, petrissage, and friction to prepare muscles for activity or aid recovery.",
      suitable: "Athletes, fitness enthusiasts, pre/post workout sessions"
    },
    "Therapeutic Massage": {
      description: "Medical massage focused on treating specific conditions and promoting overall wellness and healing.",
      duration: "60 minutes",
      price: "£70",
      benefits: [
        "Reduces stress and anxiety",
        "Improves sleep quality",
        "Boosts immune system",
        "Promotes natural healing"
      ],
      process: "Gentle, therapeutic techniques tailored to your specific health needs and conditions.",
      suitable: "Anyone seeking stress relief, pain management, or general wellness"
    },
    "Injury Treatment": {
      description: "Comprehensive rehabilitation therapy for acute and chronic injuries using advanced treatment modalities.",
      duration: "45-60 minutes", 
      price: "£95",
      benefits: [
        "Accelerates injury healing",
        "Reduces inflammation and swelling",
        "Restores normal movement patterns",
        "Prevents re-injury"
      ],
      process: "Assessment-based treatment using manual therapy, exercise prescription, and recovery protocols.",
      suitable: "Recent injuries, chronic pain conditions, post-surgery rehabilitation"
    }
  };
  const serviceCategories = [
    {
      icon: TestTube2,
      title: "Blood Testing",
      subtitle: "Comprehensive Lab Analysis",
      description: "From basic health checks to advanced wellness panels",
      features: [
        "65+ biomarkers tested",
        "Doctor-reviewed results",
        "From 3 working days turnaround",
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
      icon: Truck,
      title: "Mobile Services",
      subtitle: "Healthcare at Your Doorstep",
      description: "Professional medical services delivered directly to you",
      features: [
        "Home blood collection",
        "Mobile health screening",
        "Corporate wellness visits",
        "Same-day appointments"
      ],
      popular: false,
      startingPrice: "£25",
      link: "/mobile-home-collection",
      services: ["Home Collection", "Corporate Health", "Sample Drop-off", "Private Ambulance"]
    }
  ];

  const stats = [
    { number: "2.5M+", label: "Global Users", icon: TestTube2 },
    { number: "5,000+", label: "World-Class Experts", icon: Users },
    { number: "24hrs", label: "Average Results", icon: Clock },
    { number: "4.9/5", label: "Global Rating", icon: Star }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            The World's Most Comprehensive Health Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access the global leader in precision health - from advanced diagnostics to world-class treatments. 
            Everything the world's top institutions offer, now in one revolutionary platform.
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
                  category.popular ? 'border-primary shadow-primary/20 ring-2 ring-primary/20' : ''
                } ${index === 4 ? 'lg:col-span-2 lg:justify-self-center' : ''}`}
              >
                {category.popular && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        category.popular ? 'bg-primary/10' : 'bg-accent/10'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          category.popular ? 'text-black' : 'text-black'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-black">{category.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Starting from</div>
                      <div className="text-2xl font-bold text-primary">{category.startingPrice}</div>
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
                        <Badge 
                          key={serviceIndex} 
                          variant="secondary" 
                          className={`text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                            category.title === "Treatments" ? "hover:scale-105" : ""
                          }`}
                          onClick={() => {
                            if (category.title === "Treatments") {
                              setSelectedTreatment(service);
                            }
                          }}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant={category.popular ? "hero" : "default"} 
                      className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      size="lg"
                      onClick={() => navigate(category.link)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Explore {category.title}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-accent mb-2">The Global Standard in Health</h3>
            <p className="text-muted-foreground">Join millions worldwide who trust the most advanced health platform</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-accent">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-accent mb-2">GDPR Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Your health data is encrypted and stored securely in the EU
            </p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-accent mb-2">Accredited Laboratories</h3>
            <p className="text-sm text-muted-foreground">
              All tests processed in fully accredited medical laboratories
            </p>
          </div>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-accent mb-2">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Book appointments online with flexible scheduling options
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">Join the World's Leading Health Platform</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Access the most advanced health ecosystem on Earth. Connect with world-renowned specialists and cutting-edge diagnostics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-accent hover:bg-white/90"
                onClick={() => navigate("/booking")}
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
                onClick={() => navigate("/blood-tests")}
              >
                <div className="flex items-center gap-2">
                  <TestTube2 className="w-5 h-5" />
                  Browse Tests
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Treatment Details Modal */}
        <Dialog open={!!selectedTreatment} onOpenChange={() => setSelectedTreatment(null)}>
          <DialogContent className="max-w-2xl">
            {selectedTreatment && treatmentDetails[selectedTreatment as keyof typeof treatmentDetails] && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-accent flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    {selectedTreatment}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Treatment Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Duration</h4>
                      <p className="text-muted-foreground">{treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].duration}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Price</h4>
                      <p className="text-2xl font-bold text-accent">{treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].price}</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Key Benefits</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Treatment Process</h4>
                    <p className="text-muted-foreground text-sm">{treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].process}</p>
                  </div>

                  {/* Suitable For */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Suitable For</h4>
                    <p className="text-muted-foreground text-sm">{treatmentDetails[selectedTreatment as keyof typeof treatmentDetails].suitable}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        setSelectedTreatment(null);
                        navigate("/booking");
                      }}
                      className="flex-1"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Treatment
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedTreatment(null);
                        navigate("/treatments");
                      }}
                    >
                      View All Treatments
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Services;