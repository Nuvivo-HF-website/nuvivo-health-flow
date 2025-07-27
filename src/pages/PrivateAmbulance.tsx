import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ambulance, Clock, Shield, Phone, Star, CheckCircle } from "lucide-react";

const PrivateAmbulance = () => {
  const services = [
    {
      title: "Emergency Response",
      description: "24/7 emergency medical transport with fully equipped ambulances",
      features: ["Advanced life support", "Experienced paramedics", "GPS tracking", "Hospital liaison"],
      price: "From £450",
      response: "8-15 minutes"
    },
    {
      title: "Planned Patient Transport",
      description: "Non-emergency medical transport for appointments and transfers",
      features: ["Wheelchair accessible", "Medical escort available", "Comfortable seating", "Flexible scheduling"],
      price: "From £180",
      response: "Pre-scheduled"
    },
    {
      title: "Event Medical Cover",
      description: "Professional medical coverage for private events and functions",
      features: ["On-site medical team", "Emergency equipment", "Risk assessment", "Event planning support"],
      price: "From £300/day",
      response: "On-site coverage"
    },
    {
      title: "International Repatriation",
      description: "Medical repatriation services from anywhere in the world",
      features: ["Air ambulance", "Medical escort", "Hospital coordination", "Insurance liaison"],
      price: "Quote on request",
      response: "24-48 hours"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "CQC Regulated",
      description: "Fully licensed and regulated by the Care Quality Commission"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Round-the-clock emergency response and booking service"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Expert Crew",
      description: "Qualified paramedics and emergency medical technicians"
    }
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
                  <Ambulance className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                Private Ambulance Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Professional emergency medical transport and patient care services available 24/7 across the UK
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: 999
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Book Non-Emergency
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Service</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Professional, reliable, and compassionate private ambulance services when you need them most
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive private ambulance services tailored to your medical transport needs
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge variant="secondary">{service.response}</Badge>
                    </div>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-lg font-semibold text-primary">{service.price}</span>
                      <Button variant="outline">Get Quote</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">24/7 Emergency & Booking</h2>
              <p className="text-muted-foreground mb-8">
                For immediate medical emergencies, always call 999. For non-emergency private ambulance bookings, 
                contact our dedicated team.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="p-6 bg-red-50 border-red-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">Emergency</div>
                    <div className="text-3xl font-bold text-red-700 mb-2">999</div>
                    <p className="text-sm text-red-600">Life-threatening emergencies</p>
                  </div>
                </Card>
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">Non-Emergency</div>
                    <div className="text-3xl font-bold text-primary mb-2">0800 123 4567</div>
                    <p className="text-sm text-muted-foreground">Planned transport & bookings</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivateAmbulance;