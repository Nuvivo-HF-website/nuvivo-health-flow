import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building, Package, Ambulance } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      title: "At-Home Care",
      subtitle: "Professional Collection at Your Doorstep",
      description:
        "Qualified phlebotomists come to you for convenient, professional blood collection.",
      link: "/mobile/home-collection",
    },
    {
      icon: Building,
      title: "Corporate Health Days",
      subtitle: "Workplace Wellness Programs",
      description:
        "On-site health screenings and tailored wellness programs for teams and executives.",
      link: "/mobile/corporate",
    },
    {
      icon: Package,
      title: "Sample Drop-Off Assistance",
      subtitle: "Convenient Sample Collection",
      description:
        "Reliable pickup and secure delivery to partner labs—standard or express options.",
      link: "/mobile/sample-dropoff",
    },
    {
      icon: Ambulance,
      title: "Private Ambulance",
      subtitle: "Emergency & Planned Transport",
      description:
        "24/7 professional medical transport across the UK, including planned transfers.",
      link: "/private-ambulance",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header (matches Consultations style) */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Mobile & On-Site Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional healthcare delivered to your location. Book at-home collections,
              workplace wellness, sample logistics, or private medical transport.
            </p>
          </div>

          {/* Services grid (matches Consultations cards) */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card
                  key={idx}
                  className="relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground">
                        {service.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                    </div>
                    <p className="text-muted-foreground mt-4 text-center">
                      {service.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      size="lg"
                      onClick={() => navigate(service.link)}
                    >
                      View all in {service.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MobileServices;
