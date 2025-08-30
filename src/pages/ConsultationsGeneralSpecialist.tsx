import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, UserCheck, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ConsultationsGeneralSpecialist = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Stethoscope,
      title: "General Practice Consultations",
      description: "Comprehensive primary care consultations with experienced GPs",
      price: "£65",
      duration: "30 minutes",
      features: [
        "Health assessments",
        "Symptom evaluation",
        "Prescription management",
        "Preventive care advice"
      ],
      link: "/marketplace"
    },
    {
      icon: UserCheck,
      title: "Medical Specialist Referrals",
      description: "Connect with verified specialists across all medical disciplines",
      price: "£95",
      duration: "45 minutes", 
      features: [
        "Cardiology consultations",
        "Endocrinology expertise",
        "Dermatology services",
        "Specialist treatment plans"
      ],
      link: "/marketplace"
    },
    {
      icon: FileText,
      title: "Second Opinion Services",
      description: "Get expert second opinions on medical diagnoses and treatment plans",
      price: "£150",
      duration: "60 minutes",
      features: [
        "Medical record review",
        "Urgent second opinions",
        "Treatment plan analysis",
        "Expert recommendations"
      ],
      link: "/consultations/second-opinions"
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
              General & Specialist Care
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access comprehensive medical consultations with experienced GPs and verified 
              specialists for expert diagnosis, treatment, and ongoing care.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
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
                    <div className="flex justify-center gap-4 text-sm">
                      <span className="font-semibold text-primary">{service.price}</span>
                      <span className="text-muted-foreground">• {service.duration}</span>
                    </div>
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

export default ConsultationsGeneralSpecialist;