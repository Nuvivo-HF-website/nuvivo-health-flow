import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ConsultationsWellbeingLifestyle = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Apple,
      title: "Nutrition & Weight Management",
      description: "Comprehensive nutrition consultations and weight management programs",
      features: [
        "Personalized meal plans",
        "Weight loss strategies", 
        "Dietary assessments",
        "Nutritional counseling"
      ],
      link: "/consultations/nutrition"
    },
    {
      icon: Heart,
      title: "Mental Health & Psychology",
      description: "Professional mental health support and psychological consultations",
      features: [
        "Psychology consultations",
        "Counselling sessions",
        "Therapy services",
        "Mental wellbeing support"
      ],
      link: "/consultations/mental-health"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Wellbeing & Lifestyle
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your health with expert nutrition consultations, weight management 
              programs, and lifestyle optimization strategies.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => navigate(service.link)}
                    >
                      Book Consultation
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/consultations")}
            >
              ← Back to All Consultations
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConsultationsWellbeingLifestyle;