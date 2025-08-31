import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Consultations = () => {
  const navigate = useNavigate();

  const consultationCategories = [
    {
      icon: Users,
      title: "General & Specialist Care",
      subtitle: "Comprehensive Medical Consultations",
      description:
        "Connect with GPs and medical specialists for expert diagnosis and treatment.",
      link: "/consultations/general-specialist",
    },
    {
      icon: Heart,
      title: "Wellbeing & Lifestyle",
      subtitle: "Holistic Health & Wellness",
      description:
        "Nutrition, fitness, and lifestyle consultations for optimal wellbeing.",
      link: "/consultations/wellbeing-lifestyle",
    },
    {
      icon: Brain,
      title: "Specialist Health Areas",
      subtitle: "Targeted Health Services",
      description:
        "Specialised consultations focused on specific health needs.",
      link: "/consultations/specialist-health",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Expert Medical Consultations
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with verified healthcare professionals for comprehensive medical consultations,
              specialist advice, and personalized treatment plans.
            </p>
          </div>

          {/* Consultation Categories */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {consultationCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={index}
                  className="relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground">
                        {category.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.subtitle}
                      </p>
                    </div>
                    <p className="text-muted-foreground mt-4 text-center">
                      {category.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      size="lg"
                      onClick={() => navigate(category.link)}
                    >
                      View all in {category.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Start Your Health Journey Today</h3>
              <p className="text-primary-foreground/80 mb-6">
                Book a consultation with our verified healthcare professionals and take the first step
                towards better health and wellbeing.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-accent hover:bg-white/90"
                onClick={() => navigate("/booking")}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consultations;
