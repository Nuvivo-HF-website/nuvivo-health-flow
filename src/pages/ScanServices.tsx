import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan, Heart, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ScanServices = () => {
  const navigate = useNavigate();

  const scanCategories = [
    {
      icon: Scan,
      title: "Ultrasound & Radiology",
      subtitle: "Ultrasound, X-Ray, MRI & CT",
      description:
        "Comprehensive diagnostic imaging with expert radiologists and fast results.",
      link: "/radiology",
    },
    {
      icon: Heart,
      title: "Heart Monitoring & ECG (Home or Clinic)",
      subtitle: "Cardiac Monitoring & ECG",
      description:
        "Convenient heart monitoring services with clinical review and reports.",
      link: "/scans/ecg",
    },
    {
      icon: Activity,
      title: "Specialist Cancer Screening",
      subtitle: "Advanced Screening & Detection",
      description:
        "Targeted screening pathways for early detection and peace of mind.",
      link: "/scans/cancer",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Scan Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive medical imaging with state-of-the-art equipment and expert care.
            </p>
          </div>

          {/* Categories: 2 / 1 layout (third card centered below) */}
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {/* Top row (2 cards) */}
            {scanCategories.slice(0, 2).map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.title}
                  className="relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{cat.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                    </div>
                    <p className="text-muted-foreground mt-4 text-center">{cat.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      size="lg"
                      onClick={() => navigate(cat.link)}
                    >
                      View all in {cat.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {/* Bottom row (1 card centered) */}
            <div className="md:col-span-2 flex justify-center">
              {(() => {
                const cat = scanCategories[2];
                const Icon = cat.icon;
                return (
                  <Card className="w-full md:max-w-xl lg:max-w-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl text-foreground">{cat.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                      </div>
                      <p className="text-muted-foreground mt-4 text-center">{cat.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        size="lg"
                        onClick={() => navigate(cat.link)}
                      >
                        View all in {cat.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </div>

          {/* (Optional) Keep your “Why Choose Our Scan Services” section below */}
          {/* If you want it retained, paste it here unchanged. */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScanServices;
