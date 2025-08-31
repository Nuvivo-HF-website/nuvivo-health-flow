import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Building, 
  Package, 
  Ambulance, 
  Clock, 
  Shield, 
  MapPin,
  CheckCircle,
  Star,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "home-collection",
      icon: <Home className="w-8 h-8" />,
      title: "Home Blood Collection",
      subtitle: "Professional Collection at Your Doorstep",
      description: "Professional phlebotomists visit your home for convenient blood sample collection",
      features: [
        "Qualified phlebotomists",
        "Same-day appointments",
        "Premium service options",
        "Mobile clinic available"
      ],
      startingPrice: "From £45",
      badge: "Most Popular",
      route: "/mobile/home-collection"
    },
    {
      id: "corporate-health",
      icon: <Building className="w-8 h-8" />,
      title: "Corporate Health Days", 
      subtitle: "Workplace Wellness Programs",
      description: "Comprehensive on-site health screenings and wellness programs for your workforce",
      features: [
        "On-site health screening",
        "Team health packages",
        "Executive physicals",
        "Wellness programs"
      ],
      startingPrice: "From £75",
      badge: "Bulk Pricing",
      route: "/mobile/corporate"
    },
    {
      id: "sample-dropoff",
      icon: <Package className="w-8 h-8" />,
      title: "Sample Drop-Off Support",
      subtitle: "Convenient Sample Collection",
      description: "Reliable sample collection and laboratory delivery service for your convenience",
      features: [
        "Standard pickup service",
        "Express same-day delivery",
        "Scheduled regular service",
        "Temperature controlled transport"
      ],
      startingPrice: "From £25",
      badge: "Same Day Available",
      route: "/mobile/sample-dropoff"
    },
    {
      id: "private-ambulance",
      icon: <Ambulance className="w-8 h-8" />,
      title: "Private Ambulance Services",
      subtitle: "Emergency & Planned Medical Transport",
      description: "Professional medical transport services available 24/7 across the UK",
      features: [
        "24/7 emergency response",
        "Planned patient transport",
        "Event medical cover",
        "International repatriation"
      ],
      startingPrice: "From £180",
      badge: "24/7 Available",
      route: "/mobile/private-ambulance"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Same-Day Availability",
      description: "Urgent appointments and same-day service options across all mobile services"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Professional Standards",
      description: "CQC regulated services with qualified healthcare professionals"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Nationwide Coverage",
      description: "Mobile services available across the UK with local specialist networks"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Care",
      description: "Exceptional service quality with personalized healthcare at your location"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Home Visits Completed" },
    { number: "2,500+", label: "Corporate Programs" },
    { number: "24/7", label: "Emergency Availability" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                Mobile Health Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Professional healthcare services delivered directly to your location. From home blood collection to corporate wellness programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => navigate("/booking")}>
                  Book Service Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: 999
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mobile Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive healthcare services brought directly to your preferred location
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate(service.route)}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        {service.icon}
                      </div>
                      <Badge variant="secondary">{service.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base font-medium text-primary/80">
                      {service.subtitle}
                    </CardDescription>
                    <p className="text-muted-foreground mt-2">{service.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-lg font-semibold text-primary">{service.startingPrice}</span>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.route);
                      }}>
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Mobile Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the convenience and quality of professional healthcare at your location
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        {benefit.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ready to Book Your Mobile Service?</h2>
              <p className="text-muted-foreground mb-8">
                Choose from our range of professional mobile health services and experience healthcare at your convenience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={() => navigate("/booking")}>
                  Book Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => navigate("/guest-booking")}>
                  Book as Guest
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileServices;